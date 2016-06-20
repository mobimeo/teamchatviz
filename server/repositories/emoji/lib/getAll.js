import db from '../../../db';
import toModel from './mappers/toModel';

export default async(teamId) => {
  const members = await db.any('SELECT * FROM emojis WHERE team_id = $1', [teamId]);
  return members.map(toModel);
};
