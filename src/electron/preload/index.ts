import { webFrame, contextBridge } from "electron/renderer";
import { readFileSync } from "fs";
import { join } from "path";
import patchWebpack from "./webpack";
import * as ipc from "../ipc/renderer";


const ogPreload = process.env.DISCORD_PRELOADER;
if (ogPreload) require(ogPreload);

contextBridge.exposeInMainWorld("SkellycordNative", ipc);
webFrame.executeJavaScript(`(${patchWebpack})()`);
webFrame.executeJavaScript(readFileSync(join(__dirname, "skellycord.min.js"), { encoding: "utf8" }) + "\n//# sourceURL=skellycord.min.js");