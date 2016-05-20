import moment from 'moment-timezone';

export default (row) => {
  return {
    id: row.id,
    user_id: row.user_id,
    teamId: row.team_id,
    type: row.type,
    text: row.text,
    isStarred: row.is_starred,
    reactions: row.reactions,
    createdAt: row.created_at ? moment(row.created_at).utc().format() : null,
    updatedAt: row.updated_at ? moment(row.updated_at).utc().format() : null,
    channelId: row.channel_id,
    messageTs: row.message_ts,
  };
};