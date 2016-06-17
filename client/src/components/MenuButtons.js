import React from 'react';
import { Link } from 'react-router';
import { Menu } from './menu';

export const MenuButtons = React.createClass({
  getInitialState() {
    return {
      menuOpened: false,
    };
  },
  toggleMenu(){
    this.setState({
      menuOpened: true,
    });
  },
  render() {
    return <div className="menu-buttons" style={{ display: 'inline-block' }}>
      <Link to="/"><img className="nav-buttons" src="/images/navbuttons-16.png" alt="home" /></Link>
      <a><img className="nav-buttons" src="/images/navbuttons-17.png" alt="info" /></a>
      <a onClick={this.toggleMenu} > <img className="nav-buttons" src="/images/navbuttons-18.png" alt="menu" /> </a>
      { this.state.menuOpened ? <Menu /> : null }
    </div>;
  }
});
