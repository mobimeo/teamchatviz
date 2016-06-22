import React from 'react';
import ReactDOM from 'react-dom';
import { SearchBox } from 'client/components/SearchBox.js';
import Progress from 'react-progress-2';
import { Header } from 'client/components/Header.js';
import { AutoSizer, WindowScroller, VirtualScroll } from 'react-virtualized';
import HullPlot from 'client/d3-components/HullPlot.js';

function parseJSON(response) {
  return response.json()
}

export default React.createClass({
  getInitialState() {
    return {
      data: [],
      members: [],
    };
  },

  componentDidMount() {
    Progress.show();
    fetch('/api/people-land', {
      credentials: 'same-origin'
    })
    .then(response => {
      if (!response.ok) {
        if (response.status == 403) {
          window.location = '/api/auth/slack';
        }
        throw Error(response.statusText);
      }
      return response;
    })
    .then(parseJSON)
    .then(result => {
      this.setState({
        data: result.data,
        members: result.members,
      });
      Progress.hide();
    });
  },

  onDateChange(range) {

  },

  onSearch(value) {

  },

  onSort(option) {

  },

  render() {
    const data = this.state.data;
    const members = this.state.members;
    return <div>
      <Header title="people land" />
      <main>
        <div className="row between-xs widgets">
          <div className="col-xs-6 no-padding">
            <SearchBox onChange={this.onSearch} placeholder="search members" />
          </div>
          <div className="col-xs-6 no-padding" style={{textAlign: 'right'}}>
          </div>
        </div>
        <div className="row">
          <div className="col-xs-3">
            {
              members.map((item, index) => {
                return <div key={index}><button className="channel-list-element">{item.name}</button></div>
              })
            }
          </div>
          <div className="col-xs-9">
            <AutoSizer>
              {({ height, width }) => (
                <HullPlot data={data} width={width} height={600} padding={100} />
              )}
            </AutoSizer>
          </div>
        </div>
      </main>
    </div>;
  }
});