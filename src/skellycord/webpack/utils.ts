import { logger } from "@skellycord/utils";
import { loaded } from "@skellycord/apis/plugins";
import { WebpackInstance } from "discord-types/other";
// import { getModule } from "@skellycord/webpack";

let ogPush: Array<any>["push"];
export let wpRequire: WebpackInstance;
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

        modules[id] = function (m, e, r) {
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
                    if (
                        (patch.find instanceof RegExp ? patch.find.test(toRun) : toRun.includes(patch.find)) && 
                        (!patch.predicate || (patch.predicate && !patch.predicate(m)))
                    ) continue;
                    // logger.groupCollapsed(`Match found in WebpackModule${id} (${plugin.name})`);
                    // console.log(`Match: (${patch.find})`);
                    // would rather not have the entire function taking up box space
                    // console.log("Original Module:", { _: ogMod });
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
                        /*if (toRun === newRun) {
                            logger.groupCollapsed(`Failed to patched WebpackModule${id} [${plugin.from} - ${plugin.name}]`);
                            console.log("Replacement had no effect.");
                            console.groupEnd();
                        }*/
                        if (toRun !== newRun) {
                            try {
                                (0, eval)("0," + newRun);

                                successfulPatches++;
                                toRun = newRun;

                                logger.log(`Successfully patched WebpackModule${id} [${plugin.from} - ${plugin.name}]`);
                            }
                            catch (e) {
                                logger.groupCollapsed(`Failed to patched WebpackModule${id} [${plugin.from} - ${plugin.name}]`);
                                console.log(`Final Code: ${toRun}`);
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