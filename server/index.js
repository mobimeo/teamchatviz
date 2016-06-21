import Koa from 'koa';
import KoaRouter from 'koa-router';
import bodyParser from 'koa-bodyparser';
import cors from 'kcors';
import convert from 'koa-convert';
import session from 'koa-generic-session';
import passport from 'koa-passport';
import koaStatic from 'koa-static';
import mount from 'koa-mount';
import pgStore from './pg-store';
import './auth';
import api from './api';
import send from 'koa-send';
import Promise from 'bluebird';
import fs from 'fs';
import auth from 'koa-basic-auth';

const apiApp = new Koa();
const app = new Koa();
apiApp.keys = app.keys = ['secret'];
const basicAuth = auth({ name: 'lab', pass: 'topsecret' });

const errorHandler = async (ctx, next) => {
  try {
    await next();
  } catch (err) {
    console.log(err, ctx.path);
    if (401 == err.status) {
      ctx.status = 401;
      ctx.set('WWW-Authenticate', 'Basic');
      ctx.body = 'cant haz that';
    } else {
      throw err;
    }
  }
};

apiApp.use(errorHandler);
apiApp.use(cors());
apiApp.use(bodyParser());
apiApp.use(convert(session({ store: pgStore, cookies: { maxage: 1000*60*60*24*10 }})));
apiApp.use(passport.initialize());
apiApp.use(passport.session());
apiApp.use(api.routes());
apiApp.use(api.allowedMethods());

app.use(errorHandler);
app.use(basicAuth);
app.use(mount('/api', apiApp));
app.use(mount('/', koaStatic(__dirname + '/../client')));
app.use(async (ctx) => {
  ctx.body = await Promise.fromCallback(cb => fs.readFile(__dirname + '/../client/index.html', 'utf-8', cb));
});

export default app;
