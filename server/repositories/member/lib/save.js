import db from '../../../db';
import fromModel from './mappers/fromModel';

export default async(member) => {
  await db.none(`INSERT INTO members(
    id,
    team_id,
    name,
    color,
    first_name,
    last_name,
    real_name,
    skype,
    email,
    phone,
    image24,
    image32,
    image48,
    image72,
    image192,
    created_at,
    updated_at
    ) VALUES(
    $(id),
    $(team_id),
    $(name),
    $(color),
    $(first_name),
    $(last_name),
    $(real_name),
    $(skype),
    $(email),
    $(phone),
    $(image24),
    $(image32),
    $(image48),
    $(image72),
    $(image192),
    $(created_at),
    $(updated_at)
    )`, fromModel(member));
};
