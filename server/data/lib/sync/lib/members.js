import { WebClient } from '@slack/client';
import db from '../../../../db';
import { save as saveMember, getById as getMemberById } from '../../../../repositories/member';
import Promise from 'bluebird';

export default (token, teamId) => {
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
          let promises = result.members.map(member => {
            return getMemberById(member.id)
              .then(ch => {
                if (!ch) {
                  return saveMember({
                    id: member.id,
                    teamId: teamId,
                    name: member.name,
                    color: member.color,
                    firstName: member.profile.first_name,
                    lastName: member.profile.last_name,
                    realName: member.profile.real_name,
                    skype: member.profile.skype,
                    email: member.profile.email,
                    phone: member.profile.phone,
                    image24: member.profile.image_24,
                    image32: member.profile.image_32,
                    image48: member.profile.image_48,
                    image72: member.profile.image_72,
                    image192: member.profile.image_192,
                  }).catch(err => console.error(err));
                }
              });
          });
          return Promise.all(promises).then(() => cb(null, result.members)).catch(err => cb(err));
        });
    });
}