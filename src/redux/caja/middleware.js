/** @format */

import { SET, GET, GET_SUCCESS, SET_SUCCESS } from "./actions";

export const setCaja =
    ({ dispatch }) =>
    (next) =>
    (action) => {
        next(action);
        if (action.type === SET) {
            localStorage.setItem("caja", action.caja);
            localStorage.setItem("cemap", action.cemap);
            dispatch({ type: SET_SUCCESS, caja: action.caja });
        }
    };

export const getCaja =
    ({ dispatch }) =>
    (next) =>
    (action) => {
        next(action);
        if (action.type === GET) {
            action.caja = localStorage.getItem("caja");
            action.cemap = localStorage.getItem("cemap");
            dispatch({ type: GET_SUCCESS, caja: action.caja, cemap: action.cemap });
        }
    };

export const middleware = [setCaja, getCaja];
