import './index.scss';
import React,{Component} from 'react';
import autoBind from 'react-autobind';
import types from './a-constants';
import Calendar from './calendar';

const MIN_YEAR = types.MIN_YEAR;
const MAX_YEAR = types.MAX_YEAR;


const All_Year = [];
for(let i=MIN_YEAR;i<=MAX_YEAR;i++){
    All_Year.push(i);
}
const All_Month = [];
for(let i=1;i<=12;i++){
    All_Month.push(i);
}


function SelectDown(props){
    let content = null;
    switch(props.type){
        case 'Y':
            content = (
                All_Year.map((val,index)=>
                    <li key={index} className='calendar-select-year'>
                        {val+'年'}
                    </li>)
            )
            break;
        case 'M':
            content = (
                All_Month.map((val,index)=>
                    <li key={index} className='calendar-select-month'>
                        {val+'月'}
                    </li>)
            )
            break;
        case 'H':
            content = (
                (Object.keys(types.domesticFestival)
                    .map((val,index)=>{
                        return (
                            <li key={index} className='calendar-select-holiday'>
                                {types.domesticFestival[val]}
                            </li>
                        )
                    })).concat(
                        Object.keys(types.interFestival)
                            .map((val,index)=>{
                                return (
                                    <li key={index} className='calendar-select-holiday'>
                                        {types.interFestival[val]}
                                    </li>
                                )
                    })
                    )
            )
            break;
        default :
            content = null;
    }
    return (
        <React.Fragment>
        <div className='calendar-selected'
            
        >
        2018
        </div>
        <ul className={props.className} onClick={props.handleSelection}>
            {content}
        </ul>
        </React.Fragment>
    );
}

class CalendarModal extends Component{
    constructor(props){
        super(props);
        autoBind(this);
        this.date = new Date();
        this.state={
            year:this.date.getFullYear(),
            month:this.date.getMonth(),
            day:this.date.getDate(),
        }
    }

    componentWillMount(){
        
    }

    hanldeSelection(event){
        console.log(event.target.className);
    }

    render(){
        return (
            <div className="calendar-wrapper">
                <div className="calendar-left">
                    <div className="calendar-top">
                        {/* <div className="calendar-select-wrapper"> */}
                            <SelectDown className="calendar-select calendar-select-year" type="Y" 
                                handleSelection={this.hanldeSelection}/>
                            <SelectDown className="calendar-select calendar-select-month" type="M"
                                handleSelection={this.hanldeSelection}/>
                            <SelectDown className="calendar-select calendar-select-holiday" type="H"
                                handleSelection={this.hanldeSelection}/>
                        {/* </div> */}
                    </div>
                    {/* <Calendar todayInfo={this.state}/> */}
                </div>
                <div className="calendar-right">
                </div>
            </div>
        )
    }
}




export default CalendarModal;