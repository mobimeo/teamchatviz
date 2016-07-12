/*
  #viz4slack
  Copyright (C) 2016 Moovel Group GmbH, Haupstaetter str. 149, 70188, Stuttgart, Germany hallo@moovel.com

  This library is free software; you can redistribute it and/or
  modify it under the terms of the GNU Lesser General Public
  License as published by the Free Software Foundation; either
  version 2.1 of the License, or (at your option) any later version.

  This library is distributed in the hope that it will be useful,
  but WITHOUT ANY WARRANTY; without even the implied warranty of
  MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the GNU
  Lesser General Public License for more details.

  You should have received a copy of the GNU Lesser General Public
  License along with this library; if not, write to the Free Software
  Foundation, Inc., 51 Franklin Street, Fifth Floor, Boston, MA  02110-1301
  USA
*/

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
        multiply < 2
        ? <div className="emoji-character">{character}</div>
        :
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
      { character == '...' ? '' :
      <span className="emoji-count">
        {props.count}
      </span>
    }
    </div>
  </div>;
}