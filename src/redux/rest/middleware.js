/** @format */

import { REST_REQUEST, REST_UPDATE, REST_DELETE, REST_ADD, REST_PATCH } from "./actions";

import { showSpinner, hideSpinner } from "../api/actions";

export const middleware =
    ({ dispatch }) =>
    (next) =>
    (action) => {
        if (action.type === REST_REQUEST) {
            const { RESTfetch, id, onSuccess, onError, token } = action.meta;

            dispatch(showSpinner());
            RESTfetch.get(id, token)
                .then((data) => {
                    dispatch(hideSpinner());
                    dispatch({
                        type: onSuccess,
                        payload: {
                            send: id,
                            receive: data,
                        },
                    });
                })
                .catch((error) => {
                    dispatch(hideSpinner());
                    dispatch({
                        type: onError,
                        payload: {
                            send: id,
                            receive: error,
                        },
                    });
                });
        }

        if (action.type === REST_PATCH) {
            const { RESTfetch, id, body, onSuccess, onError, token } = action.meta;

            dispatch(showSpinner());
            RESTfetch.patch(id, body, token)
                .then((data) => {
                    dispatch(hideSpinner());
                    dispatch({
                        type: onSuccess,
                        payload: {
                            send: {
                                id: id,
                                body: body,
                            },
                            receive: data,
                        },
                    });
                })
                .catch((error) => {
                    dispatch(hideSpinner());
                    dispatch({
                        type: onError,
                        payload: {
                            send: {
                                id: id,
                                body: body,
                            },
                            receive: error,
                        },
                    });
                });
        }

        if (action.type === REST_UPDATE) {
            const { RESTfetch, id, body, onSuccess, onError, token } = action.meta;

            dispatch(showSpinner());
            RESTfetch.put(id, body, token)
                .then((data) => {
                    dispatch(hideSpinner());
                    dispatch({
                        type: onSuccess,
                        payload: {
                            send: {
                                id: id,
                                body: body,
                            },
                            receive: data,
                        },
                    });
                })
                .catch((error) => {
                    dispatch(hideSpinner());
                    dispatch({
                        type: onError,
                        payload: {
                            send: {
                                id: id,
                                body: body,
                            },
                            receive: error,
                        },
                    });
                });
        }

        if (action.type === REST_DELETE) {
            const { RESTfetch, id, onSuccess, onError, token } = action.meta;

            dispatch(showSpinner());
            RESTfetch.delete(id, token)
                .then((data) => {
                    dispatch(hideSpinner());
                    dispatch({
                        type: onSuccess,
                        payload: {
                            send: id,
                            receive: data,
                        },
                    });
                })
                .catch((error) => {
                    dispatch(hideSpinner());
                    dispatch({
                        type: onError,
                        payload: {
                            send: id,
                            receive: error,
                        },
                    });
                });
        }

        if (action.type === REST_ADD) {
            const { RESTfetch, body, onSuccess, onError, token, id } = action.meta;

            dispatch(showSpinner());
            RESTfetch.post(body, token, id)
                .then((data) => {
                    dispatch(hideSpinner());
                    dispatch({
                        type: onSuccess,
                        payload: {
                            send: body,
                            receive: data,
                        },
                    });
                })
                .catch((error) => {
                    dispatch(hideSpinner());
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
