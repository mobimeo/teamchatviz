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
import errorHandler from './error';
import demoAuth from './demo-auth';

if (!config.sessionSecret) {
  throw new Error('Define config.sessionSecret');
}

const apiApp = new Koa();
apiApp.keys = [ config.sessionSecret ];
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
apiApp.use(demoAuth);
apiApp.use(api.routes());
apiApp.use(api.allowedMethods());

const app = new Koa();
app.keys = [ config.sessionSecret ];
app.use(errorHandler);
if (config.basicAuthUser) {
  const basicAuth = auth({ name: config.basicAuthUser, pass: config.basicAuthPassword });
  app.use(basicAuth);
}
app.use(mount('/api', apiApp));
app.use(mount('/', koaStatic(__dirname + '/../client')));
app.use(async (ctx) => {
  // return index.html for anything that is not handled
  ctx.body = await Promise.fromCallback(cb => fs.readFile(__dirname + '/../client/index.html', 'utf-8', cb));
});

export default app;
