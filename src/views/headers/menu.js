/** @format */

import { html, LitElement, css } from "lit";
import { store } from "../../redux/store";
import { connect } from "@brunomon/helpers";
import { goTo } from "../../redux/routing/actions";
import { isInLayout } from "../../redux/screens/screenLayouts";
import { gridLayout } from "@brunomon/template-lit/src/views/css/gridLayout";
import { logo } from "@brunomon/template-lit/src/views/css/logo";
import { select } from "@brunomon/template-lit/src/views/css/select";
import { button } from "@brunomon/template-lit/src/views/css/button";
import { input } from "@brunomon/template-lit/src/views/css/input";
import { MENU, RIGHT, PERSON, SETTINGS, SAVE, OK, ANULACION, PAGAR } from "../../../assets/icons/svgs";
import { logout } from "../../redux/autorizacion/actions";
import { gesturesController } from "@brunomon/template-lit/src/views/controllers/gesturesController";
import { selection } from "../../redux/ui/actions";

import { get, set } from "../../redux/caja/actions";
import { pendientesXCaja } from "../../redux/OrdenMedica/actions";

const SELECTION = "ui.menu.timeStamp";
const MEDIA_CHANGE = "ui.media.timeStamp";
const SCREEN = "screen.timeStamp";
const USUARIO = "autorizacion.loginTimeStamp";
const SETCAJA = "caja.setTimeStamp";
const GETCAJA = "caja.getTimeStamp";
const CAJAVACIA = "caja.cajaVaciaTimeStamp";
export class menuPrincipal extends connect(store, MEDIA_CHANGE, SCREEN, USUARIO, SELECTION, SETCAJA, GETCAJA, CAJAVACIA)(LitElement) {
    constructor() {
        super();
        this.area = "header";
        this.visible = false;
        this.arrastrando = false;
        this.usuario = null;
        this.optionsCount = 3;
        this.defaultOption = 0;
        this.selectedOption = new Array(this.optionsCount).fill(false);
        this.selectedOption[this.defaultOption] = true;
        this.caja = "";
        this.formularioCajaVisible = false;

        const gestures = new gesturesController(this, this.gestos);
    }

    static get styles() {
        return css`
            ${gridLayout}
            ${select}
            ${logo}
            ${button}
            ${input}
            :host {
                display: grid;
                grid-auto-flow: column;
                padding: 0 !important;
                background-color: var(--primario);
            }
            :host([hidden]) {
                display: none;
            }

            *[hidden] {
                display: none !important;
            }

            #titulo {
                color: var(--on-primario);
                cursor: pointer;
            }

            .menuItem {
                color: var(--on-secundario);
                cursor: pointer;
            }

            div[oculto] {
                display: none;
            }
            h1 {
                margin: 0;
            }
            #version {
                color: var(--on-primario);
                font-size: 0.6rem;
                align-self: start;
            }
            #opciones {
                justify-content: end;
                grid-gap: 2rem;
                padding: 2rem;
            }

            :host([media-size="large"]) .menu-button,
            :host([media-size="large"]) #velo {
                display: none;
            }

            #velo {
                position: fixed;
                top: 0;
                right: -100%;
                width: 100vw;
                height: 100vh;
                background-color: var(--velo);
                z-index: 90;
            }

            .menu-button {
                cursor: pointer;
                justify-self: end;
                justify-content: end;
                display: grid;
            }

            :host([visible]) #velo {
                right: 0;
            }

            :host([arrastrando]) #opciones {
                position: absolute;
                transition: none;
            }
            .activo {
                color: var(--light-text-color);
                font-size: var(--font-label-size);
            }

            :host([media-size="large"]) button[selected] {
                color: var(--terciario);
                stroke: var(--terciario);
                fill: var(--terciario);
            }

            :host(:not([media-size="large"])) #opciones {
                position: fixed;
                top: 0;
                right: -100%;
                height: 100vh;
                width: 60%;
                grid-auto-flow: row;
                background-color: var(--secundario);
                align-content: start;
                transition: 0.3s all;
                display: grid;
                justify-items: start;
                z-index: 100;
            }
            svg {
                height: 1.2rem;
                width: 1.2rem;
            }
            button[etiqueta] {
                display: grid;
                grid-auto-flow: column;
                grid-template-columns: auto 1fr;
                grid-gap: 0.3rem;
                align-items: center;
                align-content: center;
            }
            button[link] {
                color: var(--on-primario);
                stroke: var(--on-primario);
                fill: var(--on-primario);
            }
            button[raised] {
                box-shadow: none;
            }
            #version {
                color: var(--on-primario-bajada);
            }
            svg {
                height: 2rem;
                width: 2rem;
            }
            .caja {
                display: grid;
                position: absolute;
                top: 12vh;
                right: 4vw;
                padding: 1rem;
                background-color: var(--formulario);
                z-index: 1000;
            }
        `;
    }
    render() {
        return html`
            <div id="velo" @click=${this.toggleMenu}></div>
            <div class="grid column">
                <div class="inner-grid column start">
                    <div style="padding: .3rem;border-radius: 50%;background-color: var(--on-primario);"><div class="logo"></div></div>

                    <h1 id="titulo" @click="${this.click}" .option=${"main"}>${__DESCRIPTION__}</h1>
                    <div id="version">${__VERSION__}</div>
                </div>
                <button raised circle class="menu-button" @click=${this.toggleMenu}>${MENU}</button>
            </div>

            <div id="opciones" class="grid column" @click=${this.toggleMenu}>
                <button raised circle action class="menu-button">${RIGHT}</button>
                <button link etiqueta ?selected="${this.selectedOption[0]}" @click=${this.click} .option=${"formPago"}>
                    <div>${PAGAR}</div>
                    <div class="justify-self-start">Caja</div>
                </button>

                <button link etiqueta ?selected="${this.selectedOption[1]}" @click=${this.click} .option=${"anulacion"}>
                    <div>${ANULACION}</div>
                    <div class="justify-self-start">Anulación</div>
                </button>
                <!--  <button link etiqueta ?selected="${this.selectedOption[3]}" @click=${this.click} .option=${"opcion3"}>
                    <div>${PERSON}</div>
                    <div class="justify-self-start">Login</div>
                </button> -->
                <button link ?selected="${this.selectedOption[2]}" @click="${this.mostrarCaja}" .option=${"opcion0"}>${SETTINGS}</button>
            </div>

            <div id="cajaDiv" class="caja" ?hidden=${!this.formularioCajaVisible}>
                <div class="input">
                    <input id="caja" .value="${this.caja}" />
                    <label for="caja">Código de Caja</label>
                </div>

                <button raised etiqueta round id="gabarCaja" @click=${this.guardarCaja}>
                    ${OK}
                    <div class="justify-self-start">Guardar</div>
                </button>
            </div>
        `;
    }
    isSelected(e) {
        return true;
    }
    gestos(e) {
        if (this.mediaSize != "large") {
            if (e.detail.ACTION == "move") {
                if (e.detail.dx > 0) {
                    this.arrastrando = true;
                    this.opciones.style.right = -e.detail.dx + "px";
                }
            }
            if (e.detail.ACTION == "end" && e.detail.LEFT_TO_RIGHT) {
                this.arrastrando = false;
                if (e.detail.dx > 40) {
                    this.toggleMenu();
                } else {
                    this.opciones.style.right = "0";
                }
            }
        }
    }
    toggleMenu() {
        this.visible = !this.visible;
        this.opciones.style.right = this.visible ? "0" : "-100%";
    }

