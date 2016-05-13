import moment from 'moment-timezone';

export default (model) => {
  return {
    id: model.id,
    team_id: model.teamId,
    profile: model.profile,
    access_token: model.access_token,
    created_at: model.createdAt ? moment(model.createdAt).utc().format(): moment().utc().format(),
    updated_at: model.updatedAt ? moment(model.updatedAt).utc().format(): moment().utc().format(),
  };
};
