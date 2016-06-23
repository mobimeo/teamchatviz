import React from 'react';
import { Link } from 'react-router';
import { Menu } from './menu';

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
      <Link to="/"><img className="nav-buttons" src="/images/navbuttons-16.png" alt="home" /></Link>
      <a onClick={this.toggleMenu} > <img className="nav-buttons" src="/images/navbuttons-18.png" alt="menu" /> </a>
      { this.state.menuOpened ? <Menu /> : null }
    </div>;
  }
})
