/** @format */

export const PENDIENTES_X_CAJA = "[OrdenMedica] pendientes por Caja";
export const PENDIENTES_X_CAJA_SUCCESS = "[OrdenMedica] pendientes por Caja Success";
export const PENDIENTES_X_CAJA_ERROR = "[OrdenMedica] pendientes por Caja Error";

export const pendientesXCaja = (idCaja) => ({
    type: PENDIENTES_X_CAJA,
    IdCaja: idCaja,
});
