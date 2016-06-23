import db from '../../../../db';
import { pgp } from '../../../../db';
import Promise from 'bluebird';
import moment from 'moment-timezone';

export default async function(teamId, startDate = null, endDate = null, channelId = null) {
  console.log(`Getting moods and reactions for ${teamId}, ${startDate}, ${endDate}, ${channelId}`);

  const opts = {
    teamId,
  };

  if (channelId) {
    opts.channelId = channelId;
  }

  if (startDate) {
    opts.startDate = moment(startDate).format();
  }

  if (endDate) {
    opts.endDate = moment(endDate).format();
  }

  const ids = await db.any(`SELECT messages.id, SUM(reactions.count) as c FROM messages
    INNER JOIN reactions ON messages.id = reactions.message_id
    WHERE messages.team_id = $(teamId) ${channelId ? ' AND messages.channel_id = $(channelId) ' : '' }
    AND messages.user_id <> 'USLACKBOT'
    ${startDate ? ' AND DATE(messages.message_ts) >= $(startDate)::timestamp' : ''}
    ${endDate ? ' AND DATE(messages.message_ts) <= $(endDate)::timestamp' : ''}
    GROUP BY messages.id
    ORDER BY c DESC LIMIT 20`, opts);

  const channels = await db.any(`SELECT channels.id, channels.name, creation_date as "creationDate",
    members.real_name as "creatorName", number_of_members as "numberOfMembers"
    FROM channels INNER JOIN members ON channels.created_by = members.id WHERE channels.team_id=$(teamId)`, {
      teamId,
    });

  const emojis = await db.any(`SELECT * FROM emojis WHERE team_id = $(teamId)`, {
    teamId,
  });

  if (ids.length === 0) {
    return {
      data: [],
      channels,
      emojis,
    };
  }
  const data = await db.any(`SELECT * FROM messages
    INNER JOIN members ON members.id = messages.user_id
    WHERE messages.id IN ($1:csv)
    ORDER BY
     CASE messages.id
      ${ids.map((item, i) => 'WHEN \'' + item.id + '\' THEN ' + i ).join('\n')}
     END ASC`, [ids.map(i => i.id)]);
  return {
    data,
    channels,
    emojis,
  };
};