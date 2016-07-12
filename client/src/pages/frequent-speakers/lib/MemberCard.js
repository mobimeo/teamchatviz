import React from 'react';
import ReactDOM from 'react-dom';
import { AutoSizer } from 'react-virtualized';
import { Treemap } from 'react-vis';
import { Map } from 'immutable';
import { fetchUserStats } from 'client/networking/index.js';
import NoData from 'client/components/NoData.js';
import _ from 'lodash';

export default React.createClass({
  getInitialState() {
    return {
      data: Map({
        chartData: [],
        showTooltipFor: null,
      })
    };
  },
  componentDidMount() {
    const member = this.props.member;
    const filters = this.props.filters;
    fetchUserStats(member.user_id, filters)
      .then(results => {
        this.setState(({data}) => ({
          data: data
            .set('chartData', results)
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
  onMouseOver(channel) {
    this.setState(({data}) => ({
      data: data
        .set('showTooltipFor', channel.name)
    }));
  },
  onMouseOut() {
    this.setState(({data}) => ({
      data: data
        .set('showTooltipFor', null)
    }));
  },
  render() {
    const chartData = this.state.data.get('chartData');
    const showTooltipFor = this.state.data.get('showTooltipFor');
    return chartData.length > 0 ? <AutoSizer>
      {({ height, width }) => (
        <div className="user-treemap-chart" style={{ width: width + 'px' }}>
          <div className="treemap-status-container" style={{ width: width + 'px' }}>
            {
              chartData.map((channel, i) => {
                return channel.name === showTooltipFor
                  ? <span className="treemap-status">@{channel.name} ({channel.count})</span>
                  : null;
              })
            }
          </div>
          <Treemap height={height - 200}
            width={width}
            data={{ title: '', opacity: 1,
              children: chartData.map((channel, i) => {
                const onMouseOver = _.bind(this.onMouseOver, this, channel);
                const onMouseOut = _.bind(this.onMouseOut, this, channel);
                return {
                  title: <div style={{ width: '100%', height: '100%' }} className="user-tree-map" onMouseOver={onMouseOver} onMouseOut={onMouseOut} >
                    <span className="user-tree-map-count"> {channel.count} </span>
                  </div>,
                  size: channel.count,
                }
              })
            }} />
        </div>
      )}
    </AutoSizer> : <NoData />;
  }
})