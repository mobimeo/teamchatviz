import React from 'react';

export default React.createClass({
  propTypes: {
    tooltip: React.PropTypes.object,
  },
  render() {
    if (this.props.tooltip.display ===  true) {
      let { x, y } = this.props.tooltip;
      const textStyle = {
        fontSize: 24 / this.props.zoom,
        fontWeight: 'bold',
      };
      var width = 150;
      var height = 70;
      var transformText='translate('+width/2+','+(height/2-5)+')';
      var transformArrow="";
      var transform;
      if (y > height) {
        transform='translate(' + (x-width/2) + ',' + (y-height-20) + ')';
        transformArrow='translate('+(width/2-20)+','+(height-2)+')';
      } else if (y<height) {
        transform='translate(' + (x-width/2) + ',' + (Math.round(y)+20) + ')';
        transformArrow='translate('+(width/2-20)+','+0+') rotate(180,20,0)';
      }

      return <g transform={transform}>
        <rect class="shadow" is width={width} height={height} fill="#393b42"/>
        <polygon class="shadow" is points="10,0  30,0  20,10" transform={transformArrow}
                   fill="#393b42" opacity=".9" />
        <text is transform={transformText}>
          <tspan is x="0" text-anchor="middle" font-size="15px" fill="#ffffff">{this.props.tooltip.name}</tspan>
        </text>
      </g>;
    } else {
      return <text />;
    }
  }
});