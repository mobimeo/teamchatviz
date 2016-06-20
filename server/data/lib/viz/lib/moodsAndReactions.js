import db from '../../../../db';
import { pgp } from '../../../../db';
import Promise from 'bluebird';
import moment from 'moment-timezone';

export default async function(teamId, startDate = null, endDate = null, interval = '1 day') {
  console.log(`Getting FrequentSpeakers for ${teamId}, ${startDate}, ${endDate}`);
  const ids = await db.any(`SELECT messages.id, SUM(reactions.count) as c FROM messages
    INNER JOIN reactions ON messages.id = reactions.message_id
    WHERE messages.team_id = $(teamId) AND messages.user_id <> 'USLACKBOT'
    GROUP BY messages.id
    ORDER BY c DESC LIMIT 20`, {
      // startDate,
      // endDate,
      teamId,
    });

  console.log(ids);

  const data = await db.any(`SELECT * FROM messages
    INNER JOIN members ON members.id = messages.user_id
    WHERE messages.id IN ($1:csv)
    ORDER BY
     CASE messages.id
      ${ids.map((item, i) => 'WHEN \'' + item.id + '\' THEN ' + i ).join('\n')}
     END ASC`, [ids.map(i => i.id)]);

  const channels = await db.any(`SELECT * FROM channels WHERE team_id=$(teamId)`, {
      teamId,
    });

  const emojis = await db.any(`SELECT * FROM emojis WHERE team_id = $(teamId)`, {
    teamId,
  });

  return {
    data,
    channels,
    emojis,
  };
};