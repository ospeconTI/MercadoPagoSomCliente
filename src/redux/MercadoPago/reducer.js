/** @format */

import { RECIBIR_PAGO_SUCCESS } from "./actions";
import { store } from "../store";

const initialState = {
    pagoGenerado: null,
    pagoGeneradoTimeStamp: null,
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
    }
    return newState;
};
