import React from 'react';
import { Link } from 'react-router'


const Channel = React.createClass({
  render() {
    return <div>
        <Link to="/heartbeat" style={{float: 'left', margin: '0 1rem 1rem 0'}}>
            <div className={this.props.imageName + ' chartImage'} style={{width: '7.813rem', height: '7.813rem'}}>
            </div>
        </Link>
        <div>
            <Link to="/heartbeat" className="chart-title">{this.props.title}</Link>
            <p className="chart-description">
                {this.props.description}
            </p>
        </div>
    </div>
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
        <p className="site-description">
          This tool enables you to explore how your Slack team works!
        </p>
        <div className="channels row around-xs">
            <div className="col-xs-4">
                <Channel imageName="chartHeartbeat" title="channel heartbeat" description="Compare multiple channel activity aggregated over hours to years" />
            </div>
            <div className="col-xs-4">
                <Channel imageName="chartPeopleLand" title="people land" description="Compare multiple channel activity aggregated over hours to years" />
            </div>
            <div className="col-xs-4">
                <Channel imageName="chartChannelLand" title="channel land" description="Compare multiple channel activity aggregated over hours to years" />
            </div>
        </div>
        <div className="channels row around-xs">
            <div className="col-xs-4">
                <Channel imageName="chartMoodReactions" title="modes & reactions" description="Compare multiple channel activity aggregated over hours to years" />
            </div>
            <div className="col-xs-4">
                <Channel imageName="chartFrequentSpeakers" title="frequent speakers" description="Compare multiple channel activity aggregated over hours to years" />
            </div>
            <div className="col-xs-4">
                <Channel imageName="chartEmojiTimeline"  title="emoji timeline" description="Compare multiple channel activity aggregated over hours to years" />
            </div>
        </div>
      </main>
      <a href="https://github.com/moovel/slack_viz"><img style={{ position: 'absolute', top: 0, right: 0, border: 0, width: '149px' }} src="/images/github-ribbon.png" alt="Fork me on GitHub" /></a>
    </div>;
  }
});
