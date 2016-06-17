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
import ReactDom from 'react-dom';
import { Header } from './components/Header.js';

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

const Hull = React.createClass({
  render() {
    const data = d3.geom.hull(this.props.points);
    let attr = '';
    if (data.length > 0) {
      attr = `M ${data[0][0]} ${data[0][1]} ${data.slice(0, data.length).map(d => 'L ' + d[0] + ' ' + d[1]).join(' ')} Z`;
    }
    return <path className="hull" d={attr} stroke={this.props.color}>
    </path>
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

  componentDidMount: function() {
    var el = ReactDom.findDOMNode(this);
    var selection = d3.select(el).select('g');
    var zoom = d3.behavior.zoom()
      .scaleExtent([1, 10])
      .on("zoom", this.onZoom);
    selection.call(zoom);
  },

  onZoom() {
    var el = ReactDom.findDOMNode(this);
    var selection = d3.select(el).select('g');
    selection.attr("transform", "translate(" + d3.event.translate + ")scale(" + d3.event.scale + ")")
  },

  render() {
    const props = this.props;
    const scales = { xScale: xScale(props), yScale: yScale(props) };
    const points = props.data.slice(0, 10);
    const groups = _.groupBy(props.data, 'group');
    const hulls = Object.keys(groups).map(key => {
      const points = groups[key].map(p => [scales.xScale(p.x), scales.yScale(p.y)]);
      return <Hull points={points} color={groups[key].color} />
    });

    return <svg width={props.width} height={props.height}>
      <g>
        {
          hulls
        }
        <DataCircles {...props} {...scales} showToolTip={this.showToolTip} hideToolTip={this.hideToolTip} />
        <ToolTip tooltip={this.state.tooltip} />
      </g>
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
      <Header title="channel land" />
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