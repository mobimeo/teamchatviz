import Progress from 'react-progress-2';
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

export const fetchMoodsAndReactions = ({ channel, startDate, endDate }) => {
  Progress.show();
  return fetch(`/api/moods-and-reactions?channelId=${channel ? channel.id : ''}&startDate=${startDate ? startDate : ''}&endDate=${endDate ? endDate : ''}`, {
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