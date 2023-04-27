/** @format */

import { anularOrdenFetch, recibirPagoFetch } from "../fetchs";
import { RESTAdd, RESTRequest } from "../rest/actions";
import { RECIBIR_PAGO, RECIBIR_PAGO_SUCCESS, RECIBIR_PAGO_ERROR, DEVOLVER_PAGO, DEVOLVER_PAGO_SUCCESS, DEVOLVER_PAGO_ERROR } from "./actions";

export const recibirPagos =
    ({ dispatch }) =>
    (next) =>
    (action) => {
        next(action);
        if (action.type === RECIBIR_PAGO) {
            dispatch(RESTAdd(recibirPagoFetch, action.body, RECIBIR_PAGO_SUCCESS, RECIBIR_PAGO_ERROR));
        }
    };

export const devolverPagos =
    ({ dispatch }) =>
    (next) =>
    (action) => {
        next(action);
        if (action.type === DEVOLVER_PAGO) {
            dispatch(RESTAdd(anularOrdenFetch, action.body, DEVOLVER_PAGO_SUCCESS, DEVOLVER_PAGO_ERROR));
        }
    };

export const middleware = [recibirPagos, devolverPagos];
