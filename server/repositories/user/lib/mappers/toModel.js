import moment from 'moment-timezone';

export default (row) => {
  return {
    id: row.id,
    teamId: row.team_id,
    profile: row.profile,
    accessToken: row.access_token,
    createdAt: row.created_at ? moment(row.created_at).utc().format() : null,
    updatedAt: row.updated_at ? moment(row.updated_at).utc().format() : null,
  };
};
