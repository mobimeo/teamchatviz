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
import Modal from 'client/components/Modal.js';

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
        detailsOpened: false,
        selectedUser: {},
        currentUser: {},
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
            .set('currentUser', currentUser.length > 0 ? currentUser[0] : {})
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
    const points = this.state.data.get('data');
    this.setState(({data}) => ({
      data: data
        .set('tooltipIndex', member.id)
        .set('data', this.getHighlightedPoints(points, member))
    }));
  },

  mouseOutListMember() {
    const points = this.state.data.get('data');
    points.forEach(item => {
      item.highlighted = false;
    })
    this.setState(({data}) => ({
      data: data
        .set('tooltipIndex', '')
        .set('data', this.getHighlightedPoints(points, this.state.data.get('selectedUser')))
    }));
  },

  onGroupSelection(selection) {
    this.setState(({data}) => ({
      data: data
        .set('shownGroups', selection)
    }));
  },

  onPointClick(point) {
    const members = this.state.data.get('members');
    const member = members.find(m => m.id === point.id);
    const points = this.state.data.get('data');
    this.setState(({data}) => ({
      data: data
        .set('selectedUser', member)
        .set('tooltipIndex', member.id)
        .set('detailsOpened', true)
        .set('data', this.getHighlightedPoints(points, member))
    }));
  },

  getHighlightedPoints(points, member) {
    points.forEach(item => {
      if (item.id === member.id) {
        item.highlighted = true;
      } else {
        item.highlighted = false;
      }
    });
    return points;
  },

  closeModal() {
    this.setState(({data}) => ({
      data: data
        .set('detailsOpened', false)
        .set('tooltipIndex', '')
    }));
  },

  render() {
    const currentUser = this.state.data.get('currentUser');
    const data = this.state.data.get('data');
    const members = this.state.data.get('members');
    const tooltipIndex = this.state.data.get('tooltipIndex');
    const shownGroups = this.state.data.get('shownGroups');
    const detailsOpened = this.state.data.get('detailsOpened');
    const user = this.state.data.get('selectedUser');
    const attributes = [];
    if (user) {
      if (user.email) {
        attributes.push(
          <div className="row">
            <div className="col-xs-4">
              Email
            </div>
            <div className="col-xs-8">
              {user.email}
            </div>
          </div>
        );
      }
      if (user.phone) {
        attributes.push(
          <div className="row">
            <div className="col-xs-4">
              Phone
            </div>
            <div className="col-xs-8">
              {user.phone}
            </div>
          </div>
        );
      }
      if (user.skype) {
        attributes.push(
          <div className="row">
            <div className="col-xs-4">
              Skype
            </div>
            <div className="col-xs-8">
              {user.skype}
            </div>
          </div>
        );
      }
    }
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
      if (currentUser.id === item.id) {
        item.permanent_highlight = true;
      }
    });

    return <div>
      <Header title="people land">
        <span className="chart-page-subtitle">
          users clustered by their channel membership
        </span>
      </Header>
      <main>
        <div className="row between-xs widgets">
          <div className="col-xs-3 no-padding">
            <SearchBox onChange={this.onSearch} placeholder="search members" />
          </div>
          <div className="col-xs-9 no-padding row between-xs middle-xs">
            <ClusterGroups customClassName="col-xs" data={data} onChange={this.onGroupSelection} />
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
                  const onClick = _.bind(this.onPointClick, this, item);
                  return <div>
                    <button
                      key={index}
                      onClick={onClick}
                      onMouseOver={onMouseOver}
                      onMouseOut={onMouseOut}
                      className={"channel-list-element" + 
                      (item.is_current_user ? ' is-current-user' : '') + 
                      (user && item.id == user.id ? ' selected' : '') }>
                      {item.name} {item.is_current_user ? ' (you)' : ''}
                    </button>
                  </div>;
                })
              }
            </div>
          </div>
          <div className="col-xs-9" id="modal-container">
            <AutoSizer>
              {({ height, width }) => (
                <HullPlot
                  shownGroups={shownGroups}
                  point={PersonPoint}
                  showTooltipFor={tooltipIndex}
                  data={data}
                  width={width}
                  height={height}
                  onPointClick={this.onPointClick}
                  padding={100} />
              )}
            </AutoSizer>
            <Modal
              isOpen={detailsOpened}
              closed={this.closeModal}
            >
              <div className="dialog-close-button">
                <a onClick={this.closeModal}>
                  <img src="/images/close.svg" />
                </a>
              </div>
              <div className="row">
                <div className="col-xs-4">
                  <img className="" src={user.image72} />
                </div>
                <div className="col-xs-8">
                  <h3>{user.first_name} {user.last_name}</h3>
                </div>
              </div>
              <div className="row">
                <div className="col-xs-4">
                  Username
                </div>
                <div className="col-xs-8">
                  @{user.username}
                </div>
              </div>
              {attributes}
            </Modal>
          </div>
        </div>
      </main>
    </div>;
  }
});