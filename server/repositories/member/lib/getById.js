import db from '../../../db';
import toModel from './mappers/toModel';

export default async(id) => {
  const members = await db.any('SELECT * FROM members WHERE id = $1', [id]);
  return members.length > 0 ? toModel(members[0]): null;
};
