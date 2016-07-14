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
import d3 from 'd3';

export default React.createClass({
  render() {
    const data = d3.geom.hull(this.props.points);
    let attr = '';
    if (data.length > 0) {
      attr = `M ${data[0][0]} ${data[0][1]} ${data.slice(0, data.length).map(d => 'L ' + d[0] + ' ' + d[1]).join(' ')} Z`;
    }
    const color = this.props.color;
    return <path
      className="hull"
      d={attr}
      fill={color}
      stroke={color}
      strokeWidth="0.3px"
      strokeLinejoin="round"
      strokeOpacity="1"
      fillOpacity=".05">
    </path>
  }
});