/** @format */

import { pendietesPorCaja } from "../fetchs";
import { RESTRequest } from "../rest/actions";
import { PENDIENTES_X_CAJA, PENDIENTES_X_CAJA_ERROR, PENDIENTES_X_CAJA_SUCCESS } from "./actions";

export const pendietesXCaja =
    ({ dispatch }) =>
    (next) =>
    (action) => {
        next(action);
        if (action.type === PENDIENTES_X_CAJA) {
            dispatch(RESTRequest(pendietesPorCaja, action.IdCaja, PENDIENTES_X_CAJA_SUCCESS, PENDIENTES_X_CAJA_ERROR));
        }
    };

export const middleware = [pendietesXCaja];
