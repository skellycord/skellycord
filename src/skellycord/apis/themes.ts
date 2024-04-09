import { injectCss } from "@skellycord/utils";
import { MOD_SETTINGS, MOD_STORAGE_KEY } from "@skellycord/utils/constants";
import { openStorage } from "@skellycord/utils/storage";

const quickCssInjection = injectCss("");

export const linkThemes: HTMLLinkElement[] = []; 

export function init() {
    reloadWebThemes();
    reloadQuickCss();
}

export function reloadWebThemes() {
    const modStorage = openStorage(MOD_STORAGE_KEY, MOD_SETTINGS);

    for (const theme of linkThemes) theme.remove();
    linkThemes.splice(0, linkThemes.length);

    for (const line of modStorage.webThemes.split("\n")) {
        const theme = document.createElement("link");
        theme.id = "_skellycord_theme_id";
        theme.href = line;
        theme.rel = "stylesheet";

        document.body.appendChild(theme);
        linkThemes.push(theme);
    }

    // cssInjection.edit(newLines);
}

export function reloadQuickCss() {
    const modStorage = openStorage(MOD_STORAGE_KEY, MOD_SETTINGS);

    quickCssInjection.edit(modStorage.quickcss);
}