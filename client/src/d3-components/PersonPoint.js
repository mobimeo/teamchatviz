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
import moment from 'moment';

export default (props) => {
  return (coords, index) => {
    const circleProps = {
      x: props.xScale(coords.x) - 9 / props.zoom,
      y: props.yScale(coords.y) - 9 / props.zoom,
      cx: props.xScale(coords.x),
      cy: props.yScale(coords.y),
      key: index,
      'data-name': coords.name,
      width: (18 / props.zoom) + 'px',
      height: (18 / props.zoom) + 'px',
    };
    return <g>
      <defs>
        <clipPath id={'circlePath' + index}>
          <circle cx={circleProps.x + 9 / props.zoom} cy={circleProps.y + 9 / props.zoom} r={ 9 / props.zoom } />
        </clipPath>
      </defs>
      <image
        clipPath={'url(#circlePath' + index + ')'}
        xlinkHref={coords.image24}
        style={{cursor: 'pointer'}}
        {...circleProps}
        onMouseOver={props.showTooltip}
        onMouseOut={props.hideTooltip} />
    </g>;
  };
};