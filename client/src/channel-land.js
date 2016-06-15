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

const Circle = (props) => {
  return (coords, index) => {
    const circleProps = {
      cx: props.xScale(coords.x),
      cy: props.yScale(coords.y),
      r: 5,
      key: index,
      fill: coords.color,
      'data-name': coords.name,
      stroke: 'black',
      strokeWidth: '3',
    };
    return <circle style={{cursor: 'pointer'}} {...circleProps} onMouseOver={props.showToolTip} onMouseOut={props.hideToolTip} />;
  };
};

const DataCircles = (props) => {
  return <g>{ props.data.map(Circle(props)) }</g>
}

const ToolTip = React.createClass({
  propTypes: {
    tooltip: React.PropTypes.object,
  },
  render() {
    if (this.props.tooltip.display ===  true) {
      const { x, y } = this.props.tooltip;
      const textStyle = {
        fontSize: 24,
        fontWeight: 'bold',
      };
      return <text fill="black" style={textStyle} x={parseFloat(x)+5} y={y}>#{this.props.tooltip.name}</text>;
    } else {
      return <text />;
    }
  }
});

const Chart = React.createClass({
  getInitialState() {
    return {
      tooltip: {
        display: false,
        name: '',
        x: 0,
        y: 0,
      },
    };
  },
  showToolTip(e) {
    this.setState({
      tooltip: {
        display: true,
        name: e.target.getAttribute('data-name'),
        x: e.target.getAttribute('cx'),
        y: e.target.getAttribute('cy'),
      }
    });
  },
  hideToolTip(e) {
    this.setState({
      tooltip: {
        display:false,
        name: '',
        x: 0,
        y: 0,
      }
    });
  },
  render() {
    const props = this.props;
    const scales = { xScale: xScale(props), yScale: yScale(props) };
    return <svg width={props.width} height={props.height}>
      <DataCircles {...props} {...scales} showToolTip={this.showToolTip} hideToolTip={this.hideToolTip} />
      <ToolTip tooltip={this.state.tooltip} />
    </svg>
  }
});

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
          <Chart data={data} width={1200} height={600} padding={100} />
        </div>
      </main>
    </div>;
  }
});