import * as electron from "electron";
import PatchedBrowserWindow from "./BrowserWindow";


let fakeAppSettings;
Object.defineProperty(global, "appSettings", {
    get() {
        return fakeAppSettings;
    },
    set(value) {
        // eslint-disable-next-line no-prototype-builtins
        if (!value.hasOwnProperty("settings")) value.settings = {};
        value.settings.DANGEROUS_ENABLE_DEVTOOLS_ONLY_ENABLE_IF_YOU_KNOW_WHAT_YOURE_DOING = true;
        fakeAppSettings = value;
    }
});

const electronModule = require.resolve("electron");
delete require.cache[electronModule].exports;
const electronMod: any = {
    ...electron,
    BrowserWindow: PatchedBrowserWindow
}
require.cache[electronModule].exports = electronMod;

electron.session.defaultSession.webRequest.onHeadersReceived(({ responseHeaders, url }, cb) => {
    if (responseHeaders["content-security-policy"]) delete responseHeaders["content-security-policy"];
    if (url.endsWith(".css")) responseHeaders["content-type"] = ["text/css"];
    // responseHeaders["access-control-allow-origin"] = ["*"];
    cb({ responseHeaders });
});

electron.session.defaultSession.webRequest.onBeforeRequest(({ url }, cb) => {
    if (/api\/v(.*)\/science/g.test(url)) cb({ cancel: true });
    else cb({ });
});