/*
 * @Author: hedonghui
 * @Date: 2017-08-09 14:40:44
 * @Last Modified by: hedonghui
 * @Last Modified time: 2017-11-23 18:10:41
 */
import _ from 'lodash'
import cn from 'classnames'
import moment from 'moment'
import React, { Component } from 'react'
import ReactDOM, { findDOMNode } from 'react-dom'
import autoBind from 'react-autobind'
import localstorage from 'store'

// redux
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import iActions, { exportActivityCSV } from '../actions'

//ant
import { Table, Tabs, Button, message, Spin, Dropdown, Menu, Icon } from 'antd'
const TabPane = Table.TabPane

//const
const DATE_PICKER_FORMAT = 'YYYY/MM/DD'
const SEL_MEAS_MAP = 'SEL_MEAS_MAP'

import config from '../config';

import NskyMetricSelect from 'components/nsky-metric-select';

class TableSummary extends Component {
    constructor(props) {
        super(props)
        autoBind(this);
        this.state = {
            // 直接写了 有空再改
            typeMap: {
                1: '盘古运营活动',
                2: '司机运营活动'
            },
            type: 1,
            page: 1,
            size: 20,
            tabelSumTotal: 0,
            formatList: [],
            formatListRules: [],
            selectedRowKeys: [],
            selectedRows: [],
            orders: [],
            /**
             * measure选择相关参数
             */
            // 存储不同type的所有measures（这里比较特殊，dimension和measures放在一起的）
            measMap: {
                // 1: {
                //     // 格式化之后的measures,处理rules
                //     formatMeas:[],
                //     // 原始的measures数据
                //     measures:[]
                // },
                // ...
            },
            selectMeas: [],
            selectedMeasMap: config.selectedMeasMap,
            // selectedMeasMap: localstorage.get(SEL_MEAS_MAP) || config.selectedMeasMap
            loading: false,
            // 选中指标中是否有rules
            hasRules: true

        }
        // 把默认表格头配置存储在本地 初始化
        const localSelectedMeasMap = localstorage.get(SEL_MEAS_MAP);
        if(!localSelectedMeasMap) {
            localstorage.set(SEL_MEAS_MAP, config.selectedMeasMap);
        }

    }
    componentDidMount() {
        this.setState({
            scroll: {
                y: this.calScrollY(),
                x: 1600
            }
        })
    }
    componentWillReceiveProps(nextProps) {
        const { type, measMap, searchParam, selectedMeasMap} = this.state;
        if (nextProps.type !== this.props.type) {
            this.setState({
                type: nextProps.type
            })
        }
        if (nextProps.showFitler !== this.props.showFitler) {
            this.setState({
                scroll: {
                    y: this.calScrollY(),
                }
            })
        }
        if (nextProps.searchParam !== this.props.searchParam) {
            // 将type对应的所有dimensions保存在state中
            let obj = {};
            if (!measMap[type]) {
                // 原始meas数据
                const measures = nextProps.searchParam.dimensions.concat(nextProps.searchParam.measures);
                // 格式化之后的meas数据
                const formatMeas = this.formatMeas(measures);
                obj[type] = {
                    measures,
                    formatMeas
                };
            }
            this.setState({
                searchParam: nextProps.searchParam,
                measMap: Object.assign(measMap, obj),
                page: 1,
            }, () => {
                this.fetchList();
            })
        }
        if (nextProps.activityType !== this.props.activityType) {
            const obj = {};
            nextProps.activityType.length > 0 && nextProps.activityType.forEach(item => {
                if (item.type === 'dimension') {
                    obj[item.value] = item.label;
                }
            })
            this.setState({
                typeMap: obj
            })
        }
        // 真正获取到数据之后的操作。
        if (nextProps.activityList !== this.props.activityList) {
            this.setState({
                activityList: nextProps.activityList,  // 原数据
                formatListRules: this.formatList(nextProps.activityList, true),  // 格式化之后的数据，带规则处理
                formatList: this.formatList(nextProps.activityList, false),  // 格式化之后的数据
                tabelSumTotal: nextProps.tabelSumTotal,
                selectedRowKeys: [], // 数据更新，清空已选择的数据
                selectedRows: [],
                loading: false
            })

        }
    }
    /**
     * 格式化meas数据，把rule对应的meas合并到rule下，过滤type
     *
˚     * @param {any} meas
     * @memberof TableSummary
     */
    formatMeas(meas) {
        const { rulesMap } = config;
        const { type } = this.state;
        const ruleMap = rulesMap[type]['map'];
        const ruleList = rulesMap[type]['list'];
        let newMeas = meas.filter(mea => {
            if (mea.value === 'type') return false;
            return ruleMap.indexOf(mea.value) === -1;
        })
        newMeas.push({
            label: '活动规则',
            value: 'rules',
            children: ruleList
        })
        return newMeas;
    }
    /**
     * 格式化table数据，处理rule
     *
     * @param {any} list
     * @memberof TableSummary
     */
    formatList(list, hasRules) {
        if (list && list.length === 0) return [];
        list = _.cloneDeep(list);
        let newList = [];
        if ( hasRules ) {
            list.forEach((item, index) => {
                let rules = item.rules;
                // 如果rules长度大于0
                if (rules.length > 0) {
                    delete item.rules
                    rules.forEach((i, idx, arr) => {
                        newList.push({
                            ...item,
                            ...i,
                            key: index + '-' + idx,
                            rowSpan: idx === 0 ? arr.length : 0
                        })
                    })
                } else {
                    newList.push({
                        ...item,
                        key: index + '-',
                        rowSpan: 1
                    })
                }
            })
        } else {
            newList = list.map( (item, index) => {
                return {
                    ...item,
                    key: index + '-',
                    rowSpan: 1
                }
            } )
        }
        console.log(newList)
        return newList;
    }
    /** 获取列表 */
    fetchList() {
        const { actions } = this.props;
        const { page, size, orders, searchParam } = this.state;
        const dimensions = searchParam.dimensions.concat(searchParam.measures);

        let param = {
            // 放置在url上的参数
            size,
            page,
            // 实际查询参数
            // 按照活动时间降序
            param: {
                orders: orders.concat('-activityStart'),
                dimensions: dimensions.map(item => item.value),
                filterGroup: searchParam.filterGroup
            }
        };
        this.setState({
            loading: true,
            fetchParam: param
        }, () => {
            actions.fetchActivityList(param);
        })
    }
    // table自适应筛选框缩放，需要计算每页显示行数
    // 计算公式：(可视区域高度 - table之外已有节点的高度)/每行的行高 = 行数
    calScrollY() {
        const bodyH = document.querySelector('body').getBoundingClientRect().height;
        const topPanelH = document.querySelector('.top-panel').getBoundingClientRect().height;
        const filterH = document.querySelector('.ant-layout-header').getBoundingClientRect().height;
        const trH = document.querySelector('.ant-table-thead').getBoundingClientRect().height + 2;
        // const tabsBarH =document.querySelector('.ant-tabs-bar').getBoundingClientRect().height + 20;
        const panelSumH = document.querySelector('.panel-table-summary .panel-hd').getBoundingClientRect().height + 20;
        const toolsH = document.querySelector('.panel-tools').getBoundingClientRect().height;
        // intelligence.padding + blank + pageH
        const other = 60;
        const scrollY = bodyH - filterH - topPanelH - trH - panelSumH - toolsH - other;
        return scrollY
    }
    /**
     * 获取表头列表
     * 涉及到rule的展开
     */
    getColumns() {
        const { type, selectedMeasMap } = this.state;
        const { unSortableMeas, urlMap, rulesMap, invisibleRules, unfoldMeas, measWidth } = config;
        // 默认列宽
        const width = 150;
        const defaultConfig = {
            // className: "col-custom-style",
        };
        const columns = [];

        const renderContent = (value, row, index) => {
            const obj = {
                children: value,
                props: {
                    rowSpan: row.rowSpan
                },
            };
            return obj;
        };


        selectedMeasMap[type].forEach((item, index) => {
            let column = {
                render: renderContent
            };
            // 排序设置
            if (unSortableMeas.indexOf(item.value) === -1) {
                column.sorter = true;
            } else {
                column.sorter = false;
            }

            // rule展开 单独push
            if (item.value === 'rules') {
                let colRule = {
                    title: '活动规则',
                    children: [],
                    render: (value, row, index) => {
                        const obj = {
                            children: value,
                            props: {
                                rowSpan: 1
                            },
                        };
                        return obj;
                    }
                }
                if (!item.children) {
                    item.children = rulesMap[type]['list'];
                }
                item.children.forEach(i => {
                    if (invisibleRules.indexOf(i.value) !== -1) return;
                    colRule.children.push({
                        title: i.label,
                        dataIndex: i.value,
                        key: i.value,
                        width: measWidth[i.value] || width
                    })
                })
                columns.push(colRule);
                return

            }

            // 活动ID链接设置
            if (item.value === 'activityId') {
                column.render = (value, row, index) => {
                    const obj = {
                        children: <span> <a target="_blank" href={urlMap[type] + row.activityId}>{row.activityId}</a> </span>,
                        props: {
                            rowSpan: row.rowSpan 
                        },
                    };
                    return obj;
                }
                column.title = item.label + '(链接MIS)';
            }
            // 活动名称跳转设置
            if (item.value === 'activityName') {
                column.render = (value, row, index) => {
                    const idx = row.key.split('-')[0];
                    const obj = {
                        children: <span> <a href='javascript:void(0)' onClick={() => { this.props.selectRow(true, [this.state.activityList[idx]]); }}>{row.activityName}</a> </span>,
                        props: {
                            rowSpan: row.rowSpan 
                        },
                    };
                    return obj;
                }
            }
            // 对象展开
            if (unfoldMeas.indexOf(item.value) !== -1) {
                column.render = (value, row, index) => {
                    const obj = {
                        children: row[item.value].label,
                        props: {
                            rowSpan: row.rowSpan 
                        },
                    };
                    return obj;
                }
                // if (item.value === 'cityId') {
                //     column.title = '城市'
                // }
            }

            columns.push({
                ...defaultConfig,
                title: item.label,
                dataIndex: item.value,
                key: item.value,
                // width: index === selectedMeasMap[type].length - 1 ? '' : width,
                width: measWidth[item.value] || width,
                ...column,
            })

        })
        return columns
    }
    /**
     * 设置类名
     *
     * @memberof TableSummary
     */
    getRowClassName(record, index) {
        if (record.rowSpan === 0) {
            return 'no-selection'
        }
    }
    /**
     * 格式化列表数据
     * 涉及到ruleId时，需要拆分
     */
    getDataSource() {
        const { hasRules } = this.state;
        if (hasRules) {
            return this.state.formatListRules
        } else {
            return this.state.formatList
        }
    }
    onMeasureChange(selectMeas) {
        // if (selectMeas.length < 5) {
        //     message.warning('指标不能小于5条');
        //     return;
        // }
        // this.setState({
        //     selectMeas
        // });
    }
    // 关闭指标选择
    onCloseMeasure(measures) {

        const {type, selectedMeasMap } = this.state;
        // 如果与前面相同 则不做处理
        if(_.isEqual(selectedMeasMap[type], measures)) return;

        let selectedMeasMapCopy; 

        // 如果指标选择为空
        if ( measures.length === 0 ) {
            message.warning('指标不能为空，重置为默认值');
            selectedMeasMapCopy =  _.cloneDeep(config.selectedMeasMap);
            this.setState({
                selectedMeasMap: selectedMeasMapCopy,
                hasRules: true
            }, () => {
                // 选择存储在本地
                localstorage.set(SEL_MEAS_MAP, selectedMeasMapCopy);
            })
        } else {
            selectedMeasMapCopy = _.cloneDeep(selectedMeasMap);
            selectedMeasMapCopy[type] = measures;

            let hasRules = measures.some( mea => {
                return mea.value === 'rules';
            })

            this.setState({
                hasRules,
                selectedMeasMap: selectedMeasMapCopy
            }, () => {
                // 选择存储在本地
                localstorage.set(SEL_MEAS_MAP, selectedMeasMapCopy);
            })
        }

       
    }
    onTableChange(pagination, filters, sorter) {
        let orderStr
        if (sorter.order) {
            orderStr = sorter.order === "ascend" ? sorter.columnKey : "-" + sorter.columnKey;
        }
        this.setState({
            page: pagination.current,
            orders: orderStr ? [orderStr] : []
        }, () => {
            this.fetchList();
        })
    }
    toContrast() {
        const { selectedRowKeys, activityList } = this.state;
        const convertData = selectedRowKeys.map(item => {
            const index = item.split('-')[0];
            return activityList[index];
        })
        this.props.selectRow(true, convertData);

        // 活动效果评估／对比--添加埋点
        utils.setOmega('expressIntelligenceContrast');
    }
    onSelectChange(selectedRowKeys, selectedRows) {
        // console.log('selectedRowKeys changed: ', selectedRowKeys);
        this.setState({ selectedRowKeys, selectedRows });
    }
    handleMenuClick(menu) {
        this.setState({
            size: menu.key
        }, () => {
            this.fetchList();
        })
    }
    exportCSV() {
        const { fetchParam, selectedMeasMap, type, hasRules } = this.state;
        let param = {
            hasRules,
            title: '活动全览.csv',
            fetchParam: fetchParam.param,
            selectedMeas: selectedMeasMap[type]
        }
        exportActivityCSV(param, () => {
            message.success('导出成功！');
        })
    }
    render() {
        const { selectedRowKeys, formatListRules, size, tabelSumTotal, typeMap, hasRules,
                type, selectedRows, scroll, loading, selectedMeasMap, measMap } = this.state;
        
        const rowSelection = {
            selectedRowKeys: selectedRowKeys,
            onChange: this.onSelectChange.bind(this),
            getCheckboxProps: item => ({
                disabled: selectedRowKeys.length === 3 && !selectedRowKeys.includes(item.key),    // Column configuration not to be checked
            }),
        };

        // 为什么要fake? 因为rules展开之后，实际每页显示的数目会和默认值不一致.
        const fakeSize = formatListRules.length || size;
        const fakeTotal = tabelSumTotal/size * fakeSize || tabelSumTotal;
        const pagination = {
            total: hasRules ? fakeTotal : tabelSumTotal,
            pageSize: hasRules ? fakeSize : size,
            onChange: (current) => {
                console.log('Current: ', current);
            },
        };

        const menu = (
            <Menu onClick={this.handleMenuClick}>
              <Menu.Item key="20">20 条/页</Menu.Item>
              <Menu.Item key="40">40 条/页</Menu.Item>
              <Menu.Item key="60">60 条/页</Menu.Item>
            </Menu>
          );


        return (
            <div className="panel panel-table-summary">
                <Spin spinning={loading}>   
                    <div className="panel-hd" >
                        {typeMap[type]}
                        <div className="panel-tools clearfix">
                            <div className="ant-btn ant-btn-metric">
                                <NskyMetricSelect
                                    placement="rightTop"
                                    title="更换列"
                                    subtitle="显示以下列"
                                    measures={measMap[type] && measMap[type].formatMeas}
                                    values={selectedMeasMap[type]}
                                    onChange={this.onMeasureChange.bind(this)}
                                    onClose={this.onCloseMeasure}
                                    limit="8"
                                >
                                    <div className="intelligence-change-metric">
                                        <i className="nsky-icon nsky-icon-chazhaobiaodanliebiao" />
                                    </div>
                                </NskyMetricSelect>
                            </div>
                            <Button type="primary"  onClick={this.exportCSV} >导出csv</Button>
                            <Button type="primary" className="ant-btn-blue-1" onClick={this.toContrast} disabled={selectedRows.length === 0}>对比</Button>
                        </div>
                    </div>
                    <div className="panel-bd">
                        <Table
                            dataSource={this.getDataSource()}
                            columns={this.getColumns()}
                            rowClassName={this.getRowClassName}
                            rowSelection={rowSelection}
                            pagination={pagination}
                            onChange={this.onTableChange}
                            size={"middle"}
                            scroll={scroll}
                            bordered
                        />
                        <Dropdown overlay={menu}>
                            <Button style={{ marginLeft: 8, position:'absolute', bottom: 16, right: 100, zIndex: 1 }}>
                            {size} <Icon type="down" />
                            </Button>
                        </Dropdown>
                    </div>
                </Spin>
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

export default connect(mapStateToProps, mapDispatchToProps)(TableSummary)

// export default TableSummary
