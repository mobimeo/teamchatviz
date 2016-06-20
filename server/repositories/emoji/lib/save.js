import db from '../../../db';
import fromModel from './mappers/fromModel';

export default async(reaction) => {
  await db.none(`INSERT INTO emojis(
        team_id,
        name,
        url,
        created_at,
        updated_at
    ) VALUES(
        $(team_id),
        $(name),
        $(url),
        $(created_at),
        $(updated_at)
    )`, fromModel(reaction));
};
