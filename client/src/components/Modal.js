/*
  #teamchatviz
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
import onClickOutside from 'react-onclickoutside';

export default onClickOutside(React.createClass({
  getInitialState() {
    return {
      isOpen: false,
    };
  },
  handleClickOutside(evt) {
    if (this.state.isOpen) {
      this.setState({
        isOpen: false,
      });
      this.props.closed();
    }
  },
  componentWillReceiveProps(nextProps) {
    this.setState({
      isOpen: nextProps.isOpen,
    });
  },
  render() {
    const state = this.state;
    return <div className={`dialog ${state.isOpen?'visible':''}`}>
      {this.props.children}
    </div>;
  }
}))
