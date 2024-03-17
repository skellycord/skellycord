import { getViaProps } from "@skellycord/webpack/lazy";
import Constants from "discord-types/other/Constants";

export let variables;
export let colors: Constants["Colors"];

getViaProps(
    "INTERACTIVE_NORMAL", 
    "TEXT_MUTED"
).then(m => variables = m);

getViaProps(
    "RED_500",
    "TEAL_500"
).then(m => colors = m);