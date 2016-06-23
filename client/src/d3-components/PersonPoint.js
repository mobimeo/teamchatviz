import React from 'react';
import moment from 'moment';

export default (props) => {
  return (coords, index) => {
    const circleProps = {
      x: props.xScale(coords.x) - 9 / props.zoom,
      y: props.yScale(coords.y) - 9 / props.zoom,
      cx: props.xScale(coords.x),
      cy: props.yScale(coords.y),
      key: index,
      'data-name': coords.name,
      width: (18 / props.zoom) + 'px',
      height: (18 / props.zoom) + 'px',
    };
    return <g>
      <defs>
        <clipPath id={'circlePath' + index}>
          <circle cx={circleProps.x + 9 / props.zoom} cy={circleProps.y + 9 / props.zoom} r={ 9 / props.zoom } />
        </clipPath>
      </defs>
      <image
        clipPath={'url(#circlePath' + index + ')'}
        xlinkHref={coords.image24}
        style={{cursor: 'pointer'}}
        {...circleProps}
        onMouseOver={props.showTooltip}
        onMouseOut={props.hideTooltip} />
    </g>;
  };
};