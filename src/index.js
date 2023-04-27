/** @format */

import {} from "../css/main.css";
import {} from "../css/media.css";
import {} from "../css/nunito.css";
import {} from "../css/fontSizes.css";
import {} from "../css/colors.css";
import {} from "../css/shadows.css";

import { store } from "./redux/store";
import { captureMedia } from "./redux/ui/actions";
import { goTo } from "./redux/routing/actions";
import { viewManager } from "./views/manager";
import { login } from "./redux/autorizacion/actions";
import { register as registerSW, activate as activateSW } from "./libs/serviceWorker";
import { pendientesXCaja } from "./redux/OrdenMedica/actions";
import { connect } from "./redux/notifications/actions";
import { get as getMotivos } from "./redux/motivosAnulacion/actions";

if (process.env.NODE_ENV === "production") {
    registerSW();
    activateSW();
}

viewMode("main");
store.dispatch(captureMedia());
store.dispatch(goTo("main"));

if (localStorage.getItem("caja") != undefined) {
    store.dispatch(pendientesXCaja(localStorage.getItem("caja")));
    store.dispatch(connect(localStorage.getItem("caja")));
    store.dispatch(getMotivos());
} else {
    dispatch(noticarCajaVacia());
}

export default {
    login: (email, password) => {
        store.dispatch(login(email, password));
    },
    cambioClave: () => {
        store.dispatch(goTo("cambioClave"));
    },
    miembro: () => {
        store.dispatch(goTo("serMiembro"));
    },
};
