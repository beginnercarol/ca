/*
 * @Author: hedonghui
 * @Date: 2017-08-09 14:40:44
 * @Last Modified by: hedonghui
 * @Last Modified time: 2017-11-20 19:28:42
 */

import './index.css'
import cn from 'classnames'
import moment from 'moment'
import React, { Component } from 'react'
import { connect } from 'react-redux';

//ant
import { Layout, Icon } from 'antd'
const { Header, Footer, Sider, Content } = Layout;

import IntelligenceDetails from './intelligence-details';

// components
import Filter from './filter'
import PopupLayer from './popup-layer';
import TableSummary from './table-summary';
import iActions from './actions'

const DATE_PICKER_FORMAT = 'YYYY/MM/DD'

// redux
import { createStore, applyMiddleware } from 'redux'
import { Provider } from 'react-redux'
import reducers from './reducers'
import thunkMiddleware from 'redux-thunk'

const createStoreWithMiddleware = applyMiddleware(
    thunkMiddleware,
)(createStore)
let store = createStoreWithMiddleware(reducers)

class Intelligence extends Component {
    constructor(props) {
        super(props)
        this.state = {
            // 控制是否显示详情页
            showDetail: false,
        }
    }
    componentDidMount() {

    }
    componentWillReceiveProps(nextProps) {
    }

    selectRow(showDetail, detailsData) {
        console.log('detailsData:', detailsData)
        this.setState({
            showDetail,
            detailsData
        })

    }

    render() {
        const { cityList } = this.props;
        const { showDetail, detailsData } = this.state

        return (
            <Provider store={store}>
                <div className="nsky-intelligence-layer">
                    {
                        showDetail ? <a className="intelligence-details-close" onClick={() => this.setState({ showDetail: false })}>
                            <Icon type="arrow-left" />
                        </a> : null
                    }
                    <div className="nsky-intelligence">
                        <Layout>
                            <Header ref="head">
                                <Filter
                                    cityList={cityList || []}
                                />
                            </Header>
                            <Content>
                                <TableSummary
                                    selectRow={this.selectRow.bind(this)}
                                />
                            </Content>
                        </Layout>

                        {
                            showDetail ?
                                <PopupLayer className="popup-wrap" visible={showDetail}>
                                    <IntelligenceDetails datas={detailsData} />
                                </PopupLayer> : null
                        }
                    </div>
                </div>
            </Provider>
        )
    }
}

export default Intelligence

