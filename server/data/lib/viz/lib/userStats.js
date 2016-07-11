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

export default async function(teamId, userId, startDate = null, endDate = null) {
  console.log(`Getting userStats for ${teamId}, ${userId}`);
  const options = {
    teamId,
    userId
  };

  if (startDate) {
    options.startDate = startDate;
  }
  if (endDate) {
    options.endDate = endDate;
  }

  const data = await db.any(`
    SELECT channels.id as id, channels.name, COUNT(messages.id)
    FROM channels INNER JOIN messages ON channels.id = messages.channel_id
    WHERE channels.team_id = $(teamId) and messages.user_id = $(userId)
    ${ startDate ? ' AND messages.message_ts >= $(startDate)' : ''}
    ${ endDate ? ' AND messages.message_ts <= $(endDate)' : ''}
    GROUP BY channels.id, channels.name
  `, options);

  data.forEach(d => d.count = parseInt(d.count));
  data.sort((a, b) => b.count - a.count);

  return data;
};