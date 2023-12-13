import Plugin from "@modules/plugin";
import plugins from "../../plugins";
import { logger } from "@modules/utils/logger";

export default class PluginManager {
    plugins: Map<string, Plugin> = new Map();

    constructor() {
        for (const plug of plugins) {
            const ploog: Plugin = new plug();
            this.plugins.set(plug.name, ploog);
            try {
                ploog.start();
            }
            catch (e) {
                ploog.logger.error(`Failed to start: ${e}`);
            }
        }
    }

    load(pluginName: string) {
        if (!this.plugins.get(pluginName)) {
            const pluginClass = plugins.find(p => p.name == pluginName);
            if (!pluginClass) {
                logger.warn(`No plugin found with "${pluginName}"`);
                return;
            }
            this.plugins.set(pluginName, new pluginClass());
        }
        else {
            const ploog = this.plugins.get(pluginName);
            try {
                ploog.start();
            }
            catch (e) {
                ploog.logger.error(`Failed to start: ${e}`);
            }
        }
    }

    unload(pluginName: string) {
        if (!this.plugins.get(pluginName)) return;

        const ploog = this.plugins.get(pluginName);
        try {
            ploog.stop();
        }
        catch (e) {
            ploog.logger.error(`Failed to stop: ${e}`);
        }
    }
}