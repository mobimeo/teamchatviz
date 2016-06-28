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
import { Header } from 'client/components/Header.js';
import { Treemap } from 'react-vis';
import { AutoSizer } from 'react-virtualized';
import 'react-vis/main.css!';
import { fetchFrequentSpeakers } from 'client/networking/index.js';

export default React.createClass({
  getInitialState() {
    this.filters = {
      channelName: '',
      startDate: moment.utc().subtract(10, 'days').startOf('date').format(),
      endDate: moment.utc().endOf('date').format(),
      sortOption: null,
      channelId: null,
    };
    return {
      data: Map({
        channels: [],
        data: [],
        allChannels: true,
      }),
    };
  },

  componentDidMount() {
    fetchFrequentSpeakers(this.filters.startDate, this.filters.endDate, this.filters.channelId)
      .then(result => {
        this.updateState(result);
      })
  },

  onDateChange(range) {
    this.filters.startDate = range.startDate;
    this.filters.endDate = range.endDate;
    fetchFrequentSpeakers(this.filters.startDate, this.filters.endDate, this.filters.channelId)
      .then(result => {
        this.updateState(result);
      });
  },

  onSearch(value) {
    this.filters.channelName = value;
    const result = this.state.data.toJS();
    result.channels = this.listOfChannels;
    this.updateState(result);
  },

  onSort(option) {
    this.filters.sortOption = option;
    const result = this.state.data.toJS();
    result.channels = this.listOfChannels;
    this.updateState(result);
  },

  onChannelClick(channel) {
    this.filters.channelId = channel.id;
    fetchFrequentSpeakers(this.filters.startDate, this.filters.endDate, this.filters.channelId)
      .then(result => {
        this.updateState(result);
      })
  },

  onAllChannelsClick() {
    this.filters.channelId = null;
    fetchFrequentSpeakers(this.filters.startDate, this.filters.endDate, this.filters.channelId)
      .then(result => {
        this.updateState(result);
      })
  },

  updateState(result) {
    const sortOption = this.filters.sortOption;
    const channelName = this.filters.channelName.toLowerCase();
    const sortedChannels = sortOption ? result.channels.sort(sortOption.compare) : result.channels;
    this.listOfChannels = sortedChannels;
    this.setState(({data}) => ({
      data: data
        .set('channels', sortedChannels.filter(ch => channelName === '' || ch.name.toLowerCase().indexOf(channelName) !== -1))
        .set('data', result.data)
        .set('allChannels', result.allChannels)
    }));
  },

  render() {
    const data = this.state.data;
    const channels = this.state.data.get('channels');
    const allChannels = this.state.data.get('allChannels');
    const chartData = this.state.data.get('data');
    const filters = this.filters;
    let selectedChannelName = '';
    if (filters.channelId) {
      selectedChannelName = channels.find(ch => ch.id === filters.channelId).name;
    }
    return <div>
      <Header title="frequent speakers" />
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
            <div><button onClick={this.onAllChannelsClick} className="channel-list-element">All channels</button></div>
            <hr />
            {
              channels.map((d, i) => {
                return <div onClick={_.bind(this.onChannelClick, this, d)} key={i}><button className="channel-list-element">#{d.name}</button></div>;
              })
            }
          </div>
          <div className="col-xs-9">
            <p>
              { !filters.channelId ? 'all channels' : selectedChannelName} {moment(filters.startDate).format('ll')} - {moment(filters.endDate).format('ll')}
            </p>
            {
              allChannels ? _.chunk(chartData, 4).map((chunk, index) => {
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
              }) : <AutoSizer>
                    {({ height, width }) => (
                      <Treemap height={600} width={width} data={{ title: '', opacity: 1,
                                  children: chartData.slice(0, 10).map((member, i) => ({
                                    title: <div>@{member.name} <br /> {member.count} </div>,
                                    size: member.count,
                                  }))
                                }} />
                    )}
                </AutoSizer>
              }
          </div>
        </div>
      </main>
    </div>;
  }
});