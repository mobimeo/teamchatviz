import moment from 'moment-timezone';

export default (model) => {
  return {
    user_id: model.userId,
    team_id: model.teamId,
    channel_id: model.channelId,
    is_member: model.isMember,
  };
};
