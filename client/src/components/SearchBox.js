import React from 'react';
import { Map } from 'immutable';
import moment from 'moment';

export const SearchBox = React.createClass({
  getInitialState() {
    return {
      data: Map({
        query: this.props.value || '',
      }),
    };
  },

  handleChange(event) {
    var value = event.target.value;
    this.setState(({data}) => ({
      data: data.update('query', () => value)
    }));
    this.props.onChange(value);
  },

  render() {
    return <div className="search-box">
      <input
        type="text"
        placeholder={this.props.placeholder}
        value={this.state.query}
        onChange={this.handleChange} />
    </div>;
  }
});
