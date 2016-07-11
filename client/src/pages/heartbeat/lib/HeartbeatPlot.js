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

    const propsData = this.props.data;
    return {
      data: Map({
        crosshairValues: [],
        width: 0,
        seriesColor: propsData.selected ? '#00B7BF' : '#9B9B9B',
        seriesWidth: propsData.selected ? '2.5px' : '1px',
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
    const propsData = this.props.data;
    this._crosshairValues = [];
    this.setState(({data}) => ({
      data: data
        .update('crosshairValues', () => this._crosshairValues)
        .update('seriesColor', () => propsData.selected ? '#00B7BF' : '#9B9B9B')
        .update('seriesWidth', () => propsData.selected ? '2.5px' : '1px'),
    }));
  },

  /**
   * Event handler for _onMouseEnter.
   * @private
   */
  _onMouseEnter() {
    const propsData = this.props.data;
    this._crosshairValues = [];
    this.setState(({data}) => ({
      data: data
        .update('seriesColor', () => '#00B7BF')
        .update('seriesWidth', () => '2.5px'),
    }));
  },

  componentDidMount() {
    const parent = ReactDOM.findDOMNode(this).parentNode;
    this.setState(({data}) => ({
      data: data.update('width', () =>
        parent.offsetWidth - parseInt(window.getComputedStyle(parent, null).getPropertyValue('padding-right')) - 25
      )
    }));
  },

  componentWillReceiveProps(newProps) {
    const propsData = newProps.data;
    this.setState(({data}) => ({
      data: data
        .update('seriesColor', () => propsData.selected ? '#00B7BF' : '#9B9B9B')
        .update('seriesWidth', () => propsData.selected ? '2.5px' : '1px'),
    }));
  },

  render() {
    const data = this.props.data || {
      heartbeat: [],
    };
    const chValues = this.state.data.get('crosshairValues');
    const hints = [];
    const interval = this.props.interval;
    if (chValues[0]) {
      const startDate = moment.unix(chValues[0] ? chValues[0].x : 0).format("D MMM YYYY");
      const endDate = moment.unix(chValues[0] ? chValues[0].x : 0)
        .add(interval, 'days')
        .format("D MMM YYYY");
      hints.push(<Hint
        orientation="topleft"
        value={chValues[0]}
        key={'xyPlotHint' + this.props.parentKey}>
        <div className="cross-hair arrow_box">
          { startDate } {
            interval > 1
            ? ' — ' + endDate
            : ''
          }
          <br />
          {chValues[0] ? chValues[0].y : 0} messages
        </div>
      </Hint>);
      hints.push(<Hint
        orientation="topleft"
        value={chValues[0]}
        key={'xyPlotHintPointer' + this.props.parentKey}>
          <img className="cross-hair-pointer" width="25" src="/images/pointer.png" />
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
      if (max !== 0) {
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
    }

    return <XYPlot
        onMouseLeave={this._onMouseLeave}
        onMouseEnter={this._onMouseEnter}
        width={width}
        height={100}
        margin={{left: 1.25, top: 1.25, right: 1.25, bottom: 1.25}}
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
          xType='time'
          strokeWidth={this.state.data.get('seriesWidth')}
          key={'xyPlotLineSeries' + this.props.parentKey}
        />
        {hints}
      </XYPlot>;
  }
});