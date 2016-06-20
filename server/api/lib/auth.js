import passport from 'koa-passport';

import { sync } from '../../data';

export default api => {
  api.get('/auth/slack',
    async (ctx, next) => {
      ctx.session.returnURL = ctx.query.returnURL;
      delete ctx.query.returnURL;
      await next();
    },
    passport.authenticate('slack'));

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
          ctx.redirect(ctx.session.returnURL ? ctx.session.returnURL : '/');
          if (ctx.query.state === 'admin') {
            const promises = Promise.all([
              sync.members(user.accessToken, user.teamId),
              sync.channels(user.accessToken, user.teamId)
            ]).then(([ members, channels ]) => {
              return Promise.all([
                sync.messages(user.accessToken, user.teamId, channels),
                sync.membership(user.accessToken, user.teamId, members, channels),
              ]);
            })
            .catch(err => console.log(err));
          }
        }
      })(ctx);
    } catch (err) {
      console.log('callback error', err, err.stack);
    }
  });
}