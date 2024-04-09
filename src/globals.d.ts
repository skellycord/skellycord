declare global {
    interface Window {
        _react: {
            jsx: import("react").CElement<any, any>;
            jsxs: import("react").CFactory<any, any>;
        }
        // todo: types
        SkellycordNative: any;
        DiscordNative: any;
        DiscordSentry: any;
        __SENTRY__: any;
        webpackChunkdiscord_app: any[];
        skellycord: typeof import("./skellycord");
    }
}

export {};