/** @format */

export const RECIBIR_PAGO = "[MercadoPago] recibir pago";
export const RECIBIR_PAGO_SUCCESS = "[MercadoPago] recibir pago Success";
export const RECIBIR_PAGO_ERROR = "[MercadoPago] recibir pago Error";

export const DEVOLVER_PAGO = "[MercadoPago] devolver pago";
export const DEVOLVER_PAGO_SUCCESS = "[MercadoPago] devolver pago Success";
export const DEVOLVER_PAGO_ERROR = "[MercadoPago] devolver pago Error";

export const recibirPago = (body) => ({
    type: RECIBIR_PAGO,
    body: body,
});

export const devolverPago = (body) => ({
    type: DEVOLVER_PAGO,
    body: body,
});
