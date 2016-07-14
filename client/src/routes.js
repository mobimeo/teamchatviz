/*
  #teamchatviz
  Copyright (C) 2016 Moovel Group GmbH, Haupstaetter str. 149, 70188, Stuttgart, Germany hallo@moovel.com

  This library is free software; you can redistribute it and/or
  modify it under the terms of the GNU Lesser General Public
  License as published by the Free Software Foundation; either
  version 2.1 of the License, or (at your option) any later version.

  This library is distributed in the hope that it will be useful,
  but WITHOUT ANY WARRANTY; without even the implied warranty of
  MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the GNU
  Lesser General Public License for more details.

  You should have received a copy of the GNU Lesser General Public
  License along with this library; if not, write to the Free Software
  Foundation, Inc., 51 Franklin Street, Fifth Floor, Boston, MA  02110-1301
  USA
*/

import React from 'react';
import { App } from 'client/app.js';
import HeartbeatPage from 'client/pages/heartbeat/index.js';
import PeopleLandPage from 'client/pages/people-land/index.js';
import ChannelLandPage from 'client/pages/channel-land/index.js';
import MessagesAndReactionsPage from 'client/pages/messages-and-reactions/index.js';
import FrequentSpeakersPage from 'client/pages/frequent-speakers/index.js';
import EmojiTimelinePage from 'client/pages/emoji-timeline/index.js';
import ErrorPage from 'client/pages/error/index.js';
import MainPage from 'client/pages/main/index.js';
import { Router, Route, Link, hashHistory, browserHistory } from 'react-router';

export default React.createClass({
  render() {
    return (<Router history={browserHistory}>
      <Route component={App}>
        <Route path="/" component={MainPage} />
        <Route path="/channel-heartbeat" component={HeartbeatPage} />
        <Route path="/people-land" component={PeopleLandPage} />
        <Route path="/channel-land" component={ChannelLandPage} />
        <Route path="/messages-and-reactions" component={MessagesAndReactionsPage} />
        <Route path="/frequent-speakers" component={FrequentSpeakersPage} />
        <Route path="/emoji-timeline" component={EmojiTimelinePage} />
        <Route path="/error" component={ErrorPage} />
      </Route>
    </Router>);
  }
});
