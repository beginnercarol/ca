import './index.scss';
import React,{Component} from 'react';
import autoBind from 'react-autobind';
import cn from 'classnames';

class QueueVis extends Component{
    constructor(props){
        super(props);
        autoBind(this);
        this.state={
            numberInput:'',
            info:'',
            queue:[],
            content:null,
        }
    }
    componentWillMount(){
        let number = localStorage.getItem('inputNumber');
        let queue = localStorage.getItem('queue')?(localStorage.getItem('queue')).split(","):[];
        this.setState({
            numberInput:number,
            queue,
        });
        localStorage.removeItem('inputNumber');
        localStorage.removeItem('queue');
    }
    componentDidUpdate(){
        let number = this.state.numberInput;
        let queue = this.state.queue?this.state.queue:[];
        localStorage.setItem('inputNumber',number);
        localStorage.setItem('queue',queue);
    }
    componentWillUnmount(){
        localStorage.removeItem('inputNumber');
        localStorage.removeItem('queue');
    }
    componentDidCatch(error,info){
        console.log('error happened=>',error);
    }
    confirmData(event){
        let val = parseInt(event.target.value,10);
        if(typeof val!='number'){
            this.setState({
                info:'error, must be a number'
            })
        }else{
            val = Number(val);
            this.setState({
                numberInput:val,
            })
        }
    }
    handleLI(){
        this.setState((prevState)=>{
            let temp = prevState.queue;
            let val = prevState.numberInput;
            temp.unshift(val);
            return {
                queue:temp,
            }
        },()=>{
            console.log("push queue=>",this.state.queue);
        }); 
        // if(this.vis){
        //     let box = document.createElement('div');
        //     box.className="queue-box";
        //     box.innerText=this.state.numberInput;
        //     this.vis.insertBefore(box,this.vis.firstChild);
        // }
    }
    handleLO(){
        this.setState((prevState)=>{
            let temp = prevState.queue;
            let val = prevState.numberInput;
            temp.shift(val);
            return {
                queue:temp,
            }
        }); 
    }
    handleRI(){
        this.setState((prevState)=>{
            let temp = prevState.queue;
            let val = prevState.numberInput;
            temp.push(val);
            return {
                queue:temp,
            }
        }); 
    }
    handleRO(){
        this.setState((prevState)=>{
            let temp = prevState.queue;
            let val = prevState.numberInput;
            temp.pop(val);
            return {
                queue:temp,
            }
        }); 
    }
    reset(){
        this.setState({
            numberInput:null,
            queue:[],
        });
        localStorage.clear();
    }
    render(){
        let state = this.state;
        console.log('render=>');
        let content = this.state.queue?this.state.queue.map((ele,index)=>
            <div className="queue-box" key={index}>
                {ele}
            </div>):null;
        return (
            <div className="queue-vis">
                <input type="text" 
                    onChange={(event)=>this.confirmData(event)} 
                    value={state.number}/>
                <button name='left-in' onClick={this.handleLI}>
                    LI
                </button>
                <button name='left-out' onClick={this.handleLO}>
                    LO
                </button>
                <button name='right-in' onClick={this.handleRI}>
                    RI
                </button>
                <button name='right-out' onClick={this.handleRO}>
                    RO
                </button>
                <button onClick={this.reset}>Reset</button>
                <span className="msg-info">{state.info}</span>
                <div className="vis clearfix" ref={(ele)=>this.vis=ele}>
                    {content}
                </div>
            </div>
        )
    }
}

export default QueueVis;