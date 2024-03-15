import { settings } from "@skellycord/utils";
import { CORE_STORE, CORE_STORE_LINK, SETTINGS_KEY } from "@skellycord/utils/constants";
import { logger } from "@skellycord/utils/logger";

export const loaded: { [x: string]: Plugin } = {};
export const stores: { [x: string]: PluginStore } = {};

let coreSettings: settings;

export async function init() {
    coreSettings = settings.openConfig(SETTINGS_KEY);
    
    for (const storeLink of coreSettings.get("storeLinks", []).concat(CORE_STORE_LINK)) {
        try {
            fetchStore(storeLink);
        }
        catch (e) {
            if (storeLink === CORE_STORE_LINK) {
                
            }
            logger.error(`Plugin store "${storeLink}" failed to load`, e.stack);
        }
    }
}

export function load(plugin: Plugin) {
    // if ((plugin as any)?.default) plugin = (plugin as any)?.default;
    if (!plugin || !plugin.name || loaded[plugin.name]) return;

    try {
        // const pluginSettings = new Settings(`SkellycordPlugin_${pluginName}`);
        plugin?.start?.();
        loaded[plugin.name] = plugin;
        console.log(`${plugin.name} successfully started.`);
    }
    catch (e) {
        console.error(`${plugin.name} failed to start.`, e);
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
    try {
        manifestRes = await fetch(storeLink + "manifest.json", { cache: "no-store" });
        storeRes = await fetch(storeLink + "store.js", { cache: "no-store" });
    }
    catch (e) {
        logger.error("Could not load store:", e);
        return;
    }

    if (!manifestRes.ok || !storeRes.ok) throw new Error(`Request to store "${storeLink}" was unsuccesful.`);
    const manifestJson: PluginStore = await manifestRes.json();
    const storeCode = await storeRes.text();
    
    // todo: hash stuff to prevent malicious execution and what no

    logger.groupCollapsed(`Running plugin store ${manifestJson.name}...`);
    try {
        // loadStore() but the store does it itself
        (0, eval)(`const Manifest=${JSON.stringify(manifestJson)};` + storeCode + `//# sourceURL=${storeLink}store.js`);
        const storeLinks = coreSettings.get("storeLinks", []);
        if (!storeLinks.includes(storeLink)) storeLinks.push(storeLink);
        coreSettings.set("storeLinks", storeLinks);
        
    }
    catch (e) {
        logger.error(`Plugin store ${manifestJson.name} failed to load`, e);
    }
    console.groupEnd();
}

export function loadStore(store: PluginStore, plugins: PluginStore["plugins"]) {
    store.plugins = plugins;
    stores[store.name] = store;

    const storesObj = coreSettings.get("stores", {});

    if (!storesObj[store.name]) storesObj[store.name] = {};
    
    for (const key of Object.keys(plugins)) {
        // was exported via default
        if ((plugins[key] as any)?.default) plugins[key] = (plugins[key] as any).default;
        if (typeof storesObj[store.name][key] !== "boolean") storesObj[store.name][key] = store.name === CORE_STORE;

        if (storesObj[store.name][key] ) {
            plugins[key].from = store.name;
            load(plugins[key]);
        }
    }
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
    name: string;
    description: string;
    contributors?: string[];
    patches?: {
        predicate?: (module: any) => boolean;
        find: string;
        replacements: {
            target: RegExp;
            replacement: string | ((_module: any, _exports: any) => string);
        }[];
    }[];
    start?: () => void;
    stop?: () => void;
    settings?: ({ get, set }) => React.JSX.Element | { [x: string]: SettingsModel };
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