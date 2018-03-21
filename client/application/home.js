import React,{Component} from 'react';
import {Router,Link,Route,Switch} from 'react-router-dom';
import CalendarModal from '../components/calendar-opt';
import DropDown from '../components/dropdown';
import store from '../store/configureStore';
import panelActions from '../actions/panel-actions';
import { bindActionCreators } from 'redux';
import {connect} from 'react-redux';

class Home extends Component{
    render(){
        return (
            // <Switch>
            //     <Route path='/' content={DropDown} />
            // </Switch>
            <DropDown />
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