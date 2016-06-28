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

import React from 'react';
import ReactDOM from 'react-dom';
import moment from 'moment';
import { DateRangePicker } from 'client/components/DateRangePicker.js';
import { SearchBox } from 'client/components/SearchBox.js';
import { SortDropdown } from 'client/components/SortDropdown.js';
import Progress from 'react-progress-2';
import { Map } from 'immutable';
import { Link } from 'react-router';
import _ from 'lodash';
import { Emoji } from 'client/components/Emoji.js';
import emoji from 'node-emoji';
import 'react-vis/main.css!';
import { Header } from 'client/components/Header.js';
import { fetchMessagesAndReactions } from 'client/networking/index.js';

function indexEmojis(emojis) {
  return emojis.reduce((obj, val, key) => {
    obj[`${val.name}`] = val.url;
    return obj;
  }, {});
}

export default React.createClass({
  getInitialState() {
    this.filters = {
      channel: null,
      channelName: '',
      sortOption: null,
      startDate: moment.utc().subtract(10, 'days').startOf('date').format(),
      endDate: moment.utc().endOf('date').format(),
    };
    return {
      data: Map({
        channels: [],
        data: [],
        rating: [],
        emojis: {},
        channel: null,
        startDate: moment().subtract(10, 'days').startOf('date').format(),
        endDate: moment().endOf('date').format(),
      }),
    };
  },

  componentDidMount() {
    fetchMessagesAndReactions(this.filters)
      .then(result => {
        result.emojis = indexEmojis(result.emojis);
        this.updateState(result);
      });
  },

  onDateChange(range) {
    this.filters.startDate = range.startDate;
    this.filters.endDate = range.endDate;
    fetchMessagesAndReactions(this.filters)
      .then(result => {
        result.emojis = indexEmojis(result.emojis);
        this.updateState(result);
      });
  },

  onSearch(value) {
    this.filters.channelName = value;
    this.updateState(this.state.data.toJS());
  },

  onSort(option) {
    this.filters.sortOption = option;
    this.updateState(this.state.data.toJS());
  },

  updateState(result) {
    var sortOption = this.filters.sortOption;
    var sortedChannels = sortOption ? result.channels.sort(sortOption.compare) : result.channels;
    this.allChannels = sortedChannels;
    this.setState(({data}) => ({
      data: data
        .set('data', result.data)
        .set('channels', sortedChannels)
        .set('rating', result.rating)
        .set('channel', result.channel)
        .set('emojis', result.emojis)
    }));
  },

  onChannelClick(channel) {
    this.filters.channel = channel;
    fetchMessagesAndReactions(this.filters)
      .then(result => {
        result.emojis = indexEmojis(result.emojis);
        result.channel = this.filters.channel;
        this.updateState(result);
      });
  },

  onAllChannelsClick() {
    this.filters.channel = null;
    fetchMessagesAndReactions(this.filters)
      .then(result => {
        result.emojis = indexEmojis(result.emojis);
        result.channel = this.filters.channel;
        this.updateState(result);
      });
  },

  render() {
    const data = this.state.data;
    const nameFilter = this.filters.channelName;
    const channels = data.get('channels').filter(channel => {
      return nameFilter === '' || channel.name.toLowerCase().indexOf(nameFilter.toLowerCase()) !== -1;
    });
    const chartData = data.get('data');
    const emojis = data.get('emojis');
    const channel = data.get('channel');
    let days = -1;
    if (this.filters.startDate && this.filters.endDate) {
      days = moment(this.filters.endDate).diff(moment(this.filters.startDate), 'days');
    }
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
          <div className="col-xs-3">
            <div className="channel-list-element" onClick={this.onAllChannelsClick}>All channels </div>
            <div>
              {
                channels.map((d, i) => {
                  const onClick = _.bind(this.onChannelClick, this, d);
                  return <div onClick={onClick} className="channel-list-element" key={i}><span>#{d.name}</span></div>;
                })
              }
            </div>
          </div>
          <div className="col-xs-9 messages-reactions">
            <h2>{ channel ? channel.name : 'All channels'}</h2>
            <div>
              Top rated messages for {days === -1 ? 'all times' : days + ' days'}
            </div>
            {
              chartData.map(message => {
                return <div className="message">
                  <div className="row">
                    <div className="message-body col-xs-8">
                      <div> 
                        {emoji.emojify(message.text, (unknown) => emojis[unknown])}
                      </div>
                    </div>
                    <div className="col-xs-4">
                      <div className="reactions">{message.reactions.length} reactions</div>
                      <div className="message-emoji-wrapper">
                        {
                          message
                          .reactions
                          .map((reaction, i) => {
                            return <Emoji style={{ display: 'inline-block' }} emojis={emojis} name={reaction.name} count={reaction.count} />;
                          })
                        }
                      </div>
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