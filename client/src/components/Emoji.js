import React from 'react';
import ReactDOM from 'react-dom';
import emoji from 'node-emoji';

export const Emoji = (props) => {
  return <span style={props.style} className="emoji">{emoji.get(props.name.split('::')[0])}&nbsp;{props.count}</span>
}