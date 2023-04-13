/** @format */

import { noticarCajaVacia } from "../caja/actions";
import { pendietesPorCaja } from "../fetchs";
import { RESTRequest } from "../rest/actions";
import { blanquearMensaje } from "../ui/actions";
import { PENDIENTES_X_CAJA, PENDIENTES_X_CAJA_ERROR, PENDIENTES_X_CAJA_SUCCESS } from "./actions";

export const pendietesXCaja =
    ({ dispatch }) =>
    (next) =>
    (action) => {
        next(action);
        if (action.type === PENDIENTES_X_CAJA) {
            if (localStorage.getItem("caja") != undefined) {
                dispatch(RESTRequest(pendietesPorCaja, localStorage.getItem("caja"), PENDIENTES_X_CAJA_SUCCESS, PENDIENTES_X_CAJA_ERROR));
                dispatch(blanquearMensaje());
            } else {
                dispatch(noticarCajaVacia());
            }
        }
    };

export const middleware = [pendietesXCaja];
