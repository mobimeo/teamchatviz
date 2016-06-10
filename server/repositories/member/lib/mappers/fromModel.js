import moment from 'moment-timezone';

export default (model) => {
  return {
    id: model.id,
    team_id: model.teamId,
    name: model.name,
    color: model.color,
    first_name: model.firstName,
    last_name: model.lastName,
    real_name: model.realName,
    skype: model.skype,
    email: model.email,
    phone: model.phone,
    image24: model.image24,
    image32: model.image32,
    image48: model.image48,
    image72: model.image72,
    image192: model.image192,
    created_at: model.createdAt ? moment(model.createdAt).utc().format(): moment().utc().format(),
    updated_at: model.updatedAt ? moment(model.updatedAt).utc().format(): moment().utc().format(),
  };
};
