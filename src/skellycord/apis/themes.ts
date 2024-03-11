import { injectCss, settings } from "@skellycord/utils";
import { SETTINGS_KEY } from "@skellycord/utils/constants";

const cssInjection = injectCss("");
const quickCssInjection = injectCss("");

export function init() {
    reloadWebThemes();
    reloadQuickCss();
}

export function reloadWebThemes() {
    const coreSettings = settings.openConfig(SETTINGS_KEY);

    let newLines = "";
    const webThemes = coreSettings.get("webThemes", "");
    for (const line of webThemes.split("\n")) newLines += `@import url(${line});\n`;

    cssInjection.edit(newLines);
}

export function reloadQuickCss() {
    const coreSettings = settings.openConfig(SETTINGS_KEY);

    quickCssInjection.edit(coreSettings.get("quickcss", ""));
}

export interface Theme {
    url: string;
    element: HTMLStyleElement;
}