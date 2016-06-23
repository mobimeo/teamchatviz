import React from 'react';
import moment from 'moment';

export default (props) => {
  return (coords, index) => {
    const circleProps = {
      x: props.xScale(coords.x),
      y: props.yScale(coords.y),
      cx: props.xScale(coords.x),
      cy: props.yScale(coords.y),
      r: 5 / props.zoom,
      key: index,
      fill: coords.color,
      'data-name': coords.name,
    };
    return <circle style={{cursor: 'pointer'}} {...circleProps}
      onMouseOver={props.showTooltip}
      onMouseOut={props.hideTooltip} />;
  };
};