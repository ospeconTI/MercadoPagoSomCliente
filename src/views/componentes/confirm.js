/** @format */

import { html, LitElement, css } from "lit";
import { store } from "../../redux/store";
import { connect } from "@brunomon/helpers/connect";
import { dialog } from "@brunomon/template-lit/src/views/css/dialog";
import { button } from "@brunomon/template-lit/src/views/css/button";
import { gridLayout } from "@brunomon/template-lit/src/views/css/gridLayout";
const SHOW = "ui.confirm.timeStamp";

export class ConfirmControl extends connect(store, SHOW)(LitElement) {
    constructor() {
        super();
        this.hidden = true;
    }
    static get styles() {
        return css`
            ${button}
            ${dialog}
            ${gridLayout}
            :host[hidden] {
                display: none;
            }
        `;
    }
    render() {
        return html`<dialog>
            <div class="header">${this.titulo}</div>
            <div class="body">${this.mensaje}</div>
            <div class="footer column">
                <button link @click="${this.cancel}">
                    <div>NO</div>
                </button>
                <button link @click="${this.ok}">
                    <div>SI</div>
                </button>
            </div>
        </dialog>`;
    }

    stateChanged(state, name) {
        if (name == SHOW) {
            this.titulo = state.ui.confirm.titulo;
            this.mensaje = state.ui.confirm.mensaje;
            this.onOk = state.ui.confirm.onOk;
            this.onCancel = state.ui.confirm.onCancel;
            this.renderRoot.querySelector("dialog").showModal();
            this.hidden = false;
        }
    }
    cerrar() {
        this.renderRoot.querySelector("dialog").close();
        this.hidden = true;
    }
    ok(e) {
        if (this.onOk) store.dispatch(this.onOk);
        this.cerrar();
    }
    cancel(e) {
        if (this.onCancel) store.dispatch(this.onCancel);
        this.cerrar();
    }
    static get properties() {
        return {
            hidden: {
                type: Boolean,
                reflect: true,
            },
            titulo: { type: String, reflect: true },
            mensaje: { type: String, reflect: true },
            onOk: { type: Object },
            onCancel: { type: Object },
        };
    }
}
window.customElements.define("confirm-control", ConfirmControl);
