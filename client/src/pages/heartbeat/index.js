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

import ChannelChart from './lib/ChannelChart';

export default React.createClass({
  getInitialState() {
    this.filters = {
      channelName: '',
      startDate: moment().subtract(10, 'days').startOf('date').format(),
      endDate: moment().endOf('date').format(),
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
    if (index === 0) {
      return <div key={'scrollRow0'} style={{ height: '20px' }}></div>
    }
    const data = this.state.data.get('displayedItems').get(index - 1);
    const chunks = this.state.data.get('chunks');
    return <ChannelChart data={data} chunks={chunks} showChunkHints={index === 1 ? true : false} parentKey={'scrollRow' + data.id} key={'scrollRow' + data.id} />;
  },

  _getRowHeight({ index }) {
    if (index === 0) {
      return 50;
    }
    return 100;
  },

  render() {
    const data = this.state.data;
    return <div>
      <Header title="channel heartbeat" />
      <main>
        <div className="row between-xs widgets">
          <div className="col-xs-6 no-padding">
            <SortDropdown onChange={this.onSort} /> <SearchBox onChange={this.onSearch} placeholder="search channel" />
          </div>
          <div className="col-xs-6 no-padding" style={{textAlign: 'right'}}>
            <DateRangePicker onChange={this.onDateChange} />
          </div>
        </div>
        <div>
          <WindowScroller>
            {({ height, scrollTop }) => (
              <AutoSizer disableHeight>
                {({ width }) => (
                  <VirtualScroll
                    ref={(v) => this._VirtualScroll = v}
                    autoHeight
                    height={height}
                    scrollTop={scrollTop}
                    overscanRowCount={20}
                    rowCount={data.get('displayedItems').size + 1}
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