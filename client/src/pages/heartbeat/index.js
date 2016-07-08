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
import moment from 'moment';
import { DateRangePicker } from 'client/components/DateRangePicker.js';
import { SearchBox } from 'client/components/SearchBox.js';
import { SortDropdown } from 'client/components/SortDropdown.js';
import { Map, List } from 'immutable';
import { Link } from 'react-router';
import { VirtualScroll, WindowScroller, AutoSizer } from 'react-virtualized';

import { fetchHeartbeat } from 'client/networking/index';
import { Header } from 'client/components/Header.js';

import 'react-vis/main.css!';
import 'react-virtualized/styles.css!';

import PlotRow from './lib/PlotRow';
import shallowCompare from 'react-addons-shallow-compare';

export default React.createClass({
  getInitialState() {
    this.filters = {
      channelName: '',
      startDate: moment.utc().subtract(10, 'days').startOf('date').format(),
      endDate: moment.utc().endOf('date').format(),
      sortOption: null,
    };

    return {
      data: Map({
        displayedItems: List([]),
        items: List([]),
        chunks: List([]),
      })
    };
  },

  refresh(local) {
    const filters = this.filters;
    if (local) {
      this.updateState({
        data: this.state.data.get('items').toJS(),
        chunks: this.state.data.get('chunks').toJS(),
      });
    } else {
      fetchHeartbeat(filters)
        .then(result => {
          this.updateState(result);
        });
    }
  },

  updateState(result) {
    const filters = this.filters;
    const channelName = filters.channelName;
    const sortOption = filters.sortOption;
    if (sortOption) {
      result.data.sort(sortOption.compare)
    }
    const displayedItems = result
      .data
      .filter(item => {
        return channelName === '' || item.name.toLowerCase().indexOf(channelName.toLowerCase()) !== -1;
      });
    const anySelected = displayedItems.some(item => item.selected === true);
    if (!anySelected) {
      displayedItems[0].selected = true;
    }
    this.setState(({data}) => ({
      data: data
        .set('items', List(result.data))
        .set('displayedItems', List(displayedItems))
        .set('chunks', List(result.chunks))
    }));
    this._VirtualScroll.forceUpdate();
  },

  componentDidMount() {
    this.refresh();
  },

  onDateChange(range) {
    this.filters.startDate = range.startDate;
    this.filters.endDate = range.endDate;
    this.refresh();
  },

  onSearch(value) {
    this.filters.channelName = value;
    this.refresh(true);
  },

  onSort(option) {
    this.filters.sortOption = option;
    this.refresh(true);
  },

  renderItem({ index, isScrolling }) {
    const chunks = this.state.data.get('chunks').toJS();
    if (index === 0) {
      const data = this.state.data.get('displayedItems').get(0);
      return <div style={{ height: '50px' }}/>
    }
    const data = this.state.data.get('displayedItems').get(index - 1);
    return <div className="heartbeat-plot">
      <PlotRow
        data={data}
        chunks={chunks}
        parentKey={'scrollRow' + data.id}
        onSelected={this.onChannelSelection}
        key={'scrollRow' + data.id} />
    </div>;
  },

  onChannelSelection(channel) {
    const newData = this.state.data.get('items').toJS();
    newData.forEach(item => {
      if (channel.id == item.id) {
        item.selected = true;
      } else {
        item.selected = false;
      }
    })
    this.updateState({
      data: newData,
      chunks: this.state.data.get('chunks').toJS(),
    });
  },

  _getRowHeight({ index }) {
    if (index === 0) {
      return 50;
    }
    return 100;
  },

  shouldComponentUpdate (nextProps, nextState) {
    return shallowCompare(this, nextProps, nextState);
  },

  render() {
    const data = this.state.data;
    const displayedItems = data.get('displayedItems');
    const startDate = this.filters.startDate
      ? moment.utc(this.filters.startDate)
      : moment.utc(displayedItems.get(0).heartbeat[0].t);
    const endDate = this.filters.endDate
      ? moment.utc(this.filters.endDate)
      : moment.utc(displayedItems.get(0).heartbeat[displayedItems.get(0).heartbeat.length - 1].t);
    const isEndToday = moment(endDate).isSame(moment(), 'day');
    return <div>
      <Header title="channel heartbeat">
        <span className="chart-page-subtitle">
          Amount of total messages per channel
        </span>
      </Header>
      <main>
        <div className="row between-xs widgets">
          <div className="col-xs-5 col-lg-6 no-padding">
            <SortDropdown onChange={this.onSort} />
            <SearchBox onChange={this.onSearch} placeholder="search channel" />
          </div>
          <div className="col-xs-7 col-lg-6 no-padding text-right">
            <DateRangePicker onChange={this.onDateChange} />
          </div>
        </div>
        <div>
          <div className="row middle-xs" style={{ paddingRight: '20px', position: 'relative', top: '2.5rem' }}>
            <div className="col-xs-3">
              <span>&nbsp;</span>
            </div>
            <div className="col-xs-9">
              <div className="heartbeat-x-start">
                { startDate.format('ll') }
              </div>
              <div className="heartbeat-x-end">
                { isEndToday ? 'now' : endDate.format('ll') }
              </div>
            </div>
          </div>
          <WindowScroller>
            {({ height, scrollTop }) => (
              <AutoSizer disableHeight>
                {({ width }) => (
                  <VirtualScroll
                    ref={(v) => this._VirtualScroll = v}
                    autoHeight
                    height={height}
                    scrollTop={scrollTop}
                    overscanRowCount={5}
                    rowCount={displayedItems.size + 1}
                    rowHeight={this._getRowHeight}
                    rowRenderer={this.renderItem}
                    width={width}
                  />
                )}
              </AutoSizer>
            )}
          </WindowScroller>
        </div>
      </main>
    </div>;
  }
});