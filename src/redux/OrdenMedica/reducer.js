/** @format */

import { PENDIENTES_X_CAJA_SUCCESS, PENDIENTES_X_CAJA_ERROR, PAGADOS_X_EXPEDIENTE_SUCCESS, PAGADOS_X_NUMERO_SUCCESS, PAGADOS_X_EXPEDIENTE_ERROR } from "./actions";
import { store } from "../store";

const initialState = {
    entities: null,
    timeStamp: null,
    anular: null,
    anularTimeStamp: null,
    errorTimeStamp: null,
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
        case PAGADOS_X_EXPEDIENTE_SUCCESS:
            newState.anular = action.payload.receive;
            newState.anularTimeStamp = new Date().getTime();
            break;
        case PAGADOS_X_NUMERO_SUCCESS:
            newState.anular = action.payload.receive;
            newState.anularTimeStamp = new Date().getTime();
            break;
        case PAGADOS_X_EXPEDIENTE_ERROR || PAGADOS_X_EXPEDIENTE_ERROR:
            newState.errorTimeStamp = new Date().getTime();
            break;
    }
    return newState;
};
