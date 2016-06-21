import React from 'react';
import { App } from 'client/app.js';
import HertbeatPage from 'client/pages/heartbeat/index.js';
import { FrequentSpeakers } from 'client/frequent-speakers.js';
import { EmojiTimeline } from 'client/emoji-timeline.js';
import { MoodsAndReactions } from 'client/moods-and-reactions.js';
import { ChannelLand } from 'client/channel-land.js';
import { PeopleLand } from 'client/people-land.js';
import { Main } from 'client/main.js';
import { Router, Route, Link, hashHistory, browserHistory } from 'react-router';

export default React.createClass({
  render() {
    return <Router history={browserHistory}>
      <Route component={App}>
        <Route path="/" component={Main} />
        <Route path="/heartbeat" component={HertbeatPage} />
        <Route path="/frequent-speakers" component={FrequentSpeakers} />
        <Route path="/emoji-timeline" component={EmojiTimeline} />
        <Route path="/moods-and-reactions" component={MoodsAndReactions} />
        <Route path="/channel-land" component={ChannelLand} />
        <Route path="/people-land" component={PeopleLand} />
      </Route>
    </Router>;
  }
});
