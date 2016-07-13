/*
  #viz4slack
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
import PassportSlack from 'passport-slack';
import config from './config';
import db from './db';
import { save, getById } from './repositories/user';

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser((id, done) => {
  getById(id)
    .then(user => done(null, user))
    .catch(done);
});

const handleUser = (accessToken, refreshToken, profile, done) => {
  profile.accessToken = accessToken;
  profile.refreshToken = refreshToken;
  return getById(profile.id)
    .then(user => {
      if (!user) {
        const user = {
          id: profile.id,
          teamId: profile._json.team_id,
          profile: profile._json,
          accessToken: profile.accessToken,
        };
        return save(user).then(() => done(null, user));
      } else {
        done(null, user);
      }
    })
    .catch(err => done(err));
};

/**
* Additional permissions to load team's data
*/
passport.use('slack-admin', new PassportSlack.Strategy({
    clientID: config.slackClientId,
    clientSecret: config.slackClientSecret,
    scope: [
      'files:read',
      'reactions:read',
      'channels:history',
      'channels:read',
      'users:read',
      'reminders:read',
      'search:read',
      'team:read',
      'usergroups:read',
      'emoji:read',
    ].join(', '),
  },
  handleUser
));

/**
* Look only users
*/
passport.use('slack', new PassportSlack.Strategy({
    clientID: config.slackClientId,
    clientSecret: config.slackClientSecret,
    scope: [
      'identify',
    ].join(' '),
    extendedUserProfile: false,
  },
  handleUser
));