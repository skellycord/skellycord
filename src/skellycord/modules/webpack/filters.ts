/* eslint-disable @typescript-eslint/no-explicit-any */
export default {
    byPartialProp: (mod: any, prop: string): boolean => {
        const modKeys = Object.keys(mod?.default ?? mod);
        let partialFound: boolean = false;
        for (const key in modKeys) {
            partialFound = String(key).includes(prop);
            if (partialFound) break;
        }

        return partialFound;
    },
    byProps: (mod: any, ...props: string[]): boolean => {
        let propCount: number = 0;
        for (const p of props) {
            if (mod?.default?.[p] || mod?.[p]) propCount++;
        }
        return propCount === props.length;
    },
    byPrototypes: (mod: any, ...protos: string[]): boolean => {
        let protoCount: number = 0;
        for (const p of protos) {
            if (mod?.default?.prototype?.[p] || mod?.prototype?.[p]) protoCount++;
        }
        return protoCount === protos.length;
    },
    byRegex: (mod: any, re: RegExp) => {
        const funcString = stringObj(mod);
        
        if (!funcString) return false;
        return re.test(funcString);
    },
    byDisplayName: (mod: any, displayName: any): boolean => (mod?.default?.displayName && mod?.default?.displayName == displayName) ||
    (mod?.displayName && mod?.displayName == displayName),
    byStoreName: (mod: any, storeName: string): boolean => (mod?.default?._dispatchToken && mod?.default?.getName?.() == storeName) ||
    (mod?._dispatchToken && mod?.getName?.() == storeName),
};


function stringObj(obj: any) {
    let targetString: string = "";
    if (typeof obj !== "string") {
        if (!obj || !obj?.toString) return "";
        try {
            targetString = (obj?.default?.toString?.() ?? obj?.default?.toString) ?? (obj?.toString?.() ?? obj?.toString);
        }
        catch (e) { return ""; } 
    }

    return targetString;
}