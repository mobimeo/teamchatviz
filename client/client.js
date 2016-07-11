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

import 'systemjs-hot-reloader/default-listener.js';

export function __reload(m) {
  if (m.component.state && typeof component.setState === 'function') {
    component.setState(m.component.state);
  }
}

import React from 'react';
import ReactDOM from 'react-dom';
import routes from 'client/routes.js';

import 'normalize.css!';
import 'flexboxgrid!css';
import 'react-progress-2/main.css!';
import 'client/app.scss!';
import 'src/burger.scss!';

let container = document.getElementById('client-app');
let component = ReactDOM.render(React.createElement(routes), container);
