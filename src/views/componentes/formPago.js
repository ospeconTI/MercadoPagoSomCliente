/** @format */

import { html, LitElement, css } from "lit";
import { store } from "../../redux/store";
import { connect, deepValue } from "@brunomon/helpers";
import { OK, PAGAR, PERSON, QR, REFRESH, SEARCH } from "../../../assets/icons/svgs";
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

const PENDIENTES = "ordenMedica.timeStamp";
const PAGO_GENERADO = "mercadoPago.pagoGeneradoTimeStamp";
const MESSAGE = "ui.mensajesTimeStamp";
const PAGO_RECIBIDO = "ui.pagoRecibidoTimeStamp";
export class formPago extends connect(store, PENDIENTES, PAGO_GENERADO, MESSAGE, PAGO_RECIBIDO)(LitElement) {
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
                grid-template-columns: 3fr 1fr 1fr 1fr 1fr 1fr;
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
                grid-template-columns: 3fr 1fr 1fr 1fr 1fr 1fr;
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
            }
            .resumen[open] {
                display: grid;
                justify-content: center;
                grid-template-columns: 1fr;
                justify-items: center;
                background-color: white;
                width: 50%;
                height: 70%;
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
            .fila-grilla-resumen {
                grid-template-columns: 1fr auto;
                color: var(--formulario);
            }
            .titulo-resumen {
                grid-template-columns: 9fr 1fr;
                justify-self: normal;
                font-size: var(--font-header-h1-family);
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
        `;
    }

    render() {
        return html`
            <div class="fit18 filtro">
                <div class="input">
                    <input id="filtro" />
                    <label for="filtro">Apellido/DNI/Bono/CUIL Titular</label>
                    <label error></label>
                    <label subtext>Digite para filtrar la lista de bonos</label>
                </div>
                <button raised etiqueta round @click="${this.filtrar}">
                    <div>${SEARCH}</div>
                    <div class="justify-self-start">Filtrar</div>
                </button>

                <button raised etiqueta round style="position:relative" @click="${this.refresh}">
                    <div>${REFRESH}</div>

                    <div class="justify-self-start">
                        PENDIENTES DE COBRO
                        <span class="notificacion" ?hidden="${this.messages == 0}">${this.messages}</span>
                    </div>
                </button>
            </div>
            <div class="grid grilla">
                <div class="grid cabecera-grilla">
                    <div>Apellido y Nombre</div>
                    <div>DNI</div>
                    <div>CUIL Titular</div>
                    <div>Bono Nº</div>
                    <div>Importe</div>
                    <div></div>
                </div>

                <div class="grid row detalle-grilla">
                    ${this.items.map((item) => {
                        return html`<div class="inner-grid fila-grilla" .item=${item}>
                            <div>${item.paciente_Nombre}</div>
                            <div>${item.paciente_Documento}</div>
                            <div>${item.cuilTitular}</div>
                            <div>${item.numero}</div>
                            <div>${item.importeCaja}</div>
                            <div class="check">
                                <input id="c1" type="checkbox" @click="${this.sumar}" .item=${item} />
                                <label for="c1">Sumar</label>
                                <label></label>
                            </div>
                        </div>`;
                    })}
                </div>
            </div>
            <div class="fit18 filtro">
                <div class="grid column">
                    <div class="input valores" disabled>
                        <input id="importeEfectivo" .value="${this.efectivo}" />
                        <label for="importeEfectivo">Efectivo</label>
                        <label error></label>
                    </div>

                    <div class="input valores">
                        <input id="importeMP" .value="${this.importeMP}" @blur=${this.mp} />
                        <label for="importeMP">Mercado Pago</label>
                        <label error></label>
                    </div>
                    <div class="input valores" disabled>
                        <input id="importe" .value="${this.importeTotal}" />
                        <label for="importe">Total a Pagar</label>
                        <label error></label>
                    </div>
                    <button class="align-self-center" raised etiqueta round @click="${this.prepararPago}">
                        <div>${PAGAR}</div>
                        <div class="justify-self-start">Preparar Pago</div>
                    </button>
                </div>
            </div>

            <dialog class="resumen" id="resumen">
                <div class="grid column titulo-resumen">
                    <div class="justify-self-center">Ordenes Médicas a Pagar</div>
                    <div @click=${this.cerrar} class="boton-cerrar justify-self-end">X</div>
                </div>

                <div class="grid grilla-resumen">
                    <div class="grid cabecera-grilla-resumen">
                        <div>Orden Médica</div>
                        <div>Importe</div>
                    </div>
                    <div class="grid row detalle-grilla-resumen">
                        ${this.pagos.map((pago) => {
                            return html` <div class="inner-grid fila-grilla-resumen">
                                <div>${pago.numero}</div>
                                <div>${pago.importe}</div>
                            </div>`;
                        })}
                    </div>
                </div>
                <div class="grid row">
                    <div class="grid column">
                        <div>Total Efectivo: $${this.efectivo}</div>
                        <div>Total MP: $${this.importeMP}</div>
                        <div>Total: $${this.importeTotal}</div>
                    </div>
                </div>
                <button raised etiqueta round @click="${this.pagar}">
                    <div>${PAGAR}</div>
                    <div class="justify-self-start">PAGAR</div>
                </button>
            </dialog>
            <dialog id="pago" class="resumen">
                <div class="titulo-pago">${this.importeMP != 0 ? "Por favor, Escanee el QR" : "Pago Realizado Con éxito!"}</div>
                <div ?hidden="${this.escondido}" class="ok" id="ok">${OK}</div>
                <div class="titulo-pago" ?hidden="${this.escondido}">El pago ha sido realizado</div>
                <div class="grid column">
                    <button class="align-self-end" raised etiqueta round @click="${this.cerrarPago}" ?hidden=${this.escondido}>
                        <div class="justify-self-start">ACEPTAR</div>
                    </button>
                    <button class="align-self-end" raised etiqueta round @click="${this.cerrarPago}" ?hidden=${!this.escondido}>
                        <div class="justify-self-start">CANCELAR</div>
                    </button>
                </div>
            </dialog>
        `;
    }

    cerrar() {
        const resumen = this.shadowRoot.querySelector("#resumen");
        resumen.close();
    }
    cerrarPago() {
        const resumen = this.shadowRoot.querySelector("#pago");
        this.blanqueo();
        resumen.close();
    }

    filtrar() {
        //this.item.filter();
        const filtro = this.shadowRoot.querySelector("#filtro").value.toUpperCase();

        this.items = store.getState().ordenMedica.entities.filter((item) => {
            return (
                item.numero.toString().toUpperCase().indexOf(filtro) != -1 ||
                item.cuilTitular.toString().toUpperCase().indexOf(filtro.toString().toUpperCase()) != -1 ||
                item.paciente_Documento.toString().toUpperCase().indexOf(filtro.toString().toUpperCase()) != -1 ||
                item.paciente_Nombre.toUpperCase().indexOf(filtro) != -1
            );
        });
        this.update();
    }

    sumar(e) {
        if (e.currentTarget.checked) {
            this.importeTotal = parseFloat(this.importeTotal) + e.currentTarget.item.importeCaja;
            this.efectivo = parseFloat(this.importeTotal) - parseFloat(this.importeMP);
        } else {
            this.importeTotal = parseFloat(this.importeTotal) - e.currentTarget.item.importeCaja;
            this.efectivo = this.importeTotal;
            this.importeMP = 0;
        }
        this.update();
    }

    mp() {
        const importeTotal = this.shadowRoot.querySelector("#importe");
        const efectivo = this.shadowRoot.querySelector("#importeEfectivo");
        const importeMP = this.shadowRoot.querySelector("#importeMP");
        if (importeMP.value < 0 || parseFloat(importeMP.value) > parseFloat(importeTotal.value)) {
            alert("El valor ingresado en Mercado Pago es incorrecto");
            this.importeMP = 0;
            return false;
        }
        this.efectivo = parseFloat(importeTotal.value) - parseFloat(importeMP.value);
        this.importeMP = parseFloat(importeMP.value);
        this.update();
    }

    prepararPago(e) {
        if (parseFloat(this.efectivo) == 0 && parseFloat(this.importeMP) == 0) {
            alert("Debe seleccionar los bonos a pagar");
            return false;
        }
        this.ordenes = [];
        this.pagos = [];

        const checks = this.shadowRoot.querySelectorAll("#c1");
        const checksToArray = Array.apply(null, checks);

        checksToArray.forEach((orden) => {
            if (orden.checked) {
                let pagos = {};
                pagos.id = orden.item.id;
                pagos.importe = orden.item.importeCaja;
                pagos.numero = orden.item.numero;
                this.pagos.push(pagos);
                this.ordenes.push({ id: pagos.id, importe: pagos.importe });
            }
        });
        this.body = {};
        this.body = {
            mercadoPago: this.importeMP,
            efectivo: this.efectivo,
            caja: localStorage.getItem("caja"),
            storeId: "P0002",
        };
        this.body.ordenes = this.ordenes;
        const resumen = this.shadowRoot.querySelector("#resumen");
        resumen.showModal();
        this.update();
    }

    pagar() {
        store.dispatch(recibirPago(this.body));
    }

    blanqueo() {
        /*     this.importeMP = 0;
        this.importeTotal = 0;
        this.efectivo = 0;
        this.update(); */
        this.refresh();
    }

    refresh() {
        const checks = this.shadowRoot.querySelectorAll("#c1");
        checks.forEach((check) => {
            check.checked = false;
        });
        const filtro = this.shadowRoot.querySelector("#filtro");
        filtro.value = "";
        store.dispatch(pendientesXCaja(localStorage.getItem("caja")));
        this.importeMP = 0;
        this.importeTotal = 0;
        this.efectivo = 0;
        this.update();
    }

    enlace(field) {
        return (e) => this.updateProperty(e, field);
    }

    updateProperty(e, field) {
        this.item[field] = e.currentTarget.value;
        this.requestUpdate();
    }

    stateChanged(state, name) {
        this.hidden = false;
        if (name == PENDIENTES) {
            this.items = state.ordenMedica.entities;
            this.escondido = true;
            this.update();
        }

        if (name == PAGO_GENERADO) {
            this.pagoGenerado = state.mercadoPago.pagoGenerado;
            if (this.pagoGenerado) {
                const dialogoPago = this.shadowRoot.querySelector("#pago");
                const resumen = this.shadowRoot.querySelector("#resumen");
                resumen.close();
                if (this.importeMP == 0) {
                    this.escondido = false;
                } else {
                    if (this.pagoOK) {
                        this.escondido = false;
                    }
                }
                dialogoPago.showModal();
            }
            this.update();
        }

        if (name == MESSAGE) {
            this.messages = state.ui.mensajes;
            this.update();
        }

        if (name == PAGO_RECIBIDO) {
            this.pagoOK = true;
            this.escondido = false;
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
window.customElements.define("form-pago", formPago);
