import { WebClient } from '@slack/client';
import db from '../../db';
import { save as saveMessage, getById as getMessageById } from '../../repositories/message';
import Promise from 'bluebird';

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
                    isStarred: message.is_starred,
                    reactions: JSON.stringify(message.reactions),
                  });
                }
              });
          });
          return Promise.all(promises).then(() => cb(null, result)).catch(cb);
        });
    });
}

const syncChannelHistory = (web, channel, teamId) => {
  return fetchPage(web, channel, teamId, {
    count: 100,
  }).then(result => {
    if (result.has_more) {
      return fetchPage(web, channel, teamId, {
        count: 100,
        latest: result.messages[result.messages.length - 1].ts,
      });
    }
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
      }).catch(cb);
    });
}