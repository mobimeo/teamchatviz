import 'systemjs-hot-reloader/default-listener.js';

export function __reload(m) {
  if (m.component.state)
    component.setState(m.component.state);
}


import 'whatwg-fetch';

import React from 'react';
import ReactDOM from 'react-dom';
import { Routes } from 'client/routes.js';

import 'normalize.css!';
import 'flexboxgrid!css';
import 'client/app.css!';
import "react-progress-2/main.css!"
import 'client/app.scss!';

let container = document.getElementById('client-app');
let component = ReactDOM.render(React.createElement(Routes), container);
