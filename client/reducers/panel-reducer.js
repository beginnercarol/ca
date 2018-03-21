import types from '../actions/a-constants';
const initialState = {
    initialConfig:[],
    nomore:'nomore',
}

export default function panelReducer(state=initialState,action={}){
    switch(action.type){
        case types.INITIAL_STATE:
            return Object.assign({},state,{initialState:action.data});
        // case types.FETCH_TIME:
        //     return {
        //         ...state,
        //         fetchTime:action.data
        //     }
        default:
            return state;
    }
}