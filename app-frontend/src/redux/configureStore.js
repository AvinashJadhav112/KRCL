import { createStore, applyMiddleware } from 'redux';
import authReducer from './authReducer';
import logger from 'redux-logger';
import thunk from 'redux-thunk';
import * as apiCalls from '../api/apiCalls';


const configureStore = (addLogger = true) => {

    let localStorageData = localStorage.getItem('user-auth');

    let persistedState = {
        id:0,
        email: '',
        password: '',
        isLoggedIn: false
    };
    if (localStorageData) {
       try {
           persistedState = JSON.parse(localStorageData);
           apiCalls.setAuthorizationHeader(persistedState)
       } catch (error) {

       }
    }

    const middleware = addLogger 
        ? applyMiddleware(thunk, logger)
        : applyMiddleware(thunk);
    const store = createStore(authReducer, persistedState, middleware);

    store.subscribe(() => {
        localStorage.setItem('user-auth', JSON.stringify(store.getState()))
        apiCalls.setAuthorizationHeader(store.getState());
    })

    return store;
}

export default configureStore;
