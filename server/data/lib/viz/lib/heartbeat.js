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
        max: 0,
      };
    }
    if (!channels[r.id].name && r.name) {
      channels[r.id].name = r.name;
      channels[r.id].numberOfMembers = r.number_of_members;
    }
    const count = parseInt(r.c);
    if (count > channels[r.id].max) {
      channels[r.id].max = count;
    }
    channels[r.id].heartbeat.push({
      t: r.t,
      count: count,
    })
  });
  return {
    data: Object.keys(channels).map(key => channels[key]),
  };
};

export default async function(teamId, startDate = null, endDate = null, interval = '1 day') {
  if (!startDate) {
    startDate = await getMinDate(teamId);
  }
  if (!endDate) {
    endDate = await getMaxDate(teamId);
  }
  startDate = moment.utc(startDate).format();
  endDate = moment.utc(endDate).format();
  const days = moment(endDate).diff(moment(startDate), 'days');
  let numberOfChunks = 6;
  if (days > 30) {
    interval = '5 days';
    numberOfChunks = 10;
  }
  if (days < 15) {
    numberOfChunks = days;
  }
  const chunkLength = Math.floor(days / numberOfChunks);
  const chunks = [];

  for (var i = 0; i < numberOfChunks; i++) {
    chunks[i] = {
      ts: moment.utc(startDate).add(i*chunkLength, 'days').format(),
      label: moment.utc(startDate).add(i*chunkLength, 'days').format(),
    };
  }

  // chunks.push({
  //   ts: moment(endDate).utc().subtract(1, 'day').format(),
  //   label: moment(endDate).utc().subtract(1, 'day').format(),
  // });

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
  const result = groupByChannel(tmp);
  result.chunks = chunks;
  return result;
};