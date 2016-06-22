import React from 'react';
import moment from 'moment';
import d3 from 'd3';

// Returns the largest X coordinate from the data set
const xMax   = (data)  => d3.max(data, (d) => d.x);

// Returns the higest Y coordinate from the data set
const yMax   = (data)  => d3.max(data, (d) => d.y);

// Returns the largest X coordinate from the data set
const xMin   = (data)  => d3.min(data, (d) => d.x);

// Returns the higest Y coordinate from the data set
const yMin   = (data)  => d3.min(data, (d) => d.y);

// Returns a function that "scales" X coordinates from the data to fit the chart
export const xScale = (props) => {
  return d3.scale.linear()
    .domain([xMin(props.data), xMax(props.data)])
    .range([props.padding, props.width - props.padding * 2]);
};

// Returns a function that "scales" Y coordinates from the data to fit the chart
export const yScale = (props) => {
  return d3.scale.linear()
    .domain([yMin(props.data), yMax(props.data)])
    .range([props.height - props.padding, props.padding]);
};

