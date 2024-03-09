import { getViaProps } from "@skellycord/webpack/lazy";

type MarginProps = 
"marginCenterHorz" |
"marginReset" |
"marginLeft8" |
`margin${"Top" | "Bottom"}${4 | 8 | 20 | 40 | 60}`;

export let margins: { [key in MarginProps]: string };

getViaProps(
    "marginReset", 
    "marginCenterHorz"
).then(m => margins = m);