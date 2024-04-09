import { session } from "electron";

session.defaultSession.webRequest.onHeadersReceived(({ responseHeaders }, cb) => {
    Object.keys(responseHeaders)
        .filter(k => (/^content-security-policy/i).test(k))
        .map(k => (delete responseHeaders[k]));
    cb({ responseHeaders });
});

session.defaultSession.webRequest.onBeforeRequest(({ url }, cb) => cb({ 
    cancel: /api\/v(.*)\/(science|metrics|webhooks)/g.test(url)
}));