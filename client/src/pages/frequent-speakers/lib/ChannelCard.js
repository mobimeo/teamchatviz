import React from 'react';
import ReactDOM from 'react-dom';
import { AutoSizer } from 'react-virtualized';
import { Treemap } from 'react-vis';
import { Map } from 'immutable';
import NoData from 'client/components/NoData.js';
import _ from 'lodash';

export default React.createClass({
  getInitialState() {
    return {
      data: Map({
        chartData: this.props.chartData,
        showTooltipFor: null,
      })
    };
  },

  componentWillReceiveProps(next) {
    const chartData = next.chartData;
    this.setState(({data}) => ({
      data: data
        .set('chartData', chartData)
    }));
  },

  onMouseOver(member) {
    this.setState(({data}) => ({
      data: data
        .set('showTooltipFor', member.user_id)
    }));
  },

  onMouseOut(member) {
    this.setState(({data}) => ({
      data: data
        .set('showTooltipFor', null)
    }));
  },

  render() {
    const MIN_HEIGHT = 700;
    const PADDING_BOTTOM = 75;
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
        return <div className="channel-treemap-chart" style={{ width: width + 'px' }}>
          <div className="treemap-status-container" style={{ width: width + 'px' }}>
            {
              chartData.map((member, i) => {
                return member.user_id === showTooltipFor
                  ? <span className="treemap-status">@{member.name} ({member.count})</span>
                  : null;
              })
            }
          </div>
          <Treemap height={height - PADDING_BOTTOM}
            width={width}
            data={{ title: '', opacity: 1,
              children: chartData.map((member, i) => {
                const onMouseOver = _.bind(this.onMouseOver, this, member);
                const onMouseOut = _.bind(this.onMouseOut, this, member);
                return {
                  title: <div style={{
                      width: '100%',
                      height: '100%'
                    }}
                    onMouseOver={onMouseOver}
                    onMouseOut={onMouseOut}
                    className={'channel-tree-map bg'
                        + member.count%10
                        + ((member.count / total < 0.01) ? ' xs' : '')}>
                      <div className="channel-tree-map-count"> {member.count} </div>
                    </div>,
                  size: member.count,
                }
              })
            }} />
        </div>
      }}
    </AutoSizer> : <NoData />;
  }
})