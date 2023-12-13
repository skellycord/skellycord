import { logger } from "@modules/utils/logger";
import { getModule } from "@modules/webpack";

export let wpRequire;
const _readyListeners = [];
const _moduleListeners = [];


export function _fakeModule(og, id, exports, req) {
    if (!wpRequire) {
        wpRequire = req;
        if (wpRequire) logger.log("retrieved wpRequire");
        for (const fn of _readyListeners) fn(req);
    }

    for (const fn of _moduleListeners) {
        if (fn[0](exports)) fn[1](exports);
    }

    Reflect.apply(og, null, [id, exports, req]);
}

export function _fakePush(chunk, og) {
    const [ , chunkModules ] = chunk;
    for (const mod in Object.keys(chunkModules)) {
        const ogMod = chunkModules[mod];
        Object.defineProperty(chunkModules, mod, {
            configurable: true,
            get: () => (id, exports, require) => _fakeModule(ogMod, id, exports, require)
        });
    }
    
    Reflect.apply(og, window.webpackChunkdiscord_app, [chunk]);
}

export function onReady(callback: (wp) => void) {
    _readyListeners.push(callback);
}

export function onModuleLoad(predicate: (m) => boolean, callback: (m) => void) {
    let testMod: any;
    try {
        testMod = getModule(predicate);
    }
    catch (e) {} 
    
    if (!testMod) _moduleListeners.push([predicate, callback]);
    else callback(testMod);
}