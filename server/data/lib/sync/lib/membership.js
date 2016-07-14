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

import { WebClient } from '@slack/client';
import { save as saveMembership } from '../../../../repositories/membership';
import Promise from 'bluebird';
import logger from 'winston';

export default (token, teamId, members, channels, getters) => {
  logger.info('syncing membership', token, teamId);
  const web = new WebClient(token);
  const ids = members.map(member => member.id);
  return Promise.all(channels.map(channel => {
    const channelMembers = channel.members || [];
    const channelId = channel.id;
    const membership = ids
      .map(userId => ({
        userId: getters.getMemberId(userId),
        teamId: getters.getTeamId(teamId),
        channelId: getters.getChannelId(channelId),
        isMember: channelMembers.indexOf(userId) !== -1,
      }));
    return Promise.all(membership.map(saveMembership));
  }));
};