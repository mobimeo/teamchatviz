import React from 'react';
import { App } from 'client/app.js';
import HeartbeatPage from 'client/pages/heartbeat/index.js';
import PeopleLandPage from 'client/pages/people-land/index.js';
import ChannelLandPage from 'client/pages/channel-land/index.js';
import MoodsAndReactionsPage from 'client/pages/moods-and-reactions/index.js';
import FrequentSpeakersPage from 'client/pages/frequent-speakers/index.js';
import EmojiTimelinePage from 'client/pages/emoji-timeline/index.js';
import MainPage from 'client/pages/main/index.js';
import { Router, Route, Link, hashHistory, browserHistory } from 'react-router';

export default React.createClass({
  render() {
    return <Router history={browserHistory}>
      <Route component={App}>
        <Route path="/" component={MainPage} />
        <Route path="/heartbeat" component={HeartbeatPage} />
        <Route path="/people-land" component={PeopleLandPage} />
        <Route path="/channel-land" component={ChannelLandPage} />
        <Route path="/moods-and-reactions" component={MoodsAndReactionsPage} />
        <Route path="/frequent-speakers" component={FrequentSpeakersPage} />
        <Route path="/emoji-timeline" component={EmojiTimelinePage} />
      </Route>
    </Router>;
  }
});
