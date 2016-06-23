import React from 'react';
import ReactDOM from 'react-dom';
import emoji from 'node-emoji';

export const Emoji = (props) => {
  const emojis = props.emojis || {};
  let character = emoji.get(props.name);
  if (character.startsWith(':')) {
    character = <img src={emojis[props.name]} />
  }
  return <div style={props.style} className="emoji">
    <div className="emoji-container">
      <span className="emoji-character">
        {character}
      </span>
      <span className="emoji-count">
        {props.count}
      </span>
    </div>
  </div>;
}