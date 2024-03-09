import { getViaProps } from "@skellycord/webpack/lazy";

export let FluxDispatcher;

getViaProps(
    "createToken", 
    "subscribe"
).then(m => FluxDispatcher = m);