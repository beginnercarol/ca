
import React, { Component } from 'react';
import update from 'react-addons-update';

import moment from 'moment'
import { DatePicker, message } from 'antd';

const DATE_PICKER_FORMAT = 'YYYY/MM/DD HH:mm';

class TimePicker extends Component {

    constructor(props) {
        super(props);
        this.state = {
            timeStart: props.data.timeStart,
            timeEnd: props.data.timeEnd
        }
    }

    onOkChange(value) {
        // console.log(value[0] - value[1]);
        if (value[1] - value[0] <= 0) {
            message.info("结束时间不能小于等于开始时间");
            return
        }
        var nextSearchParam = update(this.props.data, {
            timeStart: { $set: value[0].unix() * 1000 },
            timeEnd: { $set: value[1].unix() * 1000 }
        });
        this.props.onChangeHandler(nextSearchParam);
    }

    onRangePickerChange(value) {
        // 取整点
        let toTopHour = value[0].format("YYYY-MM-DD") + " 00:00";
        if (value) {
            this.setState({
                timeStart: moment(moment(toTopHour).unix()*1000),
                timeEnd: moment(value[1])
            });
        }
    }


    // 不可选择日期
    disabledDate(current) {
        return current && current.valueOf() >= Date.now();
    }

    render() {
        const rangeTime = [moment(this.state.timeStart), moment(this.state.timeEnd)];
        return this.props.data ? (
            <DatePicker.RangePicker
                showTime={{ format: 'HH:mm' }}
                style={{ width: 272 }}
                format={DATE_PICKER_FORMAT}
                value={rangeTime}
                onChange={this.onRangePickerChange.bind(this)}
                onOk={this.onOkChange.bind(this)}
                disabledDate={this.disabledDate.bind(this)}
                allowClear={false} />
        ) : null;
    }
}

export default TimePicker;
