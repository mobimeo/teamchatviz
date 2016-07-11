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
      startDate: moment.utc().subtract(30, 'days').startOf('date').format(),
      endDate: moment.utc().endOf('date').format(),
    };
    return {
      data: Map({
        channels: [],
        data: [],
        rating: [],
        emojis: {},
        channel: null,
        startDate: moment().subtract(30, 'days').startOf('date').format(),
        endDate: moment().endOf('date').format(),
      }),
    };
  },

  componentDidMount() {
    this.refs.sidebar.style.height = this.refs.main.offsetHeight + 'px';
    fetchMessagesAndReactions(this.filters)
      .then(result => {
        result.emojis = indexEmojis(result.emojis);
        this.updateState(result);
      });
  },

  componentDidUpdate(prevProps, prevState) {
    this.refs.sidebar.style.height = this.refs.main.offsetHeight + 'px';
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
        .set('teamName', result.teamName)
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
    var count = 1;
    const data = this.state.data;
    const nameFilter = this.filters.channelName;
    const channels = data.get('channels').filter(channel => {
      return nameFilter === '' || channel.name.toLowerCase().indexOf(nameFilter.toLowerCase()) !== -1;
    });
    const chartData = data.get('data');
    const emojis = data.get('emojis');
    const channel = data.get('channel');
    const teamName = data.get('teamName');
    let days = -1;
    if (this.filters.startDate && this.filters.endDate) {
      days = moment(this.filters.endDate).diff(moment(this.filters.startDate), 'days');
    }
    return <div>
      <Header title="messages and reactions">
        <span className="chart-page-subtitle">
          top 10 messages by amount of reactions
        </span>
      </Header>
      <main>
        <div className="row between-xs widgets">
          <div className="col-xs-5 col-lg-6 no-padding">
            <SortDropdown onChange={this.onSort} /> <SearchBox onChange={this.onSearch} placeholder="search channel" />
          </div>
          <div className="col-xs-7 col-lg-6 no-padding text-right">
            <DateRangePicker onChange={this.onDateChange} />
          </div>
        </div>
        <div className="row" style={{ paddingRight: '20px' }}>
          <div className="col-xs-3">
            <div className="left-list-wrapper" ref="sidebar">
              <div>
                <button className="channel-list-element first" onClick={this.onAllChannelsClick}>all channels
                </button>
              </div>
              <div>
                {
                  channels.map((d, i) => {
                    const onClick = _.bind(this.onChannelClick, this, d);
                    return <div>
                      <button
                        onClick={onClick}
                        className="channel-list-element"
                        key={i}>
                        <span>#{d.name}</span>
                      </button>
                    </div>;
                  })
                }
              </div>
            </div>
          </div>
          <div className="col-xs-9 messages-reactions" ref="main">
            <h2 className="in-page-channel-name">{ channel ? '#' + channel.name : 'all channels'}</h2>
            {
              chartData.map(message => {
                const href = `https://${teamName}.slack.com/archives/${message.channel_name}/p${message.message_id.replace('.', '')}`;
                return <div className="message">
                  <div className="row">
                    <div className="col-xs-8">
                      <div className="message-wrapper">
                        <div className="message-number">{count++}</div> 
                        <div className="message-body">
                          <div>
                            {emoji.emojify(message.text, (unknown) => emojis[unknown])}
                          </div>
                          <div className="open-in"><a href={href} target="_blank">open in slack</a> > </div>
                        </div>
                      </div>
                      <div className="row">
                        <div className="col-xs-4">
                          <div className="message-meta">
                            <div className="user-name">{message.real_name}</div>
                            <div className="message-time">{moment(message.message_ts).format('LLL')}</div>
                          </div>
                        </div>
                        <div className="col-xs-8">
                          <img className="user-img" src={message.image32}/>
                        </div>
                      </div>
                    </div>
                    <div className="col-xs-4">
                      <div className="reactions">{message.reactions.reduce((p, e) => e.count + p, 0)} reactions</div>
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
                </div>
              })
            }
          </div>
        </div>
      </main>
    </div>;
  }
});