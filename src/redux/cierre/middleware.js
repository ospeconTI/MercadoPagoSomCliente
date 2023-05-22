/** @format */

import { bonosSinCerrar } from "../OrdenMedica/actions";
import { cerrarCajaFetch } from "../fetchs";
import { RESTAdd } from "../rest/actions";
import { CERRAR_CAJA, CERRAR_CAJA_ERROR, CERRAR_CAJA_SUCCESS } from "./actions";

export const cierreCaja =
    ({ dispatch }) =>
    (next) =>
    (action) => {
        next(action);
        if (action.type === CERRAR_CAJA) {
            const body = { idCaja: localStorage.getItem("caja") };
            dispatch(RESTAdd(cerrarCajaFetch, body, CERRAR_CAJA_SUCCESS, CERRAR_CAJA_ERROR));
        }
    };

export const processCommand =
    ({ dispatch }) =>
    (next) =>
    (action) => {
        next(action);
        if (action.type === CERRAR_CAJA_SUCCESS) {
            dispatch(bonosSinCerrar());
        }
    };

export const middleware = [cierreCaja, processCommand];
