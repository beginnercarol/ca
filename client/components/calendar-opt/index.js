import './index.scss';
import types from './constants';
import autoBind from 'react-autobind';
import React , { Component, PropTypes } from 'react';
import {Select,Col,Button,Form } from 'antd';
import Calendar from './calendar';
import CalendarLunar from './calendar-lunar';
import moment from 'moment';

const Option = Select.Option;
const FormItem = Form.Item;
const MIN_YEAR = types.MIN_YEAR;
const MAX_YEAR = types.MAX_YEAR;
const Week = ['Mon','Tue','Wed','Thu','Fri','Sat','Sun'];

class CalendarModal extends Component{
    constructor(props){
        super(props);
        autoBind(this);
        this.date = new Date();
        this.view = [];
        this.state={
            year : this.date.getFullYear(),
            month : this.date.getMonth()+1,
            date : this.date.getDate(),
            lunarCalendar:this.getLunarCalendar(this.date.getFullYear(),
                            this.date.getMonth()+1,
                            this.date.getDate()),
            visible:true,
            dataSource:null, 
            rightInfo:null,
        }  
    }
    componentWillMount(){
        this.allYear = [];
        for(let i=MIN_YEAR;i<=MAX_YEAR;i++){
            this.allYear.push(i);
        }
        this.allMonth = [];
        for(let i=1;i<=12;i++){
            this.allMonth.push(i);
        }
        let dayInfo = this.state;
        this.getCalendar(dayInfo.year,dayInfo.month,dayInfo.date);  
    }
    //获取当前月份的日期
    getCalendar(y,m,d){
        console.log('redo getCalendar');
        let view = [];
        let dataSource = [];
        //填充日期
        let pYear = m==1?y-1:y;
        let pMonth = m==1?12:m-1;
        let nYear = m==12?y+1:y;
        let nMonth = m==12?1:m+1;
        //获取当月1号是星期几
        let week = this.getWeek(y,m,1);
        //当月天数
        let cMDays = this.getMonthDays(y,m);
        
        //上个月天数
        let pMDays = this.getMonthDays(pYear,pMonth);
        let nMDays = this.getMonthDays(nYear,nMonth);

        //前面需要填充几天
        let pFill = week-1;
        //后面需要填充几天
        let nFill = 7- ((pFill + cMDays)%7==0?7:(pFill + cMDays)%7);

        //生成当月的日历
        for(let i= pMDays-pFill+1;i<=pMDays;i++){
            let week = this.getWeek(pYear,pMonth,i);
            view.push({
                solarCalendar:{
                    year:pYear,
                    month:pMonth,
                    day:i,
                    week,
                    otherMonth:true,
                }
            });
        }
        for(let i=1;i<=cMDays;i++){
            let week = this.getWeek(y,m,i);
            console.log('today=>',i==d,d);
            view.push({
                solarCalendar:{
                    year:y,
                    month:m,
                    day:i,
                    week,
                    otherMonth:false,
				},
				isToday:i == d 
			});	
        }
        for(let i=1;i<=nFill;i++){
            let week = this.getWeek(nYear,nMonth,i);
            view.push({
                solarCalendar:{
                    year:nYear,
                    month:nMonth,
                    day:i,
                    week,
                    otherMonth:true,
                }
            });
        }        
        for(let i=0;i<view.length;i++){
            let elem = view[i];
            let year = elem.solarCalendar.year;
            let month = elem.solarCalendar.month;
            let day = elem.solarCalendar.day;

            //获取某天的农历日期
            elem.lunarCalendar=this.getLunarCalendar(year,month,day);

		 	// 获取某天的天干地支
            elem.chinaEra=this.getChinaEra(year,month,day);
            
		 	// 获取某天的国际节日
		 	elem.interFestival=this.getInterFestival(year,month,day);
		 	// 获取某天的国内节日
            elem.domesticFestival=
                this.getDomesticFestival(elem.lunarCalendar.lunarYear,
                        elem.lunarCalendar.lunarMonth,
                        elem.lunarCalendar.lunarDay);
		}
		
		this.view = view;
        let i=0;
        let j=i*7;
        // 将数据整合进 dataSource 传给 Table
        for(i=0;i<(view.length/7);i++){
            let obj = {
                key : i+parseInt(Math.random()*100,10),
            }
            for(j=i*7;j<i*7+7;j++){
				let arr = [];
				let item = view[j];
				arr.push(item.solarCalendar.day);
				arr.push(item.lunarCalendar.day );
				arr.push(item.interFestival );
				arr.push(item.legalHoliday );
				arr.push(item.solarCalendar.otherMonth);
				arr.push(item.isToday);
				arr.push(j);
				obj[Week[j-i*7]]=arr.slice();
				if(item.isToday){
					this.getCalendarDetails(j);
				}
            }
            dataSource.push(obj);
        }
        this.setState({
            dataSource,
        });
    }
    /**
     * 日历逻辑提升到父组件
     */
    /**
	 * 判断一个年份是闰年还是平年
	 * 
	 * eg: var r=isLeapYear(2016); // r=true; 
	 * 
	 * @param {Number} y 年
	 */
    isLeapYear(y){
        return ((y%4==0&&y%100 !=0)||(y%400==0));
    }

