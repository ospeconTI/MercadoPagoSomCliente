/** @format */

import { CERRAR_CAJA_SUCCESS } from "./actions";
import { store } from "../store";

const initialState = {
    cierre: null,
    cierreTimeStamp: null,
};

export const reducer = (state = initialState, action) => {
    const newState = {
        ...state,
    };
    switch (action.type) {
        case CERRAR_CAJA_SUCCESS:
            newState.cierreTimeStamp = new Date().getTime();
            newState.cierre = action.payload.receive;
            break;
    }

    return newState;
};
