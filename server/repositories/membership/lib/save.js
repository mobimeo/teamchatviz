import db from '../../../db';
import fromModel from './mappers/fromModel';

export default async(member) => {
  await db.none(`INSERT INTO membership(
    user_id,
    team_id,
    channel_id,
    is_member) VALUES ($(user_id), $(team_id), $(channel_id), $(is_member))`, fromModel(member));
};
