import React from 'react';
import ReactDOM from 'react-dom';
import { SearchBox } from 'client/components/SearchBox.js';
import Progress from 'react-progress-2';
import { Header } from 'client/components/Header.js';
import { AutoSizer, WindowScroller, VirtualScroll } from 'react-virtualized';
import HullPlot from 'client/d3-components/HullPlot.js';
import { fetchChannelLand } from 'client/networking/index.js';
import _ from 'lodash';
import { Map } from 'immutable';
import ChannelPoint from 'client/d3-components/ChannelPoint.js';

export default React.createClass({
  getInitialState() {
    this.filters = {};
    this.allChannels = [];
    return {
      data: Map({
        data: [],
        channels: [],
        tooltipIndex: null,
      })
    };
  },

  componentDidMount() {
    fetchChannelLand()
      .then(result => {
        this.allChannels = result.channels;
        this.setState(({data}) => ({
          data: data
            .set('data', result.data)
            .set('channels', result.channels)
        }));
      })
  },

  onSearch(value) {
    this.setState(({data}) => ({
      data: data
        .set('channels', this.allChannels.filter(channel => (value === '' || channel.name.toLowerCase().indexOf(value) !== -1)))
    }));
  },

  mouseOverListMember(channel) {
    const channels = this.state.data.get('channels');
    this.setState(({data}) => ({
      data: data
        .set('tooltipIndex', channel.id)
    }));
  },

  mouseOutListMember(channel) {
    this.setState(({data}) => ({
      data: data
        .set('tooltipIndex', '')
    }));
  },

  render() {
    const data = this.state.data.get('data');
    const channels = this.state.data.get('channels');
    const tooltipIndex = this.state.data.get('tooltipIndex');
    return <div>
      <Header title="channel land" />
      <main>
        <div className="row between-xs widgets">
          <div className="col-xs-6 no-padding">
            <SearchBox onChange={this.onSearch} placeholder="search channels" />
          </div>
          <div className="col-xs-6 no-padding" style={{textAlign: 'right'}}>
          </div>
        </div>
        <div className="row">
          <div className="col-xs-3">
            <div style={{ height: 'calc(100vh - 15rem)', overflowY: 'scroll' }}>
              {
                channels.map((item, index) => {
                  const onMouseOver = _.bind(this.mouseOverListMember, this, item);
                  const onMouseOut = _.bind(this.mouseOutListMember, this, item);
                  return <div key={index} onMouseOver={onMouseOver} onMouseOut={onMouseOut} className="channel-list-element">#{item.name}</div>
                })
              }
            </div>
          </div>
          <div className="col-xs-9">
            <AutoSizer>
              {({ height, width }) => (
                <HullPlot point={ChannelPoint} showTooltipFor={tooltipIndex} data={data} width={width} height={height} padding={100} />
              )}
            </AutoSizer>
          </div>
        </div>
      </main>
    </div>;
  }
});