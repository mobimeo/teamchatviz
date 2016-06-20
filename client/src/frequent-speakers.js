import React from 'react';
import ReactDOM from 'react-dom';
import moment from 'moment';
import { DateRangePicker } from './components/DateRangePicker.js';
import { SearchBox } from './components/SearchBox.js';
import { SortDropdown } from './components/SortDropdown.js';
import Progress from 'react-progress-2';
import { Map } from 'immutable';
import { Link } from 'react-router';
import _ from 'lodash';
import { Header } from './components/Header.js';
import { Treemap } from 'react-vis';
import { AutoSizer } from 'react-virtualized';
import 'react-vis/main.css!';
import { fetchFrequentSpeakers } from './networking/index.js';

function parseJSON(response) {
  return response.json()
}

export const FrequentSpeakers = React.createClass({
  getInitialState() {
    return {
      data: {
        channels: [],
        data: [],
        allChannels: true,
      },
    };
  },

  componentDidMount() {
    fetchFrequentSpeakers()
      .then(result => {
        this.setState({
          data: result,
        });
      })
  },

  onDateChange(range) {

  },

  onSearch(value) {

  },

  onSort(option) {

  },

  onChannelClick(channel) {
    fetchFrequentSpeakers(null, null, channel.id)
      .then(result => {
        this.setState({
          data: result,
        });
      })
  },

  partial(fn, ...params) {
    return _.bind(fn, this, ...params);
  },

  render() {
    const data = this.state.data;
    return <div>
      <Header title="frequent speakers" />
      <main>
        <div className="row between-xs widgets">
          <div className="col-xs-6 no-padding">
            <SortDropdown onChange={this.onSort} /> <SearchBox onChange={this.onSearch} placeholder="search channel" />
          </div>
          <div className="col-xs-6 no-padding" style={{textAlign: 'right'}}>
            <DateRangePicker onChange={this.onDateChange} />
          </div>
        </div>
        <div className="row" style={{ paddingRight: '20px' }}>
          <div className="col-xs-3">
            <div><button className="channel-list-element">All channels</button></div>
            <hr />
            {
              data.channels.map((d, i) => {
                return <div onClick={this.partial(this.onChannelClick, d)} key={i}><button className="channel-list-element">#{d.name}</button></div>;
              })
            }
          </div>
          <div className="col-xs-9">
            <p>
              This page shows the most keen slack writers within specific channels. It also shows the amount of messages within the user's most used five channels.
            </p>
            {
              data.allChannels ? _.chunk(data.data, 4).map((chunk, index) => {
                return <div className="row" key={index}>
                    {
                      chunk.map((member, memberIndex) => {
                        return <div className="col-xs-3 member" key={memberIndex} style={{ textAlign: 'center' }}>
                          <span className="member-index">{member.count}</span>
                          <br />
                          <img className="member-img" src={member.image72} style={{ borderRadius: '50%' }} />
                          <br />
                          {member.realname}
                          <br />
                          @{member.name}
                        </div>
                      })
                    }
                  </div>
              }) : <AutoSizer>
                    {({ height, width }) => (
                      <Treemap height={600} width={width} data={{ title: '', opacity: 1,
                                  children: data.data.slice(0, 10).map((member, i) => ({
                                    title: <div>@{member.name} <br /> {member.count} </div>,
                                    size: member.count,
                                  }))
                                }} />
                    )}
                </AutoSizer>
              }
          </div>
        </div>
      </main>
    </div>;
  }
});