/** @format */

import {
    PENDIENTES_X_CAJA_SUCCESS,
    PENDIENTES_X_CAJA_ERROR,
    PAGADOS_X_EXPEDIENTE_SUCCESS,
    PAGADOS_X_NUMERO_SUCCESS,
    PAGADOS_X_EXPEDIENTE_ERROR,
    PAGADOS_X_NUMERO_ERROR,
    BONOS_SIN_CERRAR_ERROR,
    BONOS_SIN_CERRAR_SUCCESS,
    LISTAR_CIERRE_ERROR,
    LISTAR_CIERRE_SUCCESS,
    IMPRIMIR_CIERRE_SUCCESS,
} from "./actions";
import { store } from "../store";
import { getPDFCierre } from "../../views/componentes/impresion";

const initialState = {
    entities: null,
    timeStamp: null,
    anular: null,
    anularTimeStamp: null,
    errorTimeStamp: null,
    bonosSinCerrar: null,
    bonosSinCerrarTimeStamp: null,
    errorTimeStampListar: null,
    listaCierre: null,
    listaCierreTimeStamp: null,
    errorPagadosTimeStamp: null,
    imprimirCierre: null,
    imprimirCierreTimeStamp: null,
};

export const reducer = (state = initialState, action) => {
    const newState = {
        ...state,
    };
    switch (action.type) {
        case PENDIENTES_X_CAJA_SUCCESS:
            newState.entities = action.payload.receive;
            newState.timeStamp = new Date().getTime();
            break;
        case PAGADOS_X_EXPEDIENTE_SUCCESS:
            newState.anular = action.payload.receive;
            newState.anularTimeStamp = new Date().getTime();
            break;
        case PAGADOS_X_NUMERO_SUCCESS:
            newState.anular = action.payload.receive;
            newState.anularTimeStamp = new Date().getTime();
            break;
        case BONOS_SIN_CERRAR_SUCCESS:
            newState.bonosSinCerrar = action.payload.receive;
            newState.bonosSinCerrarTimeStamp = new Date().getTime();
            break;
        case PAGADOS_X_EXPEDIENTE_ERROR:
        case PAGADOS_X_NUMERO_ERROR:
            newState.errorPagadosTimeStamp = new Date().getTime();
            break;
        case BONOS_SIN_CERRAR_ERROR:
            newState.errorTimeStamp = new Date().getTime();
            break;
        case LISTAR_CIERRE_SUCCESS:
            newState.listaCierre = action.payload.receive;
            newState.listaCierreTimeStamp = new Date().getTime();
            break;
        case LISTAR_CIERRE_ERROR:
            newState.errorTimeStampListar = new Date().getTime();
            break;
        case IMPRIMIR_CIERRE_SUCCESS:
            const doc = getPDFCierre(action.payload.receive, action.nroCierre);
            doc.save("Cierre " + nroCierre.toString());
    }
    return newState;
};
