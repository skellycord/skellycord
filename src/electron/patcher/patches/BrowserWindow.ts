import { BrowserWindow } from "electron";
import { join } from "path";

const { env, platform } = process;

export default class PatchedBrowserWindow extends BrowserWindow {
    constructor(opts: Electron.BrowserWindowConstructorOptions) {
        env.DISCORD_PRELOADER = opts.webPreferences!.preload;
        
        opts.webPreferences!.preload = join(__dirname, "preload.min.js");
        // @ts-expect-error ITS REAL
        if (opts.webPreferences.nativeWindowOpen) opts.webPreferences.preload = join(__dirname, "preload.min.js");
        else opts.webPreferences!.preload = join(__dirname, "splash.min.js");

        return new BrowserWindow(opts);

        super();
    }
}