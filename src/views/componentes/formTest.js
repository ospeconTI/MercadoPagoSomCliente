/** @format */

import { html, LitElement, css } from "lit";
import { store } from "../../redux/store";
import { connect, deepValue } from "@brunomon/helpers";
import { PERSON } from "../../../assets/icons/svgs";
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

export class formTest extends connect(store)(LitElement) {
    constructor() {
        super();
        store.dispatch(showSpinner());
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
                background-color: var(--formulario);
                padding: 2rem;
                grid-gap: 1rem;
                overflow-y: scroll;
            }
            svg {
                height: 1rem;
                width: 1.2rem;
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
        `;
    }

    render() {
        return html`
            <div class="inner-grid fit18">
                <div class="input">
                    <input id="1" />
                    <label for="1">Input</label>
                    <label error>No puede ser vacio</label>
                    <label subtext>Requerido</label>
                </div>
                <div class="input" disabled>
                    <input id="2" disabled value="valor" />
                    <label for="2">Disabled</label>
                    <label error>No puede ser vacio</label>
                    <label subtext>Requerido</label>
                </div>
                <div class="input" error>
                    <input id="3" />
                    <label for="3">Con Error</label>
                    <label error>No puede ser vacio</label>
                    <label subtext>Requerido</label>
                </div>
            </div>
            <div class="inner-grid fit18">
                <div class="select">
                    <select id="pais" required>
                        <option value="" disabled selected>Selecciona una opción</option>
                        <option value="1">Argentina qdadsad ad ad ad asdasdasdasdasdasdas asdasdasdasdadasdasasdadas</option>
                        <option value="2">Chile</option>
                        <option value="3">Peru</option>
                        <option value="4">Bolivia</option>
                    </select>
                    <label for="pais">Select</label>
                    <label error>No puede ser vacio</label>
                    <label subtext>Requerido</label>
                </div>
                <div class="select" disabled>
                    <select id="pais2" required disabled>
                        <option value="" disabled selected>Selecciona una opción</option>
                        <option value="1" selected>Argentina</option>
                        <option value="2">Chile</option>
                        <option value="3">Peru</option>
                        <option value="4">Bolivia</option>
                    </select>
                    <label for="pais2">Disabled</label>
                    <label error>No puede ser vacio</label>
                </div>
                <div class="select" error>
                    <select id="pais3" required>
                        <option value="" disabled selected>Selecciona una opción</option>
                        <option value="1">Argentina</option>
                        <option value="2">Chile</option>
                        <option value="3">Peru</option>
                        <option value="4">Bolivia</option>
                    </select>
                    <label for="pais3">Con Error</label>
                    <label error>No puede ser vacio</label>
                </div>
            </div>
            <div class="inner-grid fit18">
                <div class="check">
                    <input id="c1" type="checkbox" />
                    <label for="c1">Check</label>
                    <label></label>
                </div>
                <div class="check" disabled>
                    <input id="c3" type="checkbox" disabled checked />
                    <label for="c3">Disabled</label>
                    <label></label>
                </div>
                <div class="check" action>
                    <input id="c2" type="checkbox" />
                    <label for="c2">Action</label>
                    <label></label>
                </div>
            </div>

            <div class="grid fit18">
                <div class="inner-grid">
                    <button raised>RAISED</button>
                    <button raised action>RAISED ACTION</button>
                    <button raised disabled>RAISED DISABLED</button>
                    <button raised round>RAISED ROUND</button>
                </div>
                <div class="inner-grid">
                    <button raised etiqueta>
                        <div>${PERSON}</div>
                        <div class="justify-self-start">RAISED ICON</div>
                    </button>
                    <button raised action etiqueta>
                        <div>${PERSON}</div>
                        <div class="justify-self-start">RAISED ACTION ICON</div>
                    </button>
                    <button raised disabled etiqueta>
                        <div>${PERSON}</div>
                        <div class="justify-self-start">RAISED DISBALED ICON</div>
                    </button>
                    <button raised etiqueta round>
                        <div>${PERSON}</div>
                        <div class="justify-self-start">RAISED ICON ROUND</div>
                    </button>
                    <div class="inner-grid column">
                        <button raised circle>${PERSON}</button>
                        <button raised circle action>${PERSON}</button>
                        <button raised circle big>${PERSON}</button>
                        <button raised circle action big>${PERSON}</button>
                    </div>
                </div>
                <div class="inner-grid">
                    <button flat>FLAT</button>
                    <button flat action>FLAT ACTION</button>
                    <button flat disabled>FLAT DISBALED</button>
                    <button flat round>FLAT ROUND</button>
                    <div class="inner-grid column">
                        <button flat circle>${PERSON}</button>
                        <button flat circle action>${PERSON}</button>
                        <button flat circle big>${PERSON}</button>
                        <button flat circle action big>${PERSON}</button>
                    </div>
                </div>
                <div class="inner-grid">
                    <button link>LINK</button>
                    <button link action>LINK ACTION</button>
                    <button link disabled>LINK DISABLED</button>

                    <button link @click="${this.openAlert}">ABRIR ALERT</button>
                    <button link @click="${this.openConfirm}">ABRIR CONFIRM</button>
                </div>
            </div>
            <div class="grid fit10">
                <div class="spinner-container">
                    anillo
                    <spinner-control anillo></spinner-control>
                </div>
                <div class="spinner-container">
                    aro
                    <spinner-control aro></spinner-control>
                </div>
                <div class="spinner-container">
                    cometa
                    <spinner-control cometa></spinner-control>
                </div>
                <div class="spinner-container">
                    bloque
                    <spinner-control bloque></spinner-control>
                </div>
                <div class="spinner-container">
                    progress
                    <spinner-control progress></spinner-control>
                </div>
                <div class="spinner-container">
                    sonar
                    <spinner-control sonar></spinner-control>
                </div>
                <div class="spinner-container">
                    radar
                    <spinner-control radar></spinner-control>
                </div>
                <div class="spinner-container">
                    dado
                    <spinner-control dado></spinner-control>
                </div>
            </div>
            <alert-control></alert-control>
            <confirm-control></confirm-control>
        `;
    }

    enlace(field) {
        return (e) => this.updateProperty(e, field);
    }
    updateProperty(e, field) {
        this.item[field] = e.currentTarget.value;
        this.requestUpdate();
    }

    openAlert() {
        store.dispatch(
            showAlert(
                "Este es el titulo",
                html`<p>Normalmente con un mensaje</p>
                    <p>de uno o mas renglones</p>`
            )
        );
    }
    openConfirm() {
        store.dispatch(
            showConfirm(
                "Titulo del Confirm",
                html`<p>Esto es una prueba...</p>
                    <p>¿ quiere abrir un alert ?</p>`,
                showAlert(
                    "Confirmado",
                    html`<p>La accion de confirmacion</p>
                        <p>se disparo con exito</p>`
                ),
                showAlert(
                    "NO Confirmado",
                    html`<p>La accion de NO confirmacion</p>
                        <p>se disparo con exito</p>`
                )
            )
        );
    }

    stateChanged(state, name) {}

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
window.customElements.define("form-test", formTest);
