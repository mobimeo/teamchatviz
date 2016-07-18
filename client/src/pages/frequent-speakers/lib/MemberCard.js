import React from 'react';
import ReactDOM from 'react-dom';
import { AutoSizer } from 'react-virtualized';
import { Treemap } from 'react-vis';
import { Map } from 'immutable';
import { fetchUserStats } from 'client/networking/index.js';
import NoData from 'client/components/NoData.js';
import _ from 'lodash';

const MIN_HEIGHT = 700;

const TreemapCell = React.createClass({
  getInitialState() {
    return {
      width: 0,
    };
  },
  componentDidMount() {
    const parent = ReactDOM.findDOMNode(this).parentNode.parentNode;
    this.setState({
      width: parent.style.width,
      height: parent.style.height
    });
  },
  componentWillReceiveProps() {
    const parent = ReactDOM.findDOMNode(this).parentNode.parentNode;
    this.setState({
      width: parent.style.width,
      height: parent.style.height
    });
  },
  render() {
    const width = this.state.width;
    const height = this.state.height;
    const item = this.props.item;
    const onMouseOver = this.props.onMouseOver;
    const onMouseOut = this.props.onMouseOut;
    const total = this.props.total;
    let sizeClass = '';
    if (parseInt(width) < 40 || parseInt(height) < 40) {
      sizeClass += ' xs';
    }
    if (parseInt(width) < 16 || parseInt(height) < 16) {
      sizeClass += ' xxs';
    }
    return <div
      style={{ width, height }}
      className={'user-tree-map bg'
        + item.count % 10
        + sizeClass}
      onMouseOver={onMouseOver}
      onMouseOut={onMouseOut} >
      <span className="user-tree-map-count">{item.count}</span>
    </div>
  }
});

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
    const MIN_HEIGHT = 700;
    const PADDING_BOTTOM = 200;
    const chartData = this.state.data.get('chartData');
    const showTooltipFor = this.state.data.get('showTooltipFor');
    const total = chartData.reduce((acc, curr) => {
      return acc + curr.count;
    }, 0);
    return chartData.length > 0 ? <AutoSizer>
      {({ height, width }) => {
        if (height < MIN_HEIGHT) {
          height = MIN_HEIGHT;
        }
        return <div className="user-treemap-chart" style={{ width: width + 'px' }}>
          <div className="treemap-status-container" style={{ width: width + 'px' }}>
            {
              chartData.map((channel, i) => {
                return channel.name === showTooltipFor
                  ? <span className="treemap-status">@{channel.name} ({channel.count})</span>
                  : null;
              })
            }
          </div>
          <Treemap height={height - PADDING_BOTTOM}
            width={width}
            data={{ title: '', opacity: 1,
              children: chartData.map((channel, i) => {
                const onMouseOver = _.bind(this.onMouseOver, this, channel);
                const onMouseOut = _.bind(this.onMouseOut, this, channel);
                return {
                  title: <TreemapCell
                    item={channel}
                    total={total}
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