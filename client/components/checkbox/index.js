import React,{Component} from "react";
import autoBind from "react-autobind";

const plainOption = [1,2,3];

class Check extends React.Component {
    constructor(props) {
      super(props);
      autoBind(this);
      this.state = {
        checkAll: false,
        checkList:[0,0,0]
      };
      this.input = null;
    }
    handleChangeAll(){
        this.setState((prevState)=>({
            checkAll:!prevState.checkAll,
            checkList:(!prevState.checkAll)?[1,1,1]:[0,0,0],
        }))
    }
    handleGroupChangeAll(event,index){
        let arr = this.state.checkList.slice();
        arr[index] = 1;
        this.setState({
            checkList:arr,
            checkAll:arr.reduce((cum,cur)=>{
                return cum+cur;
            })==3?true:false,
        })
    }
    render(){
        let checkGroup = plainOption.map((val,index)=>
                <label  onClick={(e)=>this.handleGroupChangeAll(e,index)}>
                    <input type="checkbox" checked={this.state.checkList[index]}/>
                    {val}
                </label>
            );
        console.log(checkGroup);
        return (
            <div className="ca-checkbox">
                <label htmlFor="" onClick={this.handleChangeAll}>
                    <input type="checkbox" checked={this.state.checkAll}/>All
                </label>
                {checkGroup}
            </div>
        )
    }

}

export default Check;