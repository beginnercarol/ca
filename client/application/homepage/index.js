import React,{Component} from 'react';
import autoBind from 'react-autobind';
import {Router,Link,Route,Switch,withRouter,IndexRoute} from 'react-router-dom';

import CalendarModal from '../../components/calendar-opt';
import DropDown from '../../components/dropdown';
import FlattenMenu from '../../components/flattenMenu';



const pathRoute = {
    'Dropdown':'/dropdown',
    'Calendar':'/calendar',
    'Article':'/homepage',
}

class Homepage extends Component{
    constructor(props){
        super(props);
        this.state={
            
        }
    }

    enterApp(event){
        const appEnter={
            enter:'calendar'
        }
    }

    render(){
        let keys = Object.keys(pathRoute);
        let navs = [];
        for(let i=0;i<keys.length;i++){
            navs.push(
                <li key={i} onClick={()=>{this.enterApp()}}>
                    <Link to={pathRoute[keys[i]]}>{keys[i]}</Link>
                </li>
            )
        }
        return (
            <div className="homepage-main">
                <FlattenMenu />
                {this.props.children}
            </div>
        ) 
    }
}

export default Homepage;