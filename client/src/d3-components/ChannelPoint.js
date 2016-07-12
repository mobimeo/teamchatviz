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
import moment from 'moment';

export default React.createClass({
  onClick() {
    this.props.onPointClick(this.props.coords);
  },
  render() {
    const props = this.props;
    const coords = this.props.coords;
    const index = this.props.index;
    const diameter = (props.zoom > 4 ? 0.2 * props.zoom : 1) * (coords.highlighted ? 18 : 10);
    const radius = diameter / 2;
    const circleProps = {
      x: props.xScale(coords.x),
      y: props.yScale(coords.y),
      cx: props.xScale(coords.x),
      cy: props.yScale(coords.y),
      r: radius / props.zoom,
      key: index,
      fill: coords.color,
      'data-name': '#' + coords.name,
    };
    return <circle
      onClick={this.onClick}
      style={{ cursor: 'pointer', opacity: coords.grayedOut ? 0.2 : 1 }}
      {...circleProps}
      onMouseOver={props.showTooltip}
      onMouseOut={props.hideTooltip} />;
  }
});
