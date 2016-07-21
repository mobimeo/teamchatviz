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

const tsneCache = new NodeCache({ stdTTL: 60 * 24, checkperiod: 120 });

export default async function(teamId, startDate = null, endDate = null, currentUser = null, interval = '1 day') {
  logger.info(`Getting PeopleLand for ${teamId}, ${startDate}, ${endDate}`);

  const rawData = await db.any(`SELECT user_id, channel_id, is_member FROM membership
    WHERE team_id = $(teamId) AND user_id <> 'USLACKBOT';`,
    {
      teamId,
    });

  const groupedByUser = groupBy(rawData, row => row.user_id);

  const opt = {
    epsilon: 50, // epsilon is learning rate (10 = default)
    perplexity: 100, // roughly how many neighbors each point influences (30 = default)
    dim: 2, // dimensionality of the embedding (2 = default)
  };


  const userIds = Object.keys(groupedByUser);

  var solution = tsneCache.get('tsne.PeopleLand.' + teamId);
  if ( solution == undefined ){
    logger.profile('tsne');
    const tsne = new TSNE({
      dim: 2,
      perplexity: 30.0,
      earlyExaggeration: 4.0,
      learningRate: 100.0,
      nIter: 200,
      metric: 'jaccard'
    });
    const dists = userIds.map(key => {
      return groupedByUser[key].map(row => row.is_member === true);
    });
    tsne.init({
      data: dists,
      type: 'dense'
    });
    tsne.run();
    tsne.rerun();
    solution = tsne.getOutputScaled();
    logger.profile('tsne');
    tsneCache.set('tsne.PeopleLand.' + teamId, solution);
  }

  const members = (await db
    .any(`SELECT *,
          (CASE id WHEN $(thisUserId) THEN 1 ELSE 0 END) as is_current_user
        FROM members
        WHERE team_id=$(teamId)
          AND id <> 'USLACKBOT'`, {
      teamId,
      thisUserId: currentUser.id,
    }))
    .map(member => {
      member.username = member.name,
      member.name = member.first_name && member.last_name
        ? `${member.first_name} ${member.last_name}`
        : `${member.name}`;
      return member;
    });

  logger.profile('k-means');
  const numberOfClusters = 2 + Math.floor(members.length / 50);
  const dbscan = new clustering.KMEANS();
  const clusters = dbscan.run(solution, numberOfClusters);
  logger.profile('k-means');

  const data = solution.map((row, i) => {
    const member = members.find(ch => ch.id === userIds[i]);
    return {
      id: userIds[i],
      name: member.name,
      image24: member.image24,
      image48: member.image48,
      image72: member.image72,
      highlighted: member.is_current_user,
      x: row[0]*1000,
      y: row[1]*1000
    }
  });

  clusters.forEach((cluster, i) => {
    const name = `Group ${i+1}`;
    cluster.forEach(index => {
      data[index].group = name;
      data[index].color = colors[i % colors.length];
    });
  });

  return {
    data,
    members,
  };
};