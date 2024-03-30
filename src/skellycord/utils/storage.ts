import { MOD_STORAGE_KEY } from "./constants";

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