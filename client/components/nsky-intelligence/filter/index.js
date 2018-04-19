/*
 * @Author: hedonghui 
 * @Date: 2017-08-09 14:40:44 
 * @Last Modified by: hedonghui
 * @Last Modified time: 2017-12-06 16:01:42
 */
import _ from 'lodash'
import cn from 'classnames'
import autoBind from 'react-autobind'
import moment from 'moment'
import React, { Component } from 'react'

// redux
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import iActions from '../actions'

//ant
import { Collapse, Row, Col, Cascader, Form, Select, DatePicker, Button, TreeSelect, message, Input } from 'antd'
const Panel = Collapse.Panel;
const FormItem = Form.Item;
const RangePicker = DatePicker.RangePicker;
const Option = Select.Option;
const SHOW_PARENT = TreeSelect.SHOW_PARENT;
//const
const DATE_PICKER_FORMAT = 'YYYY/MM/DD'
const cityIdMapName = {}
const cityNameMapId = {}
const DRIVER_FILTER_PARAM = 'DRIVER_FILTER_PARAM'
const DRIVER_FILTER_PARAM_NEW = 'DRIVER_FILTER_PARAM_NEW'
const typeMap = { }

// 脏代码
let init = 1;

class Filter extends Component {
    constructor(props) {
        super(props);
        localStorage.removeItem(DRIVER_FILTER_PARAM)
        let filterLocal = localStorage.getItem(DRIVER_FILTER_PARAM_NEW);
        filterLocal = filterLocal ? JSON.parse(filterLocal) : null;
        this.state = {
            // 缩放filter面板
            showFilter: true,
            // 默认type为1：盘古运营活动
            type: filterLocal ? filterLocal.type : 1,
            // 活动总类别
            typeList: [],
            filterConfig: {},
            cityList: [],
            init: 1,
            filterLocal: filterLocal
            // filterLocal: null
        }

    }
    componentDidMount() {
        const { cityList } = this.props;
        if( cityList.length > 0 ) {
            this.fetchType();
        }
    }
    componentWillReceiveProps(nextProps) {
        if (nextProps.cityList !== this.props.cityList) {
            // console.log(nextProps.cityList)
            const cityLit = nextProps.cityList;
            if (cityLit.length < 0) {
                message.warning('城市列表为空');
                return
            }
            // 更新cityList，只请求一次
            if (init !== 0) {
                init--;
                this.fetchType();
            }
            
        }
    }
    fetchType() {
        const {actions} = this.props;
        actions.fetchActivityType( data => {
            this.setState({
                // activityType
                ...this.formatConfig(data)
            }, () => {
                this.setFilterConfig();
            })
        })
    }
    /** 
     * 格式化filter配置参数，如下
     *  {
     *     typeList: [{
     *             label: '盘古运营活动',
     *             value: '1'
     *         },
     *         {}],
     *     filterConfig: {
     *         1: {
     *             dimension:['activityStart', 'activityEnd', ...],
     *             measure: ['activityName', 'internalName', ...],
     *             activityTypeId: [{
     *                 label: '全部',
     *                 value: '-1',
     *                 children: [{}, {}, ...]
     *             }],
     *             productId: 同上
     *             ...
     *         }
     *         2: {}
     *     }
     *   }
    **/ 
    formatConfig(activityType) {
        const typeList = [];
        const filterConfig = {};
        // 目前是这三个，如果改动需要维护 2017/8/16
        const filterMap = ['activityTypeId', 'productId', 'activityStatus'];
        const treeSelect = {};
        activityType.length > 0 && activityType.forEach(item => {
            const config = {};
            filterConfig[item.value] = filterConfig[item.value] || {};
            if (item.type === 'dimension') {
                typeList.push({
                    label: item.label,
                    value: item.value
                })
                typeMap[item.value] = item.label;
                item.children.forEach(j => {
                    if (filterMap.indexOf(j.value) !== -1) {
                        config[j.value] = [{
                            label: '全部',
                            value: -1,
                            children: j.children
                        }]
                    }
                })
                filterConfig[item.value] = Object.assign(filterConfig[item.value], {
                    dimension: item.children,
                    ...config
                })
            }
            if (item.type === 'measure') {
                filterConfig[item.value].measure = item.children
            }
        })
        return {
            typeList,
            filterConfig
        }
    }
    /**
     *  缩放筛选面板
     */
    toggleFilter() {
        const {showFilter} = this.state;
        const {actions} = this.props;
        this.setState({
            showFilter: !showFilter
        }, ()=>{
            setTimeout(() => {
                actions.toggleFilter(this.state.showFilter);
            }, 500)
        });
    }
    getIds(value, opt='id') {
        if (_.isArray(value)) {
            return value.map( str => {
                return str.split(':')[1];
            })
        }
    }
    onTypeChange(value) {
        // const {actions} = this.props;
        // actions.setType(value);
        this.setState({
            type: value
        })
    }
    /**
     * 构造查询参数需要的格式
     * @param {表单数据} values 
     */
    formatSearchParam(values) {
        const filterMap = ['cityId', 'activityTypeId', 'productId', 'activityStatus'];
        const currentFilterConfig = this.state.filterConfig[this.state.type] || {};
        const obj = [];
        filterMap.forEach(item => {
            let value = values[item];
            if (_.isArray(value) && value[0] != -1) {
                if (item === 'cityId') {
                    value = value.map(i => {
                        // return +cityNameMapId[i];
                        return +i;
                    })
                }
                obj.push({
                    name: item,
                    operator: 'IN',
                    value: value
                })
            }
            if (_.isString(value) && value != -1) {
                // if (item === 'cityId') {
                //     // value = +cityNameMapId[value];
                //     value = +value;
                // }
                obj.push({
                    name: item,
                    operator: 'IN',
                    value: [+value]
                })
            }
        })
        // 这里参数顺序不要变，intelligence-details中获取过滤时间依赖顺序。
        const filterList = [
            {
                name: "activityStart",
                operator: 'GE',
                value: values['datePicker'][0]
            },
            {
                name: "activityEnd",
                operator: 'LE',
                value: values['datePicker'][1]
            },
            {
                name: "type",
                operator: 'EQ',
                value: +this.state.type
            },
            ...obj
        ]
        // 查询参数
        if (values.searchValue !== undefined && values.searchValue !== '') {
            let t = values['activityType'];
            if (t === 'activityId') {
                filterList.push({
                    name: 'activityId',
                    operator: 'EQ',
                    value: +values['searchValue']
                })
            }
            if (t === 'activityName') {
                filterList.push({
                    name: 'activityName',
                    operator: 'LIKE',
                    value: "%" + values['searchValue'] + "%"
                })
            }
            
        }
        return {
            dimensions: currentFilterConfig.dimension,
            measures: currentFilterConfig.measure,
            filterGroup: {
                connector: "AND",
                filterList
            },
        }

    }
    handleSubmit(e) {
        e.preventDefault();

        const { actions } = this.props;
        actions.setType(this.state.type);
        this.setFilterConfig();
    }
    setFilterConfig() {
        const {actions} = this.props;
        this.props.form.validateFields((err, fieldsValue) => {
            if (err) {
                return;
            }
            // Should format date value before submit.
            // 格式化日期时间戳
            const rangeValue = fieldsValue['datePicker'];
            const tstart = moment(rangeValue[0]).format('YYYY-MM-DD')
            const timeStart = moment( moment(tstart).format('YYYY-MM-DD HH:mm:ss') ).toDate().getTime();
            let tend = moment(rangeValue[1]).format('YYYY-MM-DD')
            let timeEnd;
            if (tend === moment().format('YYYY-MM-DD')) {
                timeEnd = rangeValue[1].valueOf()
            } else {
                timeEnd = moment( moment(tend).add(1, 'days').format('YYYY-MM-DD HH:mm:ss') ).toDate().getTime() - 1000;
            }

            fieldsValue['cityId'] = fieldsValue['cityId'].map( id => {
                return cityNameMapId[id];
            }) 

            const values = {
                ...fieldsValue,
                // datePicker: [rangeValue[0].format('YYYY-MM-DD'), rangeValue[1].format('YYYY-MM-DD')],
                datePicker: [timeStart, timeEnd],
            };
            console.log('Received values of form: ', values);

            const searchParam = this.formatSearchParam(values);
            this.setLocalstorage(searchParam);
            actions.setFilterConfig(searchParam);
        });       
    }
    cancel() {
        console.log('cancel');
    }
    setLocalstorage(param) {
        const filterMap = ['cityId', 'activityTypeId', 'productId', 'activityStatus', 'type'];
        const filterList = param.filterGroup.filterList;  
        let objMap = {};
        let objStorage = {};
        filterList.forEach(filter => {
            objMap[filter['name']] = filter;
        })
        filterMap.forEach(item => {
            objStorage[item] = objMap[item] ? objMap[item].value : -1;
        })
        objStorage['cityId'] = objStorage['cityId'].map( item => {
            return cityIdMapName[item];
        })
        localStorage.setItem(DRIVER_FILTER_PARAM_NEW, JSON.stringify(objStorage))
        // localStorage.setItem(DRIVER_FILTER_PARAM, null)
    }

