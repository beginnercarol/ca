import React,{Component} from 'react';
import autoBind from "react-autobind";

class MapManager extends Component{
    constructor(props){
        super(props);
        autoBind(this);
        this.state={

        }
    }
    handleInit(){
        var map = new AMap.Map(this.mapRoot, {
            center: [117.000923, 36.675807],
            zoom: 6
        });
        map.plugin(["AMap.ToolBar"], function() {
            map.addControl(new AMap.ToolBar());
        });
    }
    
    componentDidMount(){
        let bd = document.querySelector('body');
        let scp = document.createElement('script');
        console.log(this.handleInit);
        scp.src="http://webapi.amap.com/maps?v=1.4.4&key=f819d770948605900eaaf2f9216012df&callback=mapInit";
        console.log('script=>',scp);
        bd.appendChild(scp);
        let ctx=this;
        window.mapInit=()=>{
            if(!window.AMap){
                console.log("地图未加载!");  
            }else{
                ctx.map = new AMap.Map(this.mapRoot, {
                    center: [117.000923, 36.675807],
                    zoom: 6
                });
                ctx.map.plugin(["AMap.ToolBar",'AMap.Scale','AMap.OverView'], function() {
                    ctx.map.addControl(new AMap.ToolBar());
                    ctx.map.addControl(new AMap.Scale());
                    ctx.map.addControl(new AMap.OverView());
                });
            }
        }
    }
    addPlugins(name){
        return ;
    }
    render(){
        return (
            <div id="mapRoot"
                style={{width:'800px',height:'500px'}}
                ref={mapRoot=>this.mapRoot=mapRoot}
            >
            </div>
        );
    }
}

export default MapManager;