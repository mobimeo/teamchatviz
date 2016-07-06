/*
  Slack Viz
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
import { Emoji } from 'client/components/Emoji.js';
import { Map, List } from 'immutable';
import moment from 'moment';

export default React.createClass({
  getInitialState() {
    return {
      data: Map({
        height: 0,
      })
    };
  },

  componentDidMount() {
    this.setState(({data}) => ({
      data: data.update('height', () => parseFloat(ReactDOM.findDOMNode(this).parentNode.offsetHeight))
    }));
  },

  componentWillReceiveProps() {
    this.setState(({data}) => ({
      data: data.update('height', () => parseFloat(ReactDOM.findDOMNode(this).parentNode.offsetHeight))
    }));
  },

  getEmojiHeight(item) {
    let height = 27.78;
    const multiply = this.getMultiplyForEmoji(item);
    if (multiply >= 2) {
      height = 27.78 + 15.99 + (multiply - 2) * 5.99;
    }
    return height;
  },

  getMultiplyForEmoji(reaction) {
    let multiply = 1;
    if (reaction.count > 1000) {
      multiply = Math.floor(reaction.count / 100);
    } else if (reaction.count > 100) {
      multiply = Math.floor(reaction.count / 30);
    } else if (reaction.count > 10) {
      multiply = Math.floor(reaction.count / 10);
    }
    return multiply;
  },

  render() {
    const item = this.props.item;
    const emojis = this.props.emojis;
    const totalHeight = this.state.data.get('height') - 200;
    if (totalHeight < 0) {
      return <div />;
    }
    const max = this.props.max;
    const approxHeight = (item.total / max.total) * totalHeight;
    let numberOfIcons = 0;
    item
      .emojis
      .reduce((acc, curr, currentIndex, all) => {
        let height = this.getEmojiHeight(curr) + 11;
        if (acc - height >= 30) {
          numberOfIcons++;
        }
        return acc - height;
      }, approxHeight - 30);

    return <div style={{
        width: '4rem',
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'flex-end'
      }}>
        <div style={{ textAlign: 'center' }} >
          { item.total }
        </div>
        <div className={'emoji-timeline-column'} style={{
            zIndex: 1,
            height: approxHeight + 'px'
          }}>
        {
          item
            .emojis
            .slice(0, numberOfIcons)
            .map((reaction, i) => {
              const multiply = this.getMultiplyForEmoji(reaction);
              return <Emoji
                multiply={multiply}
                emojis={emojis}
                style={{ display: 'block' }}
                name={reaction.name}
                count={reaction.count} />;
            })
        }
        {
          item.emojis.length > numberOfIcons && approxHeight > 60
          ? <Emoji
                multiply={1}
                emojis={emojis}
                style={{ display: 'block' }}
                name={'...'} />
          : null
        }
        </div>
        <div style={{ textAlign: 'center', zIndex: 2, backgroundColor: 'white' }} >
          { moment.utc(item.id).format('ll') }
        </div>
      </div>
  }
});


