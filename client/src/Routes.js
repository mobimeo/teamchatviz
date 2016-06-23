import React from 'react';
import { App } from 'client/app.js';
import HeartbeatPage from 'client/pages/heartbeat/index.js';
import PeopleLandPage from 'client/pages/people-land/index.js';
import ChannelLandPage from 'client/pages/channel-land/index.js';
import { FrequentSpeakers } from 'client/frequent-speakers.js';
import { EmojiTimeline } from 'client/emoji-timeline.js';
import { MoodsAndReactions } from 'client/moods-and-reactions.js';
import { Main } from 'client/main.js';
import { Router, Route, Link, hashHistory, browserHistory } from 'react-router';

export default React.createClass({
  render() {
    return <Router history={browserHistory}>
      <Route component={App}>
        <Route path="/" component={Main} />
        <Route path="/heartbeat" component={HeartbeatPage} />
        <Route path="/frequent-speakers" component={FrequentSpeakers} />
        <Route path="/emoji-timeline" component={EmojiTimeline} />
        <Route path="/moods-and-reactions" component={MoodsAndReactions} />
        <Route path="/channel-land" component={ChannelLandPage} />
        <Route path="/people-land" component={PeopleLandPage} />
      </Route>
    </Router>;
  }
});
