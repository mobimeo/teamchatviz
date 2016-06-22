import React from 'react';
import moment from 'moment';
import d3 from 'd3';
import { xScale, yScale } from 'client/d3-components/Scales.js';
import { Map } from 'immutable';
import _ from 'lodash';

const Circle = (props) => {
  return (coords, index) => {
    const circleProps = {
      x: props.xScale(coords.x) - 12 / props.zoom,
      y: props.yScale(coords.y) - 12 / props.zoom,
      cx: props.xScale(coords.x) - 12 / props.zoom,
      cy: props.yScale(coords.y) - 12 / props.zoom,
      key: index,
      'data-name': coords.name,
      width: (24 / props.zoom) + 'px',
      height: (24 / props.zoom) + 'px',
    };
    return <g>
      <defs>
        <clipPath id={'circlePath' + index}>
          <circle cx={circleProps.x + 12 / props.zoom} cy={circleProps.y + 12 / props.zoom} r={ 12 / props.zoom } />
        </clipPath>
      </defs>
      <image
        clipPath={'url(#circlePath' + index + ')'}
        xlinkHref={coords.image24}
        style={{cursor: 'pointer'}}
        {...circleProps}
        onMouseOver={props.showTooltip}
        onMouseOut={props.hideTooltip} />
    </g>;
  };
};

const DataCircles = (props) => {
  return <g>
    {
      props.data.map(Circle(props))
    }
  </g>;
}

import ReactDOM from 'react-dom';
import Hull from 'client/d3-components/Hull.js';
import Tooltip from 'client/d3-components/Tooltip.js';

export default React.createClass({
  getInitialState() {
    return {
      data: Map({
        tooltip: {
          display: false,
          name: '',
          x: 0,
          y: 0,
        },
        zoom: 1,
      })
    };
  },
  showTooltip(e) {
    var tooltip = {
      display: true,
      name: e.target.getAttribute('data-name'),
      x: e.target.getAttribute('cx'),
      y: e.target.getAttribute('cy'),
    };
    this.setState(({data}) => ({
      data: data.update('tooltip', () => tooltip)
    }));
  },

  hideTooltip(e) {
    this.setState(({data}) => ({
      data: data.update('tooltip', () => ({
        display:false,
        name: '',
        x: 0,
        y: 0,
      }))
    }));
  },

  componentDidMount: function() {
    this.updateZoom = _.debounce((zoom) => {
      this.setState(({data}) => ({
        data: data.update('zoom', () => zoom)
      }));
    }, 300);
    var el = ReactDOM.findDOMNode(this);
    var selection = d3.select(el).select('g');
    var zoom = d3.behavior.zoom()
      .scaleExtent([1, 10])
      .on("zoom", this.onZoom);
    selection.call(zoom);
  },

  onZoom() {
    var el = ReactDOM.findDOMNode(this);
    var selection = d3.select(el).select('g');
    var zoom = d3.event.scale;
    this.updateZoom(zoom);
    selection.attr("transform", "translate(" + d3.event.translate + ")scale(" + zoom + ")")
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
        <DataCircles zoom={this.state.data.get('zoom')} {...props} {...scales} showTooltip={this.showTooltip} hideTooltip={this.hideTooltip} />
        <Tooltip zoom={this.state.data.get('zoom')} tooltip={this.state.data.get('tooltip')} />
      </g>
    </svg>
  }
});