    /**
	 * 返回y年农历的中闰月,如果y年没有闰月返回0
	 * @param {Number} y 年
	 */
	leapMonth(y) {
		return (types.lunarInfo[y-1899]&0x0000f);
    }

    /**
	 * 返回y年农历的指定月份的天数
	 * @param {Number} y 年
	 */
	monthDays(y,m) {
		return ((types.lunarInfo[y-1899]&(0x10000>>m))?30:29);
    }
    
	/**
	 * 返回y年农历的总天数
	 * @param {Number} y 年
	 */
	yearDays(y) {
		let i,sum = 0;
		for (i=0x08000;i>0x00008;i>>=1) {
			sum+=(types.lunarInfo[y-1899]&i)?30:29;
		}
		return (sum+this.leapDays(y)); // y年的天数再加上当年闰月的天数
    }
	
    /**
	 * 返回y年农历的中闰月的天数
	 * @param {Number} y 年
	 */
	leapDays(y) {
		if (this.leapMonth(y)) {
			return ((types.lunarInfo[y-1899]&0x10000)?30:29);
		} else {
			return 0;
		}
	}


    /**
	 * 根据日期获取某天的星期数
	 * 
	 * eg: var w=getWeek(2016,4,7); // w=1; 返回值范围 1-7
	 * 
	 * @param {Number} y 年
	 * @param {Number} m 月
	 * @param {Number} d 日
	 */
	getWeek(y,m,d){
        // 注意:JavaScript月份范围是0-11
		return new Date(y,m-1,d).getDay()==0?7:new Date(y,m-1,d).getDay();
    } 
    
    //获取当月天数
    getMonthDays(y,m){
        let monthDays=[31,this.isLeapYear(y)?29:28,31,30,31,30,31,31,30,31,30,31];
        return monthDays[m-1];
    }

    /**
	 * 
	 * 根据日期获取某天的农历日期
	 * 
	 * 
	 * 说明：通过当前日期和1899年1月10日的日期所差的天数,分别计算出当前日期对应的农历的年月日
	 * 
	 * @param {Number} y 年
	 * @param {Number} m 月
	 * @param {Number} d 日
	 */
	getLunarCalendar(y,m,d){
		let res={};
		let baseDate=new Date(1899,1,10);
		let curDate=new Date(y,m-1,d);
		let offset=(curDate-baseDate)/86400000; // 计算出当前日期到1899年1月10日所差的天数,(农历1899年1月1日)
		
		// 用offset依次减去每一年的天数,直至不够减,此时i就表示当前农历年份
		for(var i=MIN_YEAR;i<=MAX_YEAR;i++){
			let days=this.yearDays(i);
			if(offset-days<1){
				break;
			}else{
				offset-=days;
			}
		}
		// 查找对应的农历年
		res.year=i;
		res.lunarYear=i;
		// 此时offset为,当前日期到今年农历月份的天数,进而通过这个差值计算出对应的农历月份
		
		// 当年闰月的月份
		let leap=this.leapMonth(res.year);
		let isLeap=false;
        //设定当年是否有闰月
        if(leap>0){
            isLeap=true;
        }
        let isLeapMonth=false;
        for(var i=1;i<=12;i++){
            let days=null;
            //如果有闰月则减去闰月对应的天数
            if (isLeap&&(i==leap+1)&&(isLeapMonth==false)){
                isLeapMonth=true;
                i--;
                days=this.leapDays(res.year); 
                
            // 如果没有闰月则减去正常月天数
            }else{
                isLeapMonth=false;
                days=this.monthDays(res.year,i);
            }
			// 如果offset-days小于0了说明,offset找到对应月份            
            if(offset-days<0) break;
            offset=offset-days;
        }
		i=i==13?1:i;
        res.month=(leap==i&&isLeapMonth?'润':'')+types.monthCN[i-1];
        res.day=types.dayCN[offset+1-1]; // 偏移量加1,得到对应的农历日期数. offset为当月1月1日的偏移量
		
		res.lunarMonth=i;
		res.lunarDay=offset+1;
		
		return res;
    }
    
