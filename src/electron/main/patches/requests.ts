import { session } from "electron";

session.defaultSession.webRequest.onHeadersReceived(({ responseHeaders }, cb) => {
    // this was powercords btw
    Object.keys(responseHeaders!)
        .filter(k => (/^content-security-policy/i).test(k))
        .map(k => (delete responseHeaders![k]));
    cb({ responseHeaders });
});

const trackingRe = /api\/v(.*)\/(science|metrics)/g;
// const sentryRe = /assets\/sentry\.(.*)\.js/g;

session.defaultSession.webRequest.onBeforeRequest(({ url, method }, cb) => cb({ 
    cancel: 
        trackingRe.test(url) || 
        // sentryRe.test(url) ||
        (url.includes("webhooks") && method === "POST")
}));