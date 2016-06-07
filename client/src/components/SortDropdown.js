import React from 'react';
import { Map, List } from 'immutable';
import moment from 'moment';

export const SortDropdown = React.createClass({
  getInitialState() {
    return {
      data: Map({
        active: false,
        placeholder: 'sort by',
        options: List([
          Map({
            value: 1,
            label: 'Members (most to fewest)',
            selected: false,
            compare(a, b) {
              return b.numberOfMembers - a.numberOfMembers;
            }
          })
        ])
      }),
    };
  },

  onToggle() {
    this.setState(({data}) => ({
      data: data.update('active', (value) => !value)
    }));
  },

  onItemClick(i) {
    let option = this.state.data.get('options').get(i).toJS();
    this.props.onChange(option);
    this.setState(({data}) => ({
      data: data.update('options', options => options.map((b, index) => {
        if (index === i) {
          return b.update('selected', () => true );
        } else {
          return b.update('selected', () => false );
        }
      }))
    }));
  },

  render() {
    return <div className="sort-dropdown">
      <div className={this.state.data.get('active') ? 'select-box active' : 'select-box'} onClick={this.onToggle}>
        <span className="sort-by">{this.state.data.get('placeholder')}</span><span> (choose)</span>
        <ul className="dropdown">
          {
            this.state.data.get('options').map((o, i) => {
              var handleClick = this.onItemClick.bind(this, i);
              return <li onClick={handleClick} key={i}>{o.get('label')}</li>
            })
          }
        </ul>
      </div>
    </div>;
  }
});
