import db from '../../../../db';
import Promise from 'bluebird';
import moment from 'moment-timezone';

const groupByDate = (results, channels) => {
  const timeline = {};
  let max = 0;
  const rating = {};
  results.forEach(r => {
    if (!(r.t in timeline)) {
      timeline[r.t] = {
        id: r.t,
        emojis: [],
      };
    }
    const count = parseInt(r.c);
    if (count > max) {
      max = count;
    }
    if (!(r.name in rating)) {
      rating[r.name] = 0;
    }
    rating[r.name] += count;
    if (count > 4) {
      timeline[r.t].emojis.push({
        name: r.name,
        count: count,
      });
    }
  });

  var emojiRating = Object.keys(rating).map(key => ({
    name: key,
    count: rating[key],
  }));
  emojiRating.sort((a, b) => b.count - a.count);
  return {
    data: Object.keys(timeline).map(key => {
      timeline[key].emojis.sort((a, b) => b.count - a.count);
      return timeline[key];
    }),
    max: max,
    channels: channels,
    rating: emojiRating.filter(item => item.count > 0).slice(0, 10),
  };
};

async function getMinDate(teamId) {
  return moment().subtract(30, 'days').format();
}

async function getMaxDate(teamId) {
  return moment().format();
}

export default async function(teamId, startDate = null, endDate = null, interval = '3 days') {
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
  console.log(`Getting EmojiTimeline for ${teamId}, ${startDate}, ${endDate}`);
  const tmp = await db.any(`
    SELECT cr.t, cr.name, SUM(COALESCE(data.c, 0)) as c FROM (
      SELECT DATE(t) as t, name FROM generate_series($(startDate)::timestamp, $(endDate), interval $(interval)) as t
      CROSS JOIN (SELECT DISTINCT name FROM reactions WHERE team_id = $(teamId)) reactions
    ) cr LEFT JOIN (
      SELECT DATE(reactions.message_ts) as t, reactions.name, SUM(reactions.count) as c
        FROM reactions
        WHERE reactions.team_id = $(teamId) AND DATE(reactions.message_ts) BETWEEN $(startDate)::timestamp AND $(endDate)::timestamp
        GROUP BY t, reactions.name
        ORDER BY t
    ) data ON data.t BETWEEN cr.t and cr.t + $(interval)::INTERVAL AND data.name = cr.name
    GROUP BY cr.t, cr.name
    ORDER BY cr.t`, {
      startDate,
      endDate,
      teamId,
      interval,
    });
  const channels = await db.any(`SELECT * FROM channels
    WHERE channels.team_id = $(teamId) AND id IN (SELECT channel_id FROM reactions WHERE team_id = $(teamId))`, {
      teamId,
    });
  return groupByDate(tmp, channels);
};