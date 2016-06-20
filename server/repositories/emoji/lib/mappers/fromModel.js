import moment from 'moment-timezone';

export default (model) => {
  return {
    team_id: model.teamId,
    name: model.name,
    url: model.url,
    created_at: model.createdAt ? moment(model.createdAt).utc().format(): moment().utc().format(),
    updated_at: model.updatedAt ? moment(model.updatedAt).utc().format(): moment().utc().format(),
  };
};
