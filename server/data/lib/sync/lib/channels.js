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


import { WebClient } from '@slack/client';
import db from '../../../../db';
import { save as saveChannel, getById as getChannelById } from '../../../../repositories/channel';
import moment from 'moment-timezone';
import Promise from 'bluebird';
import logger from 'winston';

export default (token, teamId, getters) => {
  logger.info('syncing channels', token, teamId);
  const web = new WebClient(token);
  return Promise.fromCallback(cb => {
      logger.info('Started syncing channels');
      web
        .channels
        .list({
          exclude_archived: true,
        },
        (err, result) => {
          if (err) {
            return cb(err);
          }
          if (result.ok === false) {
            return cb(new Error(result.error));
          }
          let promises = result.channels.map(channel => {
            return getChannelById(channel.id)
              .then(ch => {
                if (!ch) {
                  return saveChannel({
                    id: getters.getChannelId(channel.id),
                    teamId: getters.getTeamId(teamId),
                    name: getters.getChannelName(channel.name),
                    topic: getters.getChannelTopic(channel.topic),
                    purpose: getters.getChannelPurpose(channel.purpose),
                    numberOfMembers: channel.members.length,
                    creationDate: moment.unix(channel.created),
                    createdBy: getters.getMemberId(channel.creator),
                  });
                }
              });
          });
          return Promise.all(promises).then(() => cb(null, result.channels)).catch(err => cb(err));
        });
    });
}