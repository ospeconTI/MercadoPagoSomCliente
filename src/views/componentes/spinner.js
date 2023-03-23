/** @format */

import { html, LitElement, css } from "lit";
import { store } from "../../redux/store";
import { connect } from "@brunomon/helpers/connect";
import { spinner } from "@brunomon/template-lit/src/views/css/spinner";
const LOADING = "api.loading";
export class SpinnerControl extends connect(store, LOADING)(LitElement) {
    constructor() {
        super();
        this.hidden = true;
    }
    static get styles() {
        return css`
            ${spinner}
            :host[hidden] {
                display: none;
            }
        `;
    }
    render() {
        return html`<div
            class="spinner"
            ?anillo=${this.anillo}
            ?aro=${this.aro}
            ?cometa=${this.cometa}
            ?bloque=${this.bloque}
            ?progress=${this.progress}
            ?sonar=${this.sonar}
            ?radar=${this.radar}
            ?dado=${this.dado}
        ></div>`;
    }

    stateChanged(state, name) {
        if (name == LOADING) this.hidden = state.api.loading == 0;
    }

    static get properties() {
        return {
            hidden: {
                type: Boolean,
                reflect: true,
            },
            anillo: {
                type: Boolean,
                reflect: true,
            },
            aro: {
                type: Boolean,
                reflect: true,
            },
            cometa: {
                type: Boolean,
                reflect: true,
            },
            bloque: {
                type: Boolean,
                reflect: true,
            },
            progress: {
                type: Boolean,
                reflect: true,
            },
            sonar: {
                type: Boolean,
                reflect: true,
            },
            radar: {
                type: Boolean,
                reflect: true,
            },
            dado: {
                type: Boolean,
                reflect: true,
            },
        };
    }
}
window.customElements.define("spinner-control", SpinnerControl);
