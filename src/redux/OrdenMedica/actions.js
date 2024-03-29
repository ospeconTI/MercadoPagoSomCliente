/** @format */

export const PENDIENTES_X_CAJA = "[OrdenMedica] pendientes por Caja";
export const PENDIENTES_X_CAJA_SUCCESS = "[OrdenMedica] pendientes por Caja Success";
export const PENDIENTES_X_CAJA_ERROR = "[OrdenMedica] pendientes por Caja Error";

export const PAGADOS_X_NUMERO = "[OrdenMedica] pagados x numero";
export const PAGADOS_X_NUMERO_SUCCESS = "[OrdenMedica] pagados x numero Success";
export const PAGADOS_X_NUMERO_ERROR = "[OrdenMedica] pagados x numero Error";

export const PAGADOS_X_EXPEDIENTE = "[OrdenMedica] pagados x expediente";
export const PAGADOS_X_EXPEDIENTE_SUCCESS = "[OrdenMedica] pagados x expediente Success";
export const PAGADOS_X_EXPEDIENTE_ERROR = "[OrdenMedica] pagados x expediente Error";

export const BONOS_SIN_CERRAR = "[OrdenMedica] bonos sin cerrar";
export const BONOS_SIN_CERRAR_SUCCESS = "[OrdenMedica] bonos sin cerrar success";
export const BONOS_SIN_CERRAR_ERROR = "[OrdenMedica] bonos sin cerrar error";

export const LISTAR_CIERRE = "[OrdenMedica] listar cierre";
export const LISTAR_CIERRE_SUCCESS = "[OrdenMedica] listar cierre success";
export const LISTAR_CIERRE_ERROR = "[OrdenMedica] listar cierre error";

export const RESUMEN_CIERRE = "[OrdenMedica] resumen cierre";
export const RESUMEN_CIERRE_SUCCESS = "[OrdenMedica] resumen cierre success";
export const RESUMEN_CIERRE_ERROR = "[OrdenMedica] resumen cierre error";

export const IMPRIMIR_CIERRE = "[OrdenMedica] imprimir cierre";
export const IMPRIMIR_CIERRE_SUCCESS = "[OrdenMedica] imprimir cierre success";
export const IMPRIMIR_CIERRE_ERROR = "[OrdenMedica] imprimir cierre error";

export const pendientesXCaja = () => ({
    type: PENDIENTES_X_CAJA,
});

export const pagadosXNumero = (numero) => ({
    type: PAGADOS_X_NUMERO,
    numero: numero,
});

export const pagadosXExpediente = (expediente) => ({
    type: PAGADOS_X_EXPEDIENTE,
    expediente: expediente,
});

export const bonosSinCerrar = () => ({
    type: BONOS_SIN_CERRAR,
});

export const listarCierre = (nroCierre) => ({
    type: LISTAR_CIERRE,
    nroCierre: nroCierre,
});

export const imprimirCierre = (nroCierre) => ({
    type: IMPRIMIR_CIERRE,
    nroCierre: nroCierre,
});

export const resumenCierre = (desde, hasta, cemap) => ({
    type: RESUMEN_CIERRE,
    desde: desde,
    hasta: hasta,
    cemap: cemap,
});
