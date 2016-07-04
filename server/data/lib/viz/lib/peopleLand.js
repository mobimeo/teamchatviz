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

export default async function(teamId, startDate = null, endDate = null, currentUser = null, interval = '1 day') {
  console.log(`Getting FrequentSpeakers for ${teamId}, ${startDate}, ${endDate}`);

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

  const tsne = new tsnejs.tSNE(opt); // create a tSNE instance
  const userIds = Object.keys(groupedByUser);
  const dists = userIds.map(key => {
    return groupedByUser[key].map(row => row.is_member === true ? 10 : 5);
  });

  console.time('tsne');
  tsne.initDataRaw(dists);
  for (let k = 0; k < 500; k++) {
    tsne.step(); // every time you call this, solution gets better
  }

  const solution = tsne.getSolution();
  console.timeEnd('tsne');

  const members = (await db
    .any(`SELECT *, (CASE id WHEN $(thisUserId) THEN 1 ELSE 0 END) as is_current_user FROM members
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

  console.time('k-means');
  const numberOfClusters = 2 + Math.floor(members.length / 50);
  const dbscan = new clustering.KMEANS();
  const clusters = dbscan.run(solution, numberOfClusters);
  console.timeEnd('k-means');

  const data = solution.map((row, i) => {
    const member = members.find(ch => ch.id === userIds[i]);
    return {
      id: userIds[i],
      name: member.name,
      image24: member.image24,
      image48: member.image48,
      highlighted: member.is_current_user,
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

  return {
    data,
    members,
  };
};