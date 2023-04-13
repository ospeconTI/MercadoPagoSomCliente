/** @format */

import { CONNECT, ON_OPEN, ON_CLOSE, ON_ERROR, NET_MESSAGE, SINGLE_MESSAGE, ERROR_MESSAGE } from "./actions";

const initialState = {
    myNetId: null,
    myNet: null,
    myNetTimeStamp: null,
    singleMessage: null,
    singleMessageTimeStamp: null,
    errorMessage: null,
    errorMessageTimeStamp: null,
    message: null,
    messageTimeStamp: null,
    error: null,
    errorTimeStamp: null,
    openTimeStamp: null,
    close: null,
    closeTimeStamp: null,
    ws: null,
};

export const reducer = (state = initialState, action) => {
    const newState = {
        ...state,
    };

    switch (action.type) {
        case CONNECT:
            newState.myNetId = action.id;
            break;
        case ON_OPEN:
            newState.openTimeStamp = new Date().getTime();
            newState.ws = action.ws;
            break;
        case ON_CLOSE:
            newState.closeTimeStamp = new Date().getTime();
            newState.close = action.close;
            break;
        case ON_ERROR:
            newState.error = action.error;
            newState.errorTimeStamp = new Date().getTime();
            break;
        case NET_MESSAGE:
            newState.myNet = action.message;
            newState.myNetTimeStamp = new Date().getTime();
            break;
        case SINGLE_MESSAGE:
            newState.singleMessage = action.message;
            newState.singleMessageTimeStamp = new Date().getTime();
            break;
        case ERROR_MESSAGE:
            newState.errorMessage = action.message;
            newState.errorMessageTimeStamp = new Date().getTime();
            break;
    }
    return newState;
};
