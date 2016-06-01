import React from 'react';
import ReactDOM from 'react-dom';
import moment from 'moment';
import { XYPlot, XAxis, YAxis, VerticalGridLines, LineSeries, Crosshair } from 'react-vis';
import { DateRangePicker } from './components/DateRangePicker.js';
import { SearchBox } from './components/SearchBox.js';
import { SortDropdown } from './components/SortDropdown.js';

import 'react-vis/main.css!';

function parseJSON(response) {
  return response.json()
}

const HeartbeatPlot = React.createClass({
  /**
   * Event handler for onNearestX.
   * @param {number} seriesIndex Index of the series.
   * @param {Object} value Selected value.
   * @private
   */
  _onNearestX(seriesIndex, value) {
    this._crosshairValues = this._crosshairValues.concat();
    this._crosshairValues[seriesIndex] = value;
    this.setState({ crosshairValues: this._crosshairValues });
  },

  /**
   * Event handler for onMouseLeave.
   * @private
   */
  _onMouseLeave() {
    this._crosshairValues = [];
    this.setState({ crosshairValues: this._crosshairValues });
  },

  getInitialState() {
    this._crosshairValues = [];

    this._onMouseLeave = this._onMouseLeave.bind(this);
    this._onNearestXs = [
      this._onNearestX.bind(this, 0),
      this._onNearestX.bind(this, 1)
    ];

    return {
      crosshairValues: [],
      width: 0,
    };
  },

  componentDidMount() {
    this.setState({
      width: ReactDOM.findDOMNode(this).parentNode.offsetWidth,
    });
  },

  render() {
    const data = this.props.data || {
      heartbeat: [],
    };
    const chValues = this.state.crosshairValues;
    const chStyle = {
      background: 'black',
      width: '100px',
    };
    return <XYPlot
        onMouseLeave={this._onMouseLeave}
        margin={{left: 0, top: 0, right: 0, bottom: 0}}
        width={this.state.width - 30}
        height={100}>
        <VerticalGridLines />
        <LineSeries
          onNearestX={this._onNearestXs[0]}
          data={data.heartbeat.map(i => ({
            x: moment(i.t).unix(),
            y: i.count,
          }))}
          xType='time'
        />
        <Crosshair values={chValues}>
          <div style={chStyle}>
            <h3>{moment.unix(chValues[0] ? chValues[0].x : 0).format("D MMM YYYY")}</h3>
            <p>{chValues[0] ? chValues[0].y : 0} messages</p>
          </div>
        </Crosshair>
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
    fetch(`/api/heartbeat?startDate=${range.startDate?range.startDate:''}&endDate=${range.endDate?range.endDate:''}`, {
      credentials: 'same-origin'
    })
    .then(parseJSON)
    .then(data => {
      this.setState({
        data: data.slice(0, 10),
        all: data,
      });
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