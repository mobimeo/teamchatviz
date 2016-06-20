import db from '../../../db';
import toModel from './mappers/toModel';

export default async(teamId) => {
  await db.none('DELETE FROM emojis WHERE team_id = $1', [teamId]);
};
