import React from 'react';
import ReactDOM from 'react-dom';

const TreemapCell = React.createClass({
  getInitialState() {
    return {
      width: 0,
      height: 0,
    };
  },

  componentDidMount() {
    const parent = ReactDOM.findDOMNode(this).parentNode.parentNode;
    this.setState({
      width: parent.style.width,
      height: parent.style.height
    });
  },

  componentWillReceiveProps() {
    const parent = ReactDOM.findDOMNode(this).parentNode.parentNode;
    this.setState({
      width: parent.style.width,
      height: parent.style.height
    });
  },

  render() {
    const width = this.state.width;
    const height = this.state.height;
    const item = this.props.item;
    const onMouseOver = this.props.onMouseOver;
    const onMouseOut = this.props.onMouseOut;
    const onMouseMove = this.props.onMouseMove;
    const total = this.props.total;
    const cntClassName = this.props.cntClassName;
    let sizeClass = '';
    if (parseInt(width) < 40 || parseInt(height) < 40) {
      sizeClass = ' xs';
    }
    if (parseInt(width) < 16 || parseInt(height) < 16) {
      sizeClass = ' xxs';
    }
    return <div
      style={{ width, height }}
      className={cntClassName
        + ' bg'
        + item.count % 10
        + sizeClass}
      onMouseOver={onMouseOver}
      onMouseOut={onMouseOut}
      onMouseMove={onMouseMove} >
      <span className={`${cntClassName}-count`}>{item.count}</span>
    </div>
  }
});

export default TreemapCell;