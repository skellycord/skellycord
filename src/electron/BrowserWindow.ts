import { BrowserWindow } from "electron";
import { join } from "path";

export default class PatchedBrowserWindow extends BrowserWindow {
    constructor(opts: Electron.BrowserWindowConstructorOptions) {
        process.env.DISCORD_PRELOADER = opts.webPreferences?.preload;
        opts.webPreferences.preload = join(__dirname, "preload.min.js");

        return new BrowserWindow(opts);
        super();
    }
}