import db from '../../../../db';
import Promise from 'bluebird';
import tsnejs from './tsne';
import { groupBy } from 'lodash';
import clustering from 'density-clustering';

export default async function(teamId, startDate = null, endDate = null, interval = '1 day') {
  console.log(`Getting FrequentSpeakers for ${teamId}, ${startDate}, ${endDate}`);

  const rawData = await db.any(`SELECT membership.channel_id, membership.user_id, membership.is_member FROM membership
    INNER JOIN channels ON membership.channel_id = channels.id AND channels.team_id = $(teamId)
    WHERE membership.team_id = $(teamId) ORDER BY membership.channel_id, membership.user_id;`,
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

  tsne.initDataDist(dists);
  for(let k = 0; k < 1000; k++) {
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
      channelId: channelIds[i],
      name: channels.find(ch => ch.id === channelIds[i]).name,
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
    channels,
  };
};