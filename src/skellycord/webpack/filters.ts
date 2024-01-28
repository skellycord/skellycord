/* eslint-disable @typescript-eslint/no-explicit-any */
export default {
    /*byPartialProp: (prop: string) => (mod: any) => {
        const modKeys = typeof mod === "object" ? Object.keys(mod) : mod;
        let partialFound: boolean = false;
        for (const key in modKeys) {
            partialFound = String(key).includes(prop);
            if (partialFound) break;
        }

        return partialFound;
    },*/
    byProps: (...props: string[]) => (mod: any) => {
        let propCount: number = 0;
        for (const p of props) {
            if (mod?.[p]) propCount++;
        }
        return propCount === props.length;
    },
    byPrototypes: (...protos: string[]) => (mod: any) => {
        let protoCount: number = 0;
        for (const p of protos) {
            if (mod?.prototype?.[p]) protoCount++;
        }
        return protoCount === protos.length;
    },
    byStrings: (...strings: string[]) => (mod: any) => {
        const funcString = stringObj(mod);
        let stringCount: number = 0;
        for (const s of strings) {
            if (funcString.includes(s)) stringCount++;
        }

        return stringCount == strings.length;
    },
    byRegex: (re: RegExp) => (mod: any) => {
        const funcString = stringObj(mod);
        
        if (!funcString || funcString == "") return false;
        return re.test(funcString);
    },
    byDisplayName: (displayName: string) => (mod: any) => (mod?.displayName && mod?.displayName == displayName),
    byStoreName: (storeName: string) => (mod: any) => (mod?._dispatchToken && mod?.getName?.() == storeName),
};


function stringObj(obj: any) {
    if (typeof obj !== "function") return "";
    let targetString: string = "";
    if (typeof obj.toString === "string") targetString = obj.toString;
    else targetString = Function.prototype.toString.call(obj);

    return targetString;
}