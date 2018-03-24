import React,{Component} from 'react';
import {Switch,Route} from 'react-router-dom';
import CalendarModal from '../calendar-opt';
import DropDown from '../dropdown';
import Check from '../checkbox';
import FlattenMenu from '../flattenMenu';
import Navigator from '../navigator.js';
import autoBind from 'react-autobind';

class MainContent extends Component{
    constructor(props){
        super(props);
        autoBind(this);
    }
    render(){
        console.log("maincontent render=>",this.props.location);
        let props = this.props;
        let content = <DropDown />;
        switch(props.location){
            case '/menu':
                content = <FlattenMenu />
                break;
            case '/dropdown':
                content = <DropDown />
                break;
            default:
                break;
        }
        console.log('content is =>',content);
        return(
            <div className="home-content">
                 {/* <Switch>
                    <Route exact path='/' component={DropDown} />
                    <Route path='/menu'component={FlattenMenu}/>
                    <Route path='/dropdown' component={DropDown} />
                    <Route path='/calendar' component={CalendarModal} />
                </Switch> */}
                {content} 
            </div>
        )
    }
    
}

export default MainContent;