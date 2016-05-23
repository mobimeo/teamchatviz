import React from 'react';
import { App } from 'client/app.js';
import { Heartbeat } from 'client/heartbeat.js';
import { Router, Route, Link, hashHistory } from 'react-router';

export const Routes = React.createClass({
  render() {
    return <Router history={hashHistory}>
      <Route path="/" component={App}>
        <Route path="heartbeat" component={Heartbeat} />
      </Route>
    </Router>;
  }
});
