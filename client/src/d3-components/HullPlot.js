/*
  Slack Viz
  Copyright (C) 2016 Moovel Group GmbH, Haupstaetter str. 149, 70188, Stuttgart, Germany hallo@moovel.com

  This library is free software; you can redistribute it and/or
  modify it under the terms of the GNU Lesser General Public
  License as published by the Free Software Foundation; either
  version 2.1 of the License, or (at your option) any later version.

  This library is distributed in the hope that it will be useful,
  but WITHOUT ANY WARRANTY; without even the implied warranty of
  MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the GNU
  Lesser General Public License for more details.

  You should have received a copy of the GNU Lesser General Public
  License along with this library; if not, write to the Free Software
  Foundation, Inc., 51 Franklin Street, Fifth Floor, Boston, MA  02110-1301
  USA
*/

import React from 'react';
import moment from 'moment';
import d3 from 'd3';
import { xScale, yScale } from 'client/d3-components/Scales.js';
import { Map } from 'immutable';
import _ from 'lodash';
import PointGroup from 'client/d3-components/PointGroup.js';
import ReactDOM from 'react-dom';
import Hull from 'client/d3-components/Hull.js';
import Tooltip from 'client/d3-components/Tooltip.js';

export default React.createClass({
  propTypes: {
    showTooltipFor: React.PropTypes.string,
    shownGroups: React.PropTypes.array,
  },
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
    this.updateZoom = _.throttle((zoom) => {
      this.setState(({data}) => ({
        data: data.update('zoom', () => zoom)
      }));
    }, 200);
    var el = ReactDOM.findDOMNode(this);
    var selection = d3.select(el).select('g');
    var zoom = d3.behavior.zoom()
      .scaleExtent([1, 10])
      .on('zoom', this.onZoom);
    selection.call(zoom);
    this.z = zoom;
    ReactDOM.findDOMNode(this.refs.svg).focus();
  },

  onZoom() {
    if (d3.event
      && d3.event.sourceEvent) {
      d3.event.sourceEvent.preventDefault()
    }
    var z = this.z;
    var zoom = z.scale();
    this.updateZoom(zoom);
    var el = ReactDOM.findDOMNode(this);
    var selection = d3.select(el).select('g');
    selection.attr('transform', 'translate(' + z.translate() + ')scale(' + z.scale() + ')')
  },

  incrementZoom() {
    var newZoom = this.state.data.get('zoom') + 1;
    if (newZoom > 10) {
      newZoom = 10;
    }
    this.z.scale(newZoom);
    this.z.translate([ - this.props.width / 2 * (newZoom - 1), - this.props.height / 2 * (newZoom - 1)]);
    this.onZoom();
    this.onZoom();
  },

  decrementZoom() {
    var newZoom = this.state.data.get('zoom') - 1;
    if (newZoom < 1) {
      newZoom = 1;
    }
    this.z.translate([ - this.props.width / 2 * (newZoom - 1), - this.props.height / 2 * (newZoom - 1)]);
    this.z.scale(newZoom);
    this.onZoom();
  },

  resetZoom() {
    this.z.scale(1);
    this.z.translate([0, 0]);
    this.onZoom();
  },

  onPointClick(...args) {
    this.props.onPointClick(...args);
  },

  render() {
    const props = this.props;
    const showTooltipFor = this.props.showTooltipFor;
    const shownGroups = this.props.shownGroups;
    let tooltip = this.state.data.get('tooltip');
    const scales = { xScale: xScale(props), yScale: yScale(props) };
    if (showTooltipFor && tooltip.display === false) {
      const member = props.data.find(item => item.id == showTooltipFor);
      if (member) {
        tooltip = {
          display: true,
          name: member.name,
          x: scales.xScale(member.x),
          y: scales.yScale(member.y),
        };
      } else {
        tooltip = {
          display: false,
          name: '',
          x: 0,
          y: 0,
        };
      }
    }

    const groupData = _.groupBy(props.data, 'group');
    const groups = Object.keys(groupData)
      .filter((group, id) => {
        if (shownGroups.length === 0) {
          return true;
        }
        return shownGroups.indexOf(id+1) !== -1;
      })
      .map(key => {
        const points = groupData[key].map(p => [scales.xScale(p.x), scales.yScale(p.y)]);
        return {
          points,
          groupName: key,
          color: groupData[key][0].color,
        }
      });
    const hulls = groups.map(gr => {
      return <Hull points={gr.points} color={gr.color} />
    });

    const shownGroupNames = groups.map(gr => gr.groupName);

    const points = shownGroups.length === 0
      ? props.data
      : props.data.filter(p => shownGroupNames.indexOf(p.group) !== -1);

    points.sort((a, b) => {
      const ca = +a.highlighted + +(a.permanent_highlight || false);
      const cb = +b.highlighted + +(b.permanent_highlight || false);
      return ca - cb;
    });

    return <div className="cluster-plot" style={{ width: props.width, height: props.height }}>
      <svg ref="svg" width={props.width - 2} height={props.height - 2}>
        <g>
          <path fill="transparent" d={`M0 0 H ${props.width - 2} V ${props.height - 2} H 0 L 0 0`}> </path>
          {
            hulls
          }
          <PointGroup
            zoom={this.state.data.get('zoom')}
            {...props}
            {...scales}
            data={points}
            point={this.props.point}
            showTooltip={this.showTooltip}
            hideTooltip={this.hideTooltip}
            onPointClick={this.onPointClick}
             />
            }
          <Tooltip zoom={this.state.data.get('zoom')} tooltip={tooltip} />
        </g>
      </svg>
      <div className="zoom-controls">
        <button onClick={this.resetZoom}><img src='/images/zoom-reset.svg' /></button>
        <button onClick={this.incrementZoom}>+</button>
        <button onClick={this.decrementZoom}>-</button>
      </div>
    </div>
  }
});