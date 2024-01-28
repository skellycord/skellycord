import { Settings } from "@skellycord/utils";

export default interface Plugin {
    name: string;
    description: string;
    developers: string[];
    patches: {
        find: string;
        replace: {
            target: RegExp;
            replacement: string;
        }[];
    }[];
    start?: (settings: Settings) => void;
    stop?: () => void;
// wtf eslint
// eslint-disable-next-line semi
}