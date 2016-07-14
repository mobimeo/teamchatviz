/*
  #teamchatviz
  Copyright (C) 2016 Moovel Group GmbH, Haupstaetter str. 149, 70188, Stuttgart, Germany hallo@moovel.com

  This library is free software; you can redistribute it and/or
  modify it under the terms of the GNU Lesser General Public
  License as published by the Free Software Foundation; either
  version 2.1 of the License, or (at your option) any later version.

  This library is distributed in the hope that it will be useful,
  but WITHOUT ANY WARRANTY; without even the implied warranty of
  MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the GNU
  Lesser General Public License for more details.

  You should have received a copy of the GNU Lesser General Public
  License along with this library; if not, write to the Free Software
  Foundation, Inc., 51 Franklin Street, Fifth Floor, Boston, MA  02110-1301
  USA
*/


import passport from 'koa-passport';

import { sync } from '../../data';
import config from '../../config';

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
        if (user === false) {
          ctx.redirect('/error')
        } else {
          ctx.login(user);
          ctx.redirect(ctx.session.returnURL ? ctx.session.returnURL : '/');
          if (ctx.query.state === 'admin') {
            sync.all(user, {
              anonymize: config.anonymize,
            });
          }
        }
      })(ctx);
    } catch (err) {
      console.info('callback error', err, err.stack);
    }
  });
}