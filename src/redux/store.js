/** @format */

import { applyMiddleware, createStore, compose } from "redux";
import { logger } from "redux-logger";
import { rootReducer as reducers } from "./reducers";
import { middleware as autorizacion } from "./autorizacion/middleware";
import { middleware as ui } from "./ui/middleware";
import { middleware as api } from "./api/middleware";
import { middleware as rest } from "./rest/middleware";
import { middleware as route } from "./routing/middleware";
import { middleware as ordenMedica } from "./OrdenMedica/middleware";
import { middleware as mercadoPago } from "./MercadoPago/middleware";
import { middleware as caja } from "./caja/middleware";
import { middleware as notifications } from "./notifications/middleware";
import { middleware as motivosAnulacion } from "./motivosAnulacion/middleware";
import { middleware as cierre } from "./cierre/middleware";

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

let mdw = [api, rest, ...ui, ...route, ...autorizacion, ...ordenMedica, ...mercadoPago, ...caja, ...notifications, ...motivosAnulacion, ...cierre];

if (process.env.NODE_ENV !== "production") {
    mdw = [...mdw, logger];
}

const initialData = {};

export const store = createStore(reducers, initialData, composeEnhancers(applyMiddleware(...mdw)));
