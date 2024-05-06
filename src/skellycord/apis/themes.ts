import { injectCss } from "@skellycord/utils";
import { MOD_SETTINGS, MOD_STORAGE_KEY } from "@skellycord/utils/constants";
import { openStorage } from "@skellycord/utils/storage";

const quickCssInjection = injectCss("");

export const linkThemes: Theme[] = []; 

export function init() {
    reloadWebThemes();
    reloadQuickCss();
}

export function reloadWebThemes() {
    const modStorage = openStorage(MOD_STORAGE_KEY, MOD_SETTINGS);

    for (const theme of linkThemes) theme.element.remove();
    linkThemes.splice(0, linkThemes.length);

    for (const line of modStorage.webThemes.split("\n")) {
        if (line === "" || line === " ") continue;
        const theme = document.createElement("link");
        theme.id = "_skellycord_theme";
        theme.href = line;
        theme.rel = "stylesheet";

        const themeData: Theme = {
            local: false,
            element: theme
        };

        document.body.appendChild(theme);
        linkThemes.push(themeData);
    }
}

export function reloadQuickCss() {
    const modStorage = openStorage(MOD_STORAGE_KEY, MOD_SETTINGS);

    quickCssInjection.edit(modStorage.quickcss);
}

export interface Theme {
    local: boolean;
    element: HTMLLinkElement;
}