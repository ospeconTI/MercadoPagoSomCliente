/** @format */

import { SET_SUCCESS, GET_SUCCESS, NOTIFICAR_VACIA } from "./actions";
import { store } from "../store";

const initialState = {
    caja: null,
    setCajaTimeStamp: null,
    getCajaTimeStamp: null,
    cajaVaciaTimeStamp: null,
};

export const reducer = (state = initialState, action) => {
    const newState = {
        ...state,
    };
    switch (action.type) {
        case SET_SUCCESS:
            newState.setCajaTimeStamp = new Date().getTime();
            newState.caja = action.caja;
            break;
        case GET_SUCCESS:
            newState.getCajaTimeStamp = new Date().getTime();
            newState.caja = action.caja;
            break;
        case NOTIFICAR_VACIA:
            newState.cajaVaciaTimeStamp = new Date().getTime();
            break;
    }

    return newState;
};
