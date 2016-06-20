import React from 'react';
import ReactDOM from 'react-dom';
import emoji from 'node-emoji';

export const Emoji = (props) => {
  const emojis = props.emojis || {};
  let character = emoji.get(props.name);
  if (character.startsWith(':')) {
    character = <img style={{ width: '1.25rem' }} src={emojis[props.name]} />
  }
  return <span style={props.style} className="emoji">{character}&nbsp;{props.count}</span>
}