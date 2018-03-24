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
import FlattenMenu from '../components/flattenMenu';
import Navigator from '../components/navigator.js';
import config from '../config/config';
import MainContent from '../components/mianContent';

class Home extends Component{
    constructor(props){
        super(props);
        autoBind(this);
        this.state={
            location:document.location.pathname
        }
    }

    componentWillMount(){
        window.onpopstate = (event)=>{
            console.log("popstatechange");
            this.setState({
                location:document.location.pathname
            })
        }
        
        this.setState({
            location:document.location.pathname
        },()=>{
            // console.log('refresh=>');
        })
    }

    handleUrlChange(e,pathname){
        // console.log("setPathname=>",pathname);
        this.setState({
            location:'/'+pathname,
        })
    }

    render(){
        return (
            <div className="homepage">
                <Navigator pathRoute={config.homepage} handleUrlChange={this.handleUrlChange}/>
                <MainContent location={this.state.location}/>
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


export default connect(mapStateToProps,mapDispatchToActions)(Home);