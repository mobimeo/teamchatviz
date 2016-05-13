import db from '../../../db';
import toModel from './mappers/toModel';

export default async(id) => {
  const channels = await db.any('SELECT * FROM channels WHERE id = $1', [id]);
  return channels.length > 0 ? toModel(channels[0]): null;
};
