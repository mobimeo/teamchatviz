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
import { SearchBox } from 'client/components/SearchBox.js';
import Progress from 'react-progress-2';
import { Header } from 'client/components/Header.js';
import { AutoSizer, WindowScroller, VirtualScroll } from 'react-virtualized';
import HullPlot from 'client/d3-components/HullPlot.js';
import { fetchChannelLand } from 'client/networking/index.js';
import _ from 'lodash';
import { Map } from 'immutable';
import ChannelPoint from 'client/d3-components/ChannelPoint.js';
import ClusterGroups from 'client/components/ClusterGroups.js';

export default React.createClass({
  getInitialState() {
    this.filters = {};
    this.allChannels = [];
    return {
      data: Map({
        data: [],
        channels: [],
        tooltipIndex: null,
        shownGroups: [],
      })
    };
  },

  componentDidMount() {
    fetchChannelLand()
      .then(result => {
        this.allChannels = result.channels;
        this.setState(({data}) => ({
          data: data
            .set('data', result.data)
            .set('channels', result.channels)
        }));
      })
  },

  onSearch(value) {
    this.setState(({data}) => ({
      data: data
        .set('channels', this.allChannels.filter(channel => (value === '' || channel.name.toLowerCase().indexOf(value) !== -1)))
    }));
  },

  mouseOverListMember(channel) {
    const channels = this.state.data.get('channels');
    this.setState(({data}) => ({
      data: data
        .set('tooltipIndex', channel.id)
    }));
  },

  mouseOutListMember(channel) {
    this.setState(({data}) => ({
      data: data
        .set('tooltipIndex', '')
    }));
  },

  onGroupSelection(selection) {
    this.setState(({data}) => ({
      data: data
        .set('shownGroups', selection)
    }));
  },

  render() {
    const data = this.state.data.get('data');
    const channels = this.state.data.get('channels');
    const tooltipIndex = this.state.data.get('tooltipIndex');
    const shownGroups = this.state.data.get('shownGroups');
    return <div>
      <Header title="channel land" />
      <main>
        <div className="row between-xs widgets">
          <div className="col-xs-6 no-padding">
            <SearchBox onChange={this.onSearch} placeholder="search channels" />
          </div>
          <div className="col-xs-6 no-padding" style={{textAlign: 'right'}}>
            <ClusterGroups data={data} onChange={this.onGroupSelection} />
          </div>
        </div>
        <div className="row">
          <div className="col-xs-3">
            <div style={{ height: 'calc(100vh - 15rem)', overflowY: 'scroll' }}>
              {
                channels.map((item, index) => {
                  const onMouseOver = _.bind(this.mouseOverListMember, this, item);
                  const onMouseOut = _.bind(this.mouseOutListMember, this, item);
                  return <div key={index} onMouseOver={onMouseOver} onMouseOut={onMouseOut} className="channel-list-element">#{item.name}</div>
                })
              }
            </div>
          </div>
          <div className="col-xs-9">
            <AutoSizer>
              {({ height, width }) => (
                <HullPlot shownGroups={shownGroups} point={ChannelPoint} showTooltipFor={tooltipIndex} data={data} width={width} height={height} padding={100} />
              )}
            </AutoSizer>
          </div>
        </div>
      </main>
    </div>;
  }
});