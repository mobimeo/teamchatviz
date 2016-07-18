/*
  #teamchatviz
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
import 'client/treemap.scss!';
import MemberCard from './lib/MemberCard.js';
import ChannelCard from './lib/ChannelCard.js';
import NoData from 'client/components/NoData.js';

export default React.createClass({
  getInitialState() {
    this.filters = {
      channelName: '',
      startDate: moment.utc().subtract(30, 'days').startOf('date').format(),
      endDate: moment.utc().endOf('date').format(),
      sortOption: null,
      channelId: null,
    };
    return {
      data: Map({
        channels: [],
        data: [],
        allChannels: true,
        selectedUser: null,
      }),
    };
  },

  componentDidMount() {
    this.refs.sidebar.style.height = this.refs.main.offsetHeight + 'px';
    fetchFrequentSpeakers(this.filters.startDate, this.filters.endDate, this.filters.channelId)
      .then(result => {
        this.updateState(result);
      })
  },

  componentDidUpdate(prevProps, prevState) {
    this.refs.sidebar.style.height = this.refs.main.offsetHeight + 'px';
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
    this.setState(({data}) => ({
      data: data
        .set('selectedUser', null)
    }));
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
        .set('data', result.data.sort((a, b) => {
          if (a.is_current_user) {
            return -1;
          }
          if (b.is_current_user) {
            return 1;
          }
          return b.count - a.count;
        }))
        .set('allChannels', result.allChannels)
    }));
  },

  onMouseOver(member) {
    member.hovering = true;
    const newData = this.state.data.get('data');
    this.setState(({data}) => ({
      data: data
        .set('data', newData)
    }));
  },

  onMouseOut(member) {
    member.hovering = false;
    const newData = this.state.data.get('data');
    this.setState(({data}) => ({
      data: data
        .set('data', newData)
    }));
  },

  onUserClick(member) {
    this.setState(({data}) => ({
      data: data
        .set('selectedUser', member)
    }));
  },

  onBackClick(e) {
    e.preventDefault();
    this.setState(({data}) => ({
      data: data
        .set('selectedUser', null)
    }));
    return false;
  },

  renderMembers(chartData) {
    const topMember = _.maxBy(chartData, (item) => {
      return item.count;
    })
    return chartData.length > 0 ? _.chunk(chartData, 4).map((chunk, index) => {
      return <div className="row" key={index}>
        {
          chunk.map((member, memberIndex) => {
            var onMouseOver = _.bind(this.onMouseOver, this, member);
            var onMouseOut = _.bind(this.onMouseOut, this, member);
            var onClick = _.bind(this.onUserClick, this, member);
            const width = 33 + (72 - 33) * member.count / topMember.count;
            return <div
                      onMouseOver={onMouseOver}
                      onMouseOut={onMouseOut}
                      onClick={onClick}
                      className={'col-xs-3 member' + (member.is_current_user ? ' is-current-user' : '')}
                      key={memberIndex}
                      style={{ textAlign: 'center' }}>
              <span className="member-index">{member.count}</span>
              <br />
              <div className="member-img-wrapper" style={{ width: width + 'px', height: width + 'px' }}>
                <img
                  className='member-img'
                  src={member.image72}
                  style={{ width: width + 'px', height: width + 'px'}} />
              </div>
              <br />
              {member.realname}
              <br />
              @{member.name}
              <br />
              { member.is_current_user ? <span className="member-you">(you)</span> : '' }
            </div>
          })
        }
      </div>
    }) : <NoData />
  },

  renderUserStats(member) {
    const chartData = this.state.data.get('data');
    return [
      <div className="user-stats middle-xs row">
        <div className="col-xs-1">
          <a href="" onClick={this.onBackClick}>
            <img src="/images/frequent-speakers-back.svg" style={{ width: '1rem' }} />
          </a>
        </div>
          <img
            className="col-xs-1"
            style={{ width: '2.25rem', borderRadius: '50%' }}
            src={member.image72} />
        <div className="col-xs-2">
          {member.realname}
          <br />
          @{member.name}
        </div>
        <div className="col-xs-2">
          {member.count} messages
          <br />
          &nbsp;
        </div>
      </div>
      ,
      <br />
      ,
      <MemberCard member={member} filters={this.filters} />
    ];
  },

  onMouseOverTreemap(member) {
    this.setState(({data}) => ({
      data: data
        .set('showTooltipFor', member.user_id)
    }));
  },

  onMouseOutTreemap(member) {
    this.setState(({data}) => ({
      data: data
        .set('showTooltipFor', null)
    }));
  },

  renderChartStats() {
    const chartData = this.state.data.get('data');
    return <ChannelCard chartData={chartData} />
  },

  render() {
    const data = this.state.data;
    const channels = this.state.data.get('channels');
    const allChannels = this.state.data.get('allChannels');
    const chartData = this.state.data.get('data');
    const selectedUser = this.state.data.get('selectedUser');
    const filters = this.filters;
    let selectedChannelName = '';
    if (filters.channelId) {
      selectedChannelName = channels.find(ch => ch.id === filters.channelId).name;
    }
    return <div>
      <Header title="frequent speakers">
        <span className="chart-page-subtitle">
          amount of public messages per channel and user
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
        <div className="row" style={{ paddingRight: '20px'}}>
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
          <div className="col-xs-9" ref="main"  style={
              !allChannels
              ? { height: 'calc(100vh - 18rem)' }
              : ( selectedUser ? { height: 'calc(100vh - 16rem)' } : {} ) }>
            <h2 className="in-page-channel-name">
              { !filters.channelId ? 'all channels ' : '#' + selectedChannelName + ' '}
            </h2>
            <span className="frequent-speakers-dates">
              {
                (filters.startDate && filters.endDate)
                ? moment(filters.startDate).format('ll') + ' - ' + moment(filters.endDate).format('ll')
                : ' all times'
              }
            </span>
            {
              allChannels
                ? ( selectedUser ? this.renderUserStats(selectedUser) : this.renderMembers(chartData) )
                : this.renderChartStats()
              }
          </div>
        </div>
      </main>
    </div>;
  }
});