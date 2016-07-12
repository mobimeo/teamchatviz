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
import db from '../../../../db';
import { save as saveMember, getById as getMemberById } from '../../../../repositories/member';
import Promise from 'bluebird';

export default (token, teamId, getters) => {
  console.log('syncing users', token, teamId);
  const web = new WebClient(token);
  return Promise.fromCallback(cb => {
      console.log('Started syncing users');
      web
        .users
        .list({}, (err, result) => {
          if (err) {
            return cb(err);
          }
          if (result.ok === false) {
            return cb(new Error(result.error));
          }
          let promises = result
            .members
              .filter(member => member.deleted === false)
              .map(member => {
              return getMemberById(member.id)
                .then(ch => {
                  if (!ch) {
                    return saveMember({
                      id: getters.getMemberId(member.id),
                      teamId: getters.getTeamId(teamId),
                      name: getters.getMemberName(member.name),
                      color: member.color,
                      firstName: getters.getMemberFirstName(member.profile.first_name),
                      lastName: getters.getMemberLastName(member.profile.last_name),
                      realName: getters.getMemberRealName(member.profile.real_name),
                      skype: getters.getSkype(member.profile.skype),
                      email: getters.getEmail(member.profile.email),
                      phone: getters.getPhone(member.profile.phone),
                      image24: getters.getImage24(member.profile.image_24),
                      image32: getters.getImage32(member.profile.image_32),
                      image48: getters.getImage48(member.profile.image_48),
                      image72: getters.getImage72(member.profile.image_72),
                      image192: getters.getImage192(member.profile.image_192),
                    }).catch(err => console.error(err));
                  }
                });
          });
          return Promise.all(promises).then(() => cb(null, result.members.filter(member => member.deleted === false))).catch(err => cb(err));
        });
    });
}