/*
  Slack Viz
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
import Promise from 'bluebird';
import fs from 'fs';
import auth from 'koa-basic-auth';
import ms from 'ms';
import config from './config';

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
apiApp.use(convert(session({
  store: pgStore,
  rolling: true,
  cookie: {
    maxage: ms('7 days'),
  },
})));
apiApp.use(passport.initialize());
apiApp.use(passport.session());

import { getOne as getOneUser, makeUserAMember as makeUserAMember } from './repositories/user';

apiApp.use(async (ctx, next) => {
  if (config.public) {
    const user = await makeUserAMember(await getOneUser());
    ctx.login(user);
    await next();
  } else {
    await next();
  }
});

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
