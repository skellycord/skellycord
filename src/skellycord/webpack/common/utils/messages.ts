import { getViaProps } from "@skellycord/webpack/lazy";

export let messages;

getViaProps(
    "sendMessage", 
    "editMessage"
).then(m => messages = m);