import { sourceBits } from "./utils";

export function byProps(...props: string[]) {
    return (mod: any) => {
        let propsCount: number = 0;
        for (const p of props) {
            if (mod?.[p]) propsCount++;
        }
        return propsCount === props.length;
    };
}

export function byPrototypes(...protos: string[]) {
    return (mod: any) => {
        let protoCount: number = 0;
        for (const p of protos) {
            if (mod?.prototype?.[p]) protoCount++;
        }
        return protoCount === protos.length;
    };
}

export function bySourceCode(re: RegExp) {
    for (const source of Object.keys(sourceBits)) {
        if (re.test(sourceBits[source])) return source;
    }
}

export function byDisplayName(displayName: string) {
    return (mod: any) => (mod?.displayName && mod?.displayName == displayName);
}

export function byStoreName(storeName: string) {
    return (mod: any) => (mod?._dispatchToken && mod?.getName?.() == storeName);
}