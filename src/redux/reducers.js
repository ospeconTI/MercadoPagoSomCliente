/** @format */

import { reducer as uiReducer } from "./ui/reducer";
import { reducer as screenReducer } from "./screens/reducer";
import { reducer as routingReducer } from "./routing/reducer";
import { reducer as apiReducer } from "./api/reducer";
import { reducer as autorizacionReducer } from "./autorizacion/reducer";
import { reducer as ordenMedica } from "./OrdenMedica/reducer";
import { reducer as mercadoPagoReducer } from "./MercadoPago/reducer";
import { reducer as cajaReducer } from "./caja/reducer";
import { reducer as notifiationsReducer } from "./notifications/reducer";
import { reducer as motivosAnulacionReducer } from "./motivosAnulacion/reducer";
import { reducer as cierreReducer } from "./cierre/reducer";

export const rootReducer = (state = {}, action) => {
    const presentacionesEstadosRed = state.presentacionesEstados;
    return {
        api: apiReducer(state.api, action),
        ui: uiReducer(state.ui, action),
        screen: screenReducer(state.screen, action),
        routing: routingReducer(state.routing, action),
        ordenMedica: ordenMedica(state.ordenMedica, action),
        mercadoPago: mercadoPagoReducer(state.mercadoPago, action),
        caja: cajaReducer(state.caja, action),
        notifiations: notifiationsReducer(state.notifiations, action),
        motivosAnulacion: motivosAnulacionReducer(state.motivosAnulacion, action),
        cierre: cierreReducer(state.cierre, action),
    };
};
