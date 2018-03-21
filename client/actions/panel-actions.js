import types from './a-constants';
const panelActions = {
    getInitialConfig(data){
        return {
            type:types.INITIAL_STATE,
            data:data
        }
    }
}

export default panelActions;