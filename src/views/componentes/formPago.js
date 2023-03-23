/** @format */

import { html, LitElement, css } from "lit";
import { store } from "../../redux/store";
import { connect, deepValue } from "@brunomon/helpers";
import { PERSON, REFRESH } from "../../../assets/icons/svgs";
import { gridLayout } from "@brunomon/template-lit/src/views/css/gridLayout";
import { input } from "@brunomon/template-lit/src/views/css/input";
import { select } from "@brunomon/template-lit/src/views/css/select";
import { check } from "@brunomon/template-lit/src/views/css/check";
import { button } from "@brunomon/template-lit/src/views/css/button";
import { SpinnerControl } from "./spinner";
import { AlertControl } from "./alert";
import { ConfirmControl } from "./confirm";
import { showAlert, showConfirm } from "../../redux/ui/actions";
import { showSpinner } from "../../redux/api/actions";
const PENDIENTES = "ordenMedica.timeStamp";
export class formPago extends connect(store, PENDIENTES)(LitElement) {
    constructor() {
        super();
        this.items = [];
    }

    static get styles() {
        return css`
            ${gridLayout}
            ${input}
            ${select}
            ${check}
            ${button}

            :host {
                display: grid;
                grid-auto-flow: row;
                background-color: var(--aplicacion);
                grid-gap: 1rem;
                overflow-y: scroll;
                align-content: start;
            }
            svg {
                height: 2rem;
                width: 2rem;
            }
            button[circle][big] svg {
                height: 2rem;
                width: 2rem;
            }
            button[etiqueta] {
                display: grid;
                grid-auto-flow: column;
                grid-template-columns: auto 1fr;
                grid-gap: 0.3rem;
                align-items: center;
                align-content: center;
            }

            .spinner-container {
                position: relative;
                color: var(--on-formulario);
            }
            .filtro {
                display: grid;
                gap: 3rem;
                padding: 2rem;
                background-color: var(--formulario);
            }
            .grilla {
                background-color: var(--formulario);
            }
            .cabecera-grilla {
                grid-template-columns: 3fr 1fr 1fr 1fr 1fr;
            }
            .cabecera-grilla div {
                color: var(--on-formulario-bajada);
            }
            .detalle-grilla {
            }
            .fila-grilla {
                grid-template-columns: 3fr 1fr 1fr 1fr 1fr;
                color: var(--on-formulario);
            }
        `;
    }

    render() {
        return html`
            <div class="fit18 filtro">
                <div class="input">
                    <input id="1" />
                    <label for="1">Apellido/DNI/Bono</label>
                    <label error></label>
                    <label subtext>Digite para filtrar la lista de bonos</label>
                </div>

                <button raised etiqueta round>
                    <div>${REFRESH}</div>
                    <div class="justify-self-start">PENDIENTES DE COBRO</div>
                </button>
            </div>
            <div class="grid grilla">
                <div class="grid cabecera-grilla">
                    <div>Apellido y Nombre</div>
                    <div>DNI</div>
                    <div>Bono Nº</div>
                    <div>Importe</div>
                    <div></div>
                </div>

                <div class="grid row detalle-grilla">
                    ${this.items.map((item) => {
                        return html`<div class="inner-grid fila-grilla">
                            <div>${item.paciente_Nombre}</div>
                            <div>${item.paciente_Documento}</div>
                            <div>${item.numero}</div>
                            <div>${item.importeCaja}</div>
                            <div class="check">
                                <input id="c1" type="checkbox" .item=${item} />
                                <label for="c1">Sumar</label>
                                <label></label>
                            </div>
                        </div>`;
                    })}
                </div>
            </div>
        `;
    }

    enlace(field) {
        return (e) => this.updateProperty(e, field);
    }
    updateProperty(e, field) {
        this.item[field] = e.currentTarget.value;
        this.requestUpdate();
    }

    stateChanged(state, name) {
        if (name == PENDIENTES) {
            this.items = state.ordenMedica.entities;
            this.update();
        }
    }

    static get properties() {
        return {
            mediaSize: {
                type: String,
                reflect: true,
                attribute: "media-size",
            },
            orientation: {
                type: String,
                reflect: true,
            },
        };
    }
}
window.customElements.define("form-pago", formPago);
