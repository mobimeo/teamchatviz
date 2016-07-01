/*
  Slack Viz
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
import { Link, withRouter } from 'react-router'
import { fetchUser } from 'client/networking/index.js';
import Channel from './lib/Channel.js';
import config from 'client/config.js';

export default withRouter(React.createClass({
  getInitialState() {
    return {
      loggedIn: false,
      loading: false,
    }
  },

  componentDidMount() {
    this.props.router.setRouteLeaveHook(this.props.route, this.routerWillLeave);
    fetchUser().then(result => {
      this.setState(result);
    });
  },

  routerWillLeave(nextLocation) {
    const isPublic = this.props.config.public;
    if (isPublic) {
      return true;
    }

    if (this.state.loggedIn === false) {
      window.location = `/api/auth/slack?returnURL=${encodeURIComponent(nextLocation.pathname)}`;
      return false;
    }
  },

  render() {
    const isPublic = this.props.config.public;
    return <div className="page">
      <header className="site-header">
        <h1>
          moovel slack data viz <img src="/images/beta.png" />
        </h1>
      </header>
      <main>
        <div className="row site-description">
          <div className="col-xs-10">
            <h2>learn and explore your team´s slack jungle</h2>
            <p>This tool enables you to explore how your Slack team works!</p>
          </div>
          {
            isPublic
              ? <div className="col-xs-2"></div>
              : <div className="col-xs-2">
                  <a href="/api/auth/slack-admin">
                    <img alt="Add to Slack" height="40" width="139"
                      src="https://platform.slack-edge.com/img/add_to_slack.png"
                      srcset="https://platform.slack-edge.com/img/add_to_slack.png 1x, https://platform.slack-edge.com/img/add_to_slack@2x.png 2x" />
                  </a>
                </div>
          }
        </div>
        <div className="channels row around-xs">
          <div className="col-xs-4">
              <Channel linkTo="/channel-heartbeat"
                imageName="chartHeartbeat"
                title="channel heartbeat"
                description="Compare multiple channel activity aggregated over hours to years" />
          </div>
          <div className="col-xs-4">
            <Channel linkTo="/people-land"
              imageName="chartPeopleLand"
              title="people land"
              description="Learn how connections between people are strengthened through similar channel and communication interests." />
          </div>
          <div className="col-xs-4">
            <Channel linkTo="/channel-land"
              imageName="chartChannelLand"
              title="channel land"
              description="Explore your channel land arranged by similarity to find additional interesting channels" />
          </div>
        </div>
        <div className="channels row around-xs">
          <div className="col-xs-4">
            <Channel linkTo="/messages-and-reactions"
              imageName="chartMoodReactions"
              title="messages and reactions"
              description="Explore what messages were most influential during the last days, weeks and months rated by comments and reactions." />
          </div>
          <div className="col-xs-4">
            <Channel linkTo="/frequent-speakers"
              imageName="chartFrequentSpeakers"
              title="frequent speakers"
              description="Learn who populates which channels summed up over time and find out communication hubs. " />
          </div>
          <div className="col-xs-4">
            <Channel linkTo="/emoji-timeline"
              imageName="chartEmojiTimeline"
              title="emoji timeline" description="See the top ten of the most used icons and have an overview of the emoji’s use over time." />
          </div>
        </div>
      </main>
      <a href="https://github.com/moovel/slackviz"><img className="github-ribbon" src="/images/github-ribbon.png" alt="Fork me on GitHub" /></a>
    </div>;
  }
}));
