import filters from "./filters";
import { wpRequire } from "./wpRequire";

export function getModule(predicate: (m: any) => boolean) {
    let targetMod = Object.values<any>(wpRequire.c).find((m) => predicate(m?.exports ?? m));
    /*if (!targetMod) targetMod = Object.values(wpRequire.m).find(m => {
        const modMaybe = extractFromModule(m);
        return predicate(modMaybe?.exports ?? modMaybe);
    });*/

    return targetMod?.exports ?? targetMod;
}

export function getAllModules(predicate: (m: any) => boolean) {
    return Object.values<any>(wpRequire.c).filter((m) => predicate(m?.exports ?? m)).map(m => m?.exports ?? m);
}

export function getViaDisplayName(displayName: string) {
    return getModule(m => filters.byDisplayName(m, displayName));
}

export function getViaStoreName(storeName: string) {
    return getModule(m => filters.byStoreName(m, storeName));
}

export function getViaProps(...props: string[]) {
    return getModule(m => filters.byProps(m, ...props));
}

export function getViaPrototypes(...protos: string[]) {
    return getModule(m => filters.byPrototypes(m, ...protos));
}

export function getViaRegex(re:RegExp) {
    return getModule(m => filters.byRegex(m, re));
}

export function extractFromModule(modFunc): any {
    let exportsSample = {};
    let idSample = {};

    try {
        modFunc(idSample, exportsSample, wpRequire);
    }
    catch (e) {}
    
    return Object.keys(idSample).length == 0 ? exportsSample : idSample;
}

export { default as common } from "./common";
export { default as filters } from "./filters";
export * as wpRequire from "./wpRequire";