import { injectCss } from "@skellycord/utils";
import { MOD_SETTINGS, MOD_STORAGE_KEY } from "@skellycord/utils/constants";
import { openStorage } from "@skellycord/utils/storage";

const cssInjection = injectCss("");
const quickCssInjection = injectCss("");

export function init() {
    reloadWebThemes();
    reloadQuickCss();
}

export function reloadWebThemes() {
    const modStorage = openStorage(MOD_STORAGE_KEY, MOD_SETTINGS);

    let newLines = "";
    for (const line of modStorage.webThemes.split("\n")) newLines += `@import url(${line});\n`;

    cssInjection.edit(newLines);
}

export function reloadQuickCss() {
    const modStorage = openStorage(MOD_STORAGE_KEY, MOD_SETTINGS);

    quickCssInjection.edit(modStorage.quickcss);
}