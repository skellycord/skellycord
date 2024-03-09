// https://github.com/BetterDiscord/BetterDiscord/blob/d390a6966e03619dd504c84224e9cfaefcbff851/preload/src/patcher.js
export default function webpackPatch() {
    const wpName = "webpackChunkdiscord_app";
    const predef = (obj, target, effect) => {
        const value = obj[target];
        Object.defineProperty(obj, target, {
            configurable: true,
            get: () => value,
            set: v => {
                Object.defineProperty(obj, target, {
                    value: v,
                    configurable: true,
                    enumerable: true,
                    writable: true
                });

                try {
                    effect(v);
                }
                catch (e) {
                    console.error(e);
                }

                return v;
            }
        });

        if (!Reflect.has(window, wpName)) predef(window, wpName, wp => wp.push([
            [Symbol("Skellycord")],
            {},
            r => r.d = (target, exports) => {
                for (const key in exports) {
                    if (!Reflect.has(exports, key)) continue;

                    try {
                        Object.defineProperty(obj, target, {
                            get: () => exports[key],
                            set: v => exports[key] = () => v,
                            configurable: true,
                            enumerable: true,
                            writable: true
                        });
                    }
                    catch (e) {
                        console.error(e);
                    }
                } 
            }
        ]));
    };
}