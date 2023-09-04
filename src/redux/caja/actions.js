export const SET = "[caja] set";
export const GET = "[caja] get";
export const SET_SUCCESS = "[caja] set success";
export const GET_SUCCESS = "[caja] get success";
export const NOTIFICAR_VACIA = "[caja] notificar vacia";

export const set = (caja, cemap) => ({
    type: SET,
    caja: caja,
    cemap: cemap,
});

export const get = () => ({
    type: GET,
    caja: null,
    cemap: null,
});

export const noticarCajaVacia = () => ({
    type: NOTIFICAR_VACIA,
});
