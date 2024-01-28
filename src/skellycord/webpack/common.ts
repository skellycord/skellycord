import { filters, getLazy } from ".";
import { onReady } from "./wpUtils";
import { init } from "@skellycord/apis/plugins/manager";

export let React;
export let ReactDOM;
export let DiscordSentry;
export let localStorage;
export let megaModule;

export let UserStore;
export let GuildStore;
export let FluxDispatcher;

onReady(() => Promise.all([
        getLazy(filters.byProps("createElement", "__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED")).then(m => React = m),
        getLazy(filters.byProps("createPortal", "hydrate")).then(m => ReactDOM = m),
        getLazy(filters.byProps("Text", "openModal", "Spinner")).then(m => megaModule = m),
        getLazy(filters.byProps("impl", "ObjectStorage")).then(m => {
            localStorage = m.impl;
            init();
        }),
        getLazy(filters.byProps("Breadcrumbs", "HttpContext")).then(m => DiscordSentry = m),
        getLazy(filters.byStoreName("UserStore")).then(m => UserStore = m),
        getLazy(filters.byStoreName("GuildStore")).then(m => GuildStore = m),
        getLazy(m => m?._subscriptions).then(m => FluxDispatcher = m)
    ])
);