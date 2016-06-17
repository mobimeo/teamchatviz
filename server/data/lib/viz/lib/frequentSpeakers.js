import db from '../../../../db';
import Promise from 'bluebird';
import moment from 'moment-timezone';

export default async function(teamId, startDate = null, endDate = null, interval = '1 day') {
  console.log(`Getting FrequentSpeakers for ${teamId}, ${startDate}, ${endDate}`);
  const data = await db.any(`SELECT messages.user_id, members.name, members.real_name as realName, members.image72, COUNT(messages.id) as count
    FROM messages INNER JOIN members ON messages.user_id = members.id
    WHERE messages.team_id=$(teamId) AND messages.user_id IS NOT NULL AND messages.user_id <> 'USLACKBOT'
    GROUP BY messages.user_id, members.name, members.real_name, members.image72;`, {
      // startDate,
      // endDate,
      teamId,
    });

  data.forEach(d => d.count = parseInt(d.count));
  data.sort((a, b) => b.count - a.count);

  const channels = await db.any(`SELECT * FROM channels WHERE team_id=$(teamId)`, {
      teamId,
    });

  return {
    data,
    channels,
  };
};