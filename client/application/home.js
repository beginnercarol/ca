import React,{Component} from 'react';
import {Router,Link,Route,Switch,withRouter} from 'react-router-dom';
import CalendarModal from '../components/calendar-opt';
import DropDown from '../components/dropdown';
import store from '../store/configureStore';
import panelActions from '../actions/panel-actions';
import { bindActionCreators } from 'redux';
import {connect} from 'react-redux';

class Home extends Component{
    render(){
        return (
            <div className="homepage">
                <Switch>
                    <Route exact path='/' component={DropDown} />
                    <Route path='/calendar' component={CalendarModal} />
                </Switch>
            </div>
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


export default withRouter(connect(mapStateToProps,mapDispatchToActions)(Home));