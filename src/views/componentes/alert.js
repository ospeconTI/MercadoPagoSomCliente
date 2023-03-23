/** @format */

import { html, LitElement, css } from "lit";
import { store } from "../../redux/store";
import { connect } from "@brunomon/helpers/connect";
import { dialog } from "@brunomon/template-lit/src/views/css/dialog";
import { button } from "@brunomon/template-lit/src/views/css/button";
const SHOW = "ui.alert.timeStamp";

export class AlertControl extends connect(store, SHOW)(LitElement) {
    constructor() {
        super();
        this.hidden = true;
    }
    static get styles() {
        return css`
            ${button}
            ${dialog}
            :host[hidden] {
                display: none;
            }
        `;
    }
    render() {
        return html`<dialog>
            <div class="header">${this.titulo}</div>
            <div class="body">${this.mensaje}</div>
            <div class="footer">
                <button link @click="${this.cerrar}">
                    <div>OK</div>
                </button>
            </div>
        </dialog>`;
    }

    stateChanged(state, name) {
        if (name == SHOW) {
            this.titulo = state.ui.alert.titulo;
            this.mensaje = state.ui.alert.mensaje;
            this.renderRoot.querySelector("dialog").showModal();
            this.hidden = false;
        }
    }
    cerrar() {
        this.renderRoot.querySelector("dialog").close();
        this.hidden = true;
    }
    static get properties() {
        return {
            hidden: {
                type: Boolean,
                reflect: true,
            },
            titulo: { type: String, reflect: true },
            mensaje: { type: String, reflect: true },
        };
    }
}
window.customElements.define("alert-control", AlertControl);
