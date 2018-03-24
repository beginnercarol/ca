import React,{Component} from 'react';
import {Link} from 'react-router-dom';
import autoBind from 'react-autobind';

class Navigator extends Component{
    constructor(props){
        super(props);
        autoBind(this);
    }
    
    handleClick(e,index){
        let props = this.props;
        let history = window.history || history;
        let keys = Object.keys(props.pathRoute);
        history.pushState('','',`/${props.pathRoute[keys[index]]}`);
        console.log('handleUrlChange=>',props.pathRoute[keys[index]]);
        this.props.handleUrlChange(e,props.pathRoute[keys[index]]);
    }

    render(){
        let props = this.props;
        let keys = Object.keys(props.pathRoute);
        let navs = [];
        for(let i=0;i<keys.length;i++){
            navs.push(
                <li key={i} onClick={(e)=>this.handleClick(e,i)}>
                    {/* <Link to={props.pathRoute[keys[i]]}>{keys[i]}</Link> */}
                    {keys[i]}
                </li>
            )
        }
        return (
            <div className="home-navi">
                {navs}
            </div>
        )
    }
    
}


export default Navigator;