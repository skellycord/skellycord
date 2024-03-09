import { getViaProps } from "@skellycord/webpack/lazy";

export let fontVariants;

getViaProps(
    "defaultColor",
    "h1",
    "disabled"
).then(m => fontVariants = m);