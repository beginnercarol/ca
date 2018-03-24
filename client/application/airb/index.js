import './index.scss';
import React,{Component} from 'react';


class AirB extends Component{
    constructor(props){
        super(props);
    }
    render(){
        return (
            <div className="airb">
                <div className="air-header">
                    <i className="iconfont icon-Airbnb"></i>
                    <input name="search" type="search" />
                    <select name="browser" id="selectBro"></select>
                    <div className="portrait">
                        <img src="" alt="portrait"/>
                        <select name="user" id="user-info"></select>
                    </div>
                    <button>List Your Space</button>
                </div>
                <div className="air-main">
                    
                </div>
                <div className="air-"></div>left
            </div>
        )
    }
}

export default AirB;