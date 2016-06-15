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
        numberOfMembers: r.number_of_members,
        creationDate: r.creation_date,
        creatorName: r.real_name,
        heartbeat: [],
      };
    }
    if (!channels[r.id].name && r.name) {
      channels[r.id].name = r.name;
      channels[r.id].numberOfMembers = r.number_of_members;
    }
    const count = parseInt(r.c);
    channels[r.id].heartbeat.push({
      t: r.t,
      count: count,
    })
  });
  return {
    data: Object.keys(channels).map(key => channels[key]),
  };
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

export default async function(teamId, startDate = null, endDate = null, interval = '1 day') {
  if (!startDate) {
    startDate = await getMinDate(teamId);
  }
  if (!endDate) {
    endDate = await getMaxDate(teamId);
  }
  startDate = moment(startDate).utc().format();
  endDate = moment(endDate).utc().format();
  const days = moment(endDate).diff(moment(startDate), 'days');
  if (days > 30) {
    interval = '5 days';
  }
  console.log(`Getting Heartbeat for ${teamId}, ${startDate}, ${endDate}`);
  const tmp = await db.any(`
    SELECT cr.t, cr.id, cr.name, cr.number_of_members, cr.creation_date, cr.created_by, members.real_name, SUM(COALESCE(data.c, 0)) as c FROM (
      SELECT DATE(t) as t, id, name, number_of_members, creation_date, created_by FROM generate_series($(startDate)::timestamp, $(endDate), interval $(interval)) as t
      CROSS JOIN (SELECT DISTINCT id, name, number_of_members, creation_date, created_by FROM channels WHERE team_id = $(teamId)) channels
    ) cr LEFT JOIN (
      SELECT DATE(messages.message_ts) as t, channels.id, COUNT(messages.id) as c
        FROM channels INNER JOIN messages ON channels.id = messages.channel_id
        WHERE channels.team_id = $(teamId) AND messages.team_id = $(teamId)
        AND DATE(messages.message_ts) BETWEEN $(startDate)::timestamp AND $(endDate)::timestamp
        GROUP BY t, channels.id, channels.name
        ORDER BY t
    ) data ON data.t BETWEEN cr.t and cr.t + $(interval)::INTERVAL AND data.id = cr.id
    INNER JOIN members ON members.id = cr.created_by
    GROUP BY cr.t, cr.id, cr.name, cr.number_of_members, cr.creation_date, cr.created_by, members.real_name
    ORDER BY cr.t`, {
      startDate,
      endDate,
      teamId,
      interval,
    });
  return groupByChannel(tmp);
};