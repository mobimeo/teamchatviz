import { viz, sync } from '../../data';

export default api => {
  api.get('/heartbeat', async(ctx) => {
    if (!ctx.req.user) {
      return ctx.throw(401);
    }
    const startDate = ctx.query.startDate || null;
    const endDate = ctx.query.endDate || null;
    ctx.body = await viz.heartbeat(ctx.req.user.teamId, startDate, endDate);
  });

  api.get('/frequent-speakers', async(ctx) => {
    if (!ctx.req.user) {
      return ctx.throw(401);
    }
    const startDate = ctx.query.startDate || null;
    const endDate = ctx.query.endDate || null;
    const channelId = ctx.query.channelId || null;
    ctx.body = await viz.frequentSpeakers(ctx.req.user.teamId, startDate, endDate, channelId);
  });

  api.get('/emoji-timeline', async(ctx) => {
    if (!ctx.req.user) {
      return ctx.throw(401);
    }
    const startDate = ctx.query.startDate || null;
    const endDate = ctx.query.endDate || null;
    ctx.body = await viz.emojiTimeline(ctx.req.user.teamId, startDate, endDate);
  });

  api.get('/channel-land', async(ctx) => {
    if (!ctx.req.user) {
      return ctx.throw(401);
    }
    const startDate = ctx.query.startDate || null;
    const endDate = ctx.query.endDate || null;
    ctx.body = await viz.channelLand(ctx.req.user.teamId, startDate, endDate);
  });

  api.get('/moods-and-reactions', async(ctx) => {
    if (!ctx.req.user) {
      return ctx.throw(401);
    }
    const startDate = ctx.query.startDate || null;
    const endDate = ctx.query.endDate || null;
    ctx.body = await viz.moodsAndReactions(ctx.req.user.teamId, startDate, endDate);
  });

  api.get('/people-land', async(ctx) => {
    if (!ctx.req.user) {
      return ctx.throw(401);
    }
    const startDate = ctx.query.startDate || null;
    const endDate = ctx.query.endDate || null;
    ctx.body = await viz.peopleLand(ctx.req.user.teamId, startDate, endDate);
  });
}