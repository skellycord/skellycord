import { common } from "../webpack";

export enum SkellycordSettings {
    CORE = "SkellycordCore",
    PLUGINS = "SkellycordPlugins",
    THEMES = "SkellycordThemes"
}

export default class Settings {
    private data: Record<string, any>;
    private key: string;
    constructor(configKey: string, waitUntilUsed: boolean = true) {
        this.key = configKey;
        try {
            const data = common.localStorage.get(configKey, null);
            if (!data) {
                this.data = {};
                if (!waitUntilUsed) common.localStorage.set(configKey, {});
            }
            else this.data = data;
        }
        catch (e) {
            this.data = {};
        }
    }

    get(key: string, defaultValue: any) {
        const val = this.data[key];
        if (val === undefined) {
            this.set(key, defaultValue);
            return defaultValue;
        }
    }

    set(key: string, value: any) {
        this.data[key] = value;
        common.localStorage.set(this.key, this.data);
    }
}