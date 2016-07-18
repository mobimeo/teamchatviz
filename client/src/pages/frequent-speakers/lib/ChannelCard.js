import React from 'react';
import ReactDOM from 'react-dom';
import { AutoSizer } from 'react-virtualized';
import { Treemap } from 'react-vis';
import { Map } from 'immutable';
import NoData from 'client/components/NoData.js';
import _ from 'lodash';
import TreemapCell from './TreemapCell.js';

export default React.createClass({
  getInitialState() {
    return {
      data: Map({
        chartData: this.props.chartData,
        showTooltipFor: null,
        clientX: 0,
        clientY: 0,
        parent: null,
      })
    };
  },

  componentDidMount() {
    const parent = ReactDOM.findDOMNode(this).parentNode;
    this.setState(({data}) => ({
      data: data
        .set('parent', parent)
    }));
  },

  componentWillReceiveProps(next) {
    const chartData = next.chartData;
    this.setState(({data}) => ({
      data: data
        .set('chartData', chartData)
    }));
  },

  onMouseOver(member, e) {
    e.persist();
    this.setState(({data}) => ({
      data: data
        .set('showTooltipFor', member.user_id)
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
    return chartData.length > 0 ? <AutoSizer>
      {({ height, width }) => {
        if (height < MIN_HEIGHT) {
          height = MIN_HEIGHT;
        }
        return <div className="channel-treemap-chart" style={{ width: width + 'px' }}>
          {
            chartData.map((member, i) => {
              const borderX = width + parentx;
              let position = 'right';
              if (clientX + 350 >= borderX) {
                position = 'left';
              }
              return member.user_id === showTooltipFor
                ? <div className="treemap-tooltip" style={{
                  position: 'fixed',
                  zIndex: 100,
                  width: 250 + 'px',
                  left: position === 'right' ? clientX + 25 : clientX - 300,
                  top: clientY - 100
                }}>
                  <div className="row">
                    <div className="col-xs-4">
                      <img className="" src={member.image72} />
                    </div>
                    <div className="col-xs-8">
                      <h3>{member.name}</h3>
                      {member.count}
                    </div>
                  </div>
                </div>
                : null;
            })
          }
          <Treemap height={height - PADDING_BOTTOM}
            width={width}
            data={{ title: '', opacity: 1,
              children: chartData.map((member, i) => {
                const onMouseOver = _.bind(this.onMouseOver, this, member);
                const onMouseOut = _.bind(this.onMouseOut, this, member);
                return {
                  title: <TreemapCell
                    cntClassName="channel-tree-map"
                    item={member}
                    total={total}
                    onMouseMove={this.onMouseMove}
                    onMouseOver={onMouseOver}
                    onMouseOut={onMouseOut} />,
                  size: member.count,
                }
              })
            }} />
        </div>
      }}
    </AutoSizer> : <NoData />;
  }
})