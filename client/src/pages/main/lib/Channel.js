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

export default React.createClass({
  render() {
    return <Link to={this.props.linkTo} className="chart-container">
      <div className="chart-image-link">
        <div className={this.props.imageName + ' chart-image'} style={{width: '7.813rem', height: '7.813rem'}}></div>
      </div>
      <div>
        <div className="chart-title">{this.props.title}</div>
        <p className="chart-description">
          {this.props.description}
        </p>
      </div>
    </Link>;
  }
});