    /**
	 * 
	 * 根据日期获取某天的天干地支
	 * 
	 * @param {Number} y 年
	 * @param {Number} m 月
	 * @param {Number} d 日
	 */
	getChinaEra(y,m,d){
		let res={};
		
		let firstTerm=getTerm(y,(m-1)*2); //某月第一个节气开始日期
		let gzYear=(m>2||m==2&&d>=getTerm(y,2))?y+1:y;//干支所在年份
		let gzMonth=d>=firstTerm?m:m-1; //干支所在月份（以节气为界）
		
		res.year=getEraYear(gzYear);
		res.month=getEraMonth(y,gzMonth);
		res.day=getEraDay(y,m,d);
		
		res.zodiac=getYearZodiac(gzYear);
		res.term=getYearTerm(y,m,d);	
		
		
		/*****************************************
		 * 计算天干地支节气相关函数
		 *****************************************/
		/**
		 * num 60进制中的位置(把60个天干地支编码成60进制的数)
		 * @param {Number} num
		 */
		function calculate (num) {
            return types.heavenlyStems[num%10]+types.earthlyBranches[num%12]
        }
		/**
		 * 获取干支纪年
		 * @param {Number} y 年
		 */
        function getEraYear(y) {
            return calculate(y-1900+35);// 1900年前一年为乙亥年,60进制编码为35
        }
        /**
		 * 获取干支纪月
		 * @param {Number} y 年
		 * @param {Number} m 月
		 */
        function getEraMonth(y,m) {
            return calculate((y-1900)*12+m+12); // 1900年1月小寒以前为丙子月，在60进制中排12
        }
        /**
		 * 获取干支纪日
		 * @param {Number} y 年
		 * @param {Number} m 月
		 * @param {Number} d 日
		 */
        function getEraDay(y,m,d) {
            return calculate(Math.ceil((new Date(y,m-1,d)-new Date(1900,0,1))/86400000+10));// 甲戌
        }
        /**
		 * 获取生肖
		 * @param {Number} y 干支所在年(默认以立春前的公历年作为基数)
		 */
		function getYearZodiac(y){
			 var num=y-1900+35; //参考干支纪年的计算，生肖对应地支
			 return types.chinaZodiac[num%12];
		}
		/**
		 * 某年的第n个节气为几日
		 * 地球公转时间:31556925974.7 毫秒
		 * 由于农历24节气交节时刻采用近似算法,可能存在少量误差(30分钟内)
		 * 1900年的正小寒点：01-06 02:03:57,1900年为基准点
		 * 
		 * @param {Number} y 公历年
		 * @param {Number} n 第几个节气，从0小寒起算
		 * 
		 */
		function getTerm(y,n) {
			var offDate = new Date((31556925974.7*(y-1900)+types.termInfo[n]*60000)+Date.UTC(1900,0,6,2,3,57));
			return(offDate.getUTCDate());
		}
		/**
		 * 获取公历年一年的二十四节气
		 * 返回节气中文名
		 */
		function getYearTerm(y,m,d){
			var res=null;
			var month=0;
			for(var i=0;i<24;i++){
				var day=getTerm(y,i);
				if(i%2==0) month++
				if(month==m&&day==d){
					res=types.solarTerm[i];
				}
			}
			return res;
		}
		return res;
    }
    /**
	 * 
	 * 根据日期获取某天的国际节日
	 * 
	 * @param {Number} y 年
	 * @param {Number} m 月
	 * @param {Number} d 日
	 */
	getInterFestival(y,m,d){
		m=m<10?'0'+m:m;
		d=d<10?'0'+d:d;
		
		var fes=types.interFestival['i'+m+d];
		if(fes){
			if(fes.split(',').length>1){
				var by=fes.split(',')[1];
				return y>=by?fes.split(',')[0]:null;
			}else{
				return fes;
			}
		}else{
			return null;
		}
		
	}
	/**
	 * 
	 * 根据日期获取某天的国内节日
	 * 
	 * @param {Number} y 年
	 * @param {Number} m 月
	 * @param {Number} d 日
	 */
	getDomesticFestival(y,m,d){
		m=m<10?'0'+m:m;
		d=d<10?'0'+d:d;
		return types.domesticFestival['d'+m+d]?types.domesticFestival['d'+m+d]:null;
	}
	/**
	 * 
	 * 根据日期获取某天的放假安排
	 * 
	 * @param {Number} y 年
	 * @param {Number} m 月
	 * @param {Number} d 日
	 */
    //select 中的参数是 xx 月 因此要用 parseInt
    handleYearChange(value){
        this.setState({
            year:parseInt(value,10),
        },()=>{
            this.getCalendar(this.state.year,this.state.month,this.state.date);
        })
        
    }
    handleMonthChange(value){
        this.setState({
            month:parseInt(value,10),
        },()=>{
            this.getCalendar(this.state.year,this.state.month,this.state.date);
        })
    }

