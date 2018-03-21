import React,{Component} from 'react';
import autoBind from "react-autobind";
const countNum=10;

class Asteroids extends Component{
    constructor(props){
        super(props);
        autoBind(this);
        this.state={
            status:false,
            bullets:new Array(6),
            _x : 250,
            _y : 250,
            degre:0,
        }
    }
    componentDidMount(){
        this.init();
        this.ctx && this.ctx.addEventListener('keyup',(event)=>{this.handleKeyOperation(event)})
    }
    handleKeyOperation(event){
        let evt = event;
        switch(evt.keyCode){
            case '39'://right arrow
                this.setState({
                    deg:0,
                });
                break;
            case '38':
            this.setState({
                
            });
            break;

        }
        
    }
    //Before componentDidMount && Before componentDidUpdate
    init(x,y){ 
        let ctx = this.ctx && this.ctx.getContext('2d');
        ctx.strokeStyle='red';
        ctx.beginPath();
        ctx.moveTo(240, 150);
        ctx.lineTo(270, 150);
        ctx.lineTo(250, 135);
        ctx.lineTo(270, 150);
        ctx.lineTo(250, 165);
        ctx.stroke();
    }
    createEnermy(){
        
    }
    render(){
        return (<div className="myCav">
                    <canvas ref={(canvas)=>{this.ctx=canvas;}} 
                        id="asCav" 
                        width="500px" height="500px"></canvas>
                </div>);
    }
}

class Bullets extends Component{
    constructor(props){
        super(props);

    }
    render(){

    }
}


export default Asteroids;