import { getViaProps, getViaRegex, getViaStoreName } from ".";

export default {
    get React() {
        return getViaProps("createElement", "__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED");
    },
    get ReactDOM() {
        return getViaProps("createPortal", "hydrate");
    },
    get DiscordSentry() {
        return getViaProps("Breadcrumbs", "HttpContext");
    },
    get FluxDispatcher() {
        return getViaRegex(/FluxDispatcher/);
    },
    get UserStore() {
        return getViaStoreName("UserStore").default;
    },
    get GuildStore() {
        return getViaStoreName("GuildStore").default;
    },
    get localStorage() {
        return getViaProps("impl", "ObjectStorage").impl;
    },
    get components() {
        return getViaProps("Text", "openModal", "Spinner");
    }
};