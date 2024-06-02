import { React, ReactDOM } from "@skellycord/webpack/common";
import Toast, { TOAST_ACTIVE, ToastOptions } from "./Toast";
import _ from "./toaster.css";
import { sleep } from "@skellycord/utils";

export interface ToastData extends ToastOptions {
    id: number
    queuedAt: number;
}

const TOAST_ID = "_skellycord-toaster-space";
// const PENDING_TOASTS: ToastData[] = [];
let TOAST_INCREMENT = 0;

export function init() {
    const toaster = document.createElement("div");
    toaster.id = TOAST_ID;
    toaster.className = "SCToaster";

    console.log(_);

    const appMount = document.body.querySelector("#app-mount");
    appMount.insertAdjacentElement("afterend", toaster);
}

export async function makeToast(toastOpts: ToastOptions) {
    const data: ToastData = {
        id: TOAST_INCREMENT,
        queuedAt: Date.now(),
        ...toastOpts
    };
    TOAST_INCREMENT++;

    // while (TOAST_ACTIVE) await sleep();

    const root = ReactDOM.createRoot(document.getElementById(TOAST_ID));

    root.render(React.createElement(Toast, data));
}