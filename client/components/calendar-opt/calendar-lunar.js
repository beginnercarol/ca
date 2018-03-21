import autoBind from 'react-autobind';
import React , { Component, PropTypes } from 'react';

class CalendarLunar extends Component{
    constructor(props){
        super(props);
    }
    render(){
        let props = this.props.dayInfo;
        let eraMon = props.chinaEra.month.split('');
        let eraDay = props.chinaEra.day.split('');
        let date = `${props.solarCalendar.year}-${props.solarCalendar.month}-${props.solarCalendar.day}`;
        return (
            <div className="calendar-right clearfix">
                <div className="calendar-top">{date}</div>
                <div className="calendar-day">{props.solarCalendar.day}</div>
                <div className="calendar-lunar">{props.lunarCalendar.day}</div> 
                <div className="calendar-chinaEra">
                    <div>
                        <span>{`${props.chinaEra.year}年`}</span>
                        <span>{`${props.chinaEra.zodiac}年`}</span>
                    </div>
                    <div>
                        <span>
                            {eraMon[0]}
                            <br/>
                            {eraMon[1]}
                            <br/>
                            月
                            <br/>
                        </span>
                        <span>
                            {eraDay[0]}
                            <br/>
                            {eraDay[1]}
                            <br/>
                            日
                            <br/>
                        </span>
                    </div>
                </div>
            </div>
        )
    }
}

export default CalendarLunar;