import './index.css'

import React, { Component } from 'react';

// redux
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import iActions, {exportActivityDetailsCSV} from '../actions';
import update from 'react-addons-update';
import { fetchGetRewardOverview, fetchGetRewardGroup } from '../actions';
import { Spin } from 'antd';

import moment from 'moment';

// UI
import { Button, Icon, Table, Select, message } from 'antd';
const Option = Select.Option;

import DriverFilter from './driver-filter';
import MultiMetricsChart from './multi-metrics-chart';

import TimePicker from './time-picker';
import { uniqBy, isNumber } from 'lodash';

const LabelName = (props) => {
    return <label>{props.name}</label>
}
class IntelligenceDetails extends Component {
    constructor(props) {
        super(props)

        this.defaultSelectItem = { id: -1, name: "全部司机", driverList: null };

        this.pickKey = ["activityAmount", "activityEnd", "activityId", "activityName", "activityStart",
            "activityStatus", "activityTypeId", "amount", "calCycle", "calIndex", "calOrderModel",
            "calStriveModel", "calTime", "carLevel", "cityId", "driCnt", "driLevel", "driverTurnover",
            "dynamicIncome", "internalName", "joinModel", "key", "limitArea", "ordCnt", "panguIncome",
            "productId", "rewardWay", "rowSpan", "ruleId", "type"];

        this.state = {
            isShowTagFilter: false,
            filteredInfo: null,
            sortedInfo: null,
            detailList: null,
            timeInfos: [],
            loading: true,
            // 流水最小值(实际是数组的下标)，间距
            flowingMinList: [ 0, 500, 1000, 1500, 2000, 2500, 3000, 3500, 4000, 4500, 5000],
            flowingMin: 0,
            flowingIntervalList: [100, 200, 500, 1000],
            flowingInterval: 100,
        }

        this.exportCSV = this.exportCSV.bind(this)
        props.actions.setDriverOrOrder(1)
    }

    componentWillMount() {
        const { datas, actions } = this.props;
        let startTime, endTime, timeInfos = [];
        for (var p in datas) {
            if (datas[p].activityStart && datas[p].activityEnd) {
                startTime = moment(datas[p].activityStart).unix() * 1000;
                endTime = moment(datas[p].activityEnd).unix() * 1000 + 24 * 3600 * 1000 - 1000 * 60;
            }
            timeInfos.push({
                timeStart: startTime,
                timeEnd: endTime
            });
        }

        this.setState({
            timeInfos: timeInfos
        });

    }

    componentWillReceiveProps(nextProps) {
        const { actions } = this.props;
        

        if (nextProps.selectItems !== this.props.selectItems) {
            this.setState({
                loading: true
            })
            this.getRewardGroupList(nextProps);
        }
        if (nextProps.analysisType !== this.props.analysisType) {
            this.setState({
                loading: true
            })
            this.getRewardGroupList(nextProps);
        }
        if (JSON.stringify(nextProps.timeInfos) !== "null" && JSON.stringify(nextProps.timeInfos) !== JSON.stringify(this.state.timeInfos)) {
            this.setState({
                loading: true,
                timeInfos: nextProps.timeInfos
            })
            this.getRewardGroupList(nextProps);
        }
      
    }
    componentWillUnmount() {
        const { actions } = this.props;
        // let timeInfos = JSON.parse(JSON.stringify(this.state.timeInfos));
        // timeInfos[index] = nextSearchParam;
        actions.setTime(null);
    }


    componentDidUpdate(prevProps, prevState) {

    }

