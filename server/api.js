import KoaRouter from 'koa-router';
import passport from 'koa-passport';

import { syncChannels } from './data';

const api = KoaRouter();

api.get('/health', async (ctx) => ctx.body = { status: 'OK' });
api.get('/auth/slack', passport.authenticate('slack'));
api.get('/auth/slack/callback', async (ctx) => {
  await passport.authenticate('slack', {
    successRedirect: '/',
    failureRedirect: '/error',
  }, function(user, info, status) {
    if (user === false) {
      ctx.redirect('/error')
    } else {
      ctx.login(user);
      ctx.redirect('/');
      syncChannels(user.accessToken, user.teamId);
    }
  })(ctx);
});

api.get('/user', async(ctx) => {
  ctx.body = ctx.session;
});

export default api;