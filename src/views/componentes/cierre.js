/** @format */

import { html, LitElement, css } from "lit";
import { store } from "../../redux/store";
import { connect, deepValue } from "@brunomon/helpers";
import { OK, PAGAR, PERSON, QR, REFRESH, SEARCH, CIERRE, PRINT } from "../../../assets/icons/svgs";
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
import { pendientesXCaja } from "../../redux/OrdenMedica/actions";
import { recibirPago } from "../../redux/MercadoPago/actions";
import { isInLayout } from "../../redux/screens/screenLayouts";
import { cerrarCaja } from "../../redux/cierre/actions";

const MEDIA_CHANGE = "ui.media.timeStamp";
const SCREEN = "screen.timeStamp";

const PENDIENTES = "ordenMedica.bonosSinCerrarTimeStamp";
const CIERRE_TS = "cierre.cierreTimeStamp";

export class cierre extends connect(store, MEDIA_CHANGE, SCREEN, PENDIENTES, CIERRE_TS)(LitElement) {
    constructor() {
        super();
        this.items = [];
        this.hidden = true;
        this.ordenes = [];
        this.pagos = [];
        this.importeMP = 0;
        this.importeTotal = 0;
        this.efectivo = 0;
        this.body = {};
        this.pagoGenerado = false;
        this.messages = 0;
        this.pagoOK = false;
        this.escondido = true;
        this.area = "body";
        this.totales = [];
        this.nroCierre = "";
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
                grid-gap: 0.6rem;
                overflow-y: scroll;
                align-content: start;
            }
            :host([hidden]) {
                display: none;
            }

            *[hidden] {
                display: none !important;
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
                grid-template-columns: 2fr 0.5fr 1fr 2.5fr 2fr 1fr 1fr 1fr 1fr 1fr;
            }
            .cabecera-grilla div {
                color: var(--on-formulario-bajada);
            }
            .detalle-grilla {
                height: 30vh;
                overflow-y: auto;
                align-content: start;
            }
            .fila-grilla {
                grid-template-columns: 2fr 0.5fr 1fr 2.5fr 2fr 1fr 1fr 1fr 1fr 1fr;
                color: var(--on-formulario);
            }
            .valores {
                width: 20vw;
            }
            .valores input {
                font-size: 2rem;
            }
            .valores label {
                font-size: 1.2rem;
                color: var(--on-formulario);
            }

            .valores select {
                font-size: 2rem;
            }
            .valores option {
                font-size: 1.5rem;
            }

            .valores input {
                color: var(--primario) !important;
                border: 1px solid var(--primario) !important;
                text-align: end !important;
            }

            .resumen[open] {
                display: grid;
                justify-content: center;
                grid-template-columns: 1fr;
                justify-items: center;
                background-color: white;
                width: 50%;
                height: 75%;
                border-radius: 1.5rem;
                border: none;
                padding: 0.5rem;
                gap: 0.5rem;
                position: absolute;
                top: 50%;
                left: 50%;
                transform: translate(-50%, -30%);
                z-index: 100;
                overflow: hidden;
            }
            .grilla-resumen {
                background-color: white; //var(--on-formulario);
                width: 90%;
                font-size: 1.3rem;
            }
            .cabecera-grilla-resumen {
                grid-template-columns: 1fr auto;
            }
            .cabecera-grilla-resumen div {
                color: var(--formulario-bajada);
            }
            .detalle-grilla-resumen {
                height: 30vh;
                overflow-y: auto;
                align-content: start;
            }
            .total {
                font-size: 1.5rem;
                color: var(--primario);
            }
            .fila-grilla-resumen {
                grid-template-columns: 1fr auto;
                color: var(--formulario);
            }
            .titulo-resumen {
                grid-template-columns: 9fr 1fr;
                justify-self: normal;
                font-size: 2rem;
                color: var(--primario);
            }
            .boton-cerrar {
                cursor: pointer;
                padding: 1rem;
            }
            .titulo-pago {
                display: grid;
                font-size: 2rem;
                color: var(--primario);
            }

            .notificacion {
                display: grid;
                color: white;
                background-color: red;
                border-radius: 50%;
                padding: 0.2rem;
                font-size: 1rem;
                position: absolute;
                top: -0.5rem;
                right: 2rem;
                height: 1rem;
                width: 1rem;
                place-content: center;
            }
            .ok {
                display: grid;
                height: 7rem;
                width: 7rem;
                background-color: green;
                border-radius: 50%;
                align-items: center;
                justify-items: center;
            }
            .ok svg {
                fill: white;
                width: 4rem;
                height: 4rem;
            }
            .orden {
                cursor: pointer;
            }

