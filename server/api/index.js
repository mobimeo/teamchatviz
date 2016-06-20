import KoaRouter from 'koa-router';
import passport from 'koa-passport';

const api = KoaRouter();

api.get('/health', async (ctx) => ctx.body = { status: 'OK' });

api.get('/user', async(ctx) => {
  if (!ctx.req.user) {
    return ctx.throw(401);
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