    async getRewardGroupList(nextProps) {
        // datas 活动
        // selectItems 司机数量 或  司机组
        const { actions, datas, type, analysisType } = this.props;

        let nextPropsSelectItems = (nextProps && nextProps.selectItems) || this.props.selectItems;
        let nextPropsAnalysisType = (nextProps && nextProps.analysisType) || this.props.analysisType;
        let nextPropsTimeInfos = (nextProps && nextProps.timeInfos) || this.state.timeInfos;
        // const { timeInfos } = this.state;

        // fakedata
        let fakeType = null //1;
        let fakeActivityId = null // 69782

        let list = [], doubleTrendOri = [];

        let count = 0;
        let rewardGroupData;
        switch (datas.length) {
            case 1:
                for (let j = 0; j < nextPropsSelectItems.length; j++) {
                    let temp = _.pick(datas[0], this.pickKey);
                    let tagId;
                    if (nextPropsSelectItems[j].id) {
                        tagId = +nextPropsSelectItems[j].id;
                    }

                    let rewardOverviewQuery = {
                        type: fakeType || type,
                        activityId: fakeActivityId || datas[0].activityId,
                        param: {
                            driverList: nextPropsSelectItems[j].driverList,
                            tag: tagId > 0 ? tagId : null
                        }
                    }

                    let rewardOverviewData = await fetchGetRewardOverview(rewardOverviewQuery);
                    list.push(_.merge(temp, rewardOverviewData, { "filterName": nextPropsSelectItems[j].name }));

                    let obj = {
                        "driverList": nextPropsSelectItems[j].driverList,
                        "tag": tagId < 0 ? null : tagId,
                        "analysisType": nextPropsAnalysisType,
                        "startTime": nextPropsTimeInfos[0].timeStart,
                        "endTime": nextPropsTimeInfos[0].timeEnd
                    }

                    let rewardGroupQuery = {
                        type: fakeType || type,
                        activityId: fakeActivityId || datas[0].activityId,
                        param: _.omitBy(_.merge(obj, _.pick(nextPropsSelectItems[j], ["driverList", "tag"])), _.isNull)
                    }


                    rewardGroupData = await fetchGetRewardGroup(rewardGroupQuery);
        
                    console.log('rewardGroupData:', rewardGroupData)
                    // if (rewardGroupData && rewardGroupData.length > 0) {
                        doubleTrendOri.push(rewardGroupData);
                    // }
                }

                break;
            case 2:
            case 3:
                for (let i = 0; i < datas.length; i++) {
                    let temp = _.pick(datas[i], this.pickKey);


                    let rewardOverviewQuery = {
                        type: type,
                        activityId: datas[i].activityId,
                        param: {
                            driverList: nextPropsSelectItems[0].driverList
                        }
                    }

                    let rewardOverviewData = await fetchGetRewardOverview(rewardOverviewQuery);
                    list.push(_.merge(temp, rewardOverviewData, { "filterName": nextPropsSelectItems[0].name }));

                    let obj = {
                        "driverList": null,
                        "tag": null,
                        "analysisType": nextPropsAnalysisType,
                        "startTime": nextPropsTimeInfos[i].timeStart,
                        "endTime": nextPropsTimeInfos[i].timeEnd
                    }

                    let rewardGroupQuery = {
                        type: type,
                        activityId: datas[i].activityId,
                        param: _.omitBy(obj, _.isNull)
                    }

                    rewardGroupData = await fetchGetRewardGroup(rewardGroupQuery);

                    console.log('rewardGroupData:', rewardGroupData)
                    // doubleTrend.push(rewardGroupData);
                    if (rewardGroupData && rewardGroupData.length > 0) {
                        doubleTrendOri.push(rewardGroupData);
                    }

                }
                break;
        }

        let doubleTrend = _.cloneDeep(doubleTrendOri)

        // 如果是流水，对流水数据根据最小显示及间距进行格式化
        if( (nextPropsAnalysisType == 3 || nextPropsAnalysisType == 4) && doubleTrend.length > 0) {
            doubleTrend = doubleTrend.map( data => {
                return this.formatTrend(data);
            })
        }


        // detailList 表单, doubleTrend
        this.setState({
            detailList: list,
            doubleTrend: doubleTrend,
            doubleTrendOri: doubleTrendOri,
            loading: false
        });
    }

    componentDidMount() {
        this.getRewardGroupList();
    }

