import React from 'react';
import HeartbeatPlot from './HeartbeatPlot.js';

const ChannelChart = React.createClass({
  render() {
    const showChunkHints = this.props.showChunkHints;
    return <div className="row middle-xs" style={{ paddingRight: '20px' }}>
      <div className="col-xs-2">
        <span>#{this.props.data.name}</span>
      </div>
      <div className="col-xs-10">
        <HeartbeatPlot data={this.props.data} showChunkHints={showChunkHints} chunks={this.props.chunks} key={this.props.parentKey} parentKey={this.props.parentKey}/>
      </div>
    </div>
  }
});

export default ChannelChart;