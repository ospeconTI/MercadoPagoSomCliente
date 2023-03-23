/** @format */

import { fetchFactory } from "../libs/fetchFactory";
import { ODataEntity, ODataFetchFactory } from "@brunomon/odata-fetch-factory";

let webApiExpedientes = SERVICE_URL;
let webApi = SERVICE_URL + "/api";

const expedienteOdataFactory = ODataFetchFactory({
    fetch: fetch,
    domain: webApiExpedientes,
});

let webApiOrdenesMedicas = OM_SERVICE_URL;

export const pendietesPorCaja = fetchFactory(webApiOrdenesMedicas, "OrdenesMedicas/pendientesXCaja");

export const loginFetch = fetchFactory(webApi, "LoginOS");
export const logonFetch = ODataEntity(expedienteOdataFactory, "Logon");
export const recuperoFetch = ODataEntity(expedienteOdataFactory, "PedirRecupero");
export const cambiarPasswordFetch = ODataEntity(expedienteOdataFactory, "CambiarPassword");
