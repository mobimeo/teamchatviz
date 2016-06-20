import React from 'react';
import { Link } from 'react-router'


const Channel = React.createClass({
  render() {
    return <div className="chart-container">
      <Link to={this.props.linkTo} className="chart-image-link">
        <div className={this.props.imageName + ' chart-image'} style={{width: '7.813rem', height: '7.813rem'}}>
        </div>
      </Link>
      <div>
        <Link to={this.props.linkTo} className="chart-title">{this.props.title}</Link>
          <p className="chart-description">
            {this.props.description}
          </p>
      </div>
    </div>;
  }
});

export const Main = React.createClass({
  render() {
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
          <div className="col-xs-2">
            <a href="/api/auth/slack-admin"><img alt="Add to Slack" height="40" width="139" src="https://platform.slack-edge.com/img/add_to_slack.png" srcset="https://platform.slack-edge.com/img/add_to_slack.png 1x, https://platform.slack-edge.com/img/add_to_slack@2x.png 2x" /></a>
          </div>
        </div>
        <div className="channels row around-xs">
          <div className="col-xs-4">
              <Channel linkTo="/heartbeat" imageName="chartHeartbeat" title="channel heartbeat" description="Compare multiple channel activity aggregated over hours to years" />
          </div>
          <div className="col-xs-4">
            <Channel linkTo="/people-land" imageName="chartPeopleLand" title="people land" description="Learn how connections between people are strengthened through similar channel and communication interests." />
          </div>
          <div className="col-xs-4">
            <Channel linkTo="/channel-land" imageName="chartChannelLand" title="channel land" description="Explore your channel land arranged by similarity to find additional interesting channels" />
          </div>
        </div>
        <div className="channels row around-xs">
          <div className="col-xs-4">
            <Channel linkTo="/moods-and-reactions" imageName="chartMoodReactions" title="messages and reactions" description="Explore what messages were most influential during the last days, weeks and months rated by comments and reactions." />
          </div>
          <div className="col-xs-4">
            <Channel linkTo="/frequent-speakers" imageName="chartFrequentSpeakers" title="frequent speakers" description="Learn who populates which channels summed up over time and find out communication hubs. " />
          </div>
          <div className="col-xs-4">
            <Channel linkTo="/emoji-timeline" imageName="chartEmojiTimeline"  title="emoji timeline" description="See the top ten of the most used icons and have an overview of the emoji’s use over time." />
          </div>
        </div>
      </main>
      <a href="https://github.com/moovel/slack_viz"><img className="github-ribbon" src="/images/github-ribbon.png" alt="Fork me on GitHub" /></a>
    </div>;
  }
});
