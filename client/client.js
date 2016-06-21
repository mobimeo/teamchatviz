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
import "react-progress-2/main.css!"
import 'client/app.scss!';

let container = document.getElementById('client-app');
let component = ReactDOM.render(React.createElement(routes), container);
