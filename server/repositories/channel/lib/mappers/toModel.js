import moment from 'moment-timezone';

export default (row) => {
  return {
    id: row.id,
    teamId: row.team_id,
    numberOfMembers: row.number_of_members,
    purpose: row.purpose,
    topic: row.topic,
    name: row.name,
    creationDate: row.creation_date,
    createdBy: row.created_by,
    createdAt: row.created_at ? moment(row.created_at).utc().format() : null,
    updatedAt: row.updated_at ? moment(row.updated_at).utc().format() : null,
  };
};
