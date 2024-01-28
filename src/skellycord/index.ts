import { logger } from "./utils/logger";
import { overridePush, wpName } from "./webpack/wpUtils";
import * as plugins from "./apis/plugins/manager";
import * as themes from "./apis/themes/manager";

export * as webpack from "./webpack";
export * as utils from "./utils";

export const apis = {
    plugins,
    themes
};

async function initMod() {
    window.skellycord = await import(".");
    if (!window[wpName]) {
        new Promise(() => setTimeout(initMod, 1));
        return;
    }

    logger.log("patching webpack...");
    overridePush();
}


logger.log("waiting for webpack...");
initMod();