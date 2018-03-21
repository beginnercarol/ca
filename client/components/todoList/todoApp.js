import "./index.scss";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import React, { Component } from "react";
import todoActions from '../../actions/todo';
import autoBind from "react-autobind";
import AddTodo from "./addTodo";
import TodoList from './todoList';
import Footer from "./footer";

const Filter = {
  SHOW_ALL:'SHOW_ALL',
  SHOW_ACTIVE:'SHOW_ACTIVE',
  SHOW_COMPLETED:'SHOW_COMPLETED',
}

class TodoAPP extends Component {
  constructor(props) {
    super(props);
    autoBind(this);
    this.state = {
      filter:Filter['SHOW_ALL'],
      listArray: [{
        text:'new year',
        completed:false,
      }],
    };
  }
  handleFilter(filter){
    let {todo,actions} = this.props;
    this.setState({
      filter:filter,
    },()=>{
      console.log("handleFilter=>",this.state.filter);
      //每当 filter 的状态被修改就发送一个
      //actions.handleFilter(filter);
    });
  }
  handleTodoList(text) {
    let {actions}=this.props;
    //添加新的 todo 项
    let content = {
        text: text,//event.target.value,
        completed: false
    };
    this.setState(prevState => {
        let arr = prevState.listArray;
        arr.unshift(content);
        return {
            listArray: arr
        };
    },()=>{
        //每次添加后就发送一个新的 list
        actions.getList(this.state.listArray);
    });
  }
  hanleItemStateChange(index){
    let listArray = this.state.listArray;
    listArray[index].completed=!listArray[index].completed;
    this.setState({
      listArray:listArray,
    },()=>{
      console.log("State List=>",this.state.listArray);
    })
  }
  render() {
    return (
      <div className="todo-wrapper">
        <AddTodo 
          filter={this.state.filter}
          handleTodoList={this.handleTodoList}/>
        <TodoList filter={this.state.filter} 
          listItem={this.state.listArray}
          hanleItemStateChange={this.hanleItemStateChange}/>
        <Footer 
          filter={this.state.filter} 
          handleFilter={this.handleFilter}/>
      </div>
    );
  }
}

const mapState = (state)=>{
  const {
    todo,
  } = state;
  
  return {
    todo,
  }
}

function actionDispatch(dispatch){
  return {
    actions:
      bindActionCreators(
        Object.assign({},todoActions),
        dispatch)
  }
}





export {Filter};
export default connect(mapState,actionDispatch)(TodoAPP);
