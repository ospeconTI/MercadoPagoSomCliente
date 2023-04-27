/** @format */

import { motivosAnulacionAllFetch } from "../fetchs";
import { RESTRequest } from "../rest/actions";
import { blanquearMensaje } from "../ui/actions";

import { MOTIVOS_ANULACION_ALL, MOTIVOS_ANULACION_ALL_ERROR, MOTIVOS_ANULACION_ALL_SUCCESS } from "./actions";

export const getAll =
    ({ dispatch }) =>
    (next) =>
    (action) => {
        next(action);
        if (action.type === MOTIVOS_ANULACION_ALL) {
            if (localStorage.getItem("caja") != undefined) {
                dispatch(RESTRequest(motivosAnulacionAllFetch, null, MOTIVOS_ANULACION_ALL_SUCCESS, MOTIVOS_ANULACION_ALL_ERROR));
                dispatch(blanquearMensaje());
            } else {
                dispatch(noticarCajaVacia());
            }
        }
    };

export const middleware = [getAll];
