/*
  #viz4slack
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


import { WebClient } from '@slack/client';
import db from '../../../../db';
import { save as saveEmoji, getAll as getAll, deleteAll as deleteAll } from '../../../../repositories/emoji';
import moment from 'moment-timezone';
import Promise from 'bluebird';

export default (token, teamId, getters) => {
  console.log('syncing emojis', token, teamId);
  const web = new WebClient(token);
  return Promise.fromCallback(cb => {
      console.log('Started syncing emojis');
      web
        .emoji
        .list((err, result) => {
          if (err) {
            return cb(err);
          }
          if (result.ok === false) {
            return cb(new Error(result.error));
          }
          return deleteAll(teamId).then(() => {
            let emojis = Object.keys(result.emoji);
            let promises = emojis.map(name => {
              if (result.emoji[name].startsWith('alias:')) {
                name = result.emoji[name].replace('alias:', '');
              }
              return saveEmoji({
                teamId: getters.getTeamId(teamId),
                name: name,
                url: result.emoji[name],
              });
            });
            return Promise.all(promises).then(() => cb(null, result.emoji)).catch(err => cb(err));
          })
        });
    });
}