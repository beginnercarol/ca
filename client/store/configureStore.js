import {createStore,combineReducers} from 'redux';
import panelReducer from '../reducers/panel-reducer';
import { EDEADLK } from 'constants';
const rootresucers = combineReducers({
    panelReducer
})


let store = createStore(rootresucers);

export default store;