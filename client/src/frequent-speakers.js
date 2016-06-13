import React from 'react';
import ReactDOM from 'react-dom';
import moment from 'moment';
import { DateRangePicker } from './components/DateRangePicker.js';
import { SearchBox } from './components/SearchBox.js';
import { SortDropdown } from './components/SortDropdown.js';
import Progress from 'react-progress-2';
import { Map } from 'immutable';
import { Link } from 'react-router';
import _ from 'lodash';

import 'react-vis/main.css!';

function parseJSON(response) {
  return response.json()
}

export const FrequentSpeakers = React.createClass({
  getInitialState() {
    return {
      data: {
        channels: [],
        data: [],
      },
    };
  },

  componentDidMount() {
    Progress.show();
    fetch('/api/frequent-speakers', {
      credentials: 'same-origin'
    })
    .then(response => {
      if (!response.ok) {
        if (response.status == 401) {
          window.location = '/api/auth/slack';
        }
        throw Error(response.statusText);
      }
      return response;
    })
    .then(parseJSON)
    .then(result => {
      this.setState({
        data: result,
      });
      Progress.hide();
    });
  },

  onDateChange(range) {

  },

  onSearch(value) {

  },

  onSort(option) {

  },

  render() {
    const data = this.state.data;
    return <div>
      <header className="site-header">
        <Link to="/">
          <h1>
            frequent speakers
          </h1>
        </Link>
      </header>
      <main>
        <div className="row between-xs widgets">
          <div className="col-xs-6 no-padding">
            <SortDropdown onChange={this.onSort} /> <SearchBox onChange={this.onSearch} placeholder="search channel" />
          </div>
          <div className="col-xs-6 no-padding" style={{textAlign: 'right'}}>
            <DateRangePicker onChange={this.onDateChange} />
          </div>
        </div>
        <div className="row" style={{ paddingRight: '20px' }}>
          <div className="col-xs-3">
            {
              data.channels.map((d, i) => {
                return <div key={i}><button className="channel-list-element">#{d.name}</button></div>;
              })
            }
          </div>
          <div className="col-xs-9">
            <p>
              This page shows the most keen slack writers within specific channels. It also shows the amount of messages within the user's most used five channels.
            </p>
            {
              _.chunk(data.data, 4).map((chunk, index) => {
                return <div className="row" key={index}>
                    {
                      chunk.map((member, memberIndex) => {
                        return <div className="col-xs-3 member" key={memberIndex} style={{ textAlign: 'center' }}>
                          <span className="member-index">{member.count}</span>
                          <br />
                          <img className="member-img" src={member.image72} style={{ borderRadius: '50%' }} />
                          <br />
                          {member.realname}
                          <br />
                          @{member.name}
                        </div>
                      })
                    }
                  </div>
              })
            }
          </div>
        </div>
      </main>
    </div>;
  }
});