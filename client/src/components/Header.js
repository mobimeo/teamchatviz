import React from 'react';
import ReactDOM from 'react-dom';
import { Link } from 'react-router';
import { MenuButtons } from './MenuButtons';

export const Header = (props) => {
  return <header className="site-header">
    <div className="row">
      <div className="col-xs-10">
        <Link to="/">
          <h1>
            {props.title}
          </h1>
        </Link>
      </div>
      <div className="col-xs-2">
        <MenuButtons />
      </div>
    </div>
  </header>
}