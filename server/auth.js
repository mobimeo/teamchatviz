import passport from 'koa-passport';
import PassportSlack from 'passport-slack';

passport.serializeUser((user, done) => {
  done(null, user.id);
})

passport.deserializeUser((id, done) => {
  done(null, user);
})

passport.use(new PassportSlack.Strategy({
    clientID: '3755727947.41964981841',
    clientSecret: 'c7b6af31cd0f3b6e32c7b072f18f7c82',
    scope: 'files:read reactions:read channels:history channels:read users:read reminders:read search:read team:read  usergroups:read',
  },
  (accessToken, refreshToken, profile, done) => {
    console.log(accessToken, refreshToken, profile);
    done({ id:1 });
  }
));