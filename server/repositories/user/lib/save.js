import db from '../../../db';
import fromModel from './mappers/fromModel';

export default async(user) => {
  await db.none('INSERT INTO users(id, team_id, profile, access_token, created_at, updated_at)' +
  ' VALUES(${id}, ${team_id}, ${profile}, ${access_token}, ${created_at}, ${updated_at})', fromModel(user));
};