    render() {
        const { filterConfig, type, typeList, showFilter, filterLocal } = this.state;
        const { toggleFilter, cityList } = this.props;
        const { getFieldDecorator } = this.props.form;

        const filterCN = cn({
            'panel': true,
            'panel-filter': true,
            'panel-filter-active': showFilter
        });
        const filterIconCN = cn({
            'nsky-icon': true,
            'nsky-icon-icon_fold': showFilter,
            'nsky-icon-icon_unfold': !showFilter
        })

        const cityChildren = cityList.map(city => {
            cityNameMapId[city.name] = city.id;
            cityIdMapName[city.id] = city.name;
            // return <Option value={city.name} key={city.name}>{city.name}</Option>
            return <Option value={city.name} key={city.name}>{city.name}</Option>
        })
        const prefixSelector = getFieldDecorator('activityType', {
            initialValue: 'activityName',
          })(
            <Select className="icp-selector">
              <Option value="activityName">名称</Option>
              <Option value="activityId">ID</Option>
            </Select>
          );
        
        const rangeConfig = {
            rules: [{ type: 'array', required: true, message: '请选择时间!' }],
            initialValue: [ moment().subtract(1, 'days'), moment().subtract(1, 'days') ]
        };
        let cityDefault = null
        if(filterLocal && Array.isArray(filterLocal['cityId'])) {
            cityDefault = filterLocal['cityId'].map(id => {
                // 这里的id类型必须保持一致。
                return id
            })
        }
        const cityRule = {
            rules: [{ required: true, message: '请选择城市!' }],
            initialValue: filterLocal ? filterLocal['cityId'] : ( cityList.length > 0 && [cityList[0].name] )
        };
        const productIdRule = {
            rules: [{ required: true, message: '请选择产品线!' }],
            initialValue: filterLocal ? filterLocal['productId'] : -1
        };
        const activityTypeIdRule = {
            rules: [{ required: true, message: '请选择活动类型!' }],
            initialValue: filterLocal ? filterLocal['activityTypeId'] : -1
        };
        const activityStatusRule = {
            rules: [{ required: true, message: '请选择活动状态!' }],
            initialValue: filterLocal ? filterLocal['activityStatus'] : -1
        };
   

        return (
            <div className={filterCN}>
                <div className="panel-hd" >
                    <i className={filterIconCN} onClick={() => {this.toggleFilter()}}></i>
                    筛选条件
                </div>
                <div className="panel-bd">
                    <Form onSubmit={(e) => {this.handleSubmit(e)}}>
                        <Row gutter={16}>
                            <Col className="gutter-row" span={8}>
                                <div className="gutter-box">
                                    <FormItem label="日期" colon={false}>
                                        {getFieldDecorator('datePicker', rangeConfig)(
                                            <RangePicker
                                                allowClear={false}
                                                style={{width:`100%`}}
                                                format={DATE_PICKER_FORMAT}
                                            />
                                        )}
                                    </FormItem>
                                </div>
                            </Col>
                            <Col className="gutter-row" span={8}>
                                <div className="gutter-box">
                                    <FormItem label="城市" colon={false}>
                                        {getFieldDecorator('cityId', cityRule)(
                                            <Select 
                                                multiple
                                                style={{ width: '100%' }}
                                                placeholder="请选择城市"
                                            >
                                            { cityChildren }
                                            </Select>
                                        )}
                                        
                                    </FormItem>
                                </div>
                            </Col>
                            <Col className="gutter-row" span={8}>
                                <div className="gutter-box">
                                    <FormItem label="产品线" colon={false}>
                                        {getFieldDecorator('productId', productIdRule)(
                                            <TreeSelect 
                                                multiple
                                                showCheckedStrategy={SHOW_PARENT}
                                                treeData={filterConfig[type] && filterConfig[type].productId}
                                                style={{ width: '100%' }}
                                                searchPlaceholder={"请选择产品线"}
                                                treeCheckable
                                            />
                                        )}
                                    </FormItem>
                                </div>
                            </Col>
                        </Row>
                        <Row gutter={16}>
                            <Col className="gutter-row" span={8}>
                                <div className="gutter-box gutter-box-2">
                                    <FormItem label="活动类型" colon={false}>
                                        <Select 
                                            style={{ width: "34%" }}
                                            value={typeMap[type]}
                                            onChange={(value) => {
                                                this.onTypeChange(value)
                                            }}
                                        >
                                            {
                                                typeList.map(type => 
                                                    <Option key={type.value}>{type.label}</Option>
                                                )
                                            }
                                        </Select>
                                        {getFieldDecorator('activityTypeId', activityTypeIdRule)(
                                            <TreeSelect 
                                                multiple
                                                showCheckedStrategy={SHOW_PARENT}
                                                treeData={filterConfig[type] && filterConfig[type].activityTypeId}
                                                style={{ width: "66%", paddingLeft: "10px" }}
                                                searchPlaceholder={"请选择活动类型"}
                                                treeCheckable
                                                className="abc"
                                            />
                                        )}
                                    </FormItem>
                                </div>
                            </Col>
                            <Col className="gutter-row" span={8}>
                                <div className="gutter-box">
                                    <FormItem label="活动状态" colon={false}>
                                        {getFieldDecorator('activityStatus', activityStatusRule)(
                                            <TreeSelect 
                                                multiple
                                                showCheckedStrategy={SHOW_PARENT}
                                                treeData={filterConfig[type] && filterConfig[type].activityStatus}
                                                style={{ width: "100%" }}
                                                searchPlaceholder={"请选择活动状态"}
                                                treeCheckable
                                            />
                                        )}
                                    </FormItem>
                                </div>
                            </Col>
                            <Col className="gutter-row" span={8}>
                    
                                <div className="gutter-box gutter-box-opt" >
                                    <FormItem className="search-item">
                                        {getFieldDecorator('searchValue')(
                                            <Input className="search-input" addonBefore={prefixSelector} placeholder="活动名称、ID搜索" />
                                        )}
                                    </FormItem>
                                    <div className="btn-group">
                                        <Button type="primary" className="ant-btn-blue" htmlType="submit">确定</Button>
                                        {
                                            // <Button className="ant-btn-blue-1" onClick={() => {this.cancel()}}>取消</Button>
                                        }
                                    </div>
                                </div>
                            </Col>
                        </Row>
                    </Form>
                </div>
            </div>
        )
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

export default Form.create()(connect(mapStateToProps, mapDispatchToProps)(Filter))


// export default Form.create()(Filter)