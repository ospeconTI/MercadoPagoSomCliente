/** @format */

import { html, LitElement, css } from "lit";
import { store } from "../../redux/store";
import { connect, deepValue } from "@brunomon/helpers";
import { ANULAR, CANCEL, OK, PAGAR, PERSON, QR, REFRESH, SEARCH, WAIT } from "../../../assets/icons/svgs";
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
import { pagadosXExpediente, pagadosXNumero } from "../../redux/OrdenMedica/actions";
import { devolverPago, recibirPago } from "../../redux/MercadoPago/actions";
import { isInLayout } from "../../redux/screens/screenLayouts";
import { traer } from "../../redux/motivosAnulacion/actions";
import { ThreeSixtyOutlined } from "@material-ui/icons";

const ORDENES = "ordenMedica.anularTimeStamp";
const MEDIA_CHANGE = "ui.media.timeStamp";
const SCREEN = "screen.timeStamp";
const MOTIVOS_ANULACION = "motivosAnulacion.timeStamp";
const DEVOLUCION_RECIBIDA = "ui.devolucionRecibidaTimeStamp";
const DEVOLUCION_RECIBIDA_EF = "ui.devolucionEfRecibidaTimeStamp";
const ERROR_TS = "ordenMedica.errorPagadosTimeStamp";
export class anulacion extends connect(store, SCREEN, MEDIA_CHANGE, ORDENES, MOTIVOS_ANULACION, DEVOLUCION_RECIBIDA, DEVOLUCION_RECIBIDA_EF, ERROR_TS)(LitElement) {
    constructor() {
        super();
        this.item = [];
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
        this.hidden = true;
        this.area = "body";
        this.motivosAnulacion = [];
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
                padding: 1.5rem;
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

            .bono {
                display: grid;
                background-color: white;
                color: var(--primario);
                font-size: 1rem;
                justify-self: center;
                border-radius: 0.7rem;
            }
            .renglon {
                display: grid;
                grid-template-columns: 3fr 5fr;
                justify-items: start;
            }
            .select select {
                color: var(--primario);
                border: 1px solid;
            }

            .select select:focus {
                background-color: transparent;
            }

            .select option {
                background-color: transparent;
                color: var(--primario);
            }
        `;
    }

    render() {
        return html`
            <div class="fit18 filtro">
                <div class="select">
                    <label>Búscar por</label>
                    <select id="filtroX" @change="${this.busqueda}">
                        <option selected value="B">Por Número de Bono</option>
                        <option value="E">Por Expediente</option>
                    </select>
                </div>
                <div class="input">
                    <input id="filtro" />
                    <label id="labelFiltro" for="filtro">Bono</label>
                    <label error></label>
                    <label subtext></label>
                </div>
                <button raised etiqueta round @click="${this.buscar}">
                    <div>${SEARCH}</div>
                    <div class="justify-self-start">Buscar</div>
                </button>
            </div>
            <div class="grid row bono" ?hidden=${this.item.length == 0}>
                <div class="renglon" ?hidden=${this.item.length != 0 ? (this.item.expediente != "" ? true : false) : false}>
                    <div>Número</div>
                    <div>${this.item.numero}</div>
                </div>
                <div class="renglon" ?hidden=${this.item.length != 0 ? (this.item.expediente == "" ? true : false) : false}>
                    <div>Expediente</div>
                    <div>${this.item.expediente}</div>
                </div>
                <div class="renglon">
                    <div>Fecha</div>
                    <div>${new Date(this.item.fechaGeneracion).toLocaleDateString()}</div>
                </div>
                <div class="renglon">
                    <div>CeMAP</div>
                    <div>${this.item.cemap}</div>
                </div>
                <div class="renglon">
                    <div>Historia Clínica</div>
                    <div>${this.item.paciente_Documento}</div>
                </div>
                <div class="renglon">
                    <div>Nombre Paciente</div>
                    <div>${this.item.paciente_Nombre}</div>
                </div>
                <div class="renglon">
                    <div>Parentesco</div>
                    <div>${this.item.parentesco}</div>
                </div>
                <div class="renglon">
                    <div>CUIT Titular</div>
                    <div>${this.item.cuilTitular}</div>
                </div>
                <div class="renglon">
                    <div>Efector</div>
                    <div>${this.item.efector}</div>
                </div>
                <div class="renglon">
                    <div>Fecha Realizacion</div>
                    <div>${this.item.length != 0 ? new Date(this.item.fechaRealizacion).toLocaleDateString() : ""}</div>
                </div>
                <div class="renglon">
                    <div>Hora Realización</div>
                    <div>${this.item.horaRealizacion}</div>
                </div>
                <div class="renglon">
                    <div>Valor Coseguro</div>
                    <div>${this.item.importeCaja}</div>
                </div>
                <div class="renglon">
                    <div>Modo de Pago</div>
                    <div>${this.item.length != 0 ? (this.item.tipoPago == "EF" ? "Efectivo" : "Billetera Virtual") : ""}</div>
                </div>
                <div class="renglon">
                    <div>Devuelve Dinero</div>
                    <div><input type="checkbox" id="devuelveDinero" /></div>
                </div>
                <div class="select">
                    <label>Motivo Anulación</label>
                    <select id="motivos">
                        ${this.motivosAnulacion.map((motivo) => {
                            return html`<option value="${motivo.id}">${motivo.descripcion}</option>`;
                        })}
                    </select>
                </div>
                <div class="grid column">
                    <button class="align-self-center" raised etiqueta round @click="${this.anular}">
                        <div>${ANULAR}</div>
                        <div class="justify-self-start">Anular Orden</div>
                    </button>
                    <button class="align-self-center" raised etiqueta round @click="${this.cancelar}">
                        <div>${CANCEL}</div>
                        <div class="justify-self-start">Cancelar</div>
                    </button>
                </div>
            </div>
            <dialog id="devolucion" class="resumen">
                <div ?hidden="${this.escondido}" class="ok" id="ok">${OK}</div>
                <div ?hidden="${!this.escondido}" class="ok" id="ok">${WAIT}</div>
                <div class="titulo-pago" ?hidden="${this.escondido}">La Anulación ha sido realizada</div>
                <div class="titulo-pago" ?hidden="${!this.escondido}">Aguarde un momento...</div>
                <div class="grid column">
                    <button class="align-self-end" raised etiqueta round @click="${this.cerrarPago}" ?hidden=${this.escondido}>
                        <div class="justify-self-start">ACEPTAR</div>
                    </button>
                </div>
            </dialog>
        `;
    }

    busqueda() {
        const filtroX = this.shadowRoot.querySelector("#filtroX");
        const labelFiltro = this.shadowRoot.querySelector("#labelFiltro");
        labelFiltro.innerHTML = filtroX.value == "B" ? "Bono" : "Expediente";
        this.update();
    }

    cerrarPago() {
        const resumen = this.shadowRoot.querySelector("#devolucion");
        resumen.close();
        this.item = [];
        const filtro = this.shadowRoot.querySelector("#filtro");
        filtro.value = "";
        this.update();
    }

    anular() {
        const devuelveDinero = this.shadowRoot.querySelector("#devuelveDinero");
        let body = {
            idOrdenMedica: this.item.id,
            idCaja: parseInt(localStorage.getItem("caja"), 10),
            medioPago: this.item.tipoPago,
            devuelveDinero: devuelveDinero.checked,
        };
        store.dispatch(devolverPago(body));
    }

    buscar() {
        const filtro = this.shadowRoot.querySelector("#filtro").value.toUpperCase();
        const filtroX = this.shadowRoot.querySelector("#filtroX").value;
        if (filtroX == "B") {
            store.dispatch(pagadosXNumero(filtro));
        } else {
            store.dispatch(pagadosXExpediente(filtro));
        }
    }

    cancelar() {
        this.item = [];
        const filtro = this.shadowRoot.querySelector("#filtro");
        filtro.value = "";
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
        if (name == SCREEN || name == MEDIA_CHANGE) {
            this.mediaSize = state.ui.media.size;
            this.hidden = true;
            const isCurrentScreen = ["anulacion"].includes(state.screen.name);
            if (isInLayout(state, this.area) && isCurrentScreen) {
                this.opciones = this.shadowRoot.querySelector("#opciones");
                //gestures(this.opciones, this.gestos, this);
                this.hidden = false;
            }
            this.update();
        }

        if (name == ORDENES) {
            this.item = state.ordenMedica.anular;
            this.update();
        }
        if (name == MOTIVOS_ANULACION) {
            this.motivosAnulacion = state.motivosAnulacion.entities;
            this.update();
        }
        if (name == DEVOLUCION_RECIBIDA) {
            const devolucion = this.shadowRoot.querySelector("#devolucion");
            devolucion.showModal();
            this.escondido = false;
            this.devolucionOK = true;
            this.update();
        }
        if (name == DEVOLUCION_RECIBIDA_EF) {
            const devolucion = this.shadowRoot.querySelector("#devolucion");
            devolucion.showModal();
            this.escondido = false;
            this.devolucionOK = true;
            this.update();
        }
        if (name == ERROR_TS) {
            alert("No Se encontró la Orden");
            this.cancelar();
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
window.customElements.define("anulacion-component", anulacion);
