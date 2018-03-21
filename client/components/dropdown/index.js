import './index.scss';
import autoBind from 'react-autobind';
import React,{Component} from 'react';
import _ from 'lodash';
class DropDown extends Component{
    constructor(props){
        super(props);
        autoBind(this);
    }
    handleClick(){
        // fetch('localhsot:8079/')
        console.log("clcik");
    }

    render(){
        return (
            <div className="drop-down">
                <label>Label</label>
                <ul className="dropdown-content">
                    <li>Jucy Judy</li>
                    <li>Bershaka</li>
                    <li>Lemon</li>
                    <li onClick={this.handleClick}>Lime</li>
                    <li><a href="localhsot:8079/">Orange</a></li>
                </ul>
            </div>
        )
    }
}

export default DropDown;
