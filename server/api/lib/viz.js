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

import { viz } from '../../data';

export default api => {
  api.get('/heartbeat', async(ctx) => {
    if (!ctx.req.user) {
      return ctx.throw(403);
    }
    const startDate = ctx.query.startDate || null;
    const endDate = ctx.query.endDate || null;
    ctx.body = await viz.heartbeat(ctx.req.user.teamId, startDate, endDate);
  });

  api.get('/frequent-speakers', async(ctx) => {
    if (!ctx.req.user) {
      return ctx.throw(403);
    }
    const startDate = ctx.query.startDate || null;
    const endDate = ctx.query.endDate || null;
    const channelId = ctx.query.channelId || null;
    ctx.body = await viz.frequentSpeakers(ctx.req.user.teamId, startDate, endDate, channelId, ctx.req.user);
  });

  api.get('/emoji-timeline', async(ctx) => {
    if (!ctx.req.user) {
      return ctx.throw(403);
    }
    const startDate = ctx.query.startDate || null;
    const endDate = ctx.query.endDate || null;
    const channelId = ctx.query.channelId || null;
    ctx.body = await viz.emojiTimeline(ctx.req.user.teamId, startDate, endDate, null, channelId);
  });

  api.get('/channel-land', async(ctx) => {
    if (!ctx.req.user) {
      return ctx.throw(403);
    }
    const startDate = ctx.query.startDate || null;
    const endDate = ctx.query.endDate || null;
    ctx.body = await viz.channelLand(ctx.req.user.teamId, startDate, endDate);
  });

  api.get('/messages-and-reactions', async(ctx) => {
    if (!ctx.req.user) {
      return ctx.throw(403);
    }
    const startDate = ctx.query.startDate || null;
    const endDate = ctx.query.endDate || null;
    const channelId = ctx.query.channelId || null;
    ctx.body = await viz.moodsAndReactions(ctx.req.user.teamId, startDate, endDate,
      channelId, ctx.req.user.profile.team);
  });

  api.get('/people-land', async(ctx) => {
    if (!ctx.req.user) {
      return ctx.throw(403);
    }
    const startDate = ctx.query.startDate || null;
    const endDate = ctx.query.endDate || null;
    ctx.body = await viz.peopleLand(ctx.req.user.teamId, startDate, endDate, ctx.req.user);
  });

  api.get('/user-stats', async(ctx) => {
    if (!ctx.req.user) {
      return ctx.throw(403);
    }
    const userId = ctx.query.userId || null;
    if (!userId) {
      return ctx.throw(403);
    }
    const startDate = ctx.query.startDate || null;
    const endDate = ctx.query.endDate || null;
    ctx.body = await viz.userStats(ctx.req.user.teamId, userId, startDate, endDate);
  });

}