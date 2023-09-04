/** @format */

import { html, LitElement, css } from "lit";
import { connect } from "@brunomon/helpers";
import { store } from "../redux/store";
import { layoutsCSS } from "../views/ui/layouts";
import { getLayout } from "../redux/screens/screenLayouts";
import { goTo } from "../redux/routing/actions";
import { formPago } from "./componentes/formPago";
import { menuPrincipal } from "./headers/menu";
import { spinner } from "@brunomon/template-lit/src/views/css/spinner";
import { gridLayout } from "@brunomon/template-lit/src/views/css/gridLayout";
import { anulacion } from "./componentes/anulacion";
import { cierre } from "./componentes/cierre";
import { listaCierre } from "./componentes/listaCierre";
import { resumenCierreComponent } from "./componentes/resumenCierre";

const MEDIA_CHANGE = "ui.media.timeStamp";
const SCREEN = "screen.timeStamp";
const SELECTION = "ui.menu.timeStamp";

export class viewManager extends connect(store, MEDIA_CHANGE, SCREEN, SELECTION)(LitElement) {
    constructor() {
        super();
        window.onpopstate = (event) => {
            if (event.state) {
                store.dispatch(goTo(event.state.option, true));
            } else {
                window.history.back();
            }
        };
    }

    static get styles() {
        return css`
            ${layoutsCSS}
            ${gridLayout}
            ${spinner}
            :host {
                display: grid;
                padding: 0;
                background-color: var(--aplicacion);
                overflow: hidden;
            }

            :host::-webkit-scrollbar {
                width: 0.5vw;
                cursor: pointer;
            }
            :host::-webkit-scrollbar([media-size="small"]) {
                display: none;
            }
            :host::-webkit-scrollbar-thumb {
                background: var(--secundario);
                border-radius: 5px;
            }
        `;
    }

    render() {
        return html`
            <div class="spinner" anillo fixed hidden></div>
            <menu-principal area="header"></menu-principal>
            <form-pago area="body"></form-pago>
            <anulacion-component area="body"></anulacion-component>
            <cierre-component area="body"></cierre-component>
            <lista-cierre-component area="body"></lista-cierre-component>
            <resumen-cierre-component area="body"></resumen-cierre-component>
        `;
    }

    stateChanged(state, name) {
        if (name == MEDIA_CHANGE || name == SCREEN) {
            this.mediaSize = state.ui.media.size;
            this.orientation = state.ui.media.orientation;
            this.layout = getLayout(state).name;
            if (!window.MSStream && /iPad|iPhone|iPod/.test(navigator.userAgent)) {
                if ("standalone" in window.navigator && window.navigator.standalone) {
                    this.style.height = document.documentElement.offsetHeight ? document.documentElement.offsetHeight : window.innerHeight + "px";
                } else {
                    if (state.ui.media.orientation == "portrait") {
                        this.style.height = window.innerHeight < window.innerWidth ? window.innerWidth : window.innerHeight + "px";
                    } else {
                        this.style.height = window.innerHeight > window.innerWidth ? window.innerWidth : window.innerHeight + "px";
                    }
                }
            }
        }
        this.update();
    }

    static get properties() {
        return {
            mediaSize: {
                type: String,
                reflect: true,
                attribute: "media-size",
            },
            layout: {
                type: String,
                reflect: true,
            },
            orientation: {
                type: String,
                reflect: true,
            },
        };
    }
}

window.customElements.define("view-manager", viewManager);
