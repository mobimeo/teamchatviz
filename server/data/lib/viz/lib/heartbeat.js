import db from '../../../../db';
import Promise from 'bluebird';

const groupByChannel = (results) => {
  const channels = {};
  results.forEach(r => {
    if (!(r.id in channels)) {
      channels[r.id] = {
        id: r.id,
        name: r.name,
        heartbeat: [],
      };
    }
    channels[r.id].heartbeat.push({
      t: r.t,
      count: parseInt(r.c),
    })
  });
  return Object.keys(channels).map(key => channels[key]);
};

export default async function() {
  return db.any(`SELECT channels.id, channels.name, DATE(messages.message_ts) as t, COUNT(messages.id) as c
    FROM channels INNER JOIN messages ON channels.id = messages.channel_id
    GROUP BY channels.id, t
    ORDER BY channels.id, t`)
    .then(results => groupByChannel(results));
};