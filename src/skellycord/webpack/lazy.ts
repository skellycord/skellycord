import { sleep } from "@skellycord/utils";
import * as wp from ".";
import * as filters from "./filters";
import { wpName, wpRequire } from "./utils";

export async function getModule(predicate: (m: any) => boolean, sendModule: boolean = false) {
    while (!window[wpName] || !wpRequire?.c || !wp.getModule(predicate)) await sleep();
    return wp.getModule(predicate, sendModule);
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