/** @format */

import { html, LitElement, css } from "lit";
import { store } from "../../redux/store";
import { connect, deepValue } from "@brunomon/helpers";
import { OK, PAGAR, PERSON, QR, REFRESH, SEARCH, CIERRE, PRINT, LISTA } from "../../../assets/icons/svgs";
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
import { imprimirCierre, listarCierre, pendientesXCaja } from "../../redux/OrdenMedica/actions";
import { recibirPago } from "../../redux/MercadoPago/actions";
import { isInLayout } from "../../redux/screens/screenLayouts";
import { cerrarCaja } from "../../redux/cierre/actions";
//import { impresionCierre } from "./impresion";

const MEDIA_CHANGE = "ui.media.timeStamp";
const SCREEN = "screen.timeStamp";
const LISTADO = "ordenMedica.listaCierreTimeStamp";

const PENDIENTES = "ordenMedica.bonosSinCerrarTimeStamp";
const CIERRE_TS = "cierre.cierreTimeStamp";

export class cierre extends connect(store, MEDIA_CHANGE, SCREEN, PENDIENTES, CIERRE_TS, LISTADO)(LitElement) {
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
        this.total = 0;
        this.resumen = [];
        this.movimientos = [];
        this.excepcion = [];
        this.recaudacion = [];
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
                grid-template-columns: 1fr 2fr;
            }
            .grilla {
                background-color: var(--formulario);
            }
            .cabecera-grilla {
                grid-template-columns: 2.5fr 0.5fr 1fr 2.5fr 2fr 1.5fr 1fr 1fr 1fr 1fr 0.5fr;
                font-size: 0.85rem;
                font-weight: bold;
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
                grid-template-columns: 2.5fr 0.5fr 1fr 2.5fr 2fr 1.5fr 1fr 1fr 1fr 1fr 0.5fr;
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
        `;
    }

    render() {
        return html`
            <div class="fit18 filtro">
                <div class="titulo">CIERRE DE CAJA</div>
                <button class="justify-self-end" raised etiqueta round @click="${this.cerrarCaja}">
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
                    <div class="justify-self-end;grid">Importe</div>
                    <div>Mov</div>
                    <div>F.Pago</div>
                    <div>Recauda</div>
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
                            <div class="justify-self-end;grid">${item.importeCaja.toFixed(2)}</div>
                            <div>${item.movimiento}</div>
                            <div>${item.tipoPago}</div>
                            <div>${item.recauda}</div>
                        </div>`;
                    })}
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
            </div>

            <div class="footer">
                <div class="footer-col row ">
                    <div class="tituloItems grid">TOTALES</div>
                    <div class="totales">
                        <div class="grid">Total General:</div>
                        <div class="grid justify-self-end">${this.resumen.importeTotal ? this.resumen.importeTotal : 0}</div>
                    </div>
                    <div class="totales">
                        <div class="grid">Efectivo:</div>
                        <div class="grid justify-self-end">${this.resumen.efectivo ? this.resumen.efectivo : 0}</div>
                    </div>
                    <div class="totales">
                        <div class="grid">Billetera:</div>
                        <div class="grid justify-self-end">${this.resumen.billetera ? this.resumen.billetera : 0}</div>
                    </div>
                </div>

                <div class="footer-col">
                    <div class="tituloItems grid">MOVIMIENTOS</div>
                    ${this.movimientos.map((item) => {
                        return html` <div class="grid resumen3">
                            <div class="grid">${item.id}</div>
                            <div class="grid justify-self-end">${item.cantidad}</div>
                            <div class="grid justify-self-end">${item.importe}</div>
                        </div>`;
                    })}
                </div>

                <div class="footer-col">
                    <div class="tituloItems grid">EXCEPCION</div>
                    ${this.excepcion.map((item) => {
                        return html` <div class="grid resumen2">
                            <div class="grid">${item.id}</div>
                            <div class="grid justify-self-end">${item.cantidad}</div>
                        </div>`;
                    })}
                </div>

                <div class="footer-col">
                    <div class="tituloItems grid">RECAUDACION</div>
                    ${this.recaudacion.map((item) => {
                        return html` <div class="grid resumen3">
                            <div class="grid">${item.id}</div>
                            <div class="grid justify-self-end">${item.cantidad}</div>
                            <div class="grid justify-self-end">${item.importe}</div>
                        </div>`;
                    })}
                </div>
            </div>
        `;
    }

    cerrar() {
        const dialogo = this.shadowRoot.querySelector("#dialogo");
        dialogo.close();
    }

    cerrarCaja() {
        if (this.items.length > 0) {
            const sinCobro = this.items.find((element) => element.tipoPago == null);
            if (!sinCobro) {
                if (confirm("Va a realizar el Cierre de la Caja. Está Seguro")) {
                    store.dispatch(cerrarCaja());
                }
            } else {
                alert("Hay bonos sin registrar el pago");
                return false;
            }
        } else {
            alert("No Hay Movimientos para cerrar");
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

    imprimir() {
        //store.dispatch(listarCierre(this.nroCierre));
        store.dispatch(imprimirCierre(this.nroCierre));
        this.cerrar();
    }

    stateChanged(state, name) {
        if (name == SCREEN || name == MEDIA_CHANGE) {
            this.mediaSize = state.ui.media.size;
            this.hidden = true;
            const isCurrentScreen = ["cierre"].includes(state.screen.name);
            if (isInLayout(state, this.area) && isCurrentScreen) {
                this.opciones = this.shadowRoot.querySelector("#opciones");
                this.hidden = false;
            }
            this.update();
        }

        if (name == PENDIENTES) {
            if (state.ordenMedica.bonosSinCerrar) {
                this.items = state.ordenMedica.bonosSinCerrar.movimientos;
                this.resumen = state.ordenMedica.bonosSinCerrar.resumen;
                this.movimientos = this.resumen.movimientos;
                this.excepcion = this.resumen.excepcion;
                this.recaudacion = this.resumen.recaudacion;
            }

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

        if (name == LISTADO) {
            const isCurrentScreen = ["cierre"].includes(state.screen.name);
            if (state.ordenMedica.listaCierre && isCurrentScreen) {
                impresionCierre();
            }
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
