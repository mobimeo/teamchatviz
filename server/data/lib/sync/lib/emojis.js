import { WebClient } from '@slack/client';
import db from '../../../../db';
import { save as saveEmoji, getAll as getAll, deleteAll as deleteAll } from '../../../../repositories/emoji';
import moment from 'moment-timezone';
import Promise from 'bluebird';

export default (token, teamId) => {
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
          return deleteAll(teamId).then(() => {
            let emojis = Object.keys(result.emoji);
            let promises = emojis.map(name => {
              if (result.emoji[name].startsWith('alias:')) {
                console.log(result.emoji[name]);
                name = result.emoji[name].replace('alias:', '');
              }
              return saveEmoji({
                teamId,
                name: name,
                url: result.emoji[name],
              });
            });
            return Promise.all(promises).then(() => cb(null, result.emoji)).catch(err => cb(err));
          })
        });
    });
}