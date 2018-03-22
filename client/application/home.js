import './index.scss';
import React,{Component} from 'react';
import store from '../store/configureStore';
import panelActions from '../actions/panel-actions';
import { bindActionCreators } from 'redux';
import {connect} from 'react-redux';
import autoBind from 'react-autobind';

import Homepage from './homepage/index';
import CalendarModal from '../components/calendar-opt';
import DropDown from '../components/dropdown';


const pathRoute = {
    'Home':'/',
    'Dropdown':'/dropdown',
    'Calendar':'/calendar',
    'Article':'/homepage',
}



class Home extends Component{
    constructor(props){
        super(props);
        autoBind(this);
        this.state={

        }
    }
    enterApp(event){
        event.preventDefault();
        const appEnter={
            enter:'calendar'
        }
        this.props.history.replace(appEnter,'calendar','#');
    }
    render(){
        let keys = Object.keys(pathRoute);
        let navs = [];
        for(let i=0;i<keys.length;i++){
            navs.push(
                <li key={i}>
                    <Link to={pathRoute[keys[i]]}>{keys[i]}</Link>
                </li>
            )
        }
        
        return (
            <div className="homepage">
                <div className="links" onClick={this.enterApp}>
                    <div className="left-nav">
                        <ul className="home-nav nav">
                            {navs}
                        </ul>
                    </div>
                </div>
                {this.props.children}              
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