/** @format */

import _ from "lodash";
import { Workbox, messageSW } from "workbox-window";

export const register = () => {
    if ("serviceWorker" in navigator) {
        window.addEventListener("load", () => {
            navigator.serviceWorker
                .register("./service-worker.js")
                .then((registration) => {
                    console.log("SW registered: ", registration);
                })
                .catch((registrationError) => {
                    console.log("SW registration failed: ", registrationError);
                });
        });
    }
};
export const activate = () => {
    if ("serviceWorker" in navigator) {
        const wb = new Workbox("./service-worker.js");
        let registration;
        const showSkipWaitingPrompt = (event) => {
            alert("La versión " + __VERSION__ + " se encuentra discontinuada. Se actualizará a la nueva versión.");
            wb.addEventListener("controlling", (event) => {
                window.location.reload();
            });
            if (registration && registration.waiting) {
                messageSW(registration.waiting, { type: "SKIP_WAITING" });
            }
        };
        wb.addEventListener("waiting", showSkipWaitingPrompt);
        wb.addEventListener("externalwaiting", showSkipWaitingPrompt);
        wb.register().then((r) => (registration = r));
    }
};
