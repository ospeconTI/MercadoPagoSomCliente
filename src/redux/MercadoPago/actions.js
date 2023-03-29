/** @format */

export const RECIBIR_PAGO = "[MercadoPago] recibir pago";
export const RECIBIR_PAGO_SUCCESS = "[MercadoPago] recibir pago Success";
export const RECIBIR_PAGO_ERROR = "[MercadoPago] recibir pago Error";

export const recibirPago = (body) => ({
    type: RECIBIR_PAGO,
    body: body,
});
