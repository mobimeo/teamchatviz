import React from 'react';
import { Link } from 'react-router'

export const App = React.createClass({
  render() {
    return <div>
      <h1>Slack Viz</h1>
      <a href="/api/auth/slack">Log in </a>
      <br />
      <Link to={`/heartbeat`}>Heartbeat</Link>
      {this.props.children}
    </div>;
  }
});
