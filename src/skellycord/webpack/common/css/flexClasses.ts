import { getViaProps } from "@skellycord/webpack/lazy";

export let flexClasses;

getViaProps(
    "noWrap", 
    "flex", 
    "flexCenter"
).then(m => flexClasses = m);