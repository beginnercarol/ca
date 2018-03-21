import React from "react";
import autoBind from 'react-autobind';
import Sub from "./sub";
const styles = {
  fontFamily: "sans-serif",
  textAlign: "center"
};


class App extends React.Component {
  constructor(props) {
    super(props);
    autoBind(this);
    this.source = 0;
    this.state = {
      data: null
    };
  }

  handleProps(){
      this.source+=5;
      console.log('source=>',this.source);
  }
  handleRerender(){
      this.setState({});
  }
  
  render() {
    return (
      <div>
        <Sub info={this.source} />
        <button onClick={this.handleProps}>click</button>
        <button onClick={this.handleRerender}>clickToRerender</button>
      </div>
      );
  }
}

export default App;