import React from 'react';
import ReactDOM from 'react-dom';
import moment from 'moment';
import { Hint, XYPlot, XAxis, YAxis, VerticalGridLines, LineSeries, Crosshair } from 'react-vis';
import { DateRangePicker } from './components/DateRangePicker.js';
import { SearchBox } from './components/SearchBox.js';
import { SortDropdown } from './components/SortDropdown.js';
import Progress from 'react-progress-2';
import { Map, List } from 'immutable';
import { Link } from 'react-router';
import { VirtualScroll } from 'react-virtualized';

import 'react-vis/main.css!';
import 'react-virtualized/styles.css!';

function parseJSON(response) {
  return response.json()
}

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
      }),
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
    const chValues = this.state.data.get('crosshairValues');
    const tooltipStyles = {
      background: '#393B42',
      width: '90px',
      color: 'white',
      position: 'absolute',
      left: '-49px',
      top: '-50px',
      fontSize: '10px'
    };
    const pointerStyles = {
      position: 'absolute',
      left: '-13px',
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
    const width = (this.state.data.get('width') - 30) > 0 ? this.state.data.get('width') - 30 : 600;
    const chartData = data.heartbeat.map(i => ({
      x: moment(i.t).unix(),
      y: i.count,
    }));

    const max = this.props.max || 1000;
    return <XYPlot
        onMouseLeave={this._onMouseLeave}
        onMouseEnter={this._onMouseEnter}
        width={width}
        height={100}
        margin={{left: 0, top: 0, right: 0, bottom: 0}}
        yDomain={[0, max]}
        key={'xyPlot' + this.props.parentKey}
        >
        <VerticalGridLines key={'xyPlotVerticalGrids' + this.props.parentKey} />
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
    return <div className="row middle-xs" style={{ paddingRight: '20px' }}>
      <div className="col-xs-2">
        <span>#{this.props.data.name}</span>
      </div>
      <div className="col-xs-10">
        <HeartbeatPlot data={this.props.data} max={this.props.max} key={this.props.parentKey} parentKey={this.props.parentKey}/>
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
      })
    };
  },

  componentDidMount() {
    Progress.show();
    fetch('/api/heartbeat', {
      credentials: 'same-origin'
    })
    .then(response => {
      if (!response.ok) {
        if (response.status == 401) {
          window.location = '/api/auth/slack';
        }
        throw Error(response.statusText);
      }
      return response;
    })
    .then(parseJSON)
    .then(result => {
      this.setState(({data}) => ({
        data: data
          .set('items', List(result.data))
          .set('displayedItems', List(result.data))
          .set('max', result.max)
      }));
      Progress.hide();
    });
  },

  onDateChange(range) {
    Progress.show();
    fetch(`/api/heartbeat?startDate=${range.startDate?range.startDate:''}&endDate=${range.endDate?range.endDate:''}`, {
      credentials: 'same-origin'
    })
    .then(parseJSON)
    .then(result => {
      this.setState(({data}) => ({
        data: data
          .set('items', List(result.data))
          .set('displayedItems', List(result.data))
          .set('max', result.max)
      }));
      this.refs.VirtualScroll.forceUpdate();
      Progress.hide();
    });
  },

  onSearch(value) {
    var result = this.state.data.get('items').toJS().filter(d => value === '' || d.name.toLowerCase().indexOf(value.toLowerCase()) !== -1);
    this.setState(({data}) => ({
      data: data
        .set('displayedItems', List(result))
    }));
    this.refs.VirtualScroll.forceUpdate();
  },

  onSort(option) {
    var result = this.state.data.get('items').toJS();
    result.sort(option.compare);
    this.setState(({data}) => ({
      data: data
        .set('displayedItems', List(result))
    }));
    this.refs.VirtualScroll.forceUpdate();
  },

  renderItem({ index, isScrolling }) {
    if (index === 0) {
      return <div key={'scrollRow0'} style={{ height: '20px' }}></div>
    }
    const data = this.state.data.get('displayedItems').get(index - 1);
    return <ChartItem data={data} parentKey={'scrollRow' + data.id} key={'scrollRow' + data.id} max={this.state.data.get('max')} />;
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
      <header className="site-header">
        <div className="row">
          <div className="col-xs-10">
            <Link to="/">
              <h1>
                channel heartbeat
              </h1>
            </Link>
          </div>
          <div className="col-xs-2">
            <Link to ="/"><img className="nav-buttons" src="../../images/navbuttons-16.png" alt="home"></img></Link>
            <Link to ="/"><img className="nav-buttons" src="../../images/navbuttons-17.png" alt="info"></img></Link>
            <Link to ="/"><img className="nav-buttons" src="../../images/navbuttons-18.png" alt="menu"></img></Link>
          </div>
        </div>
      </header>
      <main>
        <div className="row between-xs widgets">
          <div className="col-xs-6 no-padding">
            <SortDropdown onChange={this.onSort} /> <SearchBox onChange={this.onSearch} placeholder="search channel" />
          </div>
          <div className="col-xs-6 no-padding" style={{textAlign: 'right'}}>
            <DateRangePicker onChange={this.onDateChange} />
          </div>
        </div>
          <VirtualScroll
            ref='VirtualScroll'
            height={window.innerHeight - 250}
            overscanRowCount={10}
            rowCount={data.get('displayedItems').size}
            rowHeight={this._getRowHeight}
            rowRenderer={this.renderItem}
            width={1200}
          />
      </main>
    </div>;
  }
});