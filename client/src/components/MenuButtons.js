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
import { Link } from 'react-router';
// import { Menu } from './Menu.js';

export const MenuButtons = React.createClass({
  getInitialState() {
    return {
      menuOpened: false,
      infoOpened: false,
    };
  },
  toggleMenu(){
    this.setState({
      menuOpened: !this.state.menuOpened,
      infoOpened: false,
    });
  },
  render() {
    return <div className="menu-buttons" style={{ display: 'inline-block' }}>
      <Link to="/"><img className="nav-buttons" src="/images/home.png" alt="home" /></Link>
      <button onClick={this.toggleMenu} className={'hamburger' + ((this.state.menuOpened) ? ' is-active' : '')} type="button">
        <span className="hamburger-box">
          <span className="hamburger-inner"></span>
        </span>
      </button>
      <div className = { this.state.menuOpened ? 'menu actv' : 'menu' } >
        <ul>
          <Link to="/"><li>home</li></Link>
          <Link to="/heartbeat"><li>channel heartbeat</li></Link>
          <Link to="/channel-land"><li>channel land</li></Link>
          <Link to="/people-land"><li>people land</li></Link>
          <Link to="/messages-and-reactions"><li>messages & reactions</li></Link>
          <Link to="/frequent-speakers"><li>frequent speakers</li></Link>
          <Link to="/heartbeat"><li>emoji timeline</li></Link>
          <Link to="/about"><li>about</li></Link>
        </ul>
      </div>
      <div className = { this.state.menuOpened ? 'overlay actv' : 'overlay' } onClick={this.toggleMenu}></div>
    </div>;
  }
})
