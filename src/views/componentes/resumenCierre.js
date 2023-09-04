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
import { resumenCierre as resumen } from "../../redux/OrdenMedica/actions";
import { isInLayout } from "../../redux/screens/screenLayouts";
import { cerrarCaja } from "../../redux/cierre/actions";
import { jsPDF } from "jspdf";
import { getPDFResumen } from "./impresion";

const MEDIA_CHANGE = "ui.media.timeStamp";
const SCREEN = "screen.timeStamp";

const CIERRE_TS = "ordenMedica.resumenCierreTimeStamp";
const CIERRE_ERROR_TS = "ordenMedica.errorTimeStampResumen";

export class resumenCierreComponent extends connect(store, MEDIA_CHANGE, SCREEN, CIERRE_TS, CIERRE_ERROR_TS)(LitElement) {
    constructor() {
        super();
        this.items = [];
        this.hidden = true;
        this.area = "body";

        this.final = {};
        this.final.movimientos = 0;
        this.final.total = 0;
        this.final.efectivo = 0;
        this.final.billetera = 0;
        this.final.externos = 0;
        this.final.anuladosE = 0;
        this.final.anuladosB = 0;
        this.final.anupesosE = 0;
        this.final.anupesosB = 0;

        this.movimientos = 0;
        this.total = 0;
        this.efectivo = 0;
        this.billetera = 0;
        this.externos = 0;
        this.anuladosE = 0;
        this.anuladosB = 0;
        this.anupesosE = 0;
        this.anupesosB = 0;

        this.body = {};

        this.messages = 0;
        const fecha = new Date();
        const ano = fecha.getFullYear();
        const mes = ("0" + (fecha.getMonth() + 1).toString()).padEnd(2);
        const dia = ("0" + fecha.getDate().toString()).padEnd(2);
        this.fechaHasta = ano + "-" + mes + "-" + dia;
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
                grid-template-columns: 2fr 2fr 2fr 1fr 1fr;
            }
            .grilla {
                background-color: var(--formulario);
            }
            .cabecera-grilla {
                grid-template-columns: 1fr 1fr 1.5fr 1fr 1.5fr 1fr 1fr 1fr 1fr 1fr 1fr 1fr;
                font-size: 0.85rem;
                font-weight: bold;
            }

            .cabecera-grilla div {
                color: var(--on-formulario-bajada);
            }
            .detalle-grilla {
                height: 50vh;
                overflow-y: auto;
                align-content: start;
            }
            .fila-grilla {
                grid-template-columns: 1fr 1fr 1.5fr 1fr 1.5fr 1fr 1fr 1fr 1fr 1fr 1fr 1fr;
                color: var(--on-formulario);
                font-size: 0.85rem;
            }

