import { MOD_STORAGE_KEY } from "./constants";

// i don't recommend using objects in your settings but to each their own
type Primitives = string | number | boolean | object;
export type StorageObject<T = { [x: string]: Primitives | Primitives[] | any }> = T;

const _storageInstances: { [x: string]: StorageObject } = {};
export function openStorage<T extends StorageObject>(storageName: string, initData: T = undefined): T {
    const key = `${storageName === MOD_STORAGE_KEY ? "" : "SkellyPlugin_"}${storageName}`;
    if (_storageInstances[key]) return _storageInstances[key] as any;
    
    let data: any = localStorage.getItem(key);
    if (!data) data = initData ?? {};
    else data = JSON.parse(data);
    
    const storageProxy = new Proxy(data, {
        set(obj, _key, value) {
            obj[_key] = value;

            localStorage.setItem(key, JSON.stringify(obj));
            return true;
        }
    });

    _storageInstances[key] = storageProxy;

    return storageProxy;
}