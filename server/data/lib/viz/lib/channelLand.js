import db from '../../../../db';
import Promise from 'bluebird';
import tsnejs from './tsne';
import { groupBy } from 'lodash';

export default async function(teamId, startDate = null, endDate = null, interval = '1 day') {
  console.log(`Getting FrequentSpeakers for ${teamId}, ${startDate}, ${endDate}`);

  const rawData = await db.any(`SELECT channel_id, user_id, is_member FROM membership WHERE team_id = $(teamId) ORDER BY channel_id, user_id;`,
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
    return groupedByChannel[key].map(row => row.is_member === true ? 0.1 : 0);
  });

  tsne.initDataDist(dists);
  for(let k = 0; k < 1000; k++) {
    tsne.step(); // every time you call this, solution gets better
  }
  const channels = await db.any(`SELECT * FROM channels WHERE team_id=$(teamId)`, {
    teamId,
  });

  const data = tsne.getSolution().map((row, i) => ({
    channelId: channelIds[i],
    name: channels.find(ch => ch.id === channelIds[i]).name,
    x: row[0]*1000,
    y: row[1]*1000,
  }));

  return {
    data,
    channels,
  };
};