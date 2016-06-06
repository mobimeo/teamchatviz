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

const apiApp = new Koa();
apiApp.keys = ['secret'];
apiApp.use(async (ctx, next) => {
  try {
    await next();
  } catch (err) {
    console.log(err);
    throw err;
  }
});
apiApp.use(cors());
apiApp.use(bodyParser());
apiApp.use(convert(session({ store: pgStore})));
apiApp.use(passport.initialize());
apiApp.use(passport.session());
apiApp.use(api.routes());
apiApp.use(api.allowedMethods());

const app = new Koa();

app.keys = ['secret'];
app.use(mount('/api', apiApp));
app.use(mount('/', koaStatic(__dirname + '/../client')));

export default app;
