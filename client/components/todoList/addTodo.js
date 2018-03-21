import React, { Component } from "react";
import autoBind from "react-autobind";
import checkbox from "../checkbox/checkbox";
import TodoList from "./todoList";

class AddTodo extends Component {
    constructor(props) {
        super(props);
        autoBind(this);
        this.state = {
            toggleInput: false,
            listArray: [],
            todoContent: ""
        };
    }
    handleAddTodos() {
        this.addList.focus();
        this.setState(prevState => ({
            toggleInput: !prevState.toggleInput
        }));
        // this.getItemJsonP();
        this.getItemXHR();
    }
    handleInput(event) {
        let e = event;
        this.setState({
            todoContent: e.target.value
        });
    }

    handelSubmit(event) {
        let e = event;
        if (e.keyCode == "13") {
            this.handleAddTodos();
            this.props.handleTodoList(this.state.todoContent);
            this.setState({
                todoContent:'',
            });

        }
    }
    getItemFetch(){
        
    }
    getItemXHR(){
        var xhr = new XMLHttpRequest();
        xhr.open('GET','http://localhost:8099/fetch/addTodoitem',true);
        xhr.onreadystatechange = function(){
            if(xhr.readyState===XMLHttpRequest.DONE && 
                xhr.status=='200'){
                    console.log('response=>',xhr.responseText);
            }
        };
        xhr.send();
    }
    getItemJsonP(){
        // fetch("http://www.example.org/submit.php", {
        //   method: "POST",
        //   headers: {
        //     "Content-Type": "application/x-www-form-urlencoded"
        //   },
        //   body: "firstName=Nikhil&favColor=blue&password=easytoguess"
        // }).then(function(res) {
        //     if (res.ok) {
        //       alert("Perfect! Your settings are saved.");
        //     } else if (res.status == 401) {
        //       alert("Oops! You are not authorized.");
        //     }
        //   }, function(e) {
        //     alert("Error submitting form!");
        //   });

        var pa = document.getElementsByTagName('head')[0];
        var sc = document.createElement('script');
        sc.setAttribute('src','http://localhost:8099/fetch/addTodoitem?callback=handleCallback');
        sc.setAttribute('type','text/javascript');
        console.log("new Script=>",sc);
        pa.appendChild(sc);
    }
    
    render() {
        let state = this.state;
        let inputCn = state.toggleInput ? "addtodo-input" : "addtodo-input-hidden";
        return (
            <div className="addtodo-wrapper">
                <input type="button" 
                    value="Add Todo" 
                    onClick={this.handleAddTodos} />
                <div className={inputCn}>
                <input
                    type="text"
                    name="todo"
                    ref={input => {
                        this.addList = input;
                    }}
                    value={this.state.todoContent}
                    onChange={this.handleInput}
                    onKeyUp={this.handelSubmit}
                />
                </div>
            </div>
        );

  }
}

export default AddTodo;
