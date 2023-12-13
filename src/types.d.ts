import Skellycord from "./skellycord";

declare global {
    interface Window {
        DiscordSentry: any;
        webpackChunkdiscord_app: any;
        skellycord: Skellycord;
    }
}

export {};