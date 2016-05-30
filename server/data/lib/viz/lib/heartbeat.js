import db from '../../../../db';
import Promise from 'bluebird';
import moment from 'moment-timezone';

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
    if (!channels[r.id].name && r.name) {
      channels[r.id].name = r.name;
    }
    channels[r.id].heartbeat.push({
      t: r.t,
      count: parseInt(r.c),
    })
  });
  return Object.keys(channels).map(key => channels[key]);
};

async function getMinDate(teamId) {
  const tmp = await db.one(`SELECT MIN(message_ts) as result FROM messages WHERE team_id = $(teamId)`, {
    teamId: teamId
  });
  return tmp.result;
}

async function getMaxDate(teamId) {
  const tmp = await db.one(`SELECT MAX(message_ts) as result FROM messages WHERE team_id = $(teamId)`, {
    teamId: teamId
  });
  return tmp.result;
}

export default async function(teamId, startDate = null, endDate = null, inteval = '1 day') {
  if (!startDate) {
    startDate = await getMinDate(teamId);
  }
  if (!endDate) {
    endDate = await getMaxDate(teamId);
  }
  startDate = moment(startDate).utc().format();
  endDate = moment(endDate).utc().format();
  console.log(`Getting Heartbeat for ${teamId}, ${startDate}, ${endDate}`);
  const tmp = await db.any(`
    SELECT cr.t, cr.id, data.name, COALESCE(data.c, 0) as c FROM (
      SELECT DATE(t) as t, id FROM generate_series($(startDate)::timestamp, $(endDate), interval $(inteval)) as t
      CROSS JOIN (SELECT DISTINCT id FROM channels WHERE team_id = $(teamId)) channels
    ) cr LEFT JOIN (
      SELECT DATE(messages.message_ts) as t, channels.id, channels.name, COUNT(messages.id) as c
        FROM channels INNER JOIN messages ON channels.id = messages.channel_id
        WHERE channels.team_id = $(teamId) AND messages.team_id = $(teamId)
        GROUP BY t, channels.id, channels.name
    ) data ON data.t = cr.t AND data.id = cr.id
    ORDER BY cr.t`, {
      startDate,
      endDate,
      teamId,
      inteval,
    });
  return groupByChannel(tmp);
};