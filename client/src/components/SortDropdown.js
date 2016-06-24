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
import { Map, List } from 'immutable';
import moment from 'moment';

export const SortDropdown = React.createClass({
  getInitialState() {
    return {
      data: Map({
        active: false,
        placeholder: 'sort by',
        options: List([
          Map({
            value: 1,
            label: 'Channel Name & Membership',
            selected: true,
            compare(a, b) {
              return a.name - b.name;
            }
          }),
          Map({
            value: 2,
            label: 'Name of Creator',
            selected: false,
            compare(a, b) {
              return b.creatorName - a.creatorName;
            }
          }),
          Map({
            value: 3,
            label: 'Creation Date (newest first)',
            selected: false,
            compare(a, b) {
              return moment(b.creationDate).diff(moment(a.creationDate), 'minutes');
            }
          }),
          Map({
            value: 4,
            label: 'Creation Date (oldest first)',
            selected: false,
            compare(a, b) {
              return moment(a.creationDate).diff(moment(b.creationDate), 'minutes');
            }
          }),
          Map({
            value: 5,
            label: 'Members (most to fewest)',
            selected: false,
            compare(a, b) {
              return b.numberOfMembers - a.numberOfMembers;
            }
          }),
          Map({
            value: 6,
            label: 'Members (fewest to most)',
            selected: false,
            compare(a, b) {
              return a.numberOfMembers - b.numberOfMembers;
            }
          }),
        ])
      }),
    };
  },

  onToggle() {
    this.setState(({data}) => ({
      data: data.update('active', (value) => !value)
    }));
  },

  onItemClick(i) {
    let option = this.state.data.get('options').get(i).toJS();
    this.setState(({data}) => ({
      data: data.update('options', options => options.map((b, index) => {
        if (index === i) {
          return b.update('selected', () => true );
        } else {
          return b.update('selected', () => false );
        }
      }))
    }));
    this.props.onChange(option);
  },

  render() {
    var data = this.state.data;
    var active = data.get('active');
    var selected = data.get('options').find(option => option.get('selected') === true);
    var placeholder = data.get('placeholder');
    return <div className="sort-dropdown">
      <div className={ active ? 'select-box active' : 'select-box'} onClick={this.onToggle} >
        <span className="sort-by">{placeholder}</span><span> {selected ? selected.get('label') : '(choose)' }</span>
        <ul className="dropdown">
          {
            this.state.data.get('options').map((o, i) => {
              var handleClick = this.onItemClick.bind(this, i);
              return <li onClick={handleClick} key={i}>
                {o.get('label')}
              </li>
            })
          }
        </ul>
      </div>
    </div>;
  }
});
