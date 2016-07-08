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
import Modal from 'client/components/Modal.js';
import moment from 'moment';

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
        selectedChannel: {},
        detailsOpened: false,
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

  onPointClick(point) {
    const channels = this.state.data.get('channels');
    const channel = channels.find(m => m.id === point.id);
    this.setState(({data}) => ({
      data: data
        .set('selectedChannel', channel)
        .set('detailsOpened', true)
    }));
  },

  closeModal: function() {
    this.setState(({data}) => ({
      data: data
        .set('detailsOpened', false)
    }));
  },

  render() {
    const data = this.state.data.get('data');
    const channels = this.state.data.get('channels');
    const tooltipIndex = this.state.data.get('tooltipIndex');
    const shownGroups = this.state.data.get('shownGroups');
    const detailsOpened = this.state.data.get('detailsOpened');
    const channel = this.state.data.get('selectedChannel');
    const teamName = this.props.config ? this.props.config.teamName : '';
    data.forEach(item => {
      let found = false;
      channels.forEach(channel => {
        if (channel.id == item.id) {
          found = true;
        }
      });
      if (!found) {
        item.grayedOut = true;
      } else {
        item.grayedOut = false;
      }
    });
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
            <div className="left-list-wrapper">
              {
                channels.map((item, index) => {
                  const onClick = _.bind(this.onPointClick, this, item);
                  const onMouseOver = _.bind(this.mouseOverListMember, this, item);
                  const onMouseOut = _.bind(this.mouseOutListMember, this, item);
                  return <div key={index} onClick={onClick} onMouseOver={onMouseOver} onMouseOut={onMouseOut} className="channel-list-element">#{item.name}</div>
                })
              }
            </div>
          </div>
          <div className="col-xs-9">
            <AutoSizer>
              {({ height, width }) => (
                <HullPlot
                  onPointClick={this.onPointClick}
                  shownGroups={shownGroups}
                  point={ChannelPoint}
                  showTooltipFor={tooltipIndex}
                  data={data}
                  width={width}
                  height={height}
                  padding={100} />
              )}
            </AutoSizer>
            <Modal
              isOpen={detailsOpened}
              closed={this.closeModal}
            >
              <div style={{ textAlign: 'right' }}>
                <a style={{ cursor: 'pointer' }} onClick={this.closeModal}>
                  <img src="/images/close.svg" style={{ width: '1rem' }} />
                </a>
              </div>
              <h3>#{channel.name}</h3>
              <p>{channel.purpose ? channel.purpose.value : ''}</p>
              <p>created by <a target="_blank" href={`https://${teamName}.slack.com/team/${channel.creator}`}>
                  {channel.real_name}
                </a> on {moment(channel.creation_date).format('ll')}
              </p>
              <p>
                <a target="_blank" href={`https://${teamName}.slack.com/archives/${channel.name}`}>
                {channel.number_of_members} members (open in Slack)
                </a>
              </p>
            </Modal>
          </div>
        </div>
      </main>
    </div>;
  }
});