import React from 'react';
import { Link } from 'react-router'

export const App = React.createClass({
  render() {
    return <div className="client-app">
      <div className="container wrap content">
        {this.props.children}
      </div>
      <footer>
        <div className="container wrap content">
          <div className="row">
            <div className="col-xs-12">
                <div className="box">
                  2016 (c) Made by Moovel Lab and Moovel Dev Team
                </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  }
});
