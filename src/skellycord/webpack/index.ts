/* @ts-ignore */
import filters from "./filters";
import { wpRequire } from "./wpUtils";

export function getModule(predicate: (m: any) => boolean) {
    for (const m of Object.values(wpRequire.c)) {
        // @ts-ignore  
        if (!m || !m.exports) continue;
        if (predicate(m)) return m;
        if (predicate(m.exports)) return m.exports;
        if (predicate(m.exports?.default)) return m.exports?.default;
    }
}

export async function getLazy(predicate: (m: any) => boolean) {
    while (!getModule(predicate)) await new Promise(r => setTimeout(r, 1));
    return getModule(predicate);
}

export function getAllModules(predicate: (m: any) => boolean) {
    const all = [];
    for (const m of Object.values(wpRequire.c)) { 
        if (!m || !m.exports) continue;
        if (predicate(m)) {
            all.push(m);
            continue;
        }
        if (predicate(m.exports)) {
            all.push(m.exports);
            continue;
        }
        if (predicate(m.exports?.default)) all.push(m.exports?.default);
    }
  
    return all;
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

export function getViaRegex(re: RegExp) {
    return getModule(filters.byRegex(re));
}

export * as common from "./common";
export { default as filters } from "./filters";
export * as wpUtils from "./wpUtils";