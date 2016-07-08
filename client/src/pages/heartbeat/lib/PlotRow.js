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
import HeartbeatPlot from './HeartbeatPlot.js';

const PlotRow = React.createClass({
  onChannelClick() {
    this.props.onSelected(this.props.data);
  },
  render() {
    const showChunkHints = this.props.showChunkHints;
    return <div className="row middle-xs heartbeat-chart-row">
      <div className="col-xs-2">
        <div>
          <button
            className={'channel-list-element ' + (this.props.data.selected ? 'selected' : '')}
            onClick={this.onChannelClick}>
            #{this.props.data.name}
          </button>
        </div>
      </div>
      <div className="col-xs-10">
        <HeartbeatPlot selected={this.props.data.selected} data={this.props.data} showChunkHints={showChunkHints} chunks={this.props.chunks} key={this.props.parentKey} parentKey={this.props.parentKey}/>
      </div>
    </div>
  }
});

export default PlotRow;