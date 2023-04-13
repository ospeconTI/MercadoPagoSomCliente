/** @format */

//import { store } from "../store";

export const CONNECT = "[notifications] CONNECT";
export const ON_OPEN = "[notifications] ON_OPEN";
export const ON_ERROR = "[notifications] ON_ERROR";
export const ON_CLOSE = "[notifications] ON_CLOSE";
export const ON_MESSSAGE = "[notifications] ON_MESSAGE";
export const EDITING = "[notifiations] EDITING";
export const CLOSED = "[notifiations] CLOSED";
export const CHANGED = "[notifications] CHANGED";
export const NET_MESSAGE = "[notifications] NET_MESSAGE";
export const SINGLE_MESSAGE = "[notifications] SINGLE_MESSAGE";
export const ERROR_MESSAGE = "[notifications] ERROR_MESSAGE";

export const onOpen = (ws, usuario) => ({
    type: ON_OPEN,
    ws: ws,
    usuario: usuario,
});
export const onError = (error) => ({
    type: ON_ERROR,
    error: error,
});
export const onClose = (close) => ({
    type: ON_CLOSE,
    close: close,
});
export const onMessage = (message) => ({
    type: ON_MESSSAGE,
    message: message,
});
export const editing = (document) => ({
    type: EDITING,
    document: document,
});
export const closed = (document) => ({
    type: CLOSED,
    document: document,
});
export const changed = (document) => ({
    type: CHANGED,
    document: document,
});

export const netMessage = (message) => ({
    type: NET_MESSAGE,
    message: message,
});

export const singleMessage = (message) => ({
    type: SINGLE_MESSAGE,
    message: message,
});

export const errorMessage = (message) => ({
    type: ERROR_MESSAGE,
    message: message,
});

export const connect = (idCaja) => ({
    type: CONNECT,
    idCaja: idCaja,
});
