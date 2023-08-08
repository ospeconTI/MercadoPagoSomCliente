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
import { listarCierre, pendientesXCaja } from "../../redux/OrdenMedica/actions";
import { recibirPago } from "../../redux/MercadoPago/actions";
import { isInLayout } from "../../redux/screens/screenLayouts";
import { cerrarCaja } from "../../redux/cierre/actions";
import { jsPDF } from "jspdf";
import { getPDFCierre } from "./impresion";

const MEDIA_CHANGE = "ui.media.timeStamp";
const SCREEN = "screen.timeStamp";

const CIERRE_TS = "ordenMedica.listaCierreTimeStamp";

export class listaCierre extends connect(store, MEDIA_CHANGE, SCREEN, CIERRE_TS)(LitElement) {
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
                grid-template-columns: 1fr 2fr 1fr 1fr;
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
                <div class="titulo">Listado de Cierres</div>
                <div class="input">
                    <input id="nro" />
                    <label for="nro">Número de Cierre</label>
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
                            <div>${item.id}</div>
                            <div>${item.cantidad}</div>
                            <div>${item.importe}</div>
                        </div>`;
                    })}
                </div>

                <div class="footer-col">
                    <div class="tituloItems grid">EXCEPCION</div>
                    ${this.excepcion.map((item) => {
                        return html` <div class="grid resumen2">
                            <div>${item.id}</div>
                            <div>${item.cantidad}</div>
                        </div>`;
                    })}
                </div>

                <div class="footer-col">
                    <div class="tituloItems grid">RECAUDACION</div>
                    ${this.recaudacion.map((item) => {
                        return html` <div class="grid resumen3">
                            <div>${item.id}</div>
                            <div>${item.cantidad}</div>
                            <div>${item.importe}</div>
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

    imprimir() {
        const nroCierre = this.shadowRoot.querySelector("#nro").value;
        const doc = getPDFCierre(store.getState().ordenMedica.listaCierre, nroCierre);
        doc.save("Cierre" + nroCierre);
        /*        const doc = new jsPDF({ unit: "mm" });

        const hoy = new Date();

        doc.setFontSize(7);
        doc.text("Fecha: " + hoy.getDate().toString() + "/" + hoy.getMonth() + 1 + "/" + hoy.getFullYear().toString(), 10, 5);
        doc.setFontSize(14);
        doc.setFont("Helvetica", "normal", "bold");
        const ancho = doc.internal.pageSize.getWidth() / 2;
        doc.text("Listado de Cierre Nro " + nroCierre, ancho, 15, { align: "center" });
        const fuentes = doc.getFontList();
        doc.setFontSize(8);

        let fila = 40;
        let columna = 25;
        const gap = 7;

        const bono = 25;
        const mov = 3;
        const fecha = 10;
        const dni = 8;
        const importe = 19;
        const forma = 3;
        const recauda = 1;

        doc.text("Nro Bono", columna, fila);
        columna += bono + gap;
        doc.text("MOV", columna, fila);
        columna += mov + gap;
        doc.text("Fecha", columna, fila);
        columna += fecha + gap;
        doc.text("DNI", columna, fila);
        columna += dni + gap;
        doc.text("Importe", columna, fila);
        columna += importe + gap;
        doc.text("FP", columna, fila);
        columna += forma + gap;
        doc.text("Recauda", columna, fila);
        columna += recauda + gap;
        doc.setFont("Helvetica", "normal", "normal");
        this.items.forEach((item) => {
            fila += 5;
            columna = 25;
            doc.text(item.numero.substring(5, 15) + "/" + "19401290", columna, fila);
            columna += bono + gap;
            doc.text(item.movimiento, columna, fila);
            columna += mov + gap;
            const sfecha = new Date(item.fecha);
            doc.text(sfecha.getDate() + "/" + (sfecha.getMonth() + 1).toString() + "/" + sfecha.getFullYear(), columna, fila);
            columna += fecha + gap;
            doc.text(item.paciente_Documento.toString(), columna, fila);
            columna += dni + gap;
            doc.text(item.importeCaja.toFixed(2), columna, fila, { align: "left" });
            columna += importe + gap;
            doc.text(item.tipoPago, columna, fila);
            columna += forma + gap;
            doc.text(item.recauda, columna, fila);
            columna += recauda + gap;
        });
        fila += 15;
        doc.setFont("Helvetica", "normal", "bold");
        doc.text("Movimientos Exencion", 5, fila);
        doc.setFont("Helvetica", "normal", "normal");
        fila += 5;
        this.excepcion.forEach((item) => {
            doc.text(item.id, 5, fila);
            doc.text(item.cantidad.toString(), 40, fila);
        });

        fila += 15;
        doc.setFont("Helvetica", "normal", "bold");
        doc.text("Movimientos Coseguro", 5, fila);
        doc.setFont("Helvetica", "normal", "normal");

        this.movimientos.forEach((item) => {
            fila += 5;
            doc.text(item.id, 5, fila);
            doc.text(item.cantidad.toString(), 40, fila);
            doc.text(item.importe.toFixed(2), 60, fila, { align: "right" });
        });

        fila += 15;
        doc.setFont("Helvetica", "normal", "bold");
        doc.text("Movimientos Recaudación", 5, fila);
        doc.setFont("Helvetica", "normal", "normal");

        this.recaudacion.forEach((item) => {
            fila += 5;
            doc.text(item.id, 5, fila);
            doc.text(item.cantidad.toString(), 40, fila);
            doc.text(item.importe.toFixed(2), 60, fila, { align: "right" });
        });

        fila += 15;
        doc.setFont("Helvetica", "normal", "bold");
        doc.text("TOTALES", 5, fila);
        doc.setFont("Helvetica", "normal", "normal");

        fila += 5;
        doc.text("Importe Total:", 5, fila);

        doc.text(this.resumen.importeTotal.toFixed(2), 60, fila, { align: "right" });
        fila += 5;
        doc.text("Importe Efectivo", 5, fila);

        doc.text(this.resumen.efectivo.toFixed(2), 60, fila, { align: "right" });
        fila += 5;
        doc.text("Importe Billetera", 5, fila);
        doc.text(this.resumen.billetera.toFixed(2), 60, fila, { align: "right" }); */
    }

    listar() {
        const nroCierre = this.shadowRoot.querySelector("#nro").value;
        store.dispatch(listarCierre(nroCierre));
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
            const isCurrentScreen = ["listaCierre"].includes(state.screen.name);
            if (isInLayout(state, this.area) && isCurrentScreen) {
                this.opciones = this.shadowRoot.querySelector("#opciones");
                this.hidden = false;
            }
            this.update();
        }

        if (name == CIERRE_TS) {
            if (state.ordenMedica.listaCierre) {
                this.items = state.ordenMedica.listaCierre.movimientos;
                this.resumen = state.ordenMedica.listaCierre.resumen;
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
window.customElements.define("lista-cierre-component", listaCierre);