    //回到今天 
    getBackToToday(){
        let date = this.date;
        this.setState({
            year:date.getFullYear(),
            month:date.getMonth()+1,
            date:date.getDate(),
        },()=>{
            //重置 select 数据
            let form = this.props.form;
            console.log("reset date");
            form.setFieldsValue({
                year:`${this.state.year}年`,
                month: `${this.state.month}月`,
                holiday: '假期安排',                
            }); 
            this.getCalendar(this.state.year,
                            this.state.month,
                            this.state.date);
        })
    }

    //获取当日具体信息并 传给 calendar-right
    getCalendarDetails(index){
        this.setState({
            rightInfo:this.view[index],
        })
    }
    //若点击了非本月的日期将会 修改 state 引起日历重绘
    handleAnotherMonth(index){
        console.log('not this month=>');
        let today = this.view[index].solarCalendar;
        this.setState({
            year:today.year,
            month:today.month,
            date:today.day,
        },()=>{
            let dayInfo = this.state;
		    this.getCalendar(dayInfo.year,dayInfo.month,dayInfo.date);
        });
    }    
    render(){
        const { getFieldDecorator } = this.props.form;
        return (
            <div className='calendar-wrapper clearfix' 
                style={this.state.visible ? {display: 'block'} : {display: 'none'}}>
                <div className='calendar-left clearfix'>
                    <div className='calendar-left-top clearfix' 
                        ref={(target)=>{this.selectDiv = target}}
                        onClick={this.preventDefaultClcik}>
                        <Form>
                            <Col span={6}>
                                <FormItem>
                                    {getFieldDecorator('year', {
                                       initialValue:`${this.state.year}年`
                                    })(
                                        <Select onChange={this.handleYearChange} >
                                            {
                                                this.allYear.map((val)=>
                                                    <Option key={val} value={`${val}年`}>{`${val}年`}</Option>
                                                )
                                            }
                                        </Select>
                                    )}
                                </FormItem>
                            </Col>
                            <Col span={6}>
                                <FormItem>
                                    {getFieldDecorator('month', {
                                        initialValue:`${this.state.month}月`
                                    })(
                                        <Select onChange={this.handleMonthChange} >
                                            {
                                                this.allMonth.map((val)=>
                                                    <Option key={val} value={`${val}月`}>{`${val}月`}</Option>
                                                )
                                            }
                                        </Select>
                                    )}
                                </FormItem>
                            </Col>
                            <Col span={6}>
                                <FormItem>
                                    {getFieldDecorator('holiday', {
                                        initialValue:'假期安排',
                                    })(
                                        <Select>
                                            {
                                                Object.keys(types.domesticFestival).map((val)=>
                                                    <Option key={val} >{`${types.domesticFestival[val]}`}</Option>
                                                )
                                            }{
                                                Object.keys(types.interFestival).map((val)=>
                                                    <Option key={val}>{`${types.interFestival[val]}`}</Option>
                                                )
                                            }
                                        </Select>
                                    )}
                                </FormItem>
                            </Col>
                            <Col span={6}>
                                <Button onClick={this.getBackToToday}>返回今天</Button>
                            </Col>
                        </Form>
                    </div>
                    <Calendar 
                        dataSource = {this.state.dataSource}
                        getCalendarDetails={this.getCalendarDetails}
                        handleAnotherMonth={this.handleAnotherMonth} />
                </div>
                <CalendarLunar 
                    dayInfo={this.state.rightInfo}
                    getLunarCalendar={this.getLunarCalendar}
                    getChinaEra={this.getChinaEra}
                    getInterFestival={this.getInterFestival}
                    getDomesticFestival={this.getDomesticFestival}/>
            </div>
        );
        
    }
}

export default Form.create()(CalendarModal);