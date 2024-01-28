import { logger } from "@skellycord/utils/logger";
// import { getModule } from "@skellycord/webpack";

let ogPush: Array<any>["push"];
export let wpRequire;
export const wpName = "webpackChunkdiscord_app";


let _readyListeners;
// const _moduleListeners = [];

export function overridePush() {
    ogPush = window[wpName].push;
    Object.defineProperty(window[wpName], "push", {
        get: () => (chunk) => fakePush(chunk, ogPush),
        set: (newPush) => {
            Object.defineProperty(window.webpackChunkdiscord_app, "push", {
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
    const [ , chunkModules ] = chunk;
    for (const id in chunkModules) {
        const ogMod = Object.freeze(chunkModules[id]);
        
        chunkModules[id] = function (m, e, r) {
            if (!wpRequire) {
                wpRequire = r;
                if (wpRequire) {
                    logger.log("retrieved wpRequire");
                }
                for (const fn of _readyListeners) fn();
            }

            if (m.exports === window) Object.defineProperty(r.c, id, {
                value: r.c[id],
                enumerable: false,
                configurable: true
            });

            let toRun: string = ogMod.toString().replaceAll("\n", "");
            const injectedBy: string[] = [];

            for (const plugin of Object.values(window.skellycord.apis.plugins.loaded)) {
                let totalPatches = 0;
                for (const patch of Object.values(plugin.patches)) {
                    if (!toRun.includes(patch.find)) continue;

                    logger.log(`MATCH FOUND (${patch.find})`);
                    // logger.log(toRun);

                    for (const replacements of patch.replace) {
                        logger.log(`ATTEMPTING (${replacements.target}) (${plugin.name})`);
                        const replacement = toRun.replace(replacements.target, replacements.replacement.replace("$self", `window.skellycord.plugins.list[${plugin.name}]`));
                        if (toRun === replacement) logger.error(`REPLACEMENT (${replacements.target}) -> (${replacements.replacement}) had no effect.`);
                        else {
                            totalPatches++;
                            toRun = replacement;
                            logger.log(`Succesfully patched (${replacements.target})`);
                        }
                    }
                }

                if (totalPatches != 0) injectedBy.push(plugin.name);
            }

            toRun = "0," + toRun.replaceAll("\n", "");
            const patchedStr = injectedBy.length ? `Patched By: ${injectedBy.length}` : "No Patches :(";
            const newMod = (0, eval)(`/*\n* Webpack Module ${id}\n*\n* ${patchedStr}\n*/` + 
            `\n${toRun}\n` +
            `//# sourceURL=WebpackModule${id}`);
            

            /*for (const fn of _moduleListeners) {
                if (fn[0](m.exports)) fn[1](m.exports);
            }*/
        
            Reflect.apply(newMod, null, [m, e, r]);
        };

        chunkModules[id].toString = ogMod.toString;

    }
    
    Reflect.apply(og, window.webpackChunkdiscord_app, [chunk]);
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