import db from '../../../db';
import toModel from './mappers/toModel';

export default async(id) => {
  const users = await db.any('SELECT * FROM users WHERE id = $1', [id]);
  return users.length > 0 ? toModel(users[0]): null;
};
