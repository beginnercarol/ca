export default {
    // 对应tyape默认已选择的measures
    selectedMeasMap: {
        // 盘古运营活动
        1: [{label: "活动名称", value: "activityName"},
            {label: "活动预算总金额", value: "activityAmount"}, 
            {label: "活动规则", value: "rules"}, 
            {label: "指派成交率", value:"driverTurnover"}, 
            {label: "活动Id", value:"activityId"}],
        // 司机运营活动
        2: [{label: "活动名称", value: "activityName"},
            {label: "活动预算总金额", value: "activityAmount"}, 
            {label: "活动规则", value: "rules"}, 
            {label: "指派成交率", value:"driverTurnover"}, 
            {label: "活动Id", value:"activityId"}]
    }, 
    // 不用排序的measures
    unSortableMeas: ["activityName", "activityId"],
    // activityId对应的跳转链接地址
    urlMap: {
        1: "http://mis.xiaojukeji.com/gulfstream/mis/riverrun/pangu/mIndex/index/#/detail?id=",
        2: "http://mis.xiaojukeji.com/crm/index.php?r=activity/driver/showDetailPage&activity_id="
    },
    // 一些不需要显示的meas
    invisibleRules: ["ruleId"],
    // 常规是数据activityId: 64086， 特殊需要展开的数据如cityID: {label:'北京市', value:'1'}，需要展开才能显示北京市.
    unfoldMeas: ['cityId', 'activityStatus', 'activityTypeId', 'productId'], 
    // 表格头宽度设置
    measWidth: {
        calOrderModel: 100,
        calStriveModel: 100,
        activityId: 100,
        activityAmount: 120,
        cityId: 100,
        activityTypeId: 100,
        productId: 100  
    },
    // rules对应的meas
    rulesMap: {
        1: {
            map:["ruleId", "calOrderModel", "calStriveModel", "calIndex", "limitArea", "calTime", "rewardWay"],
            list: [
                {label: "规则Id", value: "ruleId"},
                {label: "订单模式", value: "calOrderModel"},
                {label: "订单级别", value: "calStriveModel"},
                {label: "计算指标", value: "calIndex"},
                {label: "围栏名", value: "limitArea"},
                {label: "计算时段", value: "calTime"},
                {label: "奖励方式", value: "rewardWay"},
            ]
        },
        2: {
            map:["ruleId", "calOrderModel", "calStriveModel", "calCycle", "calIndex", "limitArea", "calTime", "rewardWay"],
            list: [
                {label: "规则Id", value: "ruleId"},
                {label: "订单模式", value: "calOrderModel"},
                {label: "订单级别", value: "calStriveModel"},
                {label: "计算周期(天)", value: "calCycle"},
                {label: "计算指标", value: "calIndex"},
                {label: "围栏名", value: "limitArea"},
                {label: "计算时段", value: "calTime"},
                {label: "奖励方式", value: "rewardWay"},
            ]
        },
    },

    set(key, value) {
        this[key] = value;
    }
}