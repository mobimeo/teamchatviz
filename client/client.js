import React from 'react';
import ReactDOM from 'react-dom';
import { Routes } from 'client/routes.js';

let container = document.getElementById('container');
let component = ReactDOM.render(React.createElement(Routes), container);
