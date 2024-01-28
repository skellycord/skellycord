import { logger } from "@skellycord/utils/logger";

export const loaded: { [x: string]: HTMLStyleElement } = {};

export function load(url: string) {
    if (loaded[url]) return;
    if (!url.startsWith("https://")) {
        logger.error("Not a valid link.");
        return;
    }

    const element = document.createElement("style");
    element.id = "SKELLYCORD_THEME";
    
    element.textContent = `@import url(${url});`;
    document.body.appendChild(element);

    loaded[url] = element;
}

export function unload(url: string) {
    const element = loaded[url];
    if (!element) return;

    delete loaded[url];
    document.body.removeChild(element);
}