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


import KoaRouter from 'koa-router';
import passport from 'koa-passport';

const api = KoaRouter();

api.get('/health', async (ctx) => ctx.body = { status: 'OK' });

api.get('/user', async(ctx) => {
  if (!ctx.req.user) {
    return ctx.throw(403);
  }
  ctx.body = {
    loading: false,
  };
});

import auth from './lib/auth';
import viz from './lib/viz';

viz(api);
auth(api);

export default api;