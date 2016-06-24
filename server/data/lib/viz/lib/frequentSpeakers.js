import db from '../../../../db';
import Promise from 'bluebird';
import moment from 'moment-timezone';
import { getMinDate, getMaxDate } from './utils';

export default async function(teamId, startDate = null, endDate = null, channelId = null, interval = '1 day') {
  console.log(`Getting FrequentSpeakers for ${teamId}, ${startDate}, ${endDate}, ${channelId}, ${interval}`);

  if (!startDate) {
    startDate = await getMinDate(teamId);
  }
  if (!endDate) {
    endDate = await getMaxDate(teamId);
  }

  startDate = moment.utc(startDate).format();
  endDate = moment.utc(endDate).format();

  const allChannels = !channelId;
  const options = {
    startDate,
    endDate,
    teamId,
  };

  if (!allChannels) {
    options.channelId = channelId;
  }

  const data = await db.any(`SELECT messages.user_id, members.name, members.real_name as realName, members.image72, COUNT(messages.id) as count
    FROM messages INNER JOIN members ON messages.user_id = members.id
    WHERE messages.team_id=$(teamId) AND messages.user_id IS NOT NULL AND messages.user_id <> 'USLACKBOT'
    AND DATE(messages.message_ts) BETWEEN $(startDate)::timestamp AND $(endDate)::timestamp
    ${allChannels ? '' : ' AND messages.channel_id=$(channelId) '}
    GROUP BY messages.user_id, members.name, members.real_name, members.image72;`, options);


  data.forEach(d => d.count = parseInt(d.count));
  data.sort((a, b) => b.count - a.count);

  const channels = await db.any(`SELECT channels.id, channels.name, creation_date as "creationDate",
    members.real_name as "creatorName", number_of_members as "numberOfMembers"
    FROM channels INNER JOIN members ON channels.created_by = members.id WHERE channels.team_id=$(teamId)`, {
      teamId,
    });

  return {
    data,
    channels,
    allChannels,
  };
};