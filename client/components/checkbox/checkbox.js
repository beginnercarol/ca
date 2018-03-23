import React from "react";

import autoBind from "react-autobind";
import topActions from "../../actions/top-action";
const driverOptions = ["cccc", "dddd", "ffff"];
const plainoptions = [1, 2, 3];
const uncheckedList = [0, 0, 0];
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
//全选与取消的 checkbox
class Checkbox extends React.Component {
  constructor(props) {
    super(props);
    autoBind(this);
    this.state = {
      indeteminate: false,
      checkAll: false,
      checkList: uncheckedList
    };
    this.input = null;
  }
  componentDidMount() {
  }
  handleGroupChange(event, index) {
    const { actions } = this.props;
    actions.indicateTimeout("hhhh");
    let val = event.target.checked ? event.target.value : 0;
    this.setState(
      prevState => {
        prevState.checkList[index] = Number(val);
        return {
          checkList: prevState.checkList
        };
      },
      () => {
        console.log("checklist=>", this.state.checkList);
        this.setState(prevState => ({
          checkAll: prevState.checkList.indexOf(0) < 0
        }));
      }
    );
  }
  handleChange(e) {
    let sta = e.target.checked;
    this.setState(prevState => ({
      checkAll: sta,
      checkList: sta ? plainoptions : []
    }));
  }
  async handleClick(event){
    this.input.focus();
    await this.getInput();
    //this.timerId && clearInterval(this.timerId);
    console.log("this.input.value=>",this.input.value);
  }
  getInput(){
    return new Promise((resolve,reject)=>{
      this.timerId = setInterval(()=>{
        if(this.input.value!=""){
          console.log(typeof this.input.value);
          resolve(this.input.value);
        }
      },5000);
    })
  }
  render() {
    let checkgroup = [];
    for (let i = 0; i < driverOptions.length; i++) {
      checkgroup.push(
        <label>
          <input
            type="checkbox"
            onClick={e => {
              this.handleGroupChange(e, i);
            }}
            checked={!!this.state.checkList[i]}
            value={i + 1}
          />
          {plainoptions[i]}
        </label>
      );
    }
    return (
      <div className="form-checkbox">
        <div>show the signal {this.props.signalTimeout}</div>
        <input type="button" value="Click" onClick={this.handleClick}/>
        <input type="text" ref={(input)=>{this.input = input}}/>
        <label>
          <input
            type="checkbox"
            onClick={this.handleChange}
            checked={this.state.checkAll}
          />不限
        </label>
        {checkgroup}
        
      </div>
    );
  }
}

const stateToProps = state => {
  const { topReducer, todo } = state;
  return {
    topReducer,
    todo
  };
};

function actionDispatcher(dispatch) {
  return {
    actions: bindActionCreators(Object.assign({}, topActions), dispatch)
  };
}

export default connect(stateToProps, actionDispatcher)(Checkbox);
