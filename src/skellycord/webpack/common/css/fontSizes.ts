import { getViaProps } from "@skellycord/webpack/lazy";

type SizeProps = `size${10 | 12 | 14 | 16 | 20 | 24 | 32}`;
export let fontSizes: { [key in SizeProps]: string };

getViaProps(
    "size10", 
    "size12"
).then(m => fontSizes = m);