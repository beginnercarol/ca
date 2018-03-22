import React,{Component} from 'react';
import autoBind from 'react-autobind';
import {Router,Link,Route,Switch,withRouter,IndexRoute} from 'react-router-dom';
class Homepage extends Component{
    constructor(props){
        super(props);
        this.state={
            
        }
    }
    render(){
        return (
            <div className="homepage-main">
                <div className="main">
                    <Switch>
                        <Route path='/path' component={Homepage} />
                        <Route path='/dropdown' component={DropDown} />
                        <Route path='/calendar' component={CalendarModal} />
                    </Switch>
                </div>
            </div>
        ) 
    }
}

export default Homepage;