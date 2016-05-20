import React from 'react';
import rd3 from 'rd3';
import moment from 'moment';

var LineChart = rd3.LineChart;

function parseJSON(response) {
  return response.json()
}

var lineData = [
  {
    name: 'Messages',
    values : [ { x: '0', y: 8 }, { x: 1, y: 5 }, { x: 2, y: 20 }, { x: 3, y: 12 }, { x: 4, y: 4 }, { x: 5, y: 6 }, { x: 6, y: 2 } ]
  }
];

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
        data: data.slice(0, 3),
      });
    });
  },

  render() {
    const data = this.state.data;
    return <div>
      <h1>Heartbeat</h1>
      {
        data.map(d => {
          return <div>
            <span>#{d.name}</span>
            <LineChart
              legend={true}
              data={[
                {
                  name: 'Messages',
                  values : d.heartbeat.map(i => ({
                    x: moment(i.t).unix(),
                    y: i.count,
                  }))
                }
              ]}
              width='100%'
              height={150}
              viewBoxObject={{
                x: 0,
                y: 0,
                width: window.innerWidth - 50,
                height: 150
              }}
              yAccessor={(d)=>d.y}
              xAxisTickInterval={{unit: 'year', interval: 2}}
              gridHorizontal={true}
            />
          </div>
        })
      }
    </div>;
  }
});