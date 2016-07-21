/*
  #teamchatviz
  Copyright (C) 2016 Moovel Group GmbH, Haupstaetter str. 149, 70188, Stuttgart, Germany hallo@moovel.com

  This library is free software; you can redistribute it and/or
  modify it under the terms of the GNU Lesser General Public
  License as published by the Free Software Foundation; either
  version 2.1 of the License, or (at your option) any later version.

  This library is distributed in the hope that it will be useful,
  but WITHOUT ANY WARRANTY; without even the implied warranty of
  MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the GNU
  Lesser General Public License for more details.

  You should have received a copy of the GNU Lesser General Public
  License along with this library; if not, write to the Free Software
  Foundation, Inc., 51 Franklin Street, Fifth Floor, Boston, MA  02110-1301
  USA
*/

import Promise from 'bluebird';
import db from '../../../../db';
import config from '../../../../config';
import TSNE from 'tsne-js';
import { groupBy } from 'lodash';
import clustering from 'density-clustering';
import colors from './clusterColors.js';
import logger from 'winston';
import NodeCache from 'node-cache';

const tsneCache = new NodeCache({ stdTTL: 60 * 60 * 24, checkperiod: 120 });

export default async function(teamId, startDate = null, endDate = null, interval = '1 day') {
  logger.info(`Getting ChannelLand for ${teamId}, ${startDate}, ${endDate}`);
  const rawData = await db.any(`SELECT membership.channel_id,
    membership.user_id, membership.is_member
    FROM membership
    INNER JOIN channels ON membership.channel_id = channels.id
      AND channels.team_id = $(teamId)
    WHERE membership.team_id = $(teamId) AND membership.user_id <> 'USLACKBOT';`,
    {
      teamId,
    });
  const groupedByChannel = groupBy(rawData, row => row.channel_id);
  const channelIds = Object.keys(groupedByChannel);

  var solution = tsneCache.get('tsne.ChannelLand.' + teamId);
  if ( solution == undefined ) {
    logger.profile('tsne');
    const tsne = new TSNE({
      dim: 2,
      perplexity: 30.0,
      earlyExaggeration: 4.0,
      learningRate: 100.0,
      nIter: 200,
      metric: 'jaccard'
    });

    const dists = channelIds.map(key => {
      return groupedByChannel[key].map(row => row.is_member === true);
    });
    tsne.init({
      data: dists,
      type: 'dense'
    });
    tsne.run();
    tsne.rerun();
    solution = tsne.getOutputScaled();
    logger.profile('tsne');
    tsneCache.set('tsne.ChannelLand.' + teamId, solution);
  }

  const channels = await db.any(`SELECT channels.*,
    members.real_name,
    members.name as creator
   FROM channels
   LEFT JOIN members ON members.id = channels.created_by
   WHERE channels.team_id=$(teamId)`, {
    teamId,
  });

  const numberOfClusters = 2 + Math.floor(channels.length / 50);
  const dbscan = new clustering.KMEANS();
  const clusters = dbscan.run(solution, numberOfClusters);
  const data = solution.map((row, i) => {
    return {
      id: channelIds[i],
      name: channels.find(ch => ch.id === channelIds[i]).name,
      x: row[0]*1000,
      y: row[1]*1000
    }
  });

  clusters.forEach((cluster, i) => {
    const name = `Group ${i+1}`;
    cluster.forEach(index => {
      data[index].group = name;
      data[index].color = colors[i];
    });
  });

  data.forEach(i => {
    if (!i.group) {
      i.group = 'Group X',
      i.color = 'black';
    }
  })

  return {
    data,
    channels,
  };
};