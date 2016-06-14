import db from '../../../../db';
import { pgp } from '../../../../db';
import Promise from 'bluebird';
import moment from 'moment-timezone';

export default async function(teamId, startDate = null, endDate = null, interval = '1 day') {
  console.log(`Getting FrequentSpeakers for ${teamId}, ${startDate}, ${endDate}`);
  const ids = await db.any(`SELECT messages.id, SUM(reactions.count) as c FROM messages
    INNER JOIN reactions ON messages.id = reactions.message_id
    WHERE messages.team_id = $(teamId)
    GROUP BY messages.id
    ORDER BY c DESC LIMIT 20`, {
      // startDate,
      // endDate,
      teamId,
    });

  const data = await db.any(`SELECT * FROM messages
    INNER JOIN members ON members.id = messages.user_id
    WHERE messages.id IN ($1^)`, pgp.as.csv(ids.map(item => item.id)));

  const channels = await db.any(`SELECT * FROM channels WHERE team_id=$(teamId)`, {
      teamId,
    });

  return {
    data,
    channels,
  };
};