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

import Progress from 'react-progress-2';
import config from 'client/config.js';
import 'whatwg-fetch';

function parseJSON(response) {
  return response.json();
}

function onFailure(response){
  if (!response.ok) {
    if (response.status == 403) {
      window.location = '/api/auth/slack';
    }
    throw Error(response.statusText);
  }
  return response;
}

export const fetchHeartbeat = (filters) => {
  Progress.show();
  const startDate = filters.startDate;
  const endDate = filters.endDate;
  return fetch(`/api/heartbeat?startDate=${startDate?startDate:''}&endDate=${endDate?endDate:''}`, {
    credentials: 'same-origin'
  })
  .then(onFailure)
  .then(parseJSON)
  .then(result => {
    Progress.hide();
    return result;
  });
};

export const fetchUser = () => {
  Progress.show();
  return fetch(`/api/user`, {
    credentials: 'same-origin'
  })
  .then(response => {
    if (!response.ok) {
      if (response.status == 403) {
        return {
          loggedIn: false,
          loading: false,
        }
      }
      throw Error(response.statusText);
    } else {
      return response
        .json()
        .then(json => ({
          loggedIn: true,
          loading: false,
        }));
    }
  })
  .then(result => {
    Progress.hide();
    return result;
  });
};

export const fetchFrequentSpeakers = (startDate, endDate, channelId) => {
  Progress.show();
  return fetch(`/api/frequent-speakers?startDate=${startDate?startDate:''}&endDate=${endDate?endDate:''}&channelId=${channelId?channelId:''}`, {
    credentials: 'same-origin'
  })
  .then(onFailure)
  .then(parseJSON)
  .then(result => {
    Progress.hide();
    return result;
  });
}

export const fetchPeopleLand = () => {
  Progress.show();
  return fetch('/api/people-land', {
    credentials: 'same-origin'
  })
  .then(onFailure)
  .then(parseJSON)
  .then(result => {
    Progress.hide();
    return result;
  });
}

export const fetchChannelLand = () => {
  Progress.show();
  return fetch('/api/channel-land', {
    credentials: 'same-origin'
  })
  .then(onFailure)
  .then(parseJSON)
  .then(result => {
    Progress.hide();
    return result;
  });
}

export const fetchMessagesAndReactions = ({ channel, startDate, endDate }) => {
  Progress.show();
  return fetch(`/api/messages-and-reactions?channelId=${channel ? channel.id : ''}&startDate=${startDate ? startDate : ''}&endDate=${endDate ? endDate : ''}`, {
    credentials: 'same-origin'
  })
  .then(onFailure)
  .then(parseJSON)
  .then(result => {
    Progress.hide();
    return result;
  });
}

export const fetchEmojiTimeline = (startDate, endDate, channelId) => {
  Progress.show();
  return fetch(`/api/emoji-timeline?startDate=${startDate?startDate:''}&endDate=${endDate?endDate:''}&channelId=${channelId?channelId:''}`, {
    credentials: 'same-origin'
  })
  .then(onFailure)
  .then(parseJSON)
  .then(result => {
    Progress.hide();
    return result;
  });
}

export const fetchConfig = () => {
  Progress.show();
  return fetch(`/api/config`, {
    credentials: 'same-origin'
  })
  .then(onFailure)
  .then(parseJSON)
  .then(result => {
    Progress.hide();
    return result;
  });
}

export const fetchUserStats = (userId) => {
  Progress.show();
  return fetch(`/api/user-stats?userId=${userId}`, {
    credentials: 'same-origin'
  })
  .then(onFailure)
  .then(parseJSON)
  .then(result => {
    Progress.hide();
    return result;
  });
}