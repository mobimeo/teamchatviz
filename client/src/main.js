import React from 'react';
import { Link } from 'react-router'


const Channel = React.createClass({
  render() {
    return <div>
        <img className="img-circle" src={this.props.image} style={{width: '125px', float: 'left', margin: '0 1rem 1rem 0'}} />
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
                <div className="box">
                    <Channel image="/images/channels/01_hearbeat.png" title="channel heartbeat" description="Compare multiple channel activity aggregated over hours to years" />
                </div>
            </div>
            <div className="col-xs-4">
                <div className="box">
                    <Channel image="/images/channels/02_people_land.png" title="people land" description="Compare multiple channel activity aggregated over hours to years" />
                </div>
            </div>
            <div className="col-xs-4">
                <div className="box">
                    <Channel image="/images/channels/03_channel_land.png" title="channel land" description="Compare multiple channel activity aggregated over hours to years" />
                </div>
            </div>
        </div>
        <div className="channels row around-xs">
            <div className="col-xs-4">
                <div className="box">
                    <Channel image="/images/channels/04_moods_and_reactions.png" title="modes & reactions" description="Compare multiple channel activity aggregated over hours to years" />
                </div>
            </div>
            <div className="col-xs-4">
                <div className="box">
                    <Channel image="/images/channels/05_frequent_speakers.png" title="frequent speakers" description="Compare multiple channel activity aggregated over hours to years" />
                </div>
            </div>
            <div className="col-xs-4">
                <div className="box">
                    <Channel image="/images/channels/06_emoji_timeline.png"  title="emoji timeline" description="Compare multiple channel activity aggregated over hours to years" />
                </div>
            </div>
        </div>
      </main>
    </div>;
  }
});
