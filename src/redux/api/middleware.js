/** @format */

import { API_REQUEST, API_UPDATE, API_DELETE, API_ADD, API_ACTION, API_FUNCTION, showSpinner, hideSpinner } from "./actions";

export const middleware =
    ({ dispatch, getState }) =>
    (next) =>
    (action) => {
        const token = getState().autorizacion?.usuario ? getState().autorizacion.usuario.Profiles[0].Token || "" : "";
        if (action.type === API_REQUEST) {
            const { ODataFetch, params, onSuccess, onError } = action.meta;
            params.token = token;
            dispatch(showSpinner(ODataFetch));
            ODataFetch.get(params)
                .then((data) => {
                    dispatch(hideSpinner(ODataFetch));
                    dispatch({
                        type: onSuccess,
                        payload: {
                            send: params,
                            receive: data,
                        },
                    });
                })
                .catch((error) => {
                    dispatch(hideSpinner(ODataFetch));
                    dispatch({
                        type: onError,
                        payload: error,
                    });
                });
        }

        if (action.type === API_UPDATE) {
            const { ODataFetch, body, onSuccess, onError } = action.meta;
            dispatch(showSpinner(ODataFetch));
            ODataFetch.patch(body, token)
                .then((data) => {
                    dispatch(hideSpinner(ODataFetch));
                    dispatch({
                        type: onSuccess,
                        payload: {
                            send: body,
                            receive: data,
                        },
                    });
                })
                .catch((error) => {
                    dispatch(hideSpinner(ODataFetch));
                    dispatch({
                        type: onError,
                        payload: {
                            send: body,
                            receive: error,
                        },
                    });
                });
        }

        if (action.type === API_DELETE) {
            const { ODataFetch, body, onSuccess, onError } = action.meta;
            dispatch(showSpinner(ODataFetch));
            ODataFetch.delete(body, token)
                .then((data) => {
                    dispatch(hideSpinner(ODataFetch));
                    dispatch({
                        type: onSuccess,
                        payload: {
                            send: body,
                            receive: data,
                        },
                    });
                })
                .catch((error) => {
                    dispatch(hideSpinner(ODataFetch));
                    dispatch({
                        type: onError,
                        payload: {
                            send: body,
                            receive: error,
                        },
                    });
                });
        }

        if (action.type === API_ADD) {
            const { ODataFetch, body, onSuccess, onError } = action.meta;
            dispatch(showSpinner(ODataFetch));
            ODataFetch.post(body, token)
                .then((data) => {
                    dispatch(hideSpinner(ODataFetch));
                    dispatch({
                        type: onSuccess,
                        payload: {
                            send: body,
                            receive: data,
                        },
                    });
                })
                .catch((error) => {
                    dispatch(hideSpinner(ODataFetch));
                    dispatch({
                        type: onError,
                        payload: {
                            send: body,
                            receive: error,
                        },
                    });
                });
        }

        if (action.type === API_ACTION) {
            const { ODataFetch, body, key, accion, onSuccess, onError } = action.meta;
            dispatch(showSpinner(ODataFetch));
            ODataFetch.action(accion, body, key, token)
                .then((data) => {
                    dispatch(hideSpinner(ODataFetch));
                    if (data.redirect) {
                        location.href = data.redirect;
                    }
                    dispatch({
                        type: onSuccess,
                        payload: {
                            send: body,
                            receive: data,
                        },
                    });
                })
                .catch((error) => {
                    dispatch(hideSpinner(ODataFetch));
                    dispatch({
                        type: onError,
                        payload: {
                            send: body,
                            receive: error,
                        },
                    });
                });
        }

        if (action.type === API_FUNCTION) {
            const { ODataFetch, funct, onSuccess, onError } = action.meta;
            dispatch(showSpinner(ODataFetch));
            ODataFetch.execute(funct, token)
                .then((data) => {
                    dispatch(hideSpinner(ODataFetch));
                    if (data.redirect) {
                        location.href = data.redirect;
                    }
                    dispatch({
                        type: onSuccess,
                        payload: {
                            receive: data,
                        },
                    });
                })
                .catch((error) => {
                    dispatch(hideSpinner(ODataFetch));
                    dispatch({
                        type: onError,
                        payload: {
                            send: body,
                            receive: error,
                        },
                    });
                });
        }
        return next(action);
    };
