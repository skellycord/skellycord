import { webFrame, contextBridge } from "electron/renderer";
import { readFileSync, watchFile } from "fs";
import { join } from "path";
import patchWebpack from "./webpack";
import * as ipc from "../ipc/renderer";
// import quickcss from "./quickcss";


const ogPreload = process.env.DISCORD_PRELOADER;
if (ogPreload) require(ogPreload);

contextBridge.exposeInMainWorld("SkellycordNative", ipc);
webFrame.executeJavaScript(`(${patchWebpack})()`);
webFrame.executeJavaScript(readFileSync(join(__dirname, "skellycord.min.js"), { encoding: "utf8" }));

async function startQuickCss() {
    const styleThingy = document.createElement("style");
    styleThingy.id = "_sc-quickcss";
    styleThingy.textContent = await ipc.readFile("quick.css");
    document.body.appendChild(styleThingy);
    
    const updateCss = async () => {
        const file = await ipc.readFile("quick.css");
        if (file !== styleThingy.textContent) styleThingy.textContent = file;
        new Promise(() => setTimeout(updateCss, 1e3));
    };

    updateCss();
}

if (document.readyState === "loading") window.document.addEventListener("DOMContentLoaded", () => startQuickCss());
else startQuickCss();