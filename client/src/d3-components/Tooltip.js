import React from 'react';

export default React.createClass({
  propTypes: {
    tooltip: React.PropTypes.object,
  },
  render() {
    if (this.props.tooltip.display ===  true) {
      let { x, y } = this.props.tooltip;
      const zoom = this.props.zoom;
      const textStyle = {
        fontSize: 15 / zoom,
        fontWeight: 'bold',
      };
      var width = 150 / zoom;
      var height = 70 / zoom;
      var transformText = `translate(${width/2}, ${height/2 - 5/zoom})`;
      var transformArrow = '';
      var transform;
      if (y > height) {
        transform = `translate(${x-width/2}, ${y-height-20/zoom})`;
        transformArrow = `translate(${width/2 - 20 / zoom}, ${height - 2/zoom})`;
      } else if (y < height) {
        transform = `translate(${x - width /2}, ${Math.round(y) + 20/zoom})`;
        transformArrow = `translate(${width/2-20/zoom},0) rotate(${180 / zoom},${20 / zoom},0)`;
      }

      const pointsArrow = `${10 / zoom},0  ${30 / zoom},0  ${20 / zoom},${10 / zoom}`;

      return <g transform={transform}>
        <rect class="shadow" is width={width} height={height} fill="#393b42"/>
        <polygon class="shadow" is points={pointsArrow} transform={transformArrow} fill="#393b42" />
        <text is transform={transformText}>
          <tspan is x="0" text-anchor="middle" font-size={textStyle.fontSize} fill="#ffffff">{this.props.tooltip.name}</tspan>
        </text>
      </g>;
    } else {
      return <text />;
    }
  }
});