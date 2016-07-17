import { getOne as getOneUser, makeUserAMember as makeUserAMember } from './repositories/user';
import config from './config';

export default async (ctx, next) => {
  if (config.public) {
    const user = await makeUserAMember(await getOneUser());
    ctx.login(user);
    await next();
  } else {
    await next();
  }
};