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
import { DateRange } from 'react-date-range';

export const DateRangePicker = React.createClass({
  getInitialState() {
    return {
      data: Map({
        expanded: false,
        buttons: List([Map({
          id: 1,
          title: 'Last 10 Days',
          selected: true,
          range() {
            return {
              startDate: moment().subtract(10, 'days').hours(0).minutes(0).seconds(0).milliseconds(0).format(),
              endDate: moment().format()
            };
          }
        }), Map({
          id: 2,
          title: 'Last 30 Days',
          selected: false,
          range() {
            return {
              startDate: moment().subtract(30, 'days').hours(0).minutes(0).seconds(0).milliseconds(0).format(),
              endDate: moment().format()
            };
          }
        }), Map({
          id: 3,
          title: 'All times',
          selected: false,
          range() {
            return {
              startDate: null,
              endDate: null
            };
          }
        })])
      })
    };
  },

  handleSelect(range){
    if (range.startDate.format() !== range.endDate.format()) {
      this.props.onChange({
        startDate: range.startDate.format(),
        endDate: range.endDate.format()
      });
      this.setState(({data}) => ({
        data: data
          .update('expanded', expanded => !expanded)
          .update('buttons', buttons => buttons.map(b => {
            return b.update('selected', () => false);
          }))
      }));
    }
  },

  onClick(i) {
    let range = this.state.data.get('buttons').get(i).get('range')();
    this.props.onChange(range);
    this.setState(({data}) => ({
      data: data.update('buttons', buttons => buttons.map((b, index) => {
        if (index === i) {
          return b.update('selected', () => true );
        } else {
          return b.update('selected', () => false );
        }
      }))
    }));
  },

  onToggle() {
    this.setState(({data}) => ({
      data: data.update('expanded', expanded => !expanded)
    }));
  },

  render() {
    return <div className="date-picker">
      <div style={{ display: 'inline-block' }}>
        <a onClick={this.onToggle}><img className="calendar" src="../../images/navbuttons-19.png" alt="menu"></img></a>
      </div>
      <div className="button-group">
        {
          this.state.data.get('buttons').map((button, key) => {
            const onClick = this.onClick.bind(this, key);
            return <button className={`button ${button.get('selected')?"selected":""}`} key={key} onClick={onClick}>
              {button.get('title')}
            </button>
          })
        }
      </div>
      { this.state.data.get('expanded') ? <div className="date-range-container"> <DateRange onChange={this.handleSelect} /> </div> : null }
    </div>;
  }
});
