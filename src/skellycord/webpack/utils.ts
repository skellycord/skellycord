import { logger } from "@skellycord/utils/logger";
import { loaded } from "@skellycord/apis/plugins";
// import { getModule } from "@skellycord/webpack";

let ogPush: Array<any>["push"];
export let wpRequire;
export const wpName = "webpackChunkdiscord_app";
export const sourceBits: { [x: string]: string } = {};

let _readyListeners;
// const _moduleListeners = [];

export function overridePush() {
    if (window[wpName]) for (const chunk of window[wpName]) {
        if (chunk[0][1] !== -1) patchChunk(chunk);
    }

    ogPush = window[wpName].push;
    Object.defineProperty(window[wpName], "push", {
        get: () => (chunk) => fakePush(chunk, ogPush),
        set: (newPush) => {
            Object.defineProperty(window[wpName], "push", {
                value: (chunk) => {
                    // for some reason modules come through as patched in fakePush
                    return fakePush(chunk, newPush);
                },
                configurable: true,
                writable: true
            });
        },
        configurable: true
    });
}

function fakePush(chunk, og) {
    if (chunk[0][1] !== -1) patchChunk(chunk);
    if (wpRequire) patchChunk(wpRequire.m, true);
    
    Reflect.apply(og, window[wpName], [chunk]);
}

function patchChunk(chunk, isM = false) {
    let idThingy;
    let modules;

    if (!isM) {
        idThingy = chunk[0];
        modules = chunk[1];
    }
    else {
        idThingy = [];
        modules = chunk;
    }
    idThingy.push(-1);

    for (const id in modules) {
        const ogMod = Object.freeze(modules[id]);
        
        modules[id] = function(m, e, r) {
            if (!wpRequire) {
                wpRequire = r;
                if (wpRequire) {
                    // for (const fn of _readyListeners ?? []) fn();
                    logger.log("retrieved wpRequire");
                }
            }

            if (m.exports === window) Object.defineProperty(r.c, id, {
                value: r.c[id],
                enumerable: false,
                configurable: true
            });

            if (!ogMod?.toString) logger.warn(`Webpack Module ${id} is not a function!`, ogMod);
            let toRun: string = ogMod.toString().replaceAll("\n", "");
            if (toRun.includes("retrieved wpRequire")) {
                Reflect.apply(ogMod, null, [m, e, r]);
                return;
            }
            sourceBits[id] = toRun;
            const injectedBy: string[] = [];

            for (const plugin of Object.values(loaded)) {
                if (plugin.patches) for (const patch of Object.values(plugin.patches)) {
                    if (!toRun.includes(patch.find) || patch.predicate && !patch.predicate(m)) continue;
                    logger.groupCollapsed(`Match found in WebpackModule${id} (${plugin.name})`);
                    console.log(`Match: (${patch.find})`);
                    // would rather not have the entire function taking up box space
                    console.log("Original Module:", { _: ogMod });
                    // logger.log(toRun);

                    for (const replacementIndex in patch.replacements) {
                        const replacementGroup = patch.replacements[replacementIndex];
                        let successfulPatches = 0;
                        let replacementTxt: string;

                        switch (typeof replacementGroup.replacement) {
                            case "string":
                                replacementTxt = replacementGroup.replacement; 
                                break;
                            case "function":
                                replacementTxt = replacementGroup.replacement(m, e);
                        }
            
                        const newRun = toRun.replace(replacementGroup.target, replacementTxt.replaceAll("$self", `window.skellycord.apis.plugins.loaded.${plugin.name}`));
                        if (toRun === newRun) console.warn("%cPATCH FAILED", "font-weight:200", "Replacement had no effect.");
                        else {
                            try {
                                (0, eval)("0," + newRun);

                                successfulPatches++;
                                toRun = newRun;

                                console.log("%cPATCH SUCCESSFUL", "font-weight:200");
                                console.groupEnd();
                            }
                            catch (e) {
                                console.log("PATCH FAILED");
                                console.error(e.stack);
                                console.groupEnd();
                                continue;
                            }
                        }
                        if (successfulPatches) injectedBy.push(plugin.name);
                    }
                }
            }

            toRun = "0," + toRun.replaceAll("\n", "");
            const patchedStr = injectedBy.length ? `Patched By: ${injectedBy.join(", ")}` : "No Patches :(";
            const newMod = (0, eval)(`/*\n* Webpack Module ${id}\n*\n* ${patchedStr}\n*/` + 
            `\n${toRun}\n` +
            `//# sourceURL=WebpackModule${id}`);
        
            Reflect.apply(newMod, null, [m, e, r]);

        };

        modules[id].toString = ogMod.toString;
    }
}

export function onReady(callback: (wp) => void) {
    _readyListeners = _readyListeners ?? [];
    _readyListeners.push(callback);
}

/*export function onModuleLoad(predicate: (m) => boolean, callback: (m) => void) {
    let testMod: any;
    try {
        testMod = getModule(predicate);
    }
    catch (e) {} 
    
    if (!testMod) _moduleListeners.push([predicate, callback]);
    else callback(testMod);
}*/