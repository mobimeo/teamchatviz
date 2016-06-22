import React from 'react';

export default React.createClass({
  propTypes: {
    tooltip: React.PropTypes.object,
  },
  render() {
    if (this.props.tooltip.display ===  true) {
      const { x, y } = this.props.tooltip;
      const textStyle = {
        fontSize: 24 / this.props.zoom,
        fontWeight: 'bold',
      };
      return <text fill="black" style={textStyle} x={parseFloat(x)+5} y={y}>{this.props.tooltip.name}</text>;
    } else {
      return <text />;
    }
  }
});