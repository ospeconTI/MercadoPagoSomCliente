/** @format */

import { noticarCajaVacia } from "../caja/actions";
import { ordenxExpedienteFetch, ordenxNumeroFetch, pendietesPorCaja } from "../fetchs";
import { RESTRequest } from "../rest/actions";
import { blanquearMensaje } from "../ui/actions";
import {
    PENDIENTES_X_CAJA,
    PENDIENTES_X_CAJA_ERROR,
    PENDIENTES_X_CAJA_SUCCESS,
    PAGADOS_X_NUMERO,
    PAGADOS_X_NUMERO_SUCCESS,
    PAGADOS_X_NUMERO_ERROR,
    pagadosXExpediente,
    PAGADOS_X_EXPEDIENTE,
    PAGADOS_X_EXPEDIENTE_SUCCESS,
    PAGADOS_X_EXPEDIENTE_ERROR,
} from "./actions";

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

export const pagadosXnumero =
    ({ dispatch }) =>
    (next) =>
    (action) => {
        next(action);
        if (action.type === PAGADOS_X_NUMERO) {
            if (localStorage.getItem("caja") != undefined) {
                dispatch(RESTRequest(ordenxNumeroFetch, action.numero + "/" + localStorage.getItem("caja"), PAGADOS_X_NUMERO_SUCCESS, PENDIENTES_X_CAJA_ERROR));
                dispatch(blanquearMensaje());
            } else {
                dispatch(noticarCajaVacia());
            }
        }
    };

export const pagadosXexpediente =
    ({ dispatch }) =>
    (next) =>
    (action) => {
        next(action);
        if (action.type === PAGADOS_X_EXPEDIENTE) {
            if (localStorage.getItem("caja") != undefined) {
                dispatch(RESTRequest(ordenxExpedienteFetch, action.expediente + "/" + localStorage.getItem("caja"), PAGADOS_X_EXPEDIENTE_SUCCESS, PAGADOS_X_EXPEDIENTE_ERROR));
                dispatch(blanquearMensaje());
            } else {
                dispatch(noticarCajaVacia());
            }
        }
    };

export const middleware = [pendietesXCaja, pagadosXnumero, pagadosXexpediente];
