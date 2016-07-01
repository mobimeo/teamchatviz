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
import { fetchPeopleLand } from 'client/networking/index.js';
import _ from 'lodash';
import { Map } from 'immutable';
import PersonPoint from 'client/d3-components/PersonPoint.js';
import ClusterGroups from 'client/components/ClusterGroups.js';

export default React.createClass({
  getInitialState() {
    this.filters = {
      userName: '',
    }
    this.allMembers = [];
    return {
      data: Map({
        data: [],
        members: [],
        tooltipIndex: null,
        shownGroups: [],
      })
    };
  },

  componentDidMount() {
    fetchPeopleLand()
      .then(result => {
        const currentUser = _.remove(result.members, item => {
          return item.is_current_user === 1;
        });
        const sortedMembers = currentUser.concat(result.members);
        this.allMembers = sortedMembers;
        this.setState(({data}) => ({
          data: data
            .set('data', result.data)
            .set('members', sortedMembers)
        }));
      })
  },

  onSearch(value) {
    this.setState(({data}) => ({
      data: data
        .set('members', this
            .allMembers
            .filter(member =>
              (value === '' || member.name.toLowerCase().indexOf(value) !== -1)))
    }));
  },

  mouseOverListMember(member) {
    const members = this.state.data.get('members');
    this.setState(({data}) => ({
      data: data
        .set('tooltipIndex', member.id)
    }));
  },

  mouseOutListMember(member) {
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
    const members = this.state.data.get('members');
    const tooltipIndex = this.state.data.get('tooltipIndex');
    const shownGroups = this.state.data.get('shownGroups');
    data.forEach(item => {
      let found = false;
      members.forEach(member => {
        if (member.id == item.id) {
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
      <Header title="people land" />
      <main>
        <div className="row between-xs widgets">
          <div className="col-xs-4 col-lg-6 no-padding">
            <SearchBox onChange={this.onSearch} placeholder="search members" />
          </div>
          <div className="col-xs-8 col-lg-6 no-padding text-right">
            <ClusterGroups data={data} onChange={this.onGroupSelection} />
          </div>
        </div>
        <div className="row">
          <div className="col-xs-3">
            <div className="left-list-wrapper">
              {
                members
                .map((item, index) => {
                  const onMouseOver = _.bind(this.mouseOverListMember, this, item);
                  const onMouseOut = _.bind(this.mouseOutListMember, this, item);
                  return <div
                    key={index}
                    onMouseOver={onMouseOver}
                    onMouseOut={onMouseOut}
                    className="channel-list-element">
                    {item.name} {item.is_current_user ? ' (you)' : ''}
                  </div>
                })
              }
            </div>
          </div>
          <div className="col-xs-9">
            <AutoSizer>
              {({ height, width }) => (
                <HullPlot shownGroups={shownGroups} point={PersonPoint} showTooltipFor={tooltipIndex} data={data} width={width} height={height} padding={100} />
              )}
            </AutoSizer>
          </div>
        </div>
      </main>
    </div>;
  }
});