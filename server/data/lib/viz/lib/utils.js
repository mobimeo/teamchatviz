import db from '../../../../db';

export async function getMinDate(teamId) {
  const tmp = await db.one(`SELECT MIN(message_ts) as result FROM messages WHERE team_id = $(teamId)`, {
    teamId: teamId
  });
  return tmp.result;
}

export async function getMaxDate(teamId) {
  const tmp = await db.one(`SELECT MAX(message_ts) as result FROM messages WHERE team_id = $(teamId)`, {
    teamId: teamId
  });
  return tmp.result;
}

