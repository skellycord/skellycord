import * as electron from "electron";
import PatchedBrowserWindow from "./BrowserWindow";

const electronModule = require.resolve("electron");
delete require.cache[electronModule].exports;
const electronMod: any = {
    ...electron,
    BrowserWindow: PatchedBrowserWindow
};
require.cache[electronModule].exports = electronMod;