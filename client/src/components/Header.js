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
import { Link } from 'react-router';
import { MenuButtons } from './MenuButtons';

export const Header = (props) => {
  return <header className="site-header">
    <div className="row">
      <div className="col-xs-9">
        <Link to="/">
          <img className="back" src="../images/back.png" />
        </Link>
        <Link to="/">
          <h1>
            {props.title}
          </h1>
        </Link>
      </div>
      <div className="col-xs-3">
        <MenuButtons />
      </div>
    </div>
  </header>;
}