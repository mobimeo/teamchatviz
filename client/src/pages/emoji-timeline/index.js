/*
  #viz4slack
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
import { Header } from 'client/components/Header.js';
import { Emoji } from 'client/components/Emoji.js';
import { fetchEmojiTimeline } from 'client/networking/index.js';
import { AutoSizer } from 'react-virtualized';
import EmojiColumn from './lib/EmojiColumn.js';
import NoData from 'client/components/NoData.js';

import { Hint, XYPlot, XAxis, YAxis, VerticalGridLines, HorizontalGridLines, LineSeries, Crosshair } from 'react-vis';

import 'react-vis/main.css!';

function parseJSON(response) {
  return response.json()
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
        interval: 1,
      }),
    };
  },

  componentDidMount() {
    const filters = this.filters;
    fetchEmojiTimeline(filters.startDate, filters.endDate, filters.channelId)
      .then(result => {
        this.updateState(result);
      })
  },

  onDateChange(range) {
    const filters = this.filters;
    filters.startDate = range.startDate;
    filters.endDate = range.endDate;
    fetchEmojiTimeline(filters.startDate, filters.endDate, filters.channelId)
      .then(result => {
        this.updateState(result);
      });
  },

  onSearch(value) {
    this.filters.channelName = value;
    const result = this.state.data.toJS();
    result.channels = this.allChannels;
    this.updateState(result);
  },

  onSort(option) {
    this.filters.sortOption = option;
    const result = this.state.data.toJS();
    result.channels = this.allChannels;
    this.updateState(result);
  },

  updateState(result) {
    var sortOption = this.filters.sortOption;
    var channelName = this.filters.channelName;
    var sortedChannels = sortOption ? result.channels.sort(sortOption.compare) : result.channels;
    this.allChannels = sortedChannels;

    this.setState(({data}) => ({
      data: data
        .set('channels', sortedChannels.filter(channel => channelName === ''
          || channel.name.toLowerCase().indexOf(channelName.toLowerCase()) !== -1))
        .set('data', result.data)
        .set('rating', result.rating)
        .set('emojis', result.emojis)
        .set('interval', result.interval)
    }));
  },

  onChannelClick(channel) {
    const filters = this.filters;
    filters.channelId = channel.id;
    filters.channel = channel;
    fetchEmojiTimeline(filters.startDate, filters.endDate, filters.channelId)
      .then(result => {
        this.updateState(result);
      });
  },

  onAllChannelsClick() {
    const filters = this.filters;
    filters.channelId = null;
    filters.channel = null;
    fetchEmojiTimeline(filters.startDate, filters.endDate, filters.channelId)
      .then(result => {
        this.updateState(result);
      });
  },

  render() {
    const data = this.state.data;
    const channel = this.filters.channel;
    const startDate = this.filters.startDate;
    const endDate = this.filters.endDate;
    const channels = data.get('channels');
    const emojis = data.get('emojis');
    const rating = data.get('rating');
    let chartData = data.get('data');
    const max = _.maxBy(chartData, item => item.total);
    const interval = data.get('interval');
    return <div>
      <Header title="emoji timeline">
        <span className="chart-page-subtitle">
          top 3 emojis and total emoji count
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
            <div className="left-list-wrapper">
              <div>
                <button
                  className="channel-list-element first"
                  onClick={this.onAllChannelsClick}>all channels
                </button>
              </div>
              {
                channels.map((item, index) => {
                  const onClick = _.bind(this.onChannelClick, this, item);
                  return <div>
                    <button
                      key={index}
                      onClick={onClick}
                      className={'channel-list-element' + (channel && item.id == channel.id ? ' selected' : '') } >
                      #{item.name}
                    </button>
                  </div>
                })
              }
            </div>
          </div>
          <div className="col-xs-9">
            <h2 className="in-page-channel-name">{ channel ? '#'+ channel.name : 'all channels' } </h2>
            <span className="frequent-speakers-dates">
                {
                  (startDate && endDate) ? moment(startDate).format('ll') + ' - ' + moment(endDate).format('ll') : 'all times'
                }
            </span>
            <div className="row">
              <div className="col-xs-12">
                {
                  rating
                    .slice(0, 3)
                    .map((reaction, i) => {
                      return <Emoji emojis={emojis} name={reaction.name} count={reaction.count} />;
                    })
                }
              </div>
            </div>
            { chartData.length === 0 || max.total === 0 ? <NoData /> : <AutoSizer>{({ height, width }) => (
              <div
                style={{
                  width: width + 'px',
                  height: (height - 100) + 'px',
                  display: 'flex',
                  justifyContent: 'space-around',
                  alignItems: 'stretch',
                }}
               className="emoji-timeline-plot" >
                {
                  chartData.map((d, i) => {
                    var value = {
                      x: moment.utc(d.id).unix(),
                      y: d.total,
                    };
                    return <EmojiColumn
                      key={i}
                      item={d}
                      emojis={emojis}
                      interval={interval}
                      max={max}
                       />
                  })
                }
              </div>
            )}
            </AutoSizer>}
          </div>
        </div>
      </main>
    </div>;
  }
});