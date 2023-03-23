/** @format */

import { LOGIN_SUCCESS, LOGIN_ERROR, RECUPERO_SUCCESS, RECUPERO_ERROR, RENOVACION_SUCCESS, RENOVACION_ERROR, LOGON_ERROR, LOGON_SUCCESS, UPDATE_PROFILE_ERROR, UPDATE_PROFILE_SUCCESS, LOGOUT, LOGIN_SUCCESS_AUTO } from "./actions";

const initialState = {
    usuario: null,
    loginTimeStamp: null,
    logoutTimeStamp: null,
    recuperoTimeStamp: null,
    renovacionTimeStamp: null,
    logonTimeStamp: null,
    updateProfileTimeStamp: null,
    commandErrorTimeStamp: null,
    logonMessage: "",
    recuperoMessage: "",
};

export const reducer = (state = initialState, action) => {
    const newState = {
        ...state,
    };

    switch (action.type) {
        case LOGIN_SUCCESS_AUTO:
        case LOGIN_SUCCESS:
            newState.usuario = action.payload.receive;
            newState.loginTimeStamp = new Date().getTime();
            break;
        case LOGOUT:
            newState.logoutTimeStamp = new Date().getTime();
            break;
        case RENOVACION_SUCCESS:
            newState.renovacionTimeStamp = new Date().getTime();
            break;
        case RECUPERO_SUCCESS:
            newState.recuperoTimeStamp = new Date().getTime();
            newState.recuperoMessage = action.payload.receive;
            break;
        case LOGON_SUCCESS:
            newState.logonTimeStamp = new Date().getTime();
            newState.logonMessage = action.payload.receive;
            break;
        case UPDATE_PROFILE_SUCCESS:
            newState.updateProfileTimeStamp = new Date().getTime();
            break;
        case LOGIN_ERROR || RECUPERO_ERROR || RENOVACION_ERROR || UPDATE_PROFILE_ERROR || LOGON_ERROR:
            newState.commandErrorTimeStamp = new Date().getTime();
            break;
    }
    return newState;
};
