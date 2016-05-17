import { WebClient } from '@slack/client';
import db from '../../db';
import { save as saveChannel, getById as getChannelById } from '../../repositories/channel';
import Promise from 'bluebird';

export default async(token, teamId) => {
  console.log('syncing channels', token, teamId);
  const web = new WebClient(token);
  return await Promise.fromCallback(cb => {
      console.log('Started syncing');
      web
        .channels
        .list({
          exclude_archived: true,
        },
        (err, result) => {
          if (err) {
            return cb(err);
          }
          let promises = result.channels.map(channel => {
            return getChannelById(channel.id)
              .then(ch => {
                if (!ch) {
                  return saveChannel({
                    id: channel.id,
                    teamId: teamId,
                    name: channel.name,
                    topic: channel.topic,
                    purpose: channel.purpose,
                    numberOfMembers: channel.numberOfMembers,
                  });
                }
              });
          });
          return Promise.all(promises).then(() => cb()).catch(cb);
        });
    });
}