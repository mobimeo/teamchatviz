import React from 'react';
import { Link } from 'react-router';

export const Menu = React.createClass({
  getInitialState() {
    return {};
  },
  render() {
    return <div className="menu">
      <ul>
        <li>home</li>
        <li>channel heartbeat</li>
        <li>channel land</li>
        <li>people land</li>
        <li>comments & reactions</li>
        <li>frequent speakers</li>
        <li>emoji timeline</li>
        <li>about</li>
      </ul>
    </div>;
  }
});
