import { logger } from "./utils/logger";
import { overridePush, wpName } from "./webpack/utils";
import prePatches from "./utils/prePatches";
import { themes, plugins } from "./apis";

export * as apis from "./apis";
export * as components from "./components";
export * as webpack from "./webpack";
export * as utils from "./utils";


function preInit() {
    for (const prePatch of prePatches) prePatch();
    themes.init();
    plugins.init();
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