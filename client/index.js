import React,{Component} from 'react';
import ReactDOM from 'react-dom';
import {Router,BrowserRouter} from 'react-router-dom';
import store from './store/configureStore';
import {Provider} from 'react-redux';
import Home from './application/home';
import createBrowserHistory from 'history/createBrowserHistory';
const history = createBrowserHistory();


ReactDOM.render(
    <Provider store={store}>
        <Router history={history}>
            <Home/>
        </Router>
    </Provider>,
    document.getElementById('root')
);