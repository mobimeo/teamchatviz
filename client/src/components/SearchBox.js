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
import moment from 'moment';

export const SearchBox = React.createClass({
  getInitialState() {
    return {
      data: Map({
        query: this.props.value || '',
      }),
    };
  },

  handleChange(event) {
    var value = event.target.value;
    this.setState(({data}) => ({
      data: data.update('query', () => value)
    }));
    this.props.onChange(value);
  },

  render() {
    return <div className="search-box">
      <input
        type="text"
        placeholder={this.props.placeholder}
        value={this.state.query}
        onChange={this.handleChange} />
    </div>;
  }
});
