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

import moment from 'moment-timezone';

export default (row) => {
  return {
    id: row.id,
    teamId: row.team_id,
    name: row.name,
    color: row.color,
    firstName: row.first_name,
    lastName: row.last_name,
    realName: row.real_name,
    skype: row.skype,
    email: row.email,
    phone: row.phone,
    image24: row.image24,
    image32: row.image32,
    image48: row.image48,
    image72: row.image72,
    image192: row.image192,
    createdAt: row.created_at ? moment(row.created_at).utc().format() : null,
    updatedAt: row.updated_at ? moment(row.updated_at).utc().format() : null,
  };
};
