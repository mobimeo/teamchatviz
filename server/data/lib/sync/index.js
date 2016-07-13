/*
  #viz4slack
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

import channels from './lib/channels';
import messages from './lib/messages';
import members from './lib/members';
import membership from './lib/membership';
import emojis from './lib/emojis';
import faker from 'faker';
import logger from 'winston';

const configure = (user, anonymize) => {
  if (!anonymize) {
    const k = (id) => id;
    return () => {
      return {
        getChannelId: k,
        getTeamId: k,
        getMemberId: k,
        getChannelName: k,
        getChannelTopic: k,
        getChannelPurpose: k,
        getMemberName: k,
        getMemberFirstName: k,
        getMemberLastName: k,
        getMemberRealName: k,
        getSkype: k,
        getEmail: k,
        getPhone: k,
        getImage24: k,
        getImage32: k,
        getImage48: k,
        getImage72: k,
        getImage192: k,
        getMessageText: k,
      }
    }
  } else {
    const channelIds = {};
    const teamIds = {};
    const memberIds = {};
    let nextChannelId = 0;
    let nextTeamId = 0;
    let nextMemberId = 0;
    return () => {
      return {
        getChannelId: (id) => {
          if (!(id in channelIds)) {
            channelIds[id] = 'C' + nextChannelId++;
          }
          return channelIds[id];
        },
        getTeamId: (id) => {
          return id;
          if (!(id in teamIds)) {
            teamIds[id] = 'T' + nextTeamId++;
          }
          return teamIds[id];
        },
        getMemberId: (id) => {
          if (!(id in memberIds)) {
            memberIds[id] = 'U' + nextMemberId++;
          }
          return memberIds[id];
        },
        getChannelName: () => (Math.random() > 0.15
          ? faker.commerce.productName()
          : faker.address.city())
          .toLowerCase()
          .replace(/\s+/g, '-')
          .substring(0, 20),
        getChannelTopic: () => {
          return {
            value: faker.lorem.words(3),
            creator: 'U' + nextMemberId,
            last_set: 1369677212,
          }
        },
        getChannelPurpose: () => {
          return {
            value: faker.lorem.words(5),
            creator: 'U' + nextMemberId,
            last_set: 1369677212,
          }
        },
        getMemberName: () => faker.internet.userName(),
        getMemberFirstName: () => faker.name.firstName(),
        getMemberLastName: () => faker.name.lastName(),
        getMemberRealName: () => faker.fake('{{name.firstName}} {{name.lastName}}'),
        getSkype: () => faker.phone.phoneNumber(),
        getEmail: () => faker.internet.email(),
        getPhone: () => faker.phone.phoneNumber(),
        getImage24: () => faker.image.avatar(),
        getImage32: () => faker.image.avatar(),
        getImage48: () => faker.image.avatar(),
        getImage72: () => faker.image.avatar(),
        getImage192: () => faker.image.avatar(),
        getMessageText: () => faker.lorem.paragraph(),
      }
    }
  }
}

const all = (user, { anonymize }) => {
  const getters = configure(user, anonymize)();
  const promises = Promise.all([
    members(user.accessToken, user.teamId, getters),
    channels(user.accessToken, user.teamId, getters),
    emojis(user.accessToken, user.teamId, getters),
  ]).then(([ members, channels ]) => {
    return Promise.all([
      messages(user.accessToken, user.teamId, channels, getters),
      membership(user.accessToken, user.teamId, members, channels, getters),
    ]);
  })
  .catch(err => logger.info(err, err.stack));
}

export default {
  channels,
  messages,
  members,
  membership,
  emojis,
  all,
};