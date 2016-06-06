import React from 'react';
import ReactDOM from 'react-dom';
import moment from 'moment';
import { XYPlot, XAxis, YAxis, VerticalGridLines, LineMarkSeries, Crosshair } from 'react-vis';
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
    const chStyle = {
      background: '#393B42',
      width: '90px',
      color: 'white',a
    };
    const width = (this.state.data.get('width') - 30) > 0 ? this.state.data.get('width') - 30 : 600;
    return <XYPlot
        onMouseLeave={this._onMouseLeave}
        onMouseEnter={this._onMouseEnter}
        margin={{left: 1, top: 1, right: 1, bottom: 1}}
        width={width}
        height={100}>
        <VerticalGridLines />
        <LineMarkSeries
          onNearestX={this._onNearestXs[0]}
          data={data.heartbeat.map(i => ({
            x: moment(i.t).unix(),
            y: i.count,
          }))}
          color={this.state.data.get('seriesColor')}
          size='1px'
          xType='time'
        />
        <Crosshair values={chValues}>
          <div style={chStyle} className="cross-hair">
            {moment.unix(chValues[0] ? chValues[0].x : 0).format("D MMM YYYY")}
            <br />
            {chValues[0] ? chValues[0].y : 0} messages
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