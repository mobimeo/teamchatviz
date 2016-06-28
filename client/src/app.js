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
import { Link } from 'react-router';
import Progress from 'react-progress-2';
import { fetchConfig } from './networking/index.js';
import config from './config.js';

export const App = React.createClass({
  getInitialState() {
    return config;
  },
  componentDidMount() {
    fetchConfig()
      .then(cfg => {
        config.public = cfg.public;
        this.setState(config);
      });
  },
  render() {
    return (<div className={this.props.location.pathname === '/' ? 'client-app dark' : 'client-app white'}>
      <div className="container wrap content">
        <Progress.Component/>
        { React.cloneElement(this.props.children, { config: config }) }
      </div>
      <footer>
        <div className="container wrap content">
          <div className="row">
            <div className="col-xs-12">
                <div className="box">
                  2016 &copy; made by&nbsp;
                  <a href="http://lab.moovel.com/" target="_blank">moovel lab</a>&nbsp;
                  and <a href="https://developers.moovel.com/" target="_blank">moovel dev team</a>
                </div>
            </div>
          </div>
        </div>
      </footer>
    </div>)
  }
});
