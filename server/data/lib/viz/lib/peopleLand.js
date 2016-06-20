import db from '../../../../db';
import Promise from 'bluebird';
import tsnejs from './tsne';
import { groupBy } from 'lodash';
import clustering from 'density-clustering';

export default async function(teamId, startDate = null, endDate = null, interval = '1 day') {
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
    return groupedByUser[key].map(row => row.is_member === true ? 10 : 0);
  });

  // console.log(dists.slice(0, 3));
  tsne.initDataDist(dists);

  for(let k = 0; k < 500; k++) {
    tsne.step(); // every time you call this, solution gets better
  }
  const members = await db.any(`SELECT * FROM members WHERE team_id=$(teamId) AND id <> 'USLACKBOT'`, {
    teamId,
  });

  const solution = tsne.getSolution();
  const dbscan = new clustering.KMEANS();
  const clusters = dbscan.run(solution, 10);

  const data = solution.map((row, i) => {
    return {
      channelId: userIds[i],
      name: members.find(ch => ch.id === userIds[i]).name,
      x: row[0]*1000,
      y: row[1]*1000
    }
  });

  const colors = [
    'red',
    'green',
    'blue',
    'yellow',
    'grey',
    'violet',
    '#00B7BF',
    '#9B9B9B'
  ];

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
    members,
  };
};