    componentWillUnmount() {
        const { actions } = this.props;
        actions.setDriverListAndTag([{ id: -1, name: "全部司机", driverList: null }]);
    }

    formatTrend(data) {
        // flowingMin流水最小值，flowingInterval流水展示间隔
        const { flowingMin, flowingInterval } = this.state;
        let total = 0;
         // 补全
        let newDataObj = {};
        let newData = [];
        let AccYAxis = 0;
        
        // data.forEach( item => {
        //     total += item.yAxis
        // })
        // 根据间距聚合数据
        data.forEach( item => {
            let xAxis = item.xAxis;
            if (xAxis < flowingMin) {
                return;
            };
            
            let count = 0;
            total += item.yAxis; // percent分母
            if (flowingMin == 0) {
                count = Math.floor( xAxis / flowingInterval ); 
            } else {
                if ( xAxis > flowingMin ) {
                    count = Math.floor((xAxis - flowingMin) / flowingInterval); 
                } 
            }
            
            if (newDataObj[count]) {
                newDataObj[count]['yAxis'] += item.yAxis; 
            } else  {
                newDataObj[count] = {};
                newDataObj[count]['xAxis'] = +flowingMin + count * flowingInterval;
                newDataObj[count]['yAxis'] = item.yAxis; 
            }
        })
        for( let i in newDataObj) {
            let d = newDataObj[i];
            AccYAxis += d.yAxis; 
            newData.push({
                xAxis: d.xAxis,
                yAxis: d.yAxis,
                percentage: (AccYAxis / total * 100).toFixed(2)
            })
        }
        return newData;
    }

    openFilter() {
        // let btnAdd = this.refs.btnAdd.getBoundingClientRect();
        this.setState({
            isShowTagFilter: true
        });
    }

    closeFilter() {
        this.setState({
            isShowTagFilter: false
        })
    }

    addFilter(query) {

        // string conver number
        if (query.driverList && query.driverList.length > 0) {
            query.driverList = _.map(query.driverList, item => item = parseInt(item));
        }
        const { actions } = this.props;
        let selectItems = this.props.selectItems;
        selectItems.push(query);

        // 去重
        selectItems = uniqBy(selectItems, (o) => {
            return o.id;
        });

        actions.setDriverListAndTag(selectItems);

        this.setState({
            isShowTagFilter: false
        });


    }
    removeList(selectItem, e) {

        const { actions } = this.props;

        let selectItems = JSON.parse(JSON.stringify(this.props.selectItems));

        for (let key in selectItems) {
            if (selectItems[key].id == selectItem.id) {
                selectItems.splice(key, 1)
            }
        }
        actions.setDriverListAndTag(selectItems);
    }

    handleChange = (pagination, filters, sorter) => {
        // console.log('Various parameters', pagination, filters, sorter);
        this.setState({
            filteredInfo: filters,
            sortedInfo: sorter,
        });
    }

    clearFilters = () => {
        this.setState({ filteredInfo: null });
    }
    clearAll = () => {
        this.setState({
            filteredInfo: null,
            sortedInfo: null,
        });
    }
    setAgeSort = () => {
        this.setState({
            sortedInfo: {
                order: 'descend',
                columnKey: 'age',
            },
        });
    }

    handleChangeByDriver = (key) => {

        const { actions } = this.props;

        // this.setState({
        //     analysisType: key
        // });

        actions.setDriverOrOrder(key);
    }

    handleChangeByFlowingMin = key => {
        const { doubleTrendOri } = this.state;
        let doubleTrend = _.cloneDeep(doubleTrendOri)
        this.setState({
            flowingMin: key
        }, () => {
            this.setState({
                doubleTrend:  doubleTrend.map( data => {
                    return this.formatTrend(data)
                })
            })
        })
    }

    handleChangeByFlowingInterval = key => {
        const { doubleTrendOri } = this.state;
        let doubleTrend = _.cloneDeep(doubleTrendOri)
        this.setState({
            flowingInterval: key
        }, () => {
            this.setState({
                doubleTrend:  doubleTrend.map( data => {
                    return this.formatTrend(data)
                })
            })
        })
    }

