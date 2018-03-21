import autoBind from 'react-autobind';
import React , { Component, PropTypes } from 'react';
import moment from 'moment';
import { Table, Icon, Divider } from 'antd';
import types from './constants';
import cn from 'classnames';

const MIN_YEAR = types.MIN_YEAR;
const MAX_YEAR = types.MAX_YEAR;

const Week = ['Mon','Tue','Wed','Thu','Fri','Sat','Sun'];


/** 
 * 传入的 Week[index] 是一个array (antd不允许传 object)
 * 数组内容 : [solarCalendar.day,lunarCalendar.day,
 * interFestival,legalFestival,solarCalendar.otherMonth,
 * isToday,index
 * ]
*/
const dateColumns = types.weekend.map((val,index)=>{
    return {
        title:val,
        key:Week[index],
		dataIndex:Week[index],
		render:(text)=>{
			const calenderBoxStyle = cn({
				"calendar-box-cell":true,
				"calendar-box-cell-today":!!text[5],
				"calendar-box-cell-month":!!text[4],
			});
			const calendarOther = cn({
				'calendar-otehr-holiday':!!(text[2] || text[3])
			})
			return (
				<div className={calenderBoxStyle} 
					data-index={text[6]}
					data-othermonth={text[4]}>
					<p className={`calendar-box-cell-solar`}>
						{text[0]}
					</p>
					<p className={`calendar-box-cell-other ${calendarOther}`}>
						{text[2]?text[2]:(text[3]?text[3]:text[1])}
					</p>
				</div>
			)
		}
    }
})

class Calendar extends Component{
    constructor(props){
        super(props);
		autoBind(this);
	}
	
	handleCalendarClick(event){
		let curNode = event.target;

		//清除上一次点击添加的 class
		let clicked =this.table && (this.table).querySelectorAll('.calendar-box-cell-clicked');
		if(clicked.length){
			clicked.forEach((node)=>{
				let clickedCN = node.className;
				clickedCN = clickedCN.split(' ');
				let index = clickedCN.indexOf('calendar-box-cell-clicked');
				clickedCN = clickedCN.slice(0,index).concat(clickedCN.slice(index+1));
				node.className = clickedCN.join(' ');
			});
		}

		//给 td 增加 border
		while(curNode && curNode.nodeName.toLowerCase() !== 'div'){
			curNode = curNode.parentNode;
		}
		if(curNode){
			let targetCN = curNode.className;
			targetCN = targetCN.split(' ');
			targetCN.push('calendar-box-cell-clicked');
			curNode.className = targetCN.join(' ');	
		}

		//获取日期内容
		let index = curNode && curNode.getAttribute('data-index');

		this.props.getCalendarDetails(index);

		//查看 click 时是否为当前月份 是否需要引发重绘
		let isOtherMonth = curNode && curNode.getAttribute('data-othermonth');
		if(isOtherMonth=='true'){
			this.props.handleAnotherMonth(index);
		}
	}
	render(){
		console.log('calender render');
        return (
			<div className="calendar-box clearfix" 
				onClick={this.handleCalendarClick}
				ref={table=>this.table=table}>
				<Table className="calendar-table" 
					columns={dateColumns} 
					dataSource={this.props.dataSource}>
				</Table>
            </div>
        )
    }
}


export default Calendar;