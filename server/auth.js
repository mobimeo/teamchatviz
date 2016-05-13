import passport from 'koa-passport';
import PassportSlack from 'passport-slack';
import config from './config';
import db from './db';
import { save, getById } from './repositories/user';

passport.serializeUser((user, done) => {
  done(null, user.id);
})

passport.deserializeUser((id, done) => {
  db
    .one('SELECT * FROM users WHERE id = $1 LIMIT 1', id)
    .then(user => done(null, user))
    .catch(done);
})

passport.use(new PassportSlack.Strategy({
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
      'usergroups:read'
    ].join(' '),
  },
  (accessToken, refreshToken, profile, done) => {
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
          }
          return save(user).then(() => done(null, user));
        } else {
          done(null, user);
        }
      })
      .catch(done);
  }
));