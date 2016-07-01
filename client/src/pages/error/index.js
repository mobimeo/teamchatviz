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

export default React.createClass({
  render() {
    return <div className="page">
      <header className="site-header">
        <h1>
          error page :-(
        </h1>
      </header>
      <main>
        <div className="row site-description">
          <div className="col-xs-12">
            <h2>An error occurred</h2>
            <p><Link to="/">Go to Home page</Link></p>
          </div>
        </div>
      </main>
      <a href="https://github.com/moovel/slackviz"><img className="github-ribbon" src="/images/github-ribbon.png" alt="Fork me on GitHub" /></a>
    </div>;
  }
});
