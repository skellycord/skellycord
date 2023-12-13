import * as webpack from "@modules/webpack";
import * as patcher from "@modules/patcher";
import * as utils from "@modules/utils";

import startupPatches from "./startupPatches";
import { logger } from "@modules/utils/logger";
import { _fakePush, onReady } from "@modules/webpack/wpRequire";
import PluginManager from "@modules/managers/plugins";

export default class Skellycord {
    webpack: typeof import("@modules/webpack");
    patcher: typeof import("@modules/patcher");
    utils: typeof import("@modules/utils");
    plugins: PluginManager;

    constructor() {
        this.webpack = webpack;
        this.patcher = patcher;
        this.utils = utils;
        this.plugins = new PluginManager();

        logger.log("loading skellycord...");
        for (const fn of startupPatches) fn.call(this);
    }

    static async init() {
        if (!window.webpackChunkdiscord_app?.push) {
            const reIn = Skellycord.init;
            await new Promise(() => setTimeout(reIn, 1));
            return;
        }
            
        logger.log("patching webpack...");
        const ogPush = window.webpackChunkdiscord_app.push;
        // patcher.before(window.webpackChunkdiscord_app, "push", (args, tsOb) => {});
        Object.defineProperty(window.webpackChunkdiscord_app, "push", {
            get: () => (chunk) => _fakePush(chunk, ogPush),
            set: (newPush) => {
                Object.defineProperty(window.webpackChunkdiscord_app, "push", {
                    value: (chunk) => _fakePush(chunk, newPush),
                    configurable: true,
                    writable: true
                });
            },
            configurable: true
        });
        

        /*window.webpackChunkdiscord_app.push = (...chunk) => {
            const [ , chunkModules ] = chunk[0];

            if (!webpack._webpackRequire) {
                const dumbKey = Object.keys(chunkModules)[0];
                const dumbMod = chunkModules[dumbKey];
                chunkModules[dumbKey] = (id, exports, require) => webpack._mockModule(dumbMod, id, exports, require);
                log("Chunk injected, waiting for wpRequire...");
                window.webpackChunkdiscord_app.push = ogPush;
            }

            return window.webpackChunkdiscord_app.length + 1;
        }*/
       
        /*patcher.before(window.webpackChunkdiscord_app, 'push', ([ chunk ]) => {
            const [ , chunkModules ] = chunk;
    

            if (!webpack._webpackRequire) {
                const dumbKey = Object.keys(chunkModules)[0];
                const dumbMod = chunkModules[dumbKey];
                chunkModules[dumbKey] = (id, exports, require) => {
                    webpack._webpackRequire = require;
                    dumbMod(id, exports, require);
                }
            }
        });*/

        onReady(() => window.skellycord = new Skellycord());
    }
}

Skellycord.init();