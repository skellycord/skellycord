import { MOD_STORAGE_KEY, TEMP_CORE_STORAGE_KEY } from "./constants";

// i don't recommend using objects in your settings but to each their own
type Primitives = string | number | boolean | object;
type PrimitiveSet = Primitives | Primitives[] | any;
export type StorageObject<T = { 
    /** @readonly Event listener for storage object changes */
    _onChange?: (key: string, newVal: PrimitiveSet, oldVal: PrimitiveSet) => void;
    [x: string]: PrimitiveSet;
}> = T;

const _storageInstances: { [x: string]: StorageObject } = {};
export function openStorage<T extends StorageObject>(storageName: string, initData: T = undefined): T {
    const key = `${storageName === MOD_STORAGE_KEY ? "" : "SkellyPlugin_"}${storageName}`;

    const changeListeners: StorageObject["_onChange"][] = [];
    if (_storageInstances?.[key]) return _storageInstances[key] as any;
    
    let data: any = localStorage.getItem(key);
    if (!data) data = initData ?? {};
    else data = JSON.parse(data);
    
    const storageProxy = new Proxy(data, {
        get(obj, _key) {
            if (_key === "_onChange") return (listener: StorageObject["_onChange"]) => changeListeners.push(listener);

            return obj[_key];
        },
        set(obj, _key, value) {
            const ogVal = obj[_key];
            obj[_key] = value;

            localStorage.setItem(key, JSON.stringify(obj));

            for (const fn of changeListeners) fn(_key as string, value, ogVal);
            return true;
        }
    });

    _storageInstances[key] = storageProxy;

    return storageProxy;
}

export function importSkellycordData() {
    const fakeInput = document.createElement("input");
    fakeInput.type = "file";
    fakeInput.accept = "text/json";
    fakeInput.click();
    fakeInput.addEventListener("change", async () => {
        const text = await fakeInput.files[0].text();
        const data = JSON.parse(text);

        for (const key of Object.keys(data)) localStorage.setItem(key, data[key]);
    });

    fakeInput.remove();
}

export function exportSkellycordData() {
    const skellyJsonLol = {};

    for (let i = 0; i < localStorage.length; i++) {
        const curKey = localStorage.key(i);
        
        if (
            curKey !== MOD_STORAGE_KEY &&
            curKey !== TEMP_CORE_STORAGE_KEY &&
            !curKey.startsWith("SkellyPlugin_")
        ) continue;

        skellyJsonLol[curKey] = localStorage.getItem(curKey);
    }

    const linkThingy = document.createElement("a");

    linkThingy.href = "data:text/json;charset=utf-8,"
        + encodeURIComponent(JSON.stringify(skellyJsonLol));
    linkThingy.download = "skellycord_backup.json";

    linkThingy.click();
    linkThingy.remove();
}

export function _clearSkellycordData() {
    for (let i = 0; i < localStorage.length; i++) {
        const curKey = localStorage.key(i);
        if (
            curKey !== MOD_STORAGE_KEY &&
            curKey !== TEMP_CORE_STORAGE_KEY &&
            !curKey.startsWith("SkellyPlugin_")
        ) continue;

        localStorage.removeItem(curKey);
    }
}