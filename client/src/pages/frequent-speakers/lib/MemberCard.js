import React from 'react';
import ReactDOM from 'react-dom';
import { AutoSizer } from 'react-virtualized';
import { Treemap } from 'react-vis';
import { Map } from 'immutable';
import { fetchUserStats } from 'client/networking/index.js';
import NoData from 'client/components/NoData.js';
import _ from 'lodash';
import TreemapCell from './TreemapCell.js';

export default React.createClass({
  getInitialState() {
    return {
      data: Map({
        chartData: [],
        showTooltipFor: null,
        clientX: 0,
        clientY: 0,
        parent: null,
      })
    };
  },
  componentDidMount() {
    const member = this.props.member;
    const filters = this.props.filters;
    const parent = ReactDOM.findDOMNode(this).parentNode;
    fetchUserStats(member.user_id, filters)
      .then(results => {
        this.setState(({data}) => ({
          data: data
            .set('chartData', results)
            .set('parent', parent)
        }));
      })
  },

  componentWillReceiveProps(next) {
    const member = next.member;
    const filters = next.filters;
    fetchUserStats(member.user_id, filters)
      .then(results => {
        this.setState(({data}) => ({
          data: data
            .set('chartData', results)
        }));
      })
  },

  onMouseOver(channel, e) {
    e.persist();
    this.setState(({data}) => ({
      data: data
        .set('showTooltipFor', channel.name)
        .set('clientX', e.clientX)
        .set('clientY', e.clientY)
    }));
  },

  onMouseMove(e) {
    e.persist();
    this.setState(({data}) => ({
      data: data
        .set('clientX', e.clientX)
        .set('clientY', e.clientY)
    }));
  },

  onMouseOut() {
    this.setState(({data}) => ({
      data: data
        .set('showTooltipFor', null)
    }));
  },

  render() {
    const MIN_HEIGHT = 700;
    const PADDING_BOTTOM = 125;
    const chartData = this.state.data.get('chartData');
    const showTooltipFor = this.state.data.get('showTooltipFor');
    const clientX = this.state.data.get('clientX');
    const clientY = this.state.data.get('clientY');
    let parent = this.state.data.get('parent');
    let parentx = 0, parenty = 0;
    if (parent && parent.offsetParent) {
      do {
        parentx += parent.offsetLeft;
        parenty += parent.offsetTop;
      } while (parent = parent.offsetParent);
    }
    const total = chartData.reduce((acc, curr) => {
      return acc + curr.count;
    }, 0);
    return chartData.length > 0 ? <AutoSizer>
      {({ height, width }) => {
        if (height < MIN_HEIGHT) {
          height = MIN_HEIGHT;
        }
        return <div className="user-treemap-chart" style={{ width: width + 'px' }}>
          {
            chartData.map((channel, i) => {
              const borderX = width + parentx;
              let position = 'right';
              if (clientX + 350 >= borderX) {
                position = 'left';
              }
              return channel.name === showTooltipFor
                ? <div className="treemap-tooltip" style={{
                  position: 'fixed',
                  zIndex: 100,
                  width: 200 + 'px',
                  textAlign: 'center',
                  left: position === 'right' ? clientX + 25 : clientX - 200,
                  top: clientY - 75
                }}>#{channel.name} ({channel.count})</div>
                : null;
            })
          }
          <Treemap height={height - PADDING_BOTTOM}
            width={width}
            data={{ title: '', opacity: 1,
              children: chartData.map((channel, i) => {
                const onMouseOver = _.bind(this.onMouseOver, this, channel);
                const onMouseOut = _.bind(this.onMouseOut, this, channel);
                return {
                  title: <TreemapCell
                    cntClassName="user-tree-map"
                    item={channel}
                    total={total}
                    onMouseMove={this.onMouseMove}
                    onMouseOver={onMouseOver}
                    onMouseOut={onMouseOut} />,
                  size: channel.count,
                }
              })
            }} />
        </div>
      }}
    </AutoSizer> : <NoData />;
  }
})