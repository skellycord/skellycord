import { session } from "electron";

session.defaultSession.webRequest.onHeadersReceived(({ responseHeaders, url }, cb) => {
    if (responseHeaders["content-security-policy"]) delete responseHeaders["content-security-policy"];
    if (url.endsWith(".css")) responseHeaders["content-type"] = ["text/css"];
    // responseHeaders["access-control-allow-origin"] = ["*"];
    cb({ responseHeaders });
});

session.defaultSession.webRequest.onBeforeRequest(({ url }, cb) => cb({ 
    cancel: /api\/v(.*)\/(science|metrics|webhooks)/g.test(url) 
}));