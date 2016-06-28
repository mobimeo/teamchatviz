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
import { Link } from 'react-router';

export const Menu = React.createClass({
  getInitialState() {
    return {};
  },
  onClose() {
    this.props.onClose();
  },
  render() {
    return <div className="menu">
      <ul>
        <a href="/"><li>home</li></a>
        <a href="/heartbeat"><li>channel heartbeat</li></a>
        <a href="/channel-land"><li>channel land</li></a>
        <a href="/people-land"><li>people land</li></a>
        <a href="/messages-and-reactions"><li>messages & reactions</li></a>
        <a href="/frequent-speakers"><li>frequent speakers</li></a>
        <a href="/heartbeat"><li>emoji timeline</li></a>
        <a href="/about"><li>about</li></a>
      </ul>
    </div>;
  }
});
