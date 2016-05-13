import React from 'react';
import ReactDOM from 'react-dom';
import { Page } from 'client/page.js';

let container = document.getElementById('container');
let component = ReactDOM.render(React.createElement(Page), container);