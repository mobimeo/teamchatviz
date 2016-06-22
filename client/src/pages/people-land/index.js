import React from 'react';
import ReactDOM from 'react-dom';
import { SearchBox } from 'client/components/SearchBox.js';
import Progress from 'react-progress-2';
import { Header } from 'client/components/Header.js';
import { AutoSizer, WindowScroller, VirtualScroll } from 'react-virtualized';
import HullPlot from 'client/d3-components/HullPlot.js';
import { fetchPeopleLand } from 'client/networking/index.js';
import _ from 'lodash';
import { Map } from 'immutable';

export default React.createClass({
  getInitialState() {
    this.filters = {
      userName: '',
    }
    this.allMembers = [];
    return {
      data: Map({
        data: [],
        members: [],
        tooltipIndex: null,
      })
    };
  },

  componentDidMount() {
    fetchPeopleLand()
      .then(result => {
        this.allMembers = result.members;
        this.setState(({data}) => ({
          data: data
            .set('data', result.data)
            .set('members', result.members)
        }));
      })
  },

  onSearch(value) {
    this.setState(({data}) => ({
      data: data
        .set('members', this.allMembers.filter(member => (value === '' || member.name.toLowerCase().indexOf(value) !== -1)))
    }));
  },

  mouseOverListMember(member) {
    const members = this.state.data.get('members');
    this.setState(({data}) => ({
      data: data
        .set('tooltipIndex', member.id)
    }));
  },

  mouseOutListMember(member) {
    this.setState(({data}) => ({
      data: data
        .set('tooltipIndex', '')
    }));
  },

  render() {
    const data = this.state.data.get('data');
    const members = this.state.data.get('members');
    const tooltipIndex = this.state.data.get('tooltipIndex');
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
            <div style={{ height: 'calc(100vh - 15rem)', overflowY: 'scroll' }}>
              {
                members.map((item, index) => {
                  const onMouseOver = _.bind(this.mouseOverListMember, this, item);
                  const onMouseOut = _.bind(this.mouseOutListMember, this, item);
                  return <div key={index} onMouseOver={onMouseOver} onMouseOut={onMouseOut} className="channel-list-element">{item.name}</div>
                })
              }
            </div>
          </div>
          <div className="col-xs-9">
            <AutoSizer>
              {({ height, width }) => (
                <HullPlot showTooltipFor={tooltipIndex} data={data} width={width} height={height} padding={100} />
              )}
            </AutoSizer>
          </div>
        </div>
      </main>
    </div>;
  }
});