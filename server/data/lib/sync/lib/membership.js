import { WebClient } from '@slack/client';
import { save as saveMembership } from '../../../../repositories/membership';
import Promise from 'bluebird';

export default (token, teamId, members, channels) => {
  console.log('syncing membership', token, teamId);
  const web = new WebClient(token);
  const ids = members.map(member => member.id);
  return Promise.all(channels.map(channel => {
    const channelMembers = channel.members || [];
    const channelId = channel.id;
    const membership = ids.map(userId => ({
      userId,
      teamId,
      channelId,
      isMember: channelMembers.indexOf(userId) !== -1,
    }));
    return Promise.all(membership.map(saveMembership));
  }));
};