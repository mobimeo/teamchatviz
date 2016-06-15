import moment from 'moment-timezone';

export default (model) => {
  return {
    id: model.id,
    team_id: model.teamId,
    name: model.name,
    topic: model.topic,
    purpose: model.purpose,
    number_of_members: model.numberOfMembers,
    created_by: model.createdBy,
    creation_date: model.creationDate,
    created_at: model.createdAt ? moment(model.createdAt).utc().format(): moment().utc().format(),
    updated_at: model.updatedAt ? moment(model.updatedAt).utc().format(): moment().utc().format(),
  };
};
