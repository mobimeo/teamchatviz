import db from '../../../db';
import fromModel from './mappers/fromModel';

export default async(reaction) => {
  await db.none(`INSERT INTO reactions(
        team_id,
        channel_id,
        name,
        count,
        created_at,
        updated_at,
        message_id,
        message_ts
    ) VALUES(
        $(team_id),
        $(channel_id),
        $(name),
        $(count),
        $(created_at),
        $(updated_at),
        $(message_id),
        $(message_ts)
    )`, fromModel(reaction));
};
