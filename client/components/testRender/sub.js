import React, { Component } from "react";

class Sub extends React.Component {
  constructor(props) {
    super(props);
  }
  render() {
    console.log('rerender=>');
    return <div>{this.props.info}</div>;
  }
}

export default Sub;
