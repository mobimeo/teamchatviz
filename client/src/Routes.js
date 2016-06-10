import React from 'react';
import { App } from 'client/app.js';
import { Heartbeat } from 'client/heartbeat.js';
import { FrequentSpeakers } from 'client/frequent-speakers.js';
import { EmojiTimeline } from 'client/emoji-timeline.js';
import { Main } from 'client/main.js';
import { Router, Route, Link, hashHistory } from 'react-router';

export const Routes = React.createClass({
  render() {
    return <Router history={hashHistory}>
      <Route component={App}>
        <Route path="/" component={Main} />
        <Route path="/heartbeat" component={Heartbeat} />
        <Route path="/frequent-speakers" component={FrequentSpeakers} />
        <Route path="/emoji-timeline" component={EmojiTimeline} />
      </Route>
    </Router>;
  }
});
