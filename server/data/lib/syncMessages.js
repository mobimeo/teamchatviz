import { WebClient } from '@slack/client';
import db from '../../db';
import { save as saveMessage, getById as getMessageById } from '../../repositories/message';
import { save as saveReaction } from '../../repositories/reaction';
import Promise from 'bluebird';

const syncReactions = (teamId, channelId, message) => {
  if (!message.reactions) {
    return Promise.resolve();
  }
  return Promise.all(message.reactions.map(reaction => {
    return saveReaction({
      teamId,
      messageId: message.ts,
      channelId: channelId,
      name: reaction.name,
      count: reaction.count,
    });
  }));
};

const fetchPage = (web, channel, teamId, params) => {
  return Promise.fromCallback(cb => {
      web
        .channels
        .history(channel.id, params,(err, result) => {
          if (err) {
            return cb(err);
          }
          let promises = result.messages.map(message => {
            return getMessageById(message.ts)
              .then(ch => {
                if (!ch) {
                  return saveMessage({
                    id: message.ts,
                    channelId: channel.id,
                    teamId: teamId,
                    userId: message.user,
                    type: message.type,
                    text: message.text,
                    isStarred: message.is_starred === true ? true : false,
                    reactions: JSON.stringify(message.reactions),
                  })
                  .then(() => syncReactions(teamId, channel.id, message))
                  .catch(err => console.error(err));
                }
              });
          });
          return Promise.all(promises).then(() => cb(null, result)).catch(cb);
        });
    });
}

const recursiveFetch = (web, channel, teamId, params) => {
  return fetchPage(web, channel, teamId, params).then(result => {
    if (result.has_more) {
      return recursiveFetch(web, channel, teamId, {
        count: 1000,
        latest: result.messages[result.messages.length - 1].ts,
      });
    }
  });
}

const syncChannelHistory = (web, channel, teamId) => {
  return recursiveFetch(web, channel, teamId, {
    count: 1000,
  });
}

export default async(token, teamId, channels) => {
  console.log('syncing messages', token, teamId);
  const web = new WebClient(token);
  return await Promise.fromCallback(cb => {
      console.log('Started syncing messages');
      console.time('messageSync');
      return Promise.all(channels.map(channel => {
        return syncChannelHistory(web, channel, teamId);
      })).then(() => {
        console.log('Done syncing messages');
        console.timeEnd('messageSync');
        cb();
      }).catch(err => cb(err));
    });
}