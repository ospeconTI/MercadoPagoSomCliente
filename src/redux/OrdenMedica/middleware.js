/** @format */

import { getPDFCierre } from "../../views/componentes/impresion";
import { noticarCajaVacia } from "../caja/actions";
import { listarCierreFetch, ordenesSinCerrarteFetch, ordenxExpedienteFetch, ordenxNumeroFetch, pendietesPorCaja, resumenCierreFetch } from "../fetchs";
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
    BONOS_SIN_CERRAR,
    BONOS_SIN_CERRAR_SUCCESS,
    BONOS_SIN_CERRAR_ERROR,
    LISTAR_CIERRE,
    LISTAR_CIERRE_SUCCESS,
    LISTAR_CIERRE_ERROR,
    IMPRIMIR_CIERRE,
    IMPRIMIR_CIERRE_SUCCESS,
    IMPRIMIR_CIERRE_ERROR,
    RESUMEN_CIERRE,
    RESUMEN_CIERRE_SUCCESS,
    RESUMEN_CIERRE_ERROR,
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
                dispatch(RESTRequest(ordenxNumeroFetch, action.numero + "/" + localStorage.getItem("caja"), PAGADOS_X_NUMERO_SUCCESS, PAGADOS_X_NUMERO_ERROR));
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

export const ordenesSinCerrar =
    ({ dispatch }) =>
    (next) =>
    (action) => {
        next(action);
        if (action.type === BONOS_SIN_CERRAR) {
            if (localStorage.getItem("caja") != undefined) {
                dispatch(RESTRequest(ordenesSinCerrarteFetch, localStorage.getItem("caja"), BONOS_SIN_CERRAR_SUCCESS, BONOS_SIN_CERRAR_ERROR));
                dispatch(blanquearMensaje());
            } else {
                dispatch(noticarCajaVacia());
            }
        }
    };

export const listaCierre =
    ({ dispatch }) =>
    (next) =>
    (action) => {
        next(action);
        if (action.type === LISTAR_CIERRE) {
            if (localStorage.getItem("caja") != undefined) {
                dispatch(RESTRequest(listarCierreFetch, action.nroCierre + "/" + localStorage.getItem("caja"), LISTAR_CIERRE_SUCCESS, LISTAR_CIERRE_ERROR));
                dispatch(blanquearMensaje());
            } else {
                dispatch(noticarCajaVacia());
            }
        }
    };

export const resumenCierres =
    ({ dispatch }) =>
    (next) =>
    (action) => {
        next(action);
        if (action.type === RESUMEN_CIERRE) {
            if (localStorage.getItem("caja") != undefined) {
                dispatch(RESTRequest(resumenCierreFetch, action.desde + "/" + action.hasta + "/" + action.cemap, RESUMEN_CIERRE_SUCCESS, RESUMEN_CIERRE_ERROR));
                dispatch(blanquearMensaje());
            } else {
                dispatch(noticarCajaVacia());
            }
        }
    };
export const impresionCierre =
    ({ dispatch }) =>
    (next) =>
    (action) => {
        next(action);
        if (action.type === IMPRIMIR_CIERRE) {
            if (localStorage.getItem("caja") != undefined) {
                dispatch(RESTRequest(listarCierreFetch, action.nroCierre + "/" + localStorage.getItem("caja"), IMPRIMIR_CIERRE_SUCCESS, IMPRIMIR_CIERRE_ERROR));
                dispatch(blanquearMensaje());
            } else {
                dispatch(noticarCajaVacia());
            }
        }
    };

export const middleware = [pendietesXCaja, pagadosXnumero, pagadosXexpediente, ordenesSinCerrar, listaCierre, impresionCierre, resumenCierres];
