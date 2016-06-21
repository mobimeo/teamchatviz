import React from 'react';
import ReactDOM from 'react-dom';
import moment from 'moment';
import { Hint, XYPlot, XAxis, YAxis, VerticalGridLines, HorizontalGridLines, LineSeries, Crosshair } from 'react-vis';
import { DateRangePicker } from './components/DateRangePicker.js';
import { SearchBox } from './components/SearchBox.js';
import { SortDropdown } from './components/SortDropdown.js';
import { Map, List } from 'immutable';
import { Link } from 'react-router';
import { VirtualScroll, WindowScroller, AutoSizer } from 'react-virtualized';
import { maxBy } from 'lodash';
import { fetchHeartbeat } from './networking/index';
import { Header } from './components/Header.js';

import 'react-vis/main.css!';
import 'react-virtualized/styles.css!';


const HeartbeatPlot = React.createClass({

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
    this.setState(({data}) => ({
      data: data.update('width', () => ReactDOM.findDOMNode(this).parentNode.offsetWidth)
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
      hints.push(<Hint orientation="topleft" value={chValues[0]} key={'xyPlotHint' + this.props.parentKey}>
              <div style={tooltipStyles} className="cross-hair arrow_box">
                {moment.unix(chValues[0] ? chValues[0].x : 0).format("D MMM YYYY")}
                <br />
                {chValues[0] ? chValues[0].y : 0} messages
              </div>
            </Hint>);
      hints.push(<Hint orientation="topleft" value={chValues[0]}  key={'xyPlotHint2' + this.props.parentKey}>
              <img style={pointerStyles} width="25" src="/images/pointer.png" />
            </Hint>);
    }
    if (showChunkHints) {
      const chunks = this.props.chunks;
      chunks.forEach((ch, i) => {
        hints.push(<Hint orientation={ (i < chunks.length - 1) ? 'topright' : 'topright' } value={{ x: moment.utc(ch.ts).unix(), y: data.max + 30 }}>
          <span style={{ fontSize: '0.5rem', position: 'relative', top: '-20px' }}>{moment.utc(ch.ts).format('ll')}</span>
        </Hint>);
      });
    }
    const width = (this.state.data.get('width') - 30) > 0 ? this.state.data.get('width') - 30 : 600;
    const chartData = data.heartbeat.map(i => ({
      x: moment.utc(i.t).unix(),
      y: i.count,
    }));

    const max = maxBy(chartData, i => i.y).y;

    return <XYPlot
        onMouseLeave={this._onMouseLeave}
        onMouseEnter={this._onMouseEnter}
        width={width}
        height={100}
        margin={{left: 0, top: 0, right: 0, bottom: 0}}
        yDomain={[0, max + 50]}
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

const ChartItem = React.createClass({
  render() {
    const showChunkHints = this.props.showChunkHints;
    return <div className="row middle-xs" style={{ paddingRight: '20px' }}>
      <div className="col-xs-2">
        <span>#{this.props.data.name}</span>
      </div>
      <div className="col-xs-10">
        <HeartbeatPlot data={this.props.data} showChunkHints={showChunkHints} chunks={this.props.chunks} key={this.props.parentKey} parentKey={this.props.parentKey}/>
      </div>
    </div>
  }
});

export const Heartbeat = React.createClass({
  getInitialState() {
    return {
      data: Map({
        displayedItems: List([]),
        items: List([]),
        chunks: List([])
      })
    };
  },

  componentDidMount() {
    fetchHeartbeat()
      .then(result => {
        this.setState(({data}) => ({
          data: data
            .set('items', List(result.data))
            .set('displayedItems', List(result.data))
            .set('chunks', result.chunks)
        }));
      })
  },

  onDateChange(range) {
    fetchHeartbeat(range.startDate, range.endDate)
      .then(result => {
        this.setState(({data}) => ({
          data: data
            .set('items', List(result.data))
            .set('displayedItems', List(result.data))
            .set('chunks', result.chunks)
        }));
        this._VirtualScroll.forceUpdate();
      });
  },

  onSearch(value) {
    var result = this.state.data.get('items').toJS().filter(d => value === '' || d.name.toLowerCase().indexOf(value.toLowerCase()) !== -1);
    this.setState(({data}) => ({
      data: data
        .set('displayedItems', List(result))
    }));
    this._VirtualScroll.forceUpdate();
  },

  onSort(option) {
    this.setState(({data}) => ({
      data: data
        .set('displayedItems', data.get('items').sort(option.compare))
    }));
    this._VirtualScroll.forceUpdate();
  },

  renderItem({ index, isScrolling }) {
    if (index === 0) {
      return <div key={'scrollRow0'} style={{ height: '20px' }}></div>
    }
    const data = this.state.data.get('displayedItems').get(index - 1);
    const chunks = this.state.data.get('chunks');
    return <ChartItem data={data} chunks={chunks} showChunkHints={index === 1 ? true : false} parentKey={'scrollRow' + data.id} key={'scrollRow' + data.id} />;
  },

  _getRowHeight({ index }) {
    if (index === 0) {
      return 50;
    }
    return 100;
  },

  render() {
    const data = this.state.data;
    return <div>
      <Header title="channel heartbeat" />
      <main>
        <div className="row between-xs widgets">
          <div className="col-xs-6 no-padding">
            <SortDropdown onChange={this.onSort} /> <SearchBox onChange={this.onSearch} placeholder="search channel" />
          </div>
          <div className="col-xs-6 no-padding" style={{textAlign: 'right'}}>
            <DateRangePicker onChange={this.onDateChange} />
          </div>
        </div>
        <div>
          <WindowScroller>
            {({ height, scrollTop }) => (
              <AutoSizer disableHeight>
                {({ width }) => (
                  <VirtualScroll
                    ref={(v) => this._VirtualScroll = v}
                    autoHeight
                    height={height}
                    scrollTop={scrollTop}
                    overscanRowCount={20}
                    rowCount={data.get('displayedItems').size}
                    rowHeight={this._getRowHeight}
                    rowRenderer={this.renderItem}
                    width={width}
                  />
                )}
              </AutoSizer>
            )}
          </WindowScroller>
        </div>
      </main>
    </div>;
  }
});