    click(e) {
        if (e.currentTarget.option == "logout") {
            try {
                navigator.credentials.preventSilentAccess();
            } catch {}
            store.dispatch(logout());
            return;
        }

        this.selectedOption = new Array(this.optionsCount).fill(false);
        this.selectedOption[Array.from(e.currentTarget.parentNode.children).indexOf(e.currentTarget) - 1] = true;

        store.dispatch(selection(e.currentTarget.option));
        store.dispatch(goTo(e.currentTarget.option));
        if (e.currentTarget.option == "Caja") {
            store.dispatch(pendientesXCaja());
        }
    }

    mostrarCaja(e) {
        this.selectedOption = new Array(this.optionsCount).fill(false);
        this.selectedOption[Array.from(e.currentTarget.parentNode.children).indexOf(e.currentTarget) - 1] = true;

        this.formularioCajaVisible = !this.formularioCajaVisible;
        this.caja = localStorage.getItem("caja");
        this.update();
    }

    guardarCaja(e) {
        const caja = this.shadowRoot.querySelector("#caja").value;
        localStorage.setItem("caja", caja);
        store.dispatch(pendientesXCaja());
        this.formularioCajaVisible = false;
    }

    firstUpdated(changedProperties) {
        this.opciones = this.shadowRoot.querySelector("#opciones");
    }

    stateChanged(state, name) {
        if (name == SCREEN || name == MEDIA_CHANGE) {
            this.mediaSize = state.ui.media.size;
            this.hidden = true;
            const isCurrentScreen = state.screen.name != null;
            if (isInLayout(state, this.area) && isCurrentScreen) {
                this.hidden = false;
            }
        }
        if (name == USUARIO) {
            if (state.autorizacion.usuario.Profiles && state.autorizacion.usuario.Profiles.length != 0) {
                this.usuario = state.autorizacion.usuario;
            }
        }
        if (name == CAJAVACIA) {
            this.formularioCajaVisible = true;
        }
    }

    static get properties() {
        return {
            mediaSize: {
                type: String,
                reflect: true,
                attribute: "media-size",
            },
            layout: {
                type: String,
                reflect: true,
            },
            hidden: {
                type: Boolean,
                reflect: true,
            },
            area: {
                type: String,
            },
            visible: {
                type: Boolean,
                reflect: true,
            },
            arrastrando: {
                type: Boolean,
                reflect: true,
            },
            selectedOption: {
                type: Array,
            },
            formularioCajaVisible: {
                type: Boolean,
                reflect: true,
                attribute: "caja-vacia",
            },
        };
    }
}
window.customElements.define("menu-principal", menuPrincipal);
