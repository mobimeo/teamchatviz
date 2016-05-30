import React from 'react';
import moment from 'moment';
import { XYPlot, XAxis, YAxis, VerticalGridLines, LineSeries, Crosshair } from 'react-vis';
import { DateRangePicker } from './components/DateRangePicker';
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
    this.setState({crosshairValues: this._crosshairValues});
  },

  /**
   * Event handler for onMouseLeave.
   * @private
   */
  _onMouseLeave() {
    this._crosshairValues = [];
    this.setState({crosshairValues: this._crosshairValues});
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
    };
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
        width={window.innerWidth - 240}
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
    };
  },

  componentDidMount() {
    fetch('/api/heartbeat', {
      credentials: 'same-origin'
    })
    .then(parseJSON)
    .then(data => {
      this.setState({
        data: data,
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
        data: data,
      });
    });
  },

  render() {
    const data = this.state.data;
    return <div>
      <header>
        <h1>channel heartbeat</h1>
      </header>
      <main>
        <DateRangePicker onChange={this.onDateChange} />
        {
          data.map((d, i) => {
            return <div className="hbt channel" key={i}>
              <div className="hbt channel-name">
                <span>#{d.name} {d.heartbeat.length}</span>
              </div>
              <div className="hbt channel-chart">
                <HeartbeatPlot data={d} />
              </div>
            </div>
          })
        }
      </main>
    </div>;
  }
});