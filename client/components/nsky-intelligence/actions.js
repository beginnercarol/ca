
import 'isomorphic-fetch'
import { httpFetch, actionFetch, downloadHttp } from '@didi/nsky-http'
import * as types from './a-const'


export default {
    // get activity type
    fetchActivityType(callback) {
        return actionFetch({
            url: '/platform/v1/activity/type',
            callback,
            actionType: types.FETCH_ACTIVITY_TYPE
        })
    },
    // 设置 TYPE
    setType(data) {
        return {
            type: types.SET_TYPE,
            data: data
        }
    },
    // 设置 查询参数
    setFilterConfig(data) {
        return {
            type: types.SET_FILTER_CONFIG,
            data: data
        }
    },
    // 收放Filter, 影响table可视高度
    toggleFilter(data) {
        return {
            type: types.TOGGLE_FILTER,
            data: data
        }
    },
    setTime(data) {
        return {
            type: types.SET_TIME_BY_DRIVER,
            data: data
        }
    },

    setDriverOrOrder(data) {
        return {
            type: types.DRIVER_OR_ORDER,
            data: data
        }
    },

    setDriverListAndTag(selectItems) {
        return {
            type: types.SET_DRIVER_LIST_AND_TAG,
            data: selectItems
        }
    },

    // get activity list
    fetchActivityList(data) {
        const page = data.page;
        const size = data.size;
        return actionFetch({
            url: `/platform/v1/activity/list?page=${page}&size=${size}`,
            actionType: types.FETCH_ACTIVITY_LIST,
            httpType: 'POST',
            param: data.param
        })
    },
    // Get Reward Detail
    fetchGetRewardDetails(params, callback) {
        const type = params.type;
        const activityId = params.activityId;
        return actionFetch({
            url: `/platform/v1/reward/detail/${type}/${activityId}`,
            callback,
            actionType: types.FETCH_GET_REWARD_DETAILS,
            httpType: 'POST'
        });
    },

    fetchGetTags(params, callback) {
        const cityIds = params.cityIds;
        return actionFetch({
            url: `/platform/v1/activity/tag/list?cityId=${cityIds}`,
            callback,
            actionType: types.FETCH_GET_TAGS,
            httpType: 'GET'
        });
    },



}

/**
* 查询详情页面 当前activityId 的 符合该规则的司机数  符合该规则的订单数  平台支付金额单位元 动调支付金额单位元
* @param {*} params
* @param {*} callback
*/
export function fetchGetRewardOverview(params, callback) {
    const type = params.type;
    const activityId = params.activityId;
  
    return new Promise((resolve, reject) => {
        httpFetch({
            url: `/platform/v1/reward/overview/${type}/${activityId}`,
            param: params.param,
            callback: (data) => {
                resolve(data)
            }
        }, 'POST')
    })
}


/**
     * 查询详情页面，具体的图表 有3个值
     * ordCnt  柱状图   横轴  值 下标
     * driCnt 纵轴     柱状图的高低  （完单人数 ）
     * percentage 占比   线
     */
export function fetchGetRewardGroup(params, callback) {
    const type = params.type;
    const activityId = params.activityId;
    
    return new Promise((resolve, reject) => {
        httpFetch({
            url: `/platform/v1/reward/group/${type}/${activityId}`, // 新接口
            param: params.param,
            callback: (data) => {
                resolve(data)
            }
        }, 'POST')
    })
}
// 活动全览CSV下载
export function exportActivityCSV(param, callback) {
    let url = `/platform/v1/activity/download`;
    downloadHttp({
        url,
        callback,
        param: param
    }, 'POST');
}

// 活动明细CSV下载
export function exportActivityDetailsCSV(param, callback) {
    console.log(param)
    let url = `/platform/v1/activity/details/download`;
    downloadHttp({
        url,
        callback,
        param: param
    }, 'POST');
}