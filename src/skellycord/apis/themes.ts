import { injectCss } from "@skellycord/utils";
import { IS_DESKTOP, MOD_SETTINGS, MOD_STORAGE_KEY } from "@skellycord/utils/constants";
import getFileInput from "@skellycord/utils/getFileInput";
import { openStorage } from "@skellycord/utils/storage";

const quickCssInjection = injectCss("");

export const linkThemes: HTMLLinkElement[] = []; 
export const pathThemes: HTMLStyleElement[] = [];

export function init() {
    reloadWebThemes();
    reloadQuickCss();
    reloadlocalThemes();
}

export async function fetchLocalThemes() {
    if (!IS_DESKTOP) return;

    const storage = openStorage(MOD_STORAGE_KEY, MOD_SETTINGS);
    const { localThemes } = storage;

    const files = await getFileInput("text/css");

    for (const file of Object.values(files)) {
        // @ts-expect-error doesn't exist in node File i guess
        const filePath: string = file.path;

        if (localThemes.includes(filePath)) continue;

        localThemes.push(filePath);
    }
    
    storage.localThemes = localThemes;
}

export async function reloadlocalThemes() {
    if (!IS_DESKTOP) return;

    for (const theme of pathThemes) theme.remove();
    pathThemes.splice(0, pathThemes.length);

    const storage = openStorage(MOD_STORAGE_KEY, MOD_SETTINGS);

    for (const path of storage.localThemes) {
        if (!window.SkellycordNative.fileExists(path)) continue;

        const theme = document.createElement("style");
        theme.innerHTML = await window.SkellycordNative.readFile(path);

        document.body.appendChild(theme);
        pathThemes.push(theme);
    }
}

export function reloadWebThemes() {
    const modStorage = openStorage(MOD_STORAGE_KEY, MOD_SETTINGS);

    for (const theme of linkThemes) theme.remove();
    linkThemes.splice(0, linkThemes.length);

    for (const line of modStorage.webThemes.split("\n")) {
        if (line === "" || line === " ") continue;
        const theme = document.createElement("link");
        theme.id = "_skellycord_theme";
        theme.href = line;
        theme.rel = "stylesheet";

        document.body.appendChild(theme);
        linkThemes.push(theme);
    }
}

export function reloadQuickCss() {
    const modStorage = openStorage(MOD_STORAGE_KEY, MOD_SETTINGS);

    quickCssInjection.edit(modStorage.quickcss);
}