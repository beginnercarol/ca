import React,{Component} from 'react';
import autoBind from "react-autobind";

class MapPluginsManager extends Component{
    constructor(props){
        super(props);
        autoBind(this);
        this.state={
            plugins={}
        }

    }
    init(map){
        this.map = map;
    }
    
    render(){
        console.log("empty obj length",({}).length);
        return (<div className="map plugin"></div>);
    }
}

export default MapPluginsManager;