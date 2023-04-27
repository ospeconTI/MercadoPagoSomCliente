/** @format */

import { MOTIVOS_ANULACION_ALL_SUCCESS } from "./actions";
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
        case MOTIVOS_ANULACION_ALL_SUCCESS:
            newState.entities = action.payload.receive;
            newState.timeStamp = new Date().getTime();
            break;
    }
    return newState;
};
