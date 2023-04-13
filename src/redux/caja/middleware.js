/** @format */

import { SET, GET, GET_SUCCESS, SET_SUCCESS } from "./actions";

export const setCaja =
    ({ dispatch }) =>
    (next) =>
    (action) => {
        next(action);
        if (action.type === SET) {
            localStorage.setItem("caja", action.caja);
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
            dispatch({ type: GET_SUCCESS, caja: action.caja });
        }
    };

export const middleware = [setCaja, getCaja];
