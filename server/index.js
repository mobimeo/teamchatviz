import Koa from 'koa';
import KoaRouter from 'koa-router';
import bodyParser from 'koa-bodyparser';
import cors from 'kcors';
import convert from 'koa-convert';
import session from 'koa-generic-session';
import passport from 'koa-passport';
import './auth';
import koaStatic from 'koa-static';
import mount from 'koa-mount';

const apiApp = new Koa();
const api = KoaRouter();
api.get('/health', async (ctx) => {
  ctx.body = {
    status: 'OK',
  };
})
api.get('/auth/slack', passport.authenticate('slack'));
api.get('/auth/slack/callback', passport.authenticate('slack', {
  successRedirect: '/app',
  failureRedirect: '/',
}));

apiApp.keys = ['secret'];
apiApp.use(cors());
apiApp.use(bodyParser());
apiApp.use(convert(session()));
apiApp.use(passport.initialize());
apiApp.use(passport.session());
apiApp.use(api.routes());
apiApp.use(api.allowedMethods());

const app = new Koa();
app.use(mount('/api', apiApp));
app.use(mount('/', koaStatic(__dirname + '/../client')));

export default app;
