import KoaRouter from 'koa-router';
import passport from 'koa-passport';

import { syncChannels, syncMessages, viz } from './data';

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
      // syncChannels(user.accessToken, user.teamId)
      //   .then(channels => syncMessages(user.accessToken, user.teamId, channels));
    }
  })(ctx);
});

api.get('/user', async(ctx) => {
  ctx.body = ctx.session;
});

api.get('/heartbeat', async(ctx) => {
  if (!ctx.req.user) {
    return ctx.throw(401);
  }
  const startDate = ctx.query.startDate || null;
  const endDate = ctx.query.endDate || null;
  ctx.body = await viz.heartbeat(ctx.req.user.teamId, startDate, endDate);
})

export default api;