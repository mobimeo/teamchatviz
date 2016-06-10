import moment from 'moment-timezone';

export default (model) => {
  return {
    channel_id: model.channelId,
    team_id: model.teamId,
    name: model.name,
    count: model.count,
    message_id: model.messageId,
    created_at: model.createdAt ? moment(model.createdAt).utc().format(): moment().utc().format(),
    updated_at: model.updatedAt ? moment(model.updatedAt).utc().format(): moment().utc().format(),
    message_ts: moment.unix(parseInt(model.messageId.split('.')[0])).utc().format(),
  };
};
