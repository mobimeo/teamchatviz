import React from 'react';
import { Link } from 'react-router'

export const App = React.createClass({
  render() {
    return <div className={this.props.location.pathname === '/' ? 'client-app dark' : 'client-app white'}>
      <div className="container wrap content">
        <div></div>
        {this.props.children}
      </div>
      <footer>
        <div className="container wrap content">
          <div className="row">
            <div className="col-xs-12">
                <div className="box">
                  2016 (c) made by moovel lab and moovel dev. team
                </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  }
});
