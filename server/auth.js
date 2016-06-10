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
  console.log(profile);
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
      'usergroups:read'
    ].join(', '),
  },
  handleUser
));

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