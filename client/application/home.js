import './index.scss';
import React,{Component} from 'react';
import store from '../store/configureStore';
import panelActions from '../actions/panel-actions';
import { bindActionCreators } from 'redux';
import {connect} from 'react-redux';
import autoBind from 'react-autobind';
import {Router,Link,Route,Switch,withRouter,IndexRoute} from 'react-router-dom';
import Homepage from './homepage/index';
import CalendarModal from '../components/calendar-opt/index';
import DropDown from '../components/dropdown/index';
import Check from '../components/checkbox';

class Home extends Component{
    constructor(props){
        super(props);
        autoBind(this);
        this.state={

        }
    }
   
    render(){
        return (
            <div>
                {/* <Homepage /> */}
                <Check />
            </div>
            // <div className="homepage">
            //     <div className="homepage-main">
                // <Switch>
                //     <Route exact path='/' component={Homepage} >
                //         <Route path='/dropdown' component={DropDown} />
                //         <Route path='/calendar' component={CalendarModal} />
                //     </Route>
                // </Switch>
            //     </div>
            //     {/* <Homepage /> */}
            //     {/* {this.props.children}               */}
            // </div>
        )
    } 
}

const mapStateToProps = (state)=>{
    const {initialState} = state;
    return {initialState}
}

function mapDispatchToActions(dispatch){
    return {
        actions:bindActionCreators({
            panelActions
        },dispatch)
    }
}


export default connect(mapStateToProps,mapDispatchToActions)(Home);