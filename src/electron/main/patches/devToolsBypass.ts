let dummySettings;

Object.defineProperty(global, "appSettings", {
    get: () => dummySettings,
    set: (v: { settings?: any, }) => {
        // eslint-disable-next-line no-prototype-builtins
        if (!v.hasOwnProperty("settings")) v.settings = {};
        v.settings.DANGEROUS_ENABLE_DEVTOOLS_ONLY_ENABLE_IF_YOU_KNOW_WHAT_YOURE_DOING = true;
        dummySettings = v;
    }
});