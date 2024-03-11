type Primitives = string | number | boolean;
type Schema = { [x: string]: Primitives | Primitives[] };

export default class Settings<Config = Schema> {
    private static INSTANCES: { [x: string]: Settings } = {};
    private data: Record<string, any>;
    private key: string;

    static openConfig<T = Schema>(configName: string, isPlugin = true) {
        const key = `${isPlugin ? "SkellyPlugin_" : ""}${configName}`;
        if (this.INSTANCES[key]) return this.INSTANCES[key];
        
        const freshSettings = new Settings<T>(key, false);
        this.INSTANCES[key] = freshSettings;
        return freshSettings;
    }

    constructor(configKey: string, waitUntilUsed: boolean = true) {
        this.key = configKey;
        try {
            const data = localStorage.getItem(configKey);
            if (!data) {
                this.data = {};
                if (!waitUntilUsed) localStorage.setItem(configKey, "{}");
            }
            else this.data = JSON.parse(data);
        }
        catch {
            this.data = {};
            localStorage.setItem(configKey, "{}");
        }
    }

    get<T = Config>(key: string, defaultValue: T): T {
        const val = this.data[key];
        if (val === undefined) {
            this.set(key, defaultValue);
            return defaultValue;
        }

        return val;
    }

    set(key: string, value: any) {
        this.data[key] = value;
        localStorage.setItem(this.key, JSON.stringify(this.data));
    }

    copy() {
        return Object.freeze(this.data);
    }
}