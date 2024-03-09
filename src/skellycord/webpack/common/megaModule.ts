import { getViaProps } from "../lazy";

export let megaModule;

getViaProps(
    "Button",
    "Card",
    "Modal",
    "FormSwitch"
).then(m => megaModule = m);