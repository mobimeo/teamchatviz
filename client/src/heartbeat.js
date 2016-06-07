import React from 'react';
import ReactDOM from 'react-dom';
import moment from 'moment';
import { Hint, XYPlot, XAxis, YAxis, VerticalGridLines, LineSeries, Crosshair } from 'react-vis';
import { DateRangePicker } from './components/DateRangePicker.js';
import { SearchBox } from './components/SearchBox.js';
import { SortDropdown } from './components/SortDropdown.js';
import Progress from 'react-progress-2';
import { Map } from 'immutable';

import 'react-vis/main.css!';

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
      left: '-47px',
      top: '-50px',
    };
    const pointerStyles = {
      position: 'absolute',
      left: '-13px',
      top: '-13px',
    };
    const hints = [];
    if (chValues[0]) {
      hints.push(<Hint orientation="topleft" value={chValues[0]}>
              <div style={tooltipStyles} className="cross-hair arrow_box">
                {moment.unix(chValues[0] ? chValues[0].x : 0).format("D MMM YYYY")}
                <br />
                {chValues[0] ? chValues[0].y : 0} messages
              </div>
            </Hint>);
      hints.push(<Hint orientation="topleft" value={chValues[0]}>
              <img style={pointerStyles} width="25" src="/images/pointer.png" />
            </Hint>);
    }
    const width = (this.state.data.get('width') - 30) > 0 ? this.state.data.get('width') - 30 : 600;
    const chartData = data.heartbeat.map(i => ({
      x: moment(i.t).unix(),
      y: i.count,
    }));

    return <XYPlot
        onMouseLeave={this._onMouseLeave}
        onMouseEnter={this._onMouseEnter}
        width={width}
        height={100}
        margin={{left: 0, top: 1, right: 0, bottom: 1}}
        >
        <VerticalGridLines />
        <LineSeries
          onNearestX={this._onNearestXs[0]}
          data={chartData}
          color={this.state.data.get('seriesColor')}
          size='1px'
          xType='time'
        />
        {hints}
      </XYPlot>;
  }
});

export const Heartbeat = React.createClass({
  getInitialState() {
    return {
      data: [],
      all: [],
    };
  },

  componentDidMount() {
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
    .then(data => {
      this.setState({
        data: data.slice(0, 10),
        all: data,
      });
    });
  },

  onDateChange(range) {
    Progress.show();
    fetch(`/api/heartbeat?startDate=${range.startDate?range.startDate:''}&endDate=${range.endDate?range.endDate:''}`, {
      credentials: 'same-origin'
    })
    .then(parseJSON)
    .then(data => {
      this.setState({
        data: data.slice(0, 10),
        all: data,
      });
      Progress.hide();
    });
  },

  onSearch(value) {
    var result = this.state.all.filter(d => value === '' || d.name.toLowerCase().indexOf(value.toLowerCase()) !== -1);
    this.setState({
      data: result.slice(0, 10),
      all: this.state.all,
    });
  },

  onSort(option) {
    var result = this.state.all.map(i => i);
    result.sort(option.compare);
    console.log(result);
    this.setState({
      data: result.slice(0, 10),
      all: this.state.all,
    });
  },

  render() {
    const data = this.state.data;
    return <div>
      <header className="site-header">
        <h1>
          channel heartbeat
        </h1>
      </header>
      <main>
        <div className="row between-xs widgets">
          <div className="col-xs-6">
            <SortDropdown onChange={this.onSort} /> <SearchBox onChange={this.onSearch} placeholder="search channel" />
          </div>
          <div className="col-xs-6" style={{textAlign: 'right'}}>
            <DateRangePicker onChange={this.onDateChange} />
          </div>
        </div>
        {
          data.map((d, i) => {
            return <div className="row middle-xs" key={i}>
              <div className="col-xs-2">
                <span>#{d.name}</span>
              </div>
              <div className="col-xs-10">
                <HeartbeatPlot data={d} />
              </div>
            </div>
          })
        }
      </main>
    </div>;
  }
});