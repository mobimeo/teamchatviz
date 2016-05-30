import React from 'react';
import { Link } from 'react-router'

export const App = React.createClass({
  render() {
    return <div className="container wrap">
      {this.props.children}
    </div>;
  }
});
