import { MOD_STORAGE_KEY } from "../constants";

// i don't recommend using objects in your settings but to each their own
type Primitives = string | number | boolean | object;
type PrimitiveSet = Primitives | Primitives[] | any;
type ChangeListener = (key: string, newVal: PrimitiveSet, oldVal: PrimitiveSet) => void;
type _StorageObject = { 
    /** @readonly Event listener for storage object changes */
    _onChange?: (listener: ChangeListener) => void;
    [x: string]: PrimitiveSet;
};

export type StorageObject<T = _StorageObject> = T & _StorageObject;

const _storageInstances: { [x: string]: StorageObject } = {};
export function openStorage<T extends _StorageObject>(storageName: string, initData: T = undefined): StorageObject<T> {
    const key = `${storageName === MOD_STORAGE_KEY ? "" : "SkellyPlugin_"}${storageName}`;

    const changeListeners: ChangeListener[] = [];
    if (_storageInstances?.[key]) return _storageInstances[key] as any;
    
    let data: any = localStorage.getItem(key);
    if (!data) data = initData ?? {};
    else data = JSON.parse(data);
    
    const storageProxy = new Proxy(data, {
        get(obj, _key) {
            if (_key === "_onChange") return (listener: ChangeListener) => changeListeners.push(listener);

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

export * as backup from "./backup";