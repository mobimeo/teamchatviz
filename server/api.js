import KoaRouter from 'koa-router';
import passport from 'koa-passport';

import { syncChannels, syncMessages, viz, syncMembers } from './data';

const api = KoaRouter();

api.get('/health', async (ctx) => ctx.body = { status: 'OK' });

api.get('/auth/slack', passport.authenticate('slack'));

api.get('/auth/slack-admin', passport.authenticate('slack-admin', {
  state: 'admin'
}));

api.get('/auth/slack/callback', async (ctx) => {
  const name = ctx.query.state === 'admin' ? 'slack-admin' : 'slack';
  try {
    await passport.authenticate(name, {
      successRedirect: '/',
      failureRedirect: '/error',
    }, function(user, info, status) {
      console.log(user, info, status);
      if (user === false) {
        ctx.redirect('/error')
      } else {
        ctx.login(user);
        ctx.redirect('/');
        if (ctx.query.state === 'admin') {
          syncMembers(user.accessToken, user.teamId);
          syncChannels(user.accessToken, user.teamId)
            .then(channels => syncMessages(user.accessToken, user.teamId, channels));
        }
      }
    })(ctx);
  } catch (err) {
    console.log('callback error', err, err.stack);
  }
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
});

api.get('/frequent-speakers', async(ctx) => {
  if (!ctx.req.user) {
    return ctx.throw(401);
  }
  const startDate = ctx.query.startDate || null;
  const endDate = ctx.query.endDate || null;
  ctx.body = await viz.frequentSpeakers(ctx.req.user.teamId, startDate, endDate);
});

api.get('/emoji-timeline', async(ctx) => {
  if (!ctx.req.user) {
    return ctx.throw(401);
  }
  const startDate = ctx.query.startDate || null;
  const endDate = ctx.query.endDate || null;
  ctx.body = await viz.emojiTimeline(ctx.req.user.teamId, startDate, endDate);
});

export default api;