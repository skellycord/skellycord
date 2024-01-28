import Plugin from ".";
import pluginList from "@skellycord/plugins";
import { logger } from "@skellycord/utils/logger";
import { Settings } from "@skellycord/utils";


export const loaded: { [x: string]: Plugin } = {};
// const settings = new Settings(SkellycordSettings.PLUGINS);

export function init() {
    // const loadedPlugins: string[] = settings.get("loaded", []);
    for (const plug of pluginList) {
        if (/*loadedPlugins.includes(plug.name) &&*/ !loaded[plug.name]) load(plug.name);
        else logger.log(`Skipping ${plug.name}`);
    }
}

function getPluginByName(name: string): Plugin {
    return pluginList.find(p => p.name == name);
}

export function load(pluginName: string) {
    const plugin = getPluginByName(pluginName);
    if (!plugin || loaded[plugin.name]) return;

    try {
        const pluginSettings = new Settings(`SkellycordPlugin_${pluginName}`);
        plugin?.start(pluginSettings);
        loaded[plugin.name] = plugin;
        logger.log(`${plugin.name} successfully started.`);
    }
    catch (e) {
        logger.error(`${plugin.name} failed to start.`, e);
    }
}

export function unload(pluginName: string) {
    const plugin = getPluginByName(pluginName);
    if (!loaded[plugin.name]) return;

    try {
        plugin?.stop();
        logger.log("Successfully stopped.");
    }
    catch (e) {
        logger.error(`Failed to stop: ${e}`);
    }

    delete loaded[plugin.name];
}