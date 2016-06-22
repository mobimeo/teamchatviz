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
import { Emoji } from './components/Emoji.js';
import emoji from 'node-emoji';
import 'react-vis/main.css!';
import { Header } from './components/Header.js';

function parseJSON(response) {
  return response.json()
}

export const MoodsAndReactions = React.createClass({
  getInitialState() {
    return {
      data: {
        channels: [],
        data: [],
        rating: [],
        emojis: {},
      },
    };
  },

  componentDidMount() {
    Progress.show();
    fetch('/api/moods-and-reactions', {
      credentials: 'same-origin'
    })
    .then(response => {
      if (!response.ok) {
        if (response.status == 403) {
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
          emojis: result.emojis.reduce((obj, val, key) => {
            obj[`${val.name}`] = val.url;
            return obj;
          }, {}),
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
      <Header title="messages and reactions" />
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
          <div className="col-xs-2">
            <div><button className="channel-list-element">All channels</button></div>
            <hr />
            {
              data.channels.map((d, i) => {
                return <div key={i}><span>#{d.name}</span></div>;
              })
            }
          </div>
          <div className="col-xs-9 messages-reactions">
            <h2>All channels</h2>
            <div>
              Top rated messages in the last 10 days
            </div>
            {
              data.data.map(message => {
                return <div className="message">
                  <div className="row">
                    <div className="message-body col-xs-8">
                      {emoji.emojify(message.text, (unknown) => data.emojis[unknown])}
                    </div>
                    <div className="col-xs-4">
                      <div className="reactions">{message.reactions.length} reactions</div>
                      {
                        message
                        .reactions
                        .map((reaction, i) => {
                          return <Emoji emojis={data.emojis} name={reaction.name} count={reaction.count} />;
                        })
                      }
                    </div>
                  </div>
                  <div className="row">
                    <div className="message-meta col-xs-3">
                      <div className="user-name">{message.real_name}</div>
                      <div className="message-time">{moment(message.message_ts).format()}</div>
                    </div>
                    <img className="user-img" src={message.image32}/>
                  </div>
                </div>
              })
            }
          </div>
        </div>
      </main>
    </div>;
  }
});