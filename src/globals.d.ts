import * as Skellycord from "./skellycord";

declare global {
    interface Window {
        DiscordSentry: any;
        webpackChunkdiscord_app: any[];
        skellycord: typeof Skellycord;
    }
}

export {};