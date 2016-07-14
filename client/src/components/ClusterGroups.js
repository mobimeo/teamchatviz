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
import { Map } from 'immutable';
import { groupBy, bind } from 'lodash';

export default React.createClass({
  getInitialState() {
    return {
      data: Map({
        selected: [],
      })
    };
  },
  onGroupClick(group) {
    const selected = this.state.data.get('selected');
    if (selected.indexOf(group.id) === -1) {
      const newSelection = selected.concat([ group.id ]);
      this.props.onChange(newSelection);
      this.setState(({data}) => ({
        data: data
          .update('selected', () => newSelection)
      }));
    } else {
      const newSelection = selected.filter(id => id !== group.id);
      this.props.onChange(newSelection);
      this.setState(({data}) => ({
        data: data
          .update('selected', () => newSelection)
      }));
    }
  },
  onAllClick() {
    this.props.onChange([]);
    this.setState(({data}) => ({
      data: data
        .update('selected', () => [])
    }));
  },
  render() {
    const data = this.props.data;
    const groupsData = _.groupBy(data, 'group');
    const groups = Object
      .keys(groupsData)
      .sort()
      .map((key, i) => {
        const id = i + 1;
        const color = groupsData[key][0].color;
        return {
          id,
          color,
        };
      });
    const selected = this.state.data.get('selected');
    return <div className={'cluster-groups ' + this.props.customClassName}>
      <div className="cluster-groups-all">
        <div>groups</div>
        <button
          className={ selected.length === 0 ? 'is-active' : '' }
          onClick={this.onAllClick}>all</button>
      </div>
      {
        groups.map(group => {
          const onClick = bind(this.onGroupClick, this, group);
          return <div className="cluster-groups-button">
            <span style={{ background: group.color }}></span>
            <button
              className={ selected.length !== 0
                && selected.indexOf(group.id) !== -1 ? 'is-active' : '' }
                onClick={onClick}>{group.id}</button>
          </div>;
        })
      }
    </div>;
  }
});
