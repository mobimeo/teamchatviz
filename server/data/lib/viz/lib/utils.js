/*
  #teamchatviz
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

export async function getMinDate(teamId) {
  const tmp = await db.one(`SELECT MIN(message_ts) as result FROM messages WHERE team_id = $(teamId)`, {
    teamId: teamId
  });
  return tmp.result;
}

export async function getMaxDate(teamId) {
  const tmp = await db.one(`SELECT MAX(message_ts) as result FROM messages WHERE team_id = $(teamId)`, {
    teamId: teamId
  });
  return tmp.result;
}

