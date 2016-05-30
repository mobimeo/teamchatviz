import React from 'react';
import { Link } from 'react-router'


const Channel = React.createClass({
  render() {
    return <div className="row start-xs">
        <div className="col-xs-6">
            <div className="box">
                <img className="img-circle" src="http://placehold.it/125x125" />
            </div>
        </div>
        <div className="col-xs-6">
            <div className="box">
                <Link to="/heartbeat">{this.props.title}</Link>
                <p>
                  {this.props.description}
                </p>
            </div>
        </div>
    </div>
  }
});

export const Main = React.createClass({
  render() {
    return <div className="page">
      <header>
        <h1>moovel slack data viz</h1>
      </header>
      <main>
        <p>
          This tool enables you to explore how your Slack team works!
          <a href="/api/auth/slack">Log in via Slack</a>
        </p>
        <div className="row around-xs">
            <div className="col-xs-4">
                <div className="box">
                    <Channel title="channel heartbeat" description="Compare multiple channel activity aggregated over hours to years" />
                </div>
            </div>
            <div className="col-xs-4">
                <div className="box">
                    <Channel title="channel heartbeat" description="Compare multiple channel activity aggregated over hours to years" />
                </div>
            </div>
            <div className="col-xs-4">
                <div className="box">
                    <Channel title="channel heartbeat" description="Compare multiple channel activity aggregated over hours to years" />
                </div>
            </div>
        </div>
        <div className="row around-xs">
            <div className="col-xs-4">
                <div className="box">
                    <Channel title="channel heartbeat" description="Compare multiple channel activity aggregated over hours to years" />
                </div>
            </div>
            <div className="col-xs-4">
                <div className="box">
                    <Channel title="channel heartbeat" description="Compare multiple channel activity aggregated over hours to years" />
                </div>
            </div>
            <div className="col-xs-4">
                <div className="box">
                    <Channel title="channel heartbeat" description="Compare multiple channel activity aggregated over hours to years" />
                </div>
            </div>
        </div>
      </main>
    </div>;
  }
});
