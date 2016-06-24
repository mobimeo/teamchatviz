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
import { Emoji } from 'client/components/Emoji.js';
import { fetchEmojiTimeline } from 'client/networking/index.js';
import { AutoSizer } from 'react-virtualized';

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
      startDate: moment().subtract(10, 'days').startOf('date').format(),
      endDate: moment().endOf('date').format(),
    };

    return {
      data: Map({
        channels: [],
        data: [],
        rating: [],
        emojis: {},
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

  },

  onSort(option) {

  },

  updateState(result) {
    this.setState(({data}) => ({
      data: data
        .set('channels', result.channels)
        .set('data', result.data)
        .set('rating', result.rating)
        .set('emojis', result.emojis.reduce((obj, val, key) => {
          obj[`${val.name}`] = val.url;
          return obj;
        }, {}))
    }));
  },

  render() {
    const data = this.state.data;
    const channels = data.get('channels');
    const emojis = data.get('emojis');
    const rating = data.get('rating');
    const chartData = data.get('data');
    return <div>
      <Header title="emoji timeline" />
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
            <div style={{ height: 'calc(100vh - 15rem)', overflowY: 'scroll' }}>
              {
                channels.map((item, index) => {
                  return <div key={index} className="channel-list-element">{item.name}</div>
                })
              }
            </div>
          </div>
          <div className="col-xs-9">
            <div>
              All channels. <br />
              Last 10 days. <br />
              {
                rating
                  .slice(0, 3)
                  .map((reaction, i) => {
                    return <Emoji emojis={emojis} name={reaction.name} count={reaction.count} />;
                  })
              }
            </div>
            <div style={{ textAlign: 'center' }} >
              {
                chartData.map((d, i) => {
                  return <div key={i} style={{ display: 'inline-block', minWidth: '4.5rem' }}>
                  {
                    d.emojis
                      .slice(0, 10)
                      .map((reaction, i) => {
                        let multiply = 1;
                        if (reaction.count > 10) {
                          multiply = reaction.count / 10;
                        }
                        return <Emoji emojis={emojis} style={{ display: 'block' }} name={reaction.name} count={reaction.count} multiply={multiply} />;
                      })
                  }
                  { d.emojis.length > 10 ? <Emoji style={{ display: 'block' }} name={'...'} count={''} />: <div></div> }
                  {moment(d.id).format('DD/MM/YY')}
                  </div>;
                })
              }
            </div>
          </div>
        </div>
      </main>
    </div>;
  }
});