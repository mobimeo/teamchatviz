import db from '../../../db';
import toModel from './mappers/toModel';

export default async(id) => {
  const messages = await db.any('SELECT * FROM messages WHERE id = $1', [id]);
  return messages.length > 0 ? toModel(messages[0]): null;
};
