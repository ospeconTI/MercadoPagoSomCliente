/** @format */

import { WebSocketNotificaciones } from "../../libs/webSocket";
import { recibirDevolucionEF, recibirDevolucionMP, recibirPagoMP, sumarMensaje } from "../ui/actions";

import {
    CONNECT,
    ON_OPEN,
    ON_CLOSE,
    ON_ERROR,
    ON_MESSSAGE,
    EDITING,
    CLOSED,
    onOpen as actionOnOpen,
    onClose as actionOnClose,
    onError as actionOnError,
    onMessage as actionOnMessage,
    netMessage,
    singleMessage,
    errorMessage,
    CHANGED,
} from "./actions";

export const connect =
    ({ dispatch, getState }) =>
    (next) =>
    (action) => {
        next(action);
        if (action.type === CONNECT) {
            WebSocketNotificaciones(dispatch, "wss://wstest.uocra.net/?IdCaja=" + action.idCaja, null, actionOnOpen, actionOnMessage, actionOnError, actionOnClose);
        }
    };
export const onOpen =
    ({ dispatch, getState }) =>
    (next) =>
    (action) => {
        next(action);
        if (action.type === ON_OPEN) {
        }
    };
export const onClose =
    ({ dispatch }) =>
    (next) =>
    (action) => {
        next(action);
        if (action.type === ON_CLOSE) {
        }
    };
export const onError =
    ({ dispatch }) =>
    (next) =>
    (action) => {
        next(action);
        if (action.type === ON_ERROR) {
        }
    };
export const onMessage =
    ({ dispatch }) =>
    (next) =>
    (action) => {
        next(action);
        if (action.type === ON_MESSSAGE) {
            if (action.message.de == "database") {
                dispatch(sumarMensaje());
            }
            if (action.message.de == "MP") {
                dispatch(recibirPagoMP());
            }
            if (action.message.de == "MP-") {
                dispatch(recibirDevolucionMP());
            }
            if (action.message.de == "EF") {
                dispatch(recibirDevolucionEF());
            }
        }
    };
export const editing =
    ({ dispatch, getState }) =>
    (next) =>
    (action) => {
        next(action);
        if (action.type === EDITING) {
            const message = { Action: "editing", Document: action.document };
            getState().notifications.ws.send(JSON.stringify(message));
        }
    };
export const closed =
    ({ dispatch, getState }) =>
    (next) =>
    (action) => {
        next(action);
        if (action.type === CLOSED) {
            const message = { Action: "closed", Document: action.document };
            getState().notifications.ws.send(JSON.stringify(message));
        }
    };
export const changed =
    ({ dispatch, getState }) =>
    (next) =>
    (action) => {
        next(action);
        if (action.type === CHANGED) {
            const message = { Action: "changed", Document: action.document };
            getState().notifications.ws.send(JSON.stringify(message));
        }
    };

export const middleware = [connect, onOpen, onClose, onError, onMessage, editing, closed, changed];
