import 'whatwg-fetch';

import React from 'react';
import ReactDOM from 'react-dom';
import { Routes } from 'client/routes.js';

import 'normalize.css!css';
import 'flexboxgrid!css';
import 'client/app.css!';
import "react-progress-2/main.css!"

let container = document.getElementById('client-app');
let component = ReactDOM.render(React.createElement(Routes), container);
