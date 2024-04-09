export const CORE_STORE = "SkellyStore";
export const GITHUB = "skellycord/skellycord";
export const GITHUB_REPO = `https://github.com/${GITHUB}/`;
export const GUILD_DATA = {
    id: "1207058659037683812",
    invite: "aW3We2VKna"
};

export enum TempStoreRunType {
    TEMPORARY,
    PERMANENT
}

export const MOD_STORAGE_KEY = "SkellycordInternal";
export const MOD_SETTINGS = {
    firstStart: true,
    quickcss: "",
    storeLinks: [],
    stores: {},
    webThemes: "",
    localThemes: []
};

export const TEMP_CORE_STORAGE_KEY = "SkellycordTempCore";
export const TEMP_CORE_SETTINGS = {
    link: null,
    loadType: TempStoreRunType.TEMPORARY,
    hasLoaded: false
};

export const CORE_STORE_LINK: string = "https://store.skellycord.rocks/";
export const IS_DESKTOP: boolean = window?.DiscordNative != undefined;
export const IS_FLATPAK: boolean = IS_DESKTOP && window?.SkellycordNative != undefined;
// @ts-expect-error Defined by build tool
export const MOD_VERSION: string = __MOD_VERSION;
// @ts-expect-error Defined by build tool
export const RELEASE_STATE: string = __RELEASE_STATE;
// @ts-expect-error Defined by build tool
export const LAST_COMMIT: string = __GH_SHA;