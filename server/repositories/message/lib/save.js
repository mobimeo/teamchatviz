import db from '../../../db';
import fromModel from './mappers/fromModel';

export default async(message) => {
  await db.none('INSERT INTO messages(id, team_id, user_id, message_ts, created_at, updated_at, type, text, is_starred, reactions, channel_id)' +
  ' VALUES(${id}, ${team_id}, ${user_id}, ${message_ts}, ${created_at}, ${updated_at}, ${type}, ${text}, ${is_starred}, ${reactions}, ${channel_id})', fromModel(message));
};



