import Progress from 'react-progress-2';
import 'whatwg-fetch';

function parseJSON(response) {
  return response.json();
}

function onFailure(response){
  if (!response.ok) {
    if (response.status == 401) {
      window.location = '/api/auth/slack';
    }
    throw Error(response.statusText);
  }
  return response;
}

export const fetchHeartbeat = (startDate, endDate) => {
  Progress.show();
  return fetch(`/api/heartbeat?startDate=${startDate?startDate:''}&endDate=${endDate?endDate:''}`, {
    credentials: 'same-origin'
  })
  .then(onFailure)
  .then(parseJSON)
  .then(result => {
    Progress.hide();
    return result;
  });
}