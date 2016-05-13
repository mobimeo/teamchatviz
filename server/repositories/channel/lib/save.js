import db from '../../../db';
import fromModel from './mappers/fromModel';

export default async(channel) => {
  await db.none('INSERT INTO channels(id, team_id, created_at, updated_at, name, number_of_members, topic, purpose)' +
  ' VALUES(${id}, ${team_id}, ${created_at}, ${updated_at}, ${name}, ${number_of_members}, ${topic}, ${purpose})', fromModel(channel));
};
