import moment from 'moment-timezone';

export default (row) => {
  return {
    id: row.id,
    teamId: row.team_id,
    name: row.name,
    color: row.color,
    firstName: row.first_name,
    lastName: row.last_name,
    realName: row.real_name,
    skype: row.skype,
    email: row.email,
    phone: row.phone,
    image24: row.image24,
    image32: row.image32,
    image48: row.image48,
    image72: row.image72,
    image192: row.image192,
    createdAt: row.created_at ? moment(row.created_at).utc().format() : null,
    updatedAt: row.updated_at ? moment(row.updated_at).utc().format() : null,
  };
};
