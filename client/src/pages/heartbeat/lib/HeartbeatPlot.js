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
    this._crosshairValues = [];

    this._onMouseLeave = this._onMouseLeave.bind(this);
    this._onNearestXs = [
      this._onNearestX.bind(this, 0),
      this._onNearestX.bind(this, 1)
    ];

    return {
      data: Map({
        crosshairValues: [],
        width: 0,
        seriesColor: '#9B9B9B',
      })
    };
  },

  /**
   * Event handler for onNearestX.
   * @param {number} seriesIndex Index of the series.
   * @param {Object} value Selected value.
   * @private
   */
  _onNearestX(seriesIndex, value) {
    this._crosshairValues = this._crosshairValues.concat();
    this._crosshairValues[seriesIndex] = value;
    this.setState(({data}) => ({
      data: data.update('crosshairValues', () => this._crosshairValues)
    }));
  },

  /**
   * Event handler for onMouseLeave.
   * @private
   */
  _onMouseLeave() {
    this._crosshairValues = [];
    this.setState(({data}) => ({
      data: data
        .update('crosshairValues', () => this._crosshairValues)
        .update('seriesColor', () => '#9B9B9B'),
    }));
  },

  /**
   * Event handler for _onMouseEnter.
   * @private
   */
  _onMouseEnter() {
    this._crosshairValues = [];
    this.setState(({data}) => ({
      data: data.update('seriesColor', () => '#00B7BF')
    }));
  },

  componentDidMount() {
    const parent = ReactDOM.findDOMNode(this).parentNode;
    this.setState(({data}) => ({
      data: data.update('width', () =>
        parent.offsetWidth - parseInt(window.getComputedStyle(parent, null).getPropertyValue('padding-right')) - 5
      )
    }));
  },

  render() {
    const data = this.props.data || {
      heartbeat: [],
    };
    const showChunkHints = this.props.showChunkHints || false;
    const chValues = this.state.data.get('crosshairValues');
    const tooltipStyles = {
      background: '#393B42',
      width: '90px',
      color: 'white',
      position: 'absolute',
      left: '-47px',
      top: '-50px',
      fontSize: '10px'
    };
    const pointerStyles = {
      position: 'absolute',
      left: '-12px',
      top: '-13px',
    };
    const hints = [];
    if (chValues[0]) {
      hints.push(<Hint
        orientation="topleft"
        value={chValues[0]}
        key={'xyPlotHint' + this.props.parentKey}>
        <div style={tooltipStyles} className="cross-hair arrow_box">
          {moment.unix(chValues[0] ? chValues[0].x : 0).format("D MMM YYYY")}
          <br />
          {chValues[0] ? chValues[0].y : 0} messages
        </div>
      </Hint>);
      hints.push(<Hint
        orientation="topleft"
        value={chValues[0]}
        key={'xyPlotHintPointer' + this.props.parentKey}>
          <img style={pointerStyles} width="25" src="/images/pointer.png" />
      </Hint>);
    }

    const width = (this.state.data.get('width')) > 0 ? this.state.data.get('width') : 600;
    const chartData = data.heartbeat.map(i => ({
      x: moment.utc(i.t).unix(),
      y: i.count,
    }));

    const max = maxBy(chartData, i => i.y).y;
    if (chartData.length > 0) {
      hints.push(<Hint
        orientation="topright"
        value={{
          x: chartData[0].x,
          y: max,
        }}
        key={'xyPlotTopMark' + this.props.parentKey}>
          <div className="heartbeat-y-mark-value">{max}</div>
          <div className="heartbeat-y-mark"></div>
      </Hint>);
      hints.push(<Hint
        orientation="topright"
        value={{
          x: chartData[0].x,
          y: 0,
        }}
        key={'xyPlotLowMark' + this.props.parentKey}>
          <div className="heartbeat-y-mark-value">0</div>
          <div className="heartbeat-y-mark"></div>
      </Hint>);
    }

    return <XYPlot
        onMouseLeave={this._onMouseLeave}
        onMouseEnter={this._onMouseEnter}
        width={width}
        height={100}
        margin={{left: 0.5, top: 0.5, right: 0.5, bottom: 0.5}}
        yDomain={[0, max + ( max * 0.3 ) ]}
        key={'xyPlot' + this.props.parentKey}
        >
        <HorizontalGridLines className="low-boundary" key={'xyPlotHorizontalGrids' + this.props.parentKey} values={[0]} />
        <HorizontalGridLines className="higher-boundary" key={'xyPlotHorizontalGrids2' + this.props.parentKey} values={[max]} />
        <VerticalGridLines key={'xyPlotVerticalGrids' + this.props.parentKey} values={this.props.chunks.map(ch => moment.utc(ch.ts).unix())} />
        <LineSeries
          onNearestX={this._onNearestXs[0]}
          data={chartData}
          color={this.state.data.get('seriesColor')}
          size='1px'
          xType='time'
          key={'xyPlotLineSeries' + this.props.parentKey}
        />
        {hints}
      </XYPlot>;
  }
});