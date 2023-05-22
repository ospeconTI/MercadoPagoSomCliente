/** @format */

import { fetchFactory } from "../libs/fetchFactory";
import { ODataEntity, ODataFetchFactory } from "@brunomon/odata-fetch-factory";

let webApi = SERVICE_URL + "/api";
let webApiOrdenesMedicas = OM_SERVICE_URL;

const expedienteOdataFactory = ODataFetchFactory({
    fetch: fetch,
    domain: webApiOrdenesMedicas,
});

export const pendietesPorCaja = fetchFactory(webApiOrdenesMedicas, "OrdenesMedicas/pendientesXCaja");

export const loginFetch = fetchFactory(webApi, "LoginOS");
export const logonFetch = ODataEntity(expedienteOdataFactory, "Logon");
export const recuperoFetch = ODataEntity(expedienteOdataFactory, "PedirRecupero");
export const cambiarPasswordFetch = ODataEntity(expedienteOdataFactory, "CambiarPassword");

export const recibirPagoFetch = fetchFactory(webApiOrdenesMedicas, "MercadoPago/RecibirPago");
export const anularOrdenFetch = fetchFactory(webApiOrdenesMedicas, "MercadoPago/DevolverPago");

export const ordenxNumeroFetch = fetchFactory(webApiOrdenesMedicas, "OrdenesMedicas/pagadoxNumero");
export const ordenxExpedienteFetch = fetchFactory(webApiOrdenesMedicas, "OrdenesMedicas/pagadoxExpediente");
export const ordenesSinCerrarteFetch = fetchFactory(webApiOrdenesMedicas, "OrdenesMedicas/bonosSinCerrar");

export const motivosAnulacionAllFetch = fetchFactory(webApiOrdenesMedicas, "MotivosAnulacion/getAll");
export const cerrarCajaFetch = fetchFactory(webApiOrdenesMedicas, "Cierres/CerrarCaja");
