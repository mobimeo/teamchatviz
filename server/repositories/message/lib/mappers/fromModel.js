import moment from 'moment-timezone';

export default (model) => {
  return {
    id: model.id,
    team_id: model.teamId,
    user_id: model.userId,
    type: model.type,
    text: model.text,
    is_starred: model.isStarred,
    reactions: model.reactions,
    channel_id: model.channelId,
    created_at: model.createdAt ? moment(model.createdAt).utc().format(): moment().utc().format(),
    updated_at: model.updatedAt ? moment(model.updatedAt).utc().format(): moment().utc().format(),
    message_ts: moment.unix(parseInt(model.id.split('.')[0])).utc().format(),
  };
};
