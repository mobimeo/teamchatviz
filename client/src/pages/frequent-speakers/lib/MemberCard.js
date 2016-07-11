import React from 'react';
import ReactDOM from 'react-dom';
import { AutoSizer } from 'react-virtualized';
import { Treemap } from 'react-vis';
import { Map } from 'immutable';
import { fetchUserStats } from 'client/networking/index.js';
import NoData from 'client/components/NoData.js';

export default React.createClass({
  getInitialState() {
    return {
      data: Map({
        chartData: [],
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
  render() {
    const chartData = this.state.data.get('chartData');
    return chartData.length > 0 ? <AutoSizer>
      {({ height, width }) => (
        <div className="user-treemap-chart">
          <Treemap height={height - 200}
            width={width}
            data={{ title: '', opacity: 1,
              children: chartData.slice(0, 10).map((channel, i) => ({
                title: <div className="user-tree-map">
                  <span className="user-tree-map-title">@{channel.name}</span>
                  <br />
                  <span className="user-tree-map-count"> {channel.count} </span>
                </div>,
                size: channel.count,
              })) }} />
        </div>
      )}
    </AutoSizer> : <NoData />;
  }
})