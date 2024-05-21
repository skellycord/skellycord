import { StorageObject, openStorage } from "@skellycord/utils/storage";
import { CORE_STORE, CORE_STORE_LINK, MOD_SETTINGS, MOD_STORAGE_KEY, TEMP_CORE_SETTINGS, TEMP_CORE_STORAGE_KEY, TempStoreRunType } from "@skellycord/utils/constants";
import { logger } from "@skellycord/utils";

export const loaded: { [x: string]: Plugin } = {};
export const stores: { [x: string]: PluginStore } = {};

let coreSettings: StorageObject<typeof MOD_SETTINGS>;
export let INTERNAL_PLUGIN: string;

export async function init() {
    coreSettings = openStorage(MOD_STORAGE_KEY, MOD_SETTINGS);
    const tempCoreSettings = openStorage(TEMP_CORE_STORAGE_KEY, TEMP_CORE_SETTINGS);

    if (tempCoreSettings.link) {
        switch (tempCoreSettings.loadType) {
            case TempStoreRunType.PERMANENT:
                INTERNAL_PLUGIN = tempCoreSettings.link;
                logger.log(`Custom core store active: ${INTERNAL_PLUGIN}`);
                break;
            case TempStoreRunType.TEMPORARY:
                if (tempCoreSettings.hasLoaded) {
                    tempCoreSettings.link = null;
                    tempCoreSettings.hasLoaded = false;
                    INTERNAL_PLUGIN = CORE_STORE_LINK;
                }
                else {
                    INTERNAL_PLUGIN = tempCoreSettings.link ?? CORE_STORE_LINK;
                    tempCoreSettings.hasLoaded = INTERNAL_PLUGIN !== CORE_STORE_LINK;
                    if (tempCoreSettings.hasLoaded) logger.log(`Custom core store active: ${INTERNAL_PLUGIN}`);
                }
        }
    }
    else INTERNAL_PLUGIN = CORE_STORE_LINK;

    for (const storeLink of [INTERNAL_PLUGIN, ...coreSettings.storeLinks]) {
        try {
            fetchStore(storeLink);
        }
        catch (e) {
            if (storeLink === INTERNAL_PLUGIN) logger.warn(`Core plugin store (${INTERNAL_PLUGIN}) failed to load, skellycord frontend/settings cannot be shown.`);
            logger.error(`Plugin store "${storeLink}" failed to load`, e.stack);
        }
    }
}

export function load(plugin: Plugin) {
    // if ((plugin as any)?.default) plugin = (plugin as any)?.default;
    if (!plugin || !plugin.name || loaded[plugin.name]) return;

    try {
        plugin?.start?.();
        loaded[plugin.name] = plugin;
        console.log(`${plugin.name} successfully started.`);
    }
    catch (e) {
        console.error(`${plugin.name} failed to start: ${e}`);
    }
}

export function unload(pluginName: string) {
    const plugin = loaded[pluginName];
    if (!plugin) return;

    try {
        plugin?.stop?.();
        logger.log("Successfully stopped.");
    }
    catch (e) {
        logger.error(`Failed to stop: ${e}`);
    }

    delete loaded[plugin.name];
}

export async function fetchStore(storeLink: string) {
    if (!storeLink.endsWith("/")) storeLink += "/";
    let manifestRes;
    let storeRes;
    const pingTest = Date.now();

    try {
        manifestRes = await fetchPluginData(storeLink + "manifest.json");
        storeRes = await fetchPluginData(storeLink + "store.js");
    }
    catch (e) {
        logger.error("Could not load store:", e);
        return;
    }

    // if (!manifestRes.ok || !storeRes.ok) throw new Error(`Request to store "${storeLink}" was unsuccesful.`);
    const manifestJson: PluginStore = JSON.parse(manifestRes);
    const storeCode = storeRes;
    logger.log(`Retreived plugin code in ${Date.now() - pingTest}ms`);
    
    // todo: hash stuff to prevent malicious execution and what no

    logger.groupCollapsed(`Running plugin store ${manifestJson.name}...`);
    try {
        // loadStore() but the store does it itself
        (0, eval)(`const Manifest=${manifestRes};${storeCode}//# sourceURL=${storeLink}store.js`);
        const storeLinks = coreSettings.storeLinks;

        if (storeLink !== INTERNAL_PLUGIN && !storeLinks.includes(storeLink)) storeLinks.push(storeLink);

        coreSettings.storeLinks = storeLinks;
    }
    catch (e) {
        logger.error(`Plugin store ${manifestJson.name} failed to load`, e);
    }
    console.groupEnd();
}

export function loadStore(store: PluginStore, plugins: PluginStore["plugins"]) {
    store.plugins = plugins;
    stores[store.name] = store;

    const storesObj = coreSettings.stores;

    if (!storesObj[store.name]) storesObj[store.name] = {};
    for (const key of Object.keys(plugins)) {
        // was exported via default
        if ((plugins[key] as any)?.default) plugins[key] = (plugins[key] as any).default;
        if (typeof storesObj[store.name][key] !== "boolean") storesObj[store.name][key] = store.name === CORE_STORE;

        plugins[key].from = store.name;
        if (storesObj[store.name][key]) load(plugins[key]);
    }
}

/* just a lil short fetch function because xhr is faster it seems */
export async function fetchPluginData(url: string) {
    const xhr = new XMLHttpRequest();
    let data;
    xhr.open("GET", url);
    xhr.onload = () => data = xhr.response;
    xhr.send();

    while (!data) await new Promise(r => setTimeout(r, 1));

    return data;
}

export enum SettingsTypes {
    STRING,
    NUMBER,
    BOOLEAN
}

export interface SettingsModel {
    displayName: string;
    description?: string;
    type: SettingsTypes;
    defaultValue: any;
}

export interface Plugin {
    [x: string]: any;
    name: string;
    description: string;
    contributors?: string[];
    patches?: {
        predicate?: (module: any) => boolean;
        find: string | RegExp;
        replacements: {
            target: RegExp;
            replacement: string | ((_module: any, _exports: any) => string);
        }[];
    }[];
    start?: () => void;
    stop?: () => void;
    settings?: (storage: StorageObject) => React.JSX.Element;
    /**
     * @readonly Set by plugin api
     */
    from?: string;
}

export interface PluginStore {
    name: string;
    description: string;
    author: string;
    plugins: { [x: string]: Plugin };
}