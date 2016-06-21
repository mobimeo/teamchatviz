import React from 'react';
import { Link } from 'react-router';
import { Menu } from './menu';
import Modal from 'react-modal';

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
  toggleInfo(){
    this.setState({
      menuOpened: false,
      infoOpened: true,
    });
  },
  closeModal: function() {
    this.setState({
      menuOpened: false,
      infoOpened: false,
    });
  },
  render() {
    const customStyles = {
      overlay: {
        position          : 'fixed',
        top               : 0,
        left              : 0,
        right             : 0,
        bottom            : 0,
        backgroundColor   : 'rgba(255, 255, 255, 0.75)'
      },
      content: {
        position                   : 'absolute',
        top                        : '200px',
        left                       : '200px',
        right                      : '200px',
        bottom                     : '200px',
        border                     : '1px solid #ccc',
        background                 : '#fff',
        overflow                   : 'auto',
        WebkitOverflowScrolling    : 'touch',
        borderRadius               : '4px',
        outline                    : 'none',
        padding                    : '20px'
      }
    };
    return <div className="menu-buttons" style={{ display: 'inline-block' }}>
      <Link to="/"><img className="nav-buttons" src="/images/navbuttons-16.png" alt="home" /></Link>
      <a onClick={this.toggleInfo}><img className="nav-buttons" src="/images/navbuttons-17.png" alt="info" /></a>
      <a onClick={this.toggleMenu} > <img className="nav-buttons" src="/images/navbuttons-18.png" alt="menu" /> </a>
      { this.state.menuOpened ? <Menu /> : null }
      <Modal isOpen={this.state.infoOpened} style={customStyles} onRequestClose={this.closeModal} >
        <h2>Info</h2>
        <button onClick={this.closeModal}>close</button>
        <p>Info content.</p>
      </Modal>
    </div>;
  }
});
