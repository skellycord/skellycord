/* eslint-disable @typescript-eslint/no-explicit-any */
interface PatchFuncTypes {
    before: (args: IArguments, thisObj: any) => any,
    after: ((args: IArguments, res: any, thisObj: any) => any),
    instead: (args: IArguments, og: ((args?: any[]) => any), thisObj: any) => any
}

interface PatchData {
    before: (PatchFuncTypes["before"])[],
    after: (PatchFuncTypes["after"])[],
    instead: (PatchFuncTypes["instead"])[],
    og: (...args: IArguments[]) => any
}

const patchSym: string = "skellycord.patches";
// const _patches:Map<string, PatchData> = new Map();


function _patchTarget({ type, obj, target, patchFn }: {
    type: "before" | "instead" | "after", 
    obj: Record<string, any>,
    target: string,
    patchFn: any
}) {
    if (!obj || !obj[target]) throw new TypeError(`${target} is undefined!`);
    let patchData: PatchData = obj[target][patchSym];
    if (!obj[target][patchSym]) {
        const og = obj[target];
        patchData = {
            before: [],
            instead: [],
            after: [],
            og
        };

        Object.defineProperty(obj[target], patchSym, {
            get: () => patchData,
            configurable: true
        });
        /*const descriptors = Object.getOwnPropertyDescriptors(patchData.og);
        const keys = {};
        for (const x of Object.keys(descriptors)) {
            console.log(x);
            Object.defineProperty(keys[target] as object, x, descriptors[x].value);
        }*/
        // obj[target] = [];
    }
    patchData[type].push(patchFn);
    Object.defineProperty(obj, target, { get: () => _replaceFunc(patchData) });
    // obj[target] = replacement;

    // obj[target].toString = replacement.toString;

    return () => {
        patchData[type].splice(patchData[type].findIndex(patchFn), 1);
        // if (patchData.after.length + patchData.before.length + patchData.instead.length == 0) 
        Object.defineProperty(obj, target, { get: () => _replaceFunc(patchData) });
    };
}

function _replaceFunc(patchData: PatchData) {
    return function() {
        // eslint-disable-next-line prefer-rest-params
        const args: any = arguments;
        let res, error;

        for (const patch of patchData.before) {
            try {
                patch.call(this, args, this);
            }
            catch (e) {
            }
        }

        for (const patch of patchData.instead) {
            try {
                res = patch.call(this, args, patchData.og);
            }
            catch (e) {
                error = e;
            }
        }

        if (!patchData.instead.length) {
            try {
                res = patchData.og.call(this, ...args);
            } 
            catch (e) {
                error = e;
            }
        }

        /*for (const patch of patchData.after) {
            const ret = patch.call(this, args, res, this);
            if (ret !== void 0) {
                res = ret;
            }
        }*/
        
        if (error) throw error;
        return res;
    };
}

export function before(obj: Record<string, any>, target: string, patchFn: (args: any[], thisObj: any) => unknown) {
    return _patchTarget({ type: "before", obj, target, patchFn });
}

export function instead(obj: Record<string, any>, target: string, patchFn: (args: any[], og: (...args: IArguments[]) => unknown, thisObj: any) => unknown) {
    return _patchTarget({ type: "instead", obj, target, patchFn });
}

export function after(obj: Record<string, any>, target: string, patchFn: (args: any[], res: any, thisObj: any) => unknown) {
    return _patchTarget({ type: "after", obj, target, patchFn });
}