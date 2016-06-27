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
import { Hint, XYPlot, XAxis, YAxis, VerticalGridLines, HorizontalGridLines, LineSeries, Crosshair } from 'react-vis';
import { Map, List } from 'immutable';
import moment from 'moment';
import { maxBy } from 'lodash';
import ReactDOM from 'react-dom';

export default React.createClass({

  getInitialState() {
    return {
      data: Map({
        width: 0,
      })
    };
  },

  componentDidMount() {
    this.setState(({data}) => ({
      data: data.update('width', () => ReactDOM.findDOMNode(this).parentNode.offsetWidth)
    }));
  },

  render() {
    const data = this.props.data || {
      heartbeat: [],
    };
    const hints = [];
    const width = (this.state.data.get('width') - 30) > 0 ? this.state.data.get('width') - 30 : 600;
    const chartData = data.heartbeat.map(i => ({
      x: moment.utc(i.t).unix(),
      y: i.count,
    }));
    const chunks = this.props.chunks;
    chunks.forEach((ch, i) => {
      hints.push(<Hint
        orientation={ (i < chunks.length - 1) ? 'topright' : 'topright' }
        value={{ x: moment.utc(ch.ts).unix(), y: 0 }}>
        <span style={{ position: 'relative', left: '4px', fontSize: '0.5rem' }}>
          {moment.utc(ch.ts).format('ll')}
        </span>
      </Hint>);
    });

    return <XYPlot
        onMouseLeave={this._onMouseLeave}
        onMouseEnter={this._onMouseEnter}
        width={width}
        height={40}
        margin={{left: 0, top: 0, right: 0, bottom: 0}}
        yDomain={[0, 1 ]}
        key={'xyPlot' + this.props.parentKey}
        >
        <VerticalGridLines
          key={'xyPlotVerticalGrids' + this.props.parentKey}
          color="white"
          values={this.props.chunks.map(ch => moment.utc(ch.ts).unix())} />
        <LineSeries
          data={chartData}
          color="white"
          size='1px'
          xType='time'
          key={'xyPlotLineSeries' + this.props.parentKey}
        />
        {hints}
      </XYPlot>;
  }
});