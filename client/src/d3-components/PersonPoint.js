/*
  Slack Viz
  Copyright (C) 2016 Moovel Group GmbH, Haupstaetter str. 149, 70width8, Stuttgart, Germany hallo@moovel.com

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

export default (props) => {
  return (coords, index) => {
    const diameter = (props.zoom > 4 ? 0.2 * props.zoom : 1) * (coords.highlighted ? 32 : 18);
    const radius = diameter / 2;
    const circleProps = {
      x: props.xScale(coords.x) - radius / props.zoom,
      y: props.yScale(coords.y) - radius / props.zoom,
      cx: props.xScale(coords.x),
      cy: props.yScale(coords.y),
      key: index,
      'data-name': coords.name,
      width: (diameter / props.zoom) + 'px',
      height: (diameter / props.zoom) + 'px',
    };
    return <g>
      <defs>
        <clipPath id={'circlePath' + index}>
          <circle cx={circleProps.x + radius / props.zoom} cy={circleProps.y + radius / props.zoom} r={ radius / props.zoom } />
        </clipPath>
      </defs>
      <image
        clipPath={'url(#circlePath' + index + ')'}
        xlinkHref={coords.highlighted ? coords.image48 : coords.image24}
        style={{ cursor: 'pointer', opacity: coords.grayedOut ? 0.2 : 1 }}
        {...circleProps}
        onMouseOver={props.showTooltip}
        onMouseOut={props.hideTooltip} />
    </g>;
  };
};