    onChangeHandler(nextSearchParam, index) {

        const { actions } = this.props;
        let timeInfos = JSON.parse(JSON.stringify(this.state.timeInfos));
        timeInfos[index] = nextSearchParam;

        // this.setState({
        //     timeInfos: timeInfos
        // });

        actions.setTime(timeInfos);

    }

    exportCSV() {
        const { activityType, datas } = this.props;
        const { detailList } = this.state;
        const detail = detailList[0];
        let param = {
            title: datas[0].activityId + '.csv',
            fetchParam: {
                type: datas[0].type,
                activityId: datas[0].activityId
            },
            importParam: {
                activityType: detail['activityTypeId']['label'],
                activityName: detail['activityName'],
                activityStart: detail['activityStart'],
                activityEnd: detail['activityEnd'],
                type: detail['type']
            }
        }
        exportActivityDetailsCSV(param, () => {
            message.success('导出成功！');
        })
    }
    render() {
        const detailData = this.props.datas;
        const { doubleTrend , detailList, flowingMinList, flowingIntervalList } = this.state;

        const cityIds = _.reduce(detailData, (init, next) => {
            init.push(next.cityId.value);
            return init
        }, []);

        // var type = detailData[0].type;
        var activityId = detailData[0].activityId || 69640;

        //    0 , 1 盘古运营活动    dimension, measure
        //    2 , 3 司机运营活动    dimension, measure
        const activityType = this.props.activityType;
        const type = this.props.type;

        const measure = this.props.searchParam.measures;
        const dimension = this.props.searchParam.dimensions;

        let totalMetrics;
        if (dimension) {
            totalMetrics = dimension.concat(measure);
        }
        let measureKeyMap = {};
        if (detailList) {
            let measureKeys = _.keys(detailList[0]);
            _.forEach(measureKeys, (key) => {
                var val = _.find(totalMetrics, { "value": key });
                if (val) {
                    measureKeyMap[key] = val.label;
                }
            });
        }

        let { sortedInfo, filteredInfo } = this.state;
        sortedInfo = sortedInfo || {};
        filteredInfo = filteredInfo || {};

        // 司机数 1 完单数 2
        const ordType = [   { name: '司机数', value: 1 },
                            { name: '完单数', value: 2 }
                        ];
        // 司机运营活动才有完单流水选项
        if (type == 2) {
            // ordType.push({ name: '流水奖励', value: 3 })
            ordType.push({ name: '流水金额', value: 4 })
        }

        const ordOption = ordType.map(type => <Option key={type.value}>{type.name}</Option>);
        const flowingMinOption = flowingMinList.map( min => <Option key={min}>{min}</Option>)
        const flowingIntervalOption = flowingIntervalList.map( interval => <Option key={interval}>{interval}</Option>)
        const columns = [{
            title: "司机组",
            dataIndex: 'filterName',
            key: 'filterName',
            filteredValue: filteredInfo.name || null
        }, {
            title: measureKeyMap["activityName"],
            dataIndex: 'activityName',
            key: 'activityName',
            filteredValue: filteredInfo.name || null
        }, {
            title: measureKeyMap["activityStart"],
            dataIndex: 'activityStart',
            key: 'activityStart'
        }, {
            title: measureKeyMap["activityAmount"],
            dataIndex: 'activityAmount',
            key: 'activityAmount'
        }, {
            title: measureKeyMap["amount"],
            dataIndex: 'amount',
            key: 'amount'
        }, {
            title: measureKeyMap["driCnt"],
            dataIndex: 'driCnt',
            key: 'driCnt'
        }, {
            title: measureKeyMap["panguIncome"],
            dataIndex: 'panguIncome',
            key: 'panguIncome'
        }, {
            title: measureKeyMap["dynamicIncome"],
            dataIndex: 'dynamicIncome',
            key: 'dynamicIncome'
        }, {
            title: measureKeyMap["ordCnt"],
            dataIndex: 'ordCnt',
            key: 'ordCnt'
        }];

        // 添加每个组的名称
        let chartData = [];
        doubleTrend && doubleTrend.map((data,index) => {
            chartData.push({
                data,
                name: this.props.selectItems[index].name
            })
        })

        return (
            <div className="intelligence-details">
                {
                    this.props.datas.length < 2 ?
                        <div>
                            <div className="intelligence-details-fiter clearfix">
                                <ul>
                                    {
                                        this.props.selectItems.map((value, key) => {
                                            return (<li key={key}>
                                                <span className="dynamic-label">{value.name}</span>
                                                {
                                                    this.props.selectItems.length > 1 ? <a className="dynamic-label-clonse" onClick={(e) => this.removeList(value, e)}>
                                                        <Icon type="close"></Icon>
                                                    </a> : null
                                                }
                                            </li>)
                                        })
                                    }
                                </ul>
                                {
                                    this.props.selectItems.length <= 2 ? (
                                        <a className="intelligence-details-add" onClick={this.openFilter.bind(this)} ref="btnAdd">
                                            <Icon type="plus" />
                                        </a>) : null
                                }
                                {
                                    this.state.isShowTagFilter ?
                                        <DriverFilter type={type}
                                            cityIds={cityIds}
                                            onClose={this.closeFilter.bind(this)}
                                            visiable={this.state.isShowTagFilter}
                                            onSubmit={this.addFilter.bind(this)}
                                            position={{
                                                top: this.refs.btnAdd.offsetTop - 20,
                                                left: this.refs.btnAdd.offsetLeft + 30
                                            }}
                                            defaultSelectItem={this.defaultSelectItem} /> : null
                                }
                                <Button type="primary"  onClick={this.exportCSV} >明细导出</Button>
                            </div>
                            <div className="intelligence-details-list">
                                <div className="details-label">分组对比</div>
                                <Spin spinning={this.state.loading}>
                                    <Table className="intelligence-details-table"
                                        columns={columns}
                                        dataSource={detailList}
                                        onChange={this.handleChange}
                                        pagination={false} />
                                </Spin>
                            </div>
                        </div> : null
                }
                <div className="intelligence-details-graph">
                    <div className="details-label">
                        <Select defaultValue={ordType[0].name} style={{ width: 90 }} onChange={this.handleChangeByDriver}>
                            {ordOption}
                        </Select>
                        {
                            this.props.datas.map((data, index) => {
                                return (
                                    <span className="intelligence-time-select">
                                        <LabelName name={data.activityName} />
                                        <TimePicker data={this.state.timeInfos[index]} onChangeHandler={(nextSearchParam) => this.onChangeHandler(nextSearchParam, index)} />
                                    </span>
                                )
                            })
                        }
                        {
                            this.props.analysisType == 4 && this.props.type == 2 ? 
                                <div className="details-tools">
                                    <span>
                                        <label>最小值 ≥</label>
                                        <Select defaultValue={flowingMinList[0]} style={{ width: 90 }} onChange={this.handleChangeByFlowingMin}>
                                            {flowingMinOption}
                                        </Select>
                                    </span>
                                    <span>
                                        <label>间距</label>
                                        <Select defaultValue={flowingIntervalList[0]} style={{ width: 90 }} onChange={this.handleChangeByFlowingInterval}>
                                            {flowingIntervalOption}
                                        </Select>
                                    </span>  
                                </div> : null
                        }
                    </div>
                    <Spin spinning={this.state.loading}>
                        <MultiMetricsChart data={chartData} analysisType={this.props.analysisType} />
                    </Spin>
                </div>
            </div>)
    }
}


const mapStateToProps = (state) => {
    return {
        ...state
    }
}

function mapDispatchToProps(dispatch) {
    return {
        actions: bindActionCreators(Object.assign({}, iActions), dispatch)
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(IntelligenceDetails)
