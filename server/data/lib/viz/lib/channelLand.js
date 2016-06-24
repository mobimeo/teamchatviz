/*
  Slack Viz
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

import db from '../../../../db';
import Promise from 'bluebird';
import tsnejs from 'tsne/tsne';
import { groupBy } from 'lodash';
import clustering from 'density-clustering';
import colors from './clusterColors.js';

export default async function(teamId, startDate = null, endDate = null, interval = '1 day') {
  console.log(`Getting FrequentSpeakers for ${teamId}, ${startDate}, ${endDate}`);

  const rawData = await db.any(`SELECT membership.channel_id, membership.user_id, membership.is_member FROM membership
    INNER JOIN channels ON membership.channel_id = channels.id AND channels.team_id = $(teamId)
    WHERE membership.team_id = $(teamId) AND membership.user_id <> 'USLACKBOT';`,
    {
      teamId,
    });

  const groupedByChannel = groupBy(rawData, row => row.channel_id);

  const opt = {
    epsilon: 10, // epsilon is learning rate (10 = default)
    perplexity: 30, // roughly how many neighbors each point influences (30 = default)
    dim: 2, // dimensionality of the embedding (2 = default)
  };

  const tsne = new tsnejs.tSNE(opt); // create a tSNE instance
  const channelIds = Object.keys(groupedByChannel);
  const dists = channelIds.map(key => {
    return groupedByChannel[key].map(row => row.is_member === true ? 10 : 0);
  });

  tsne.initDataRaw(dists);
  for(let k = 0; k < 500; k++) {
    tsne.step(); // every time you call this, solution gets better
  }
  const channels = await db.any(`SELECT * FROM channels WHERE team_id=$(teamId)`, {
    teamId,
  });

  const solution = tsne.getSolution();
  const dbscan = new clustering.KMEANS();
  const clusters = dbscan.run(solution, 5);

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