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
import moment from 'moment-timezone';
import { getMinDate, getMaxDate } from './utils';

const groupByDate = (results, channels, emojis) => {
  const timeline = {};
  let max = 0;
  const rating = {};
  results.forEach(r => {
    if (!(r.t in timeline)) {
      timeline[r.t] = {
        id: r.t,
        emojis: [],
        total: 0,
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
    if (count > 0) {
      timeline[r.t].emojis.push({
        name: r.name,
        count: count,
      });
      timeline[r.t].total += count;
    }
  });

  var emojiRating = Object.keys(rating).map(key => ({
    name: key,
    count: rating[key],
  }));
  emojiRating.sort((a, b) => b.count - a.count);
  const data = Object.keys(timeline).map(key => {
    timeline[key].emojis.sort((a, b) => b.count - a.count);
    return timeline[key];
  });

  return {
    data,
    max,
    channels,
    rating: emojiRating.filter(item => item.count > 0).slice(0, 10),
    emojis,
  };
};

export default async function(teamId, startDate = null, endDate = null, interval = '1 day', channelId = null) {
  if (!startDate) {
    startDate = await getMinDate(teamId);
  }
  if (!endDate) {
    endDate = await getMaxDate(teamId);
  }
  startDate = moment.utc(startDate).format();
  endDate = moment.utc(endDate).format();
  const days = moment(endDate).diff(moment(startDate), 'days');
  const intervalDays = days <= 10 ? 1 : parseInt(days / 14) + 1;
  interval =  intervalDays + ' days';
  console.log(`Getting EmojiTimeline for ${teamId}, ${startDate}, ${endDate}, ${interval}, ${days}`);
  const opts = {
    startDate,
    endDate,
    teamId,
    interval,
  };
  if (channelId) {
    opts.channelId = channelId;
  }
  const tmp = await db.any(`
    SELECT cr.t, cr.name, SUM(COALESCE(data.c, 0)) as c FROM (
      SELECT DATE(t) as t, name FROM generate_series($(startDate)::timestamp, $(endDate), interval $(interval)) as t
      CROSS JOIN (SELECT DISTINCT name FROM reactions WHERE team_id = $(teamId) ${ channelId ? ' AND reactions.channel_id = $(channelId)' : ''} ) reactions
    ) cr LEFT JOIN (
      SELECT DATE(reactions.message_ts) as t, reactions.name, SUM(reactions.count) as c
        FROM reactions
        WHERE reactions.team_id = $(teamId) AND DATE(reactions.message_ts) BETWEEN $(startDate)::timestamp AND $(endDate)::timestamp
        ${ channelId ? ' AND reactions.channel_id = $(channelId)' : ''}
        GROUP BY t, reactions.name
        ORDER BY t
    ) data ON data.t BETWEEN cr.t and cr.t + $(interval)::INTERVAL AND data.name = cr.name
    GROUP BY cr.t, cr.name
    ORDER BY cr.t`, opts);

  const channels = await db.any(`SELECT channels.id, channels.name, creation_date as "creationDate",
    members.real_name as "creatorName", number_of_members as "numberOfMembers"
    FROM channels INNER JOIN members ON channels.created_by = members.id WHERE channels.team_id=$(teamId)`, {
      teamId,
    });

  const emojis = await db.any(`SELECT * FROM emojis WHERE team_id = $(teamId)`, {
    teamId,
  }).reduce((obj, val, key) => {
    obj[`${val.name}`] = val.url;
    return obj;
  }, {});

  return groupByDate(tmp, channels, emojis);
};