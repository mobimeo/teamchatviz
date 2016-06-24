import React from 'react';
import ReactDOM from 'react-dom';
import emoji from 'node-emoji';

export const Emoji = (props) => {
  const emojis = props.emojis || {};
  const multiply = props.multiply || 1;
  let character = emoji.get(props.name);
  if (character.startsWith(':')) {
    character = emojis[props.name];
    if (character) {
      character = <img src={character} />
    } else {
      character = '...';
    }
  }
  return <div style={props.style} className="emoji">
    <div className="emoji-container">
      {
        multiply < 2 ? <div className="emoji-character"> {character} </div> :
          <div className="emoji-stack">
            {
              Array.from({
                length: multiply
              }).map(i => {
                return <div className="emoji-character">
                  {character}
                </div>;
              })
            }
          </div>
      }
      <span className="emoji-count">
        {props.count}
      </span>
    </div>
  </div>;
}