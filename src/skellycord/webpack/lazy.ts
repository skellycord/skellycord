import * as wp from ".";
import * as filters from "./filters";
import { wpName, wpRequire } from "./utils";

export async function getModule(predicate: (m: any) => boolean) {
    while (!window[wpName] || !wpRequire?.c || !wp.getModule(predicate)) await new Promise(r => setTimeout(r, 1));
    return wp.getModule(predicate);
}

export async function getViaProps(...props: string[]) {
    return getModule(filters.byProps(...props));
}

export async function getViaPrototypes(...protos: string[]) {
    return getModule(filters.byPrototypes(...protos));
}

export async function getViaDisplayName(displayName: string) {
    return getModule(filters.byDisplayName(displayName));
}

export async function getViaStoreName(storeName: string) {
    return getModule(filters.byStoreName(storeName));
}