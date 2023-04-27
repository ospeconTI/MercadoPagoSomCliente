/** @format */

import { DEVOLVER_PAGO_SUCCESS, RECIBIR_PAGO_SUCCESS } from "./actions";
import { store } from "../store";

const initialState = {
    pagoGenerado: null,
    pagoGeneradoTimeStamp: null,
    pagoDevueltoTimeStamp: null,
};

export const reducer = (state = initialState, action) => {
    const newState = {
        ...state,
    };
    switch (action.type) {
        case RECIBIR_PAGO_SUCCESS:
            newState.pagoGenerado = action.payload.receive;
            newState.pagoGeneradoTimeStamp = new Date().getTime();
            break;
        case DEVOLVER_PAGO_SUCCESS:
            newState.pagoDevueltoTimeStamp = new Date().getTime();
            break;
    }
    return newState;
};
