import React from 'react';
import { Link } from 'react-router';

export default React.createClass({
  render() {
    return <div className="chart-container">
      <Link to={this.props.linkTo} className="chart-image-link">
        <div className={this.props.imageName + ' chart-image'} style={{width: '7.813rem', height: '7.813rem'}}>
        </div>
      </Link>
      <div>
        <Link to={this.props.linkTo} className="chart-title">{this.props.title}</Link>
          <p className="chart-description">
            {this.props.description}
          </p>
      </div>
    </div>;
  }
});