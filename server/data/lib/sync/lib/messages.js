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
import { save as saveMessage, getById as getMessageById } from '../../../../repositories/message';
import { save as saveReaction } from '../../../../repositories/reaction';
import Promise from 'bluebird';
import logger from 'winston';

const syncReactions = (teamId, channelId, message, getters) => {
  if (!message.reactions) {
    return Promise.resolve();
  }
  return Promise.all(message.reactions.map(reaction => {
    return saveReaction({
      teamId: getters.getTeamId(teamId),
      messageId: message.ts,
      channelId: getters.getChannelId(channelId),
      name: reaction.name.split('::')[0],
      count: reaction.count,
    });
  }));
};

const fetchPage = (web, channel, teamId, getters, params) => {
  return Promise.fromCallback(cb => {
      web
        .channels
        .history(channel.id, params,(err, result) => {
          if (err) {
            return cb(err);
          }
          if (result.ok === false) {
            return cb(new Error(result.error));
          }
          let promises = result.messages.map(message => {
            return getMessageById(message.ts)
              .then(ch => {
                if (!ch) {
                  return saveMessage({
                    id: message.ts,
                    channelId: getters.getChannelId(channel.id),
                    teamId: getters.getTeamId(teamId),
                    userId: getters.getMemberId(message.user),
                    type: message.type,
                    text: getters.getMessageText(message.text),
                    isStarred: message.is_starred === true ? true : false,
                    reactions: JSON.stringify(message.reactions),
                  })
                  .then(() => syncReactions(teamId, channel.id, message, getters))
                  .catch(err => logger.error(err));
                }
              });
          });
          return Promise.all(promises).then(() => cb(null, result)).catch(cb);
        });
    });
}

const recursiveFetch = (web, channel, teamId, getters, params) => {
  return fetchPage(web, channel, teamId, getters, params).then(result => {
    if (result.has_more) {
      return recursiveFetch(web, channel, teamId, getters, {
        count: 1000,
        latest: result.messages[result.messages.length - 1].ts,
      });
    }
  });
}

const syncChannelHistory = (web, channel, teamId, getters) => {
  return recursiveFetch(web, channel, teamId, getters, {
    count: 1000,
  });
}

export default async(token, teamId, channels, getters) => {
  logger.info('syncing messages', token, teamId);
  const web = new WebClient(token);
  return await Promise.fromCallback(cb => {
      logger.info('Started syncing messages');
      logger.profile('messageSync');
      return Promise.all(channels.map(channel => {
        return syncChannelHistory(web, channel, teamId, getters);
      })).then(() => {
        logger.info('Done syncing messages');
        logger.profile('messageSync');
        cb();
      }).catch(err => cb(err));
    });
}