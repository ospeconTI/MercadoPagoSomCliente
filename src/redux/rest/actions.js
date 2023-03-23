export const REST_REQUEST = "[app] REST Request";
export const REST_UPDATE = "[app] REST Update"
export const REST_PATCH = "[app] REST Patch"
export const REST_DELETE = "[app] REST Delete"
export const REST_ADD = "[app] REST Add"

export const RESTRequest = (RESTfetch, id, onSuccess, onError, token) => ({
    type: REST_REQUEST,
    meta: {
        RESTfetch,
        id,
        onSuccess,
        onError,
        token
    }
});

export const RESTUpdate = (RESTfetch, id, body, onSuccess, onError, token) => ({
    type: REST_UPDATE,
    meta: {
        RESTfetch,
        body,
        id,
        onSuccess,
        onError,
        token
    }
});


export const RESTPatch = (RESTfetch, id, body, onSuccess, onError, token) => ({
    type: REST_PATCH,
    meta: {
        RESTfetch,
        body,
        id,
        onSuccess,
        onError,
        token
    }
});

export const RESTDelete = (RESTfetch, id, onSuccess, onError, token) => ({
    type: REST_DELETE,
    meta: {
        RESTfetch,
        id,
        onSuccess,
        onError,
        token
    }
});

export const RESTAdd = (RESTfetch, body, onSuccess, onError, token, id) => ({
    type: REST_ADD,
    payload: {},
    meta: {
        RESTfetch,
        body,
        onSuccess,
        onError,
        token,
        id
    }
});