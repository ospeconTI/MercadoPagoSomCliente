/** @format */

import { PENDIENTES_X_CAJA_SUCCESS, PENDIENTES_X_CAJA_ERROR } from "./actions";
import { store } from "../store";

const initialState = {
    entities: null,
    timeStamp: null,
};

export const reducer = (state = initialState, action) => {
    const newState = {
        ...state,
    };
    switch (action.type) {
        case PENDIENTES_X_CAJA_SUCCESS:
            newState.entities = action.payload.receive;
            newState.timeStamp = new Date().getTime();
            break;
    }
    return newState;
};
