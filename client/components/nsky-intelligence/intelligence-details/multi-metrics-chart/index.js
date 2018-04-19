import './index.css';
import React, { Component } from 'react';
import PropTypes from 'prop-types'
import autoBind from 'react-autobind';
import echarts from 'echarts';

// import { findMeasureNameById, calcNumberFormat } from '../utils';

// const LINE_COLOR = ['#1589EE', '#50E3C2', '#F8E71C', '#A8B7C7'];
// const AREA_COLOR = ['rgba(118, 181, 255, 0.5)', 'rgba(155, 239, 220, 0.5)', 'rgba(255, 238, 183, 0.5)', 'transparent'];
// const AREA_COLOR_END = ['rgba(118, 181, 255, 0)', 'rgba(155, 239, 220, 0)', 'rgba(255, 238, 183, 0)', 'transparent'];

class MultiMetricsChart extends Component {
    constructor(props) {
        super(props)
        autoBind(this)

        this.chartObj = null;
        this.chartDom = null;

        this.state = {
            colors: [
                ['#71C6FF', '#1589EE'],
                ['#C3FBDA', '#84FAB0'],
                ['#F7E18E', '#FCC06A']
            ],
            analysisTypeMap: {
                1: {
                    name: '司机数',
                },
                2: {
                    name: '完单数',
                },
                3: {
                    name: '人数',
                },
                4: {
                    name: '人数',
                }
            }    
        }
    }
    componentDidMount() {
    }

    componentWillReceiveProps(nextProps) {
        const data = nextProps.data;
        if (data && data.length > 0) {
            this.chartObj.dispose();
            this.chartObj = echarts.init(this.chartDom);

            this.chartObj && this.chartObj.setOption(this.processData(data));
            this.chartObj && this.chartObj.resize();
        }

    }

    processData(data) {

        var series = [];
        var xAxis = [];
        var legendData = [];
        var barMin;
        var barMax;
        var lineMin;
        var lineMax;
        const { analysisType } = this.props;
        const { colors, analysisTypeMap } = this.state;

        _.forEach(data[0].data, (item) => {
            xAxis.push(item.xAxis);
        });

        _.forEach(data, (group, index) => {
            let seriesData = [],
                lineData = [];
            let groupData = group.data;
            let groupName = group.name;

            legendData = legendData.concat({
                name: groupName + analysisTypeMap[analysisType].name,
                icon: 'circle'
            }, {
                name: groupName + '累计占比',
                icon: 'line'
            });

            barMin = barMin > _.minBy(groupData, "yAxis").yAxis ? _.minBy(groupData, "yAxis").yAxis : barMin;
            barMax = barMax < _.maxBy(groupData, "yAxis").yAxis ? _.maxBy(groupData, "yAxis").yAxis : barMax;

            lineMin = lineMin > _.minBy(groupData, "percentage").percentage ? _.minBy(groupData, "percentage").percentage : lineMin;
            lineMax = lineMax < _.maxBy(groupData, "percentage").percentage ? _.maxBy(groupData, "percentage").percentage : lineMax;

            for (var key in groupData) {

                let yAxis = groupData[key].yAxis;
                let percentage = groupData[key].percentage;

                seriesData.push(yAxis);
                lineData.push(percentage);

            }
            var yAxis = {
                name: groupName + analysisTypeMap[analysisType].name,
                type: 'bar',
                data: seriesData,
                itemStyle: {
                    normal: {
                        barBorderRadius: [20, 20, 0, 0],
                        color: new echarts.graphic.LinearGradient(
                            0, 0, 0, 1,
                            [
                                { offset: 0, color: colors[index][0] },
                                { offset: 1, color: colors[index][1] }
                            ]
                        )
                    }
                },
                barWidth: 11
            };
            var percent = {
                name: groupName + '累计占比',
                type: 'line',
                yAxisIndex: 1,
                smooth: true,
                data: lineData,
                lineStyle: {
                    normal: {
                        width: 3,
                        color: new echarts.graphic.LinearGradient(
                            0, 0, 0, 1,
                            [
                                { offset: 0, color: colors[index][0] },
                                { offset: 1, color: colors[index][1] }
                            ]
                        )
                    }
                }
            }
            series.push(yAxis, percent);
        })


        let options = {
            color: ['#468EE5'],
            tooltip: {
                trigger: 'axis',
                axisPointer: {
                    type: 'cross'
                }
            },
            grid: {
                right: 70,
                left: 60,
                top: 60,
                bottom: 50
            },
            // toolbox: {
            //     feature: {
            //         dataView: {show: true, readOnly: false},
            //         restore: {show: true},
            //         saveAsImage: {show: true}
            //     }
            // },
            legend: {
                type: 'scroll',
                data: legendData,
                right: 0,
                top: 0,
                itemGap: 20,
                formatter: function (name) {
                    return echarts.format.truncateText(name, 130, '14px Microsoft Yahei', '…');
                },
                tooltip: {
                    show: true
                }
            },
            xAxis: [{
                type: 'category',
                axisTick: {
                    alignWithLabel: true
                },
                data: xAxis
            }],
            yAxis: [
                {
                    type: 'value',
                    name: analysisTypeMap[analysisType].name,
                    min: barMin,
                    max: barMax,
                    position: 'left',
                    axisLine: {
                        lineStyle: {
                            color:  '#54698D'
                        },
                        show: false
                    },
                    nameGap: 20,
                    axisLabel: {
                        textStyle: {
                            fontSize: 12,
                            fontFamily: 'STHeitiSC-Light',
                            color:  '#54698D'
                        },
                        margin: -10
                    },
                    offset: 40,
                    nameTextStyle: {
                        fontSize: 12,
                        fontFamily: 'STHeitiSC-Light',
                        color:  '#54698D'
                    },
                    axisTick: {
                        show: false
                    }
                },
                {
                    type: 'value',
                    name: '累计占比',
                    min: lineMin,
                    max: lineMax,
                    position: 'right',
                    axisLine: {
                        lineStyle: {
                            color:  '#54698D'
                        },
                        show: false
                    },
                    nameGap: 20,
                    axisLabel: {
                        textStyle: {
                            fontSize: 12,
                            fontFamily: 'STHeitiSC-Light',
                            color:  '#54698D'
                        },
                        margin: -20
                    },
                    offset: 40,
                    nameTextStyle: {
                        fontSize: 12,
                        fontFamily: 'STHeitiSC-Light',
                        color:  '#54698D'
                    },
                    axisTick: {
                        show: false
                    }
                }
            ],
            series: series
        };


        return options;
    }

    initChart(dom) {
        if (dom) {
            this.chartDom = dom;
            this.chartObj = echarts.init(dom);
            if (this.props.data && this.props.data.length > 0) {
                this.chartObj.setOption(this.processData(this.props.data));
            }

        }
    }

    render() {
        return (
            <div className="multi-metrics-chart">
                <div className="multi-metrics-chart-graph" ref={this.initChart}></div>
            </div>
        )
    }
}

export default MultiMetricsChart;
