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
import emoji from 'node-emoji';
import 'react-vis/main.css!';

function parseJSON(response) {
  return response.json()
}

export const EmojiTimeline = React.createClass({
  getInitialState() {
    return {
      data: {
        channels: [],
        data: [],
        rating: [],
      },
    };
  },

  componentDidMount() {
    Progress.show();
    fetch('/api/emoji-timeline', {
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
        data: {
          data: result.data,
          channels: result.channels,
          rating: result.rating,
        },
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
            emoji timeline
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
            <div>
              All channels. <br />
              Last 10 days. <br />
              {
                data.rating
                .filter(r => !emoji.get(r.name.split('::')[0]).startsWith(':'))
                .map((reaction, i) => {
                  return <span className="emoji" style={{ display: 'inline-block' }}>{emoji.get(reaction.name.split('::')[0])} &nbsp; {reaction.count}</span>;
                })
              }
            </div>
            <br />
            <br />
            {
              data.data.map((d, i) => {
                return <div key={i} style={{ display: 'inline-block', minWidth: '4.5rem' }}>
                {
                  d.emojis
                  .filter(r => !emoji.get(r.name.split('::')[0]).startsWith(':'))
                  .map((reaction, i) => {
                    return <div className="emoji">{emoji.get(reaction.name.split('::')[0])} &nbsp; {reaction.count}</div>;
                  })
                }
                {moment(d.id).format('DD/MM/YY')}
                </div>;
              })
            }
          </div>
        </div>
      </main>
    </div>;
  }
});