import React from 'react';

export default (props) => {
  return <g>
    {
      props.data.map(props.point(props))
    }
  </g>;
};