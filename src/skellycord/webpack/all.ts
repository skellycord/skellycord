import * as filters from "./filters";
import { wpRequire } from "./utils";

export function getModules(predicate: (m: any) => boolean, sendModule: boolean = false) {
    const all = [];
    for (const m of Object.values(wpRequire.c) as any[]) { 
        if (!m || !m.exports) continue;
        if (predicate(m)) {
            all.push(m);
            continue;
        }
        if (predicate(m.exports)) {
            all.push(sendModule ? m : m.exports);
            continue;
        }
        if (predicate(m.exports?.default)) all.push(sendModule ? m : m.exports?.default);
    }
  
    return all;
}

export function getViaProps(...props: string[]) {
    return getModules(filters.byProps(...props));
}

export function getViaPrototypes(...protos: string[]) {
    return getModules(filters.byPrototypes(...protos));
}

export function getViaDisplayName(displayName: string) {
    return getModules(filters.byDisplayName(displayName));
}

export function getViaStoreName(storeName: string) {
    return getModules(filters.byStoreName(storeName));
}