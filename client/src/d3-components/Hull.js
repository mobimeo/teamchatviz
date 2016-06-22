import React from 'react';
import d3 from 'd3';

export default React.createClass({
  render() {
    const data = d3.geom.hull(this.props.points);
    let attr = '';
    if (data.length > 0) {
      attr = `M ${data[0][0]} ${data[0][1]} ${data.slice(0, data.length).map(d => 'L ' + d[0] + ' ' + d[1]).join(' ')} Z`;
    }
    return <path className="hull" d={attr} stroke="#fcf2f7">
    </path>
  }
});