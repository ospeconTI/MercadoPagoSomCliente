/** @format */

import { SHOW_SPINNER, HIDE_SPINNER, SHOW_ERROR, HIDE_ERROR, SET_MEDIA, SET_MEDIA_ORIENTATION, SELECTION, STEP, SHOW_ALERT, SHOW_CONFIRM } from "./actions";

const initialState = {
    spinner: {
        loading: 0,
    },
    error: {
        message: "",
        timestamp: null,
    },
    media: {
        size: "large",
        orientation: "landscape",
        timeStamp: null,
    },
    menu: {
        timeStamp: null,
        option: "",
    },

    alert: {
        timeStamp: null,
        titulo: null,
        mensaje: null,
    },
    confirm: {
        timeStamp: null,
        titulo: null,
        mensaje: null,
        onOk: null,
        onCancel: null,
    },
    loginOk: false,
    steps: {
        step: 1,
    },
};

export const reducer = (state = initialState, action) => {
    const newState = {
        ...state,
    };

    switch (action.type) {
        case SHOW_SPINNER:
            newState.spinner.loading += 1;
            break;
        case HIDE_SPINNER:
            newState.spinner.loading -= 1;
            break;
        case SHOW_ERROR:
            newState.error.timeStamp = new Date().getTime();
            newState.error.messages = action.message;
            break;
        case HIDE_ERROR:
            newState.error.timeStamp = new Date().getTime();
            newState.error.messages = null;
            break;
        case SET_MEDIA:
            newState.media.size = action.size;
            newState.media.timeStamp = new Date().getTime();
            break;
        case SET_MEDIA_ORIENTATION:
            newState.media.orientation = action.orientation;
            newState.media.timeStamp = new Date().getTime();
            break;
        case SELECTION:
            newState.menu.timeStamp = new Date().getTime();
            newState.menu.option = action.option;
            break;
        case SHOW_ALERT:
            newState.alert.timeStamp = new Date().getTime();
            newState.alert.titulo = action.titulo;
            newState.alert.mensaje = action.mensaje;
            break;
        case SHOW_CONFIRM:
            newState.confirm.timeStamp = new Date().getTime();
            newState.confirm.titulo = action.titulo;
            newState.confirm.mensaje = action.mensaje;
            newState.confirm.onOk = action.onOk;
            newState.confirm.onCancel = action.onCancel;
            break;
        case STEP:
            newState.steps.step = action.step;
            break;
    }
    return newState;
};