            .valores {
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
                width: 40%;
                height: 50%;
                border-radius: 1.5rem;
                border: none;
                padding: 0.5rem;
                gap: 0.5rem;
                position: absolute;
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%);
                z-index: 100;
                overflow: hidden;
                align-self: center;
                align-items: center;
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
                font-size: 1.6rem;
                color: var(--primario);
                align-self: start;
            }

            .resumen2 {
                grid-template-columns: 3fr 1fr;
            }

            .resumen3 {
                grid-template-columns: 3fr 1fr 2fr;
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

            .footer {
                display: grid;
                grid-template-columns: 2fr 2fr 2fr 2fr;
                grid-gap: 0.4rem;
                color: var(--on-formulario);
                padding: 0.5rem;
            }

            .footer-col {
                border-radius: 0.3rem;
                background-color: var(--formulario);
            }

            .titulo {
                //justify-self: normal;
                font-size: 2rem;
                color: var(--on-formulario);
            }
            .tituloItems {
                //display: grid;
                column-span: 2;
                font-weight: bold;
                justify-content: center;
            }
            .resumenItems {
                display: grid;
                grid-auto-columns: auto;
                color: var(--on-formulario);
                align-self: start;
            }

            .totales {
                display: grid;
                grid-template-columns: 2fr 1fr;
                color: var(--on-formulario);
            }
            .bold {
                font-weight: bold;
                color: var(--terciario-10);
            }
        `;
    }

    render() {
        return html`
            <div class="fit18 filtro">
                <div class="titulo">Resumen de Cierres</div>
                <div class="input">
                    <input type="date" id="desde" max="${this.fechaHasta}" />
                    <label for="desde">Fecha desde:</label>
                    <label error>No puede ser vacio</label>
                    <label subtext>Requerido</label>
                </div>
                <div class="input">
                    <input type="date" id="hasta" max="${this.fechaHasta}" />
                    <label error>No puede ser vacio</label>
                    <label subtext>Requerido</label>
                </div>
                <button class="justify-self-end" raised etiqueta round @click="${this.listar}">
                    <div>${CIERRE}</div>
                    <div class="justify-self-start">Listar</div>
                </button>
                <button class="justify-self-end" raised etiqueta round @click="${this.imprimir}">
                    <div>${PRINT}</div>
                    <div class="justify-self-start">Imprimir</div>
                </button>
            </div>
            <div class="grid grilla" id="grillaPDF">
                <div class="grid cabecera-grilla">
                    <div class="orden" .ordenax=${"nroCierre"} @click=${this.ordenar}>Numero</div>
                    <div class="orden" .ordenax=${"fecha"} @click=${this.ordenar}>Fecha</div>
                    <div class="orden" .ordenax=${"nombre"} @click=${this.ordenar}>Caja</div>
                    <div class="justify-self-end grid">Movimientos</div>
                    <div class="orden justify-self-end grid" .ordenax=${"total"} @click=${this.ordenar}>Total</div>
                    <div class="justify-self-end grid">Efectivo</div>
                    <div class="justify-self-end grid">Billetera</div>
                    <div class="justify-self-end grid">Externos</div>
                    <div class="justify-self-end grid">Anulados Efectivo</div>
                    <div class="justify-self-end grid">Anulados Billetera</div>
                    <div class="justify-self-end grid">$ Anulados Efectivo</div>
                    <div class="justify-self-end grid">$ Anulados Billetera</div>
                </div>

                <div class="grid row detalle-grilla">
                    ${this.items.map((item) => {
                        this.sumar(item);
                        return html`<div class="inner-grid fila-grilla" .item=${item}>
                            <div>${item.nroCierre}</div>
                            <div>${item.fecha ? new Date(item.fecha).toLocaleDateString() : ""}</div>
                            <div>${item.nombre}</div>
                            <div class="justify-self-end grid">${item.movimientos}</div>
                            <div class="justify-self-end grid">${item.total.toFixed(2)}</div>
                            <div class="justify-self-end grid">${item.efectivo.toFixed(2)}</div>
                            <div class="justify-self-end grid">${item.billetera.toFixed(2)}</div>
                            <div class="justify-self-end grid">${item.externos}</div>
                            <div class="justify-self-end grid">${item.anuladosEfectivo}</div>
                            <div class="justify-self-end grid">${item.anuladosBilletera}</div>
                            <div class="justify-self-end grid">${item.importeAnuladosE.toFixed(2)}</div>
                            <div class="justify-self-end grid">${item.importeAnuladosB.toFixed(2)}</div>
                        </div>`;
                    })}
                    <div class="inner-grid fila-grilla bold" id="divTotales" hidden>
                        <div></div>
                        <div></div>
                        <div></div>
                        <div class="justify-self-end grid">${this.final.movimientos}</div>
                        <div class="justify-self-end grid">${this.final.total.toFixed(2)}</div>
                        <div class="justify-self-end grid">${this.final.efectivo.toFixed(2)}</div>
                        <div class="justify-self-end grid">${this.final.billetera.toFixed(2)}</div>
                        <div class="justify-self-end grid">${this.final.externos}</div>
                        <div class="justify-self-end grid">${this.final.anuladosE}</div>
                        <div class="justify-self-end grid">${this.final.anuladosB}</div>
                        <div class="justify-self-end grid">${this.final.anupesosE.toFixed(2)}</div>
                        <div class="justify-self-end grid">${this.final.anupesosB.toFixed(2)}</div>
                    </div>
                </div>
            </div>
        `;
    }

    validoFecha() {
        const desde = this.shadowRoot.querySelector("#desde");
        const hasta = this.shadowRoot.querySelector("#hasta");
        if (!desde.value || !hasta.value) {
            alert("Debe completar las fechas");
            return false;
        }
        if (desde.value > hasta.value) {
            alert("La fecha desde debe ser menor igual a la fecha hasta");
            return false;
        }
        return true;
    }

    sumar(item) {
        this.final.movimientos += item.movimientos;
        this.final.total += item.total;
        this.final.efectivo += item.efectivo;
        this.final.billetera += item.billetera;
        this.final.externos += item.externos;
        this.final.anuladosE += item.anuladosEfectivo;
        this.final.anuladosB += item.anuladosBilletera;
        this.final.anupesosE += item.importeAnuladosE;
        this.final.anupesosB += item.importeAnuladosB;
        const totales = this.shadowRoot.querySelector("#divTotales");
        totales.hidden = false;
    }

    cerrar() {
        const dialogo = this.shadowRoot.querySelector("#dialogo");
        dialogo.close();
    }

    imprimir() {
        const desde = this.shadowRoot.querySelector("#desde");
        const hasta = this.shadowRoot.querySelector("#hasta");
        const doc = getPDFResumen(this.items, desde.value, hasta.value, this.final);
        doc.save("ResumenCierre" + desde.value.toString() + "_" + hasta.value.toString());
    }

    listar() {
        if (this.validoFecha()) {
            const desde = this.shadowRoot.querySelector("#desde").value;
            const hasta = this.shadowRoot.querySelector("#hasta").value;
            const cemap = localStorage.getItem("cemap");
            store.dispatch(resumen(desde, hasta, cemap));
        } else {
            return false;
        }
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
            const isCurrentScreen = ["resumenCierre"].includes(state.screen.name);
            if (isInLayout(state, this.area) && isCurrentScreen) {
                //this.opciones = this.shadowRoot.querySelector("#opciones");
                this.hidden = false;
            }
            this.update();
        }

        if (name == CIERRE_TS) {
            if (state.ordenMedica.resumenCierre) {
                this.items = state.ordenMedica.resumenCierre;
            }

            this.update();
        }

        if (name == CIERRE_ERROR_TS) {
            alert("No existe el Número de Cierre");
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
window.customElements.define("resumen-cierre-component", resumenCierreComponent);
