export const API_REQUEST = "[app] API Request";
export const API_UPDATE = "[app] API Update";
export const API_DELETE = "[app] API Delete";
export const API_ADD = "[app] API Add";
export const API_ACTION = "[app] API Action";
export const API_FUNCTION = "[app] API Funct";

export const API_SHOW_SPINNER = "[app] API Show spinner";
export const API_HIDE_SPINNER = "[app] API hide spinner";

export const apiRequest = (ODataFetch, params, onSuccess, onError) => ({
    type: API_REQUEST,
    meta: {
        ODataFetch,
        params,
        onSuccess,
        onError,
    },
});

export const apiUpdate = (ODataFetch, body, onSuccess, onError) => ({
    type: API_UPDATE,
    meta: {
        ODataFetch,
        body,
        onSuccess,
        onError,
    },
});

export const apiDelete = (ODataFetch, body, onSuccess, onError) => ({
    type: API_DELETE,
    meta: {
        ODataFetch,
        body,
        onSuccess,
        onError,
    },
});

export const apiAdd = (ODataFetch, body, onSuccess, onError) => ({
    type: API_ADD,
    payload: {},
    meta: {
        ODataFetch,
        body,
        onSuccess,
        onError,
    },
});
export const apiAction = (ODataFetch, body, key, accion, onSuccess, onError) => ({
    type: API_ACTION,
    payload: {},
    meta: {
        ODataFetch,
        body,
        key,
        accion,
        onSuccess,
        onError,
    },
});
export const apiFunction = (ODataFetch, funct, onSuccess, onError) => ({
    type: API_FUNCTION,
    payload: {},
    meta: {
        ODataFetch,
        funct,
        onSuccess,
        onError,
    },
});

export const showSpinner = (fetch) => ({
    type: API_SHOW_SPINNER,
    fetch: fetch,
});
export const hideSpinner = (fetch) => ({
    type: API_HIDE_SPINNER,
    fetch: fetch,
});
