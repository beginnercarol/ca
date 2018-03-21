import React,{Component} from 'react';
import autoBind from 'react-autobind';
import {Filter} from './todoApp';

class TodoItem extends Component{
    render(){
        return <div className="todo-content" 
            style={{ textDecoration: this.props.completed ? "line-through" : "none", cursor: this.props.completed ? "default" : "pointer" }}>
            <label>
              <input type="checkbox" 
                onClick={this.props.onClick} />
                    {this.props.text}
            </label>
          </div>;
    }
  }

class TodoList extends Component{
    render(){
        let {todo} = this.props;
        let stateFilter = this.props.filter;
        let listItem = this.props.listItem;
        switch(stateFilter){
            case Filter.SHOW_ALL:
                break;
            case Filter.SHOW_ACTIVE:
                listItem = listItem.filter((val)=>{
                    return val.completed==false;
                });
                break;
            case Filter.SHOW_COMPLETED:
                listItem = listItem.filter((val)=>{
                    return val.completed==true;
                });
                console.log("completed=>",listItem);
                break;
            default:
                break;
        }
        return (
            <div className="addtodoList-wrapper">
                {listItem.map((val,index)=>
                    <TodoItem key={index} 
                        {...val}
                        onClick={()=>{this.props.hanleItemStateChange(index)}}
                    />
                )}
            </div>
        );
    }
}

export default TodoList;