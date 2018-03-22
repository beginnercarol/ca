import './index.scss';
import React,{Component} from 'react';
import {Router,Link,Route,Switch,withRouter} from 'react-router-dom';
import CalendarModal from '../components/calendar-opt';
import DropDown from '../components/dropdown';
import store from '../store/configureStore';
import panelActions from '../actions/panel-actions';
import { bindActionCreators } from 'redux';
import {connect} from 'react-redux';
import autoBind from 'react-autobind';

class Home extends Component{
    constructor(props){
        super(props);
        autoBind(this);
    }
    enterApp(){
        const appEnter={
            enter:'calendar'
        }
        this.props.history.push(appEnter,'calendat','bar.html');
        console.log('props.history=>',this.props.history);
    }
    render(){
        return (
            <div className="context">
                <div className="links">
                    <ul>
                        <li onClick={this.enterApp}>
                            <Link to="/calendar">Calendar</Link> /
                        </li>
                        <li onClick={this.enterApp}>
                            <Link to="/path"> path</Link> /
                        </li>
                    </ul>
                </div>
                <div className="homepage">
                    <Switch>
                        <Route exact path='/path' component={DropDown} />
                        <Route path='/calendar' component={CalendarModal} />
                    </Switch>
                </div>
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