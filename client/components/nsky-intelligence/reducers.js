import * as types from './a-const'


export default function intelligence(state = {
    // 活动类型 1：盘古运营活动，2：司机运营活动
    type: 1,
    activityType: {},
    activityList: [],
    // list总条数
    tabelSumTotal: 0,
    // get activity list 查询参数
    searchParam: {},
    showFitler: true,
    showDetail: false,
    dataList: null,
    tagList: null,
    detailList: null,
    doubleTrend: null,
    driverParams: {},
    analysisType: 1,
    selectItems: [{ id: -1, name: "全部司机", driverList: null }],
    timeInfos: null
}, action) {
    switch (action.type) {
        case types.FETCH_ACTIVITY_TYPE:
            return Object.assign({}, state, {
                activityType: action.data
            })
        case types.SET_TYPE:
            return Object.assign({}, state, {
                type: action.data
            })
        case types.SET_FILTER_CONFIG:
            return Object.assign({}, state, {
                searchParam: action.data
            })
        case types.TOGGLE_FILTER:
            return Object.assign({}, state, {
                showFitler: action.data
            })
        case types.FETCH_ACTIVITY_LIST:
            // console.log(action)
            return Object.assign({}, state, {
                activityList: action.data.list || [],
                tabelSumTotal: +action.data.total || 0
            })
        case types.OPEN_DETAILS:
            return Object.assign({}, state, {
                showDetail: action.data.showDetail,
                dataList: action.data.dataList
            })
        case types.FETCH_GET_TAGS:
            return Object.assign({}, state, {
                tagList: action.data
            });
        case types.FETCHG_GET_REWARD_OVERVIEW:
            return Object.assign({}, state, {
                detailList: action.data
            })

        case types.FETCH_GET_REWARD_DETAILS:
            return Object.assign({}, state, {

            });
        case types.FETCH_GET_REWARD_GROUP:
            return Object.assign({}, state, {
                doubleTrend: action.data
            });

        case types.SET_DRIVER_LIST_AND_TAG:
            return Object.assign({}, state, {
                selectItems: action.data
            })
        case types.DRIVER_OR_ORDER:
            return Object.assign({}, state, {
                analysisType: action.data
            });
        case types.SET_TIME_BY_DRIVER:
            return {
                ...state,
                timeInfos: action.data
            }
        default:
            return state
    }
}
