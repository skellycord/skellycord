import { logger } from "./utils";
import { overridePush, wpName } from "./webpack/utils";
import prePatches from "./utils/prePatches";
import { themes, plugins, toaster } from "./apis";

export * as apis from "./apis";
export * as webpack from "./webpack";
export * as utils from "./utils";

function preInit() {
    for (const prePatch of prePatches) prePatch();
    plugins.init();
    themes.init();
    toaster.init();
}

if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", preInit);
else preInit();

import * as _ from ".";

window.skellycord = Object.freeze(_);

async function initMod() {
    if (!window[wpName]) {
        new Promise(() => setTimeout(initMod, 1));
        return;
    }
    
    logger.log("patching webpack...");
    overridePush();
}

logger.log("waiting for webpack...");
initMod();