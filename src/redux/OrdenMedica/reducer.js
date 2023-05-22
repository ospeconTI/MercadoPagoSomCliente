/** @format */

import {
    PENDIENTES_X_CAJA_SUCCESS,
    PENDIENTES_X_CAJA_ERROR,
    PAGADOS_X_EXPEDIENTE_SUCCESS,
    PAGADOS_X_NUMERO_SUCCESS,
    PAGADOS_X_EXPEDIENTE_ERROR,
    PAGADOS_X_NUMERO_ERROR,
    BONOS_SIN_CERRAR_ERROR,
    BONOS_SIN_CERRAR_SUCCESS,
} from "./actions";
import { store } from "../store";

const initialState = {
    entities: null,
    timeStamp: null,
    anular: null,
    anularTimeStamp: null,
    errorTimeStamp: null,
    bonosSinCerrar: null,
    bonosSinCerrarTimeStamp: null,
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
        case BONOS_SIN_CERRAR_SUCCESS:
            newState.bonosSinCerrar = action.payload.receive;
            newState.bonosSinCerrarTimeStamp = new Date().getTime();
            break;
        case PAGADOS_X_EXPEDIENTE_ERROR:
        case PAGADOS_X_NUMERO_ERROR:
        case BONOS_SIN_CERRAR_ERROR:
            newState.errorTimeStamp = new Date().getTime();
            break;
    }
    return newState;
};
