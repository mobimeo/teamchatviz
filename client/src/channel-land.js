import React from 'react';
import ReactDOM from 'react-dom';
import moment from 'moment';
import { DateRangePicker } from './components/DateRangePicker.js';
import { SearchBox } from './components/SearchBox.js';
import { SortDropdown } from './components/SortDropdown.js';
import Progress from 'react-progress-2';
import { Map } from 'immutable';
import { Link } from 'react-router';
import _ from 'lodash';
import d3 from 'd3';

function parseJSON(response) {
  return response.json()
}

// Returns the largest X coordinate from the data set
const xMax   = (data)  => d3.max(data, (d) => d.x);

// Returns the higest Y coordinate from the data set
const yMax   = (data)  => d3.max(data, (d) => d.y);

// Returns the largest X coordinate from the data set
const xMin   = (data)  => d3.min(data, (d) => d.x);

// Returns the higest Y coordinate from the data set
const yMin   = (data)  => d3.min(data, (d) => d.y);

// Returns a function that "scales" X coordinates from the data to fit the chart
const xScale = (props) => {
  return d3.scale.linear()
    .domain([xMin(props.data), xMax(props.data)])
    .range([props.padding, props.width - props.padding * 2]);
};

// Returns a function that "scales" Y coordinates from the data to fit the chart
const yScale = (props) => {
  return d3.scale.linear()
    .domain([yMin(props.data), yMax(props.data)])
    .range([props.height - props.padding, props.padding]);
};

const renderCircles = (props) => {
  return (coords, index) => {
    const circleProps = {
      x: props.xScale(coords.x),
      y: props.yScale(coords.y),
      key: index,
    };
    return <text {...circleProps} fontSize="9px">#{coords.name}</text>
  };
};

const DataCircles = (props) => {
  return <g>{ props.data.map(renderCircles(props)) }</g>
}

const Chart = (props) => {
  const scales = { xScale: xScale(props), yScale: yScale(props) };
  return <svg width={props.width} height={props.height}>
    <DataCircles {...props} {...scales} />
  </svg>
};

export const ChannelLand = React.createClass({
  getInitialState() {
    return {
      data: [],
    };
  },

  componentDidMount() {
    Progress.show();
    fetch('/api/channel-land', {
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
      this.setState({
        data: result.data,
      });
      Progress.hide();
    });
  },

  onDateChange(range) {

  },

  onSearch(value) {

  },

  onSort(option) {

  },

  render() {
    const data = this.state.data;
    return <div>
      <header className="site-header">
        <Link to="/">
          <h1>
            channel land
          </h1>
        </Link>
      </header>
      <main>
        <div className="row between-xs widgets">
          <div className="col-xs-6 no-padding">
            <SortDropdown onChange={this.onSort} /> <SearchBox onChange={this.onSearch} placeholder="search channel" />
          </div>
          <div className="col-xs-6 no-padding" style={{textAlign: 'right'}}>
            <DateRangePicker onChange={this.onDateChange} />
          </div>
          <Chart data={data} width={1200} height={800} padding={100} />
        </div>
      </main>
    </div>;
  }
});