import React from 'react';
import moment from 'moment';
import { XYPlot, XAxis, YAxis, VerticalGridLines, LineSeries } from 'react-vis';
import 'react-vis/main.css!';
import './app.css!';

function parseJSON(response) {
  return response.json()
}
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

  render() {
    const data = this.state.data;
    return <div>
      <h1>Heartbeat</h1>
      {
        data.map(d => {
          return <div className="hbt channel">
            <div className="hbt channel-name">
              <span>#{d.name}</span>
            </div>
            <div className="hbt channel-chart">
              <XYPlot
                width={window.innerWidth - 120}
                height={100}>
                <VerticalGridLines />
                <LineSeries
                  data={d.heartbeat.map(i => ({
                    x: moment(i.t).unix(),
                    y: i.count,
                  }))}
                  xType='time'
                />
              </XYPlot>
            </div>
          </div>
        })
      }
    </div>;
  }
});