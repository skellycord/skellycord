import * as filters from "./filters";
import { sourceBits, wpRequire } from "./utils";

export function getModule(predicate: (m: any) => boolean) {
    for (const m of Object.values(wpRequire.c) as any[]) {
        if (!m || !m.exports) continue;
        if (predicate(m)) return m;
        if (predicate(m.exports)) return m.exports;
        if (predicate(m.exports?.default)) return m.exports?.default;
    }
}

export function getViaSource(re: RegExp) {
    for (const source of Object.keys(sourceBits)) {
        if (re.test(sourceBits[source])) return wpRequire.c[source].exports;
    }
}

export function getViaDisplayName(displayName: string) {
    return getModule(filters.byDisplayName(displayName));
}

export function getViaStoreName(storeName: string) {
    return getModule(filters.byStoreName(storeName));
}

export function getViaProps(...props: string[]) {
    return getModule(filters.byProps(...props));
}

export function getViaPrototypes(...protos: string[]) {
    return getModule(filters.byPrototypes(...protos));
}

export * as common from "./common";
export * as filters from "./filters";
export * as utils from "./utils";
export * as lazy from "./lazy";
export * as all from "./all";