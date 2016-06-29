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

export default React.createClass({
  propTypes: {
    tooltip: React.PropTypes.object,
  },
  render() {
    if (this.props.tooltip.display ===  true) {
      let { x, y } = this.props.tooltip;
      const zoom = this.props.zoom;
      const textStyle = {
        fontSize: 15 / zoom,
        fontWeight: 'bold',
      };
      var width = 170 / zoom;
      var height = 30 / zoom;
      var transformText = `translate(${width/2}, ${height/2 + 5/zoom})`;
      var transformArrow = '';
      var transform;
      if (y > height) {
        transform = `translate(${x-width/2}, ${y-height-20/zoom})`;
        transformArrow = `translate(${width/2 - 20 / zoom}, ${height - 2/zoom})`;
      } else if (y < height) {
        transform = `translate(${x - width /2}, ${Math.round(y) + 20/zoom})`;
        transformArrow = `translate(${width/2-20/zoom},0) rotate(${180 / zoom},${20 / zoom},0)`;
      }

      const pointsArrow = `${10 / zoom},0  ${30 / zoom},0  ${20 / zoom},${10 / zoom}`;

      return <g transform={transform}>
        <rect class="shadow" is width={width} height={height} fill="#393b42"/>
        <polygon class="shadow" is points={pointsArrow} transform={transformArrow} fill="#393b42" />
        <text is transform={transformText}>
          <tspan is x="0" text-anchor="middle" font-size={textStyle.fontSize} fill="#ffffff">{this.props.tooltip.name}</tspan>
        </text>
      </g>;
    } else {
      return <text />;
    }
  }
});