            .titulo {
                //justify-self: normal;
                font-size: 2rem;
                color: var(--on-formulario);
            }
        `;
    }

    render() {
        return html`
            <div class="fit18 filtro">
                <div class="titulo">CIERRE DE CAJA</div>
                <button raised etiqueta round @click="${this.cerrarCaja}">
                    <div>${CIERRE}</div>
                    <div class="justify-self-start">CERRAR CAJA</div>
                </button>
            </div>
            <div class="grid grilla">
                <div class="grid cabecera-grilla">
                    <div class="orden" .ordenax=${"paciente_Nombre"} @click=${this.ordenar}>Apellido y Nombre</div>
                    <div class="orden" .ordenax=${"paciente_Documento"} @click=${this.ordenar}>DNI</div>
                    <div class="orden" .ordenax=${"cuilTitular"} @click=${this.ordenar}>CUIL Titular</div>
                    <div class="orden" .ordenax=${"efector"} @click=${this.ordenar}>Efector</div>
                    <div class="orden" .ordenax=${"especialidad"} @click=${this.ordenar}>Especialidad</div>
                    <div class="orden" .ordenax=${"numero"} @click=${this.ordenar}>Bono Nº</div>
                    <div class="orden" .ordenax=${"expediente"} @click=${this.ordenar}>Expediente</div>
                    <div>Importe</div>
                    <div>Mov</div>
                    <div>F.Pago</div>
                </div>

                <div class="grid row detalle-grilla">
                    ${this.items.map((item) => {
                        return html`<div class="inner-grid fila-grilla" .item=${item}>
                            <div>${item.paciente_Nombre}</div>
                            <div>${item.paciente_Documento}</div>
                            <div>${item.cuilTitular}</div>
                            <div>${item.efector}</div>
                            <div>${item.especialidad}</div>
                            <div>${item.numero}</div>
                            <div>${item.expediente}</div>
                            <div>$ ${item.importeCaja.toFixed(2)}</div>
                            <div>${item.movimiento}</div>
                            <div>${item.tipoPago}</div>
                        </div>`;
                    })}
                </div>
            </div>

            <dialog class="resumen" id="dialogo">
                <div class="grid column titulo-resumen">
                    <div class="justify-self-center">Se ha generado el cierre Nro: ${this.nroCierre}</div>
                    <div @click=${this.cerrar} class="boton-cerrar justify-self-end">X</div>
                </div>

                <button raised etiqueta round @click="${this.imprimir}">
                    <div>${PRINT}</div>
                    <div class="justify-self-start">IMPRIMIR</div>
                </button>
            </dialog>
        `;
    }

    cerrar() {
        const dialogo = this.shadowRoot.querySelector("#dialogo");
        dialogo.close();
    }

    cerrarCaja() {
        store.dispatch(cerrarCaja());
    }

    ordenar(e) {
        const orden = e.currentTarget.ordenax;
        this.ordenarArray(orden);
        this.update();
    }

    ordenarArray(orden) {
        this.items.sort((a, b) => {
            const propA = a[orden];
            const propB = b[orden];
            if (propA < propB) {
                return -1;
            }
            if (propA > propB) {
                return 1;
            }
            return 0;
        });
    }

    enlace(field) {
        return (e) => this.updateProperty(e, field);
    }

    updateProperty(e, field) {
        this.item[field] = e.currentTarget.value;
        this.requestUpdate();
    }

    stateChanged(state, name) {
        if (name == SCREEN || name == MEDIA_CHANGE) {
            this.mediaSize = state.ui.media.size;
            this.hidden = true;
            const isCurrentScreen = ["cierre"].includes(state.screen.name);
            if (isInLayout(state, this.area) && isCurrentScreen) {
                this.opciones = this.shadowRoot.querySelector("#opciones");
                //gestures(this.opciones, this.gestos, this);
                this.hidden = false;
            }
            this.update();
        }

        if (name == PENDIENTES) {
            this.items = state.ordenMedica.bonosSinCerrar;
            //this.totales = this.items.reduce((a, b) => (a.tipoPago = b.tipoPago ? a.importeCaja : 0));

            this.totales = this.items.reduce((acum, item) => {
                return !acum[item.tipoPago] ? { ...acum, [item.tipoPago]: item.importeCaja } : { ...acum, [item.tipoPago]: acum[item.tipoPago] + item.importeCaja };
            }, {});
            this.update();
        }

        if (name == CIERRE_TS) {
            this.nroCierre = state.cierre.cierre;
            const dialogo = this.shadowRoot.querySelector("#dialogo");
            dialogo.showModal();
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
            hidden: {
                type: Boolean,
                reflect: true,
            },
        };
    }
}
window.customElements.define("cierre-component", cierre);
