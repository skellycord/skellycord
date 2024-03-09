import { getViaProps } from "../lazy";

export let miniReact;

getViaProps(
    "jsx", 
    "jsxs"
).then(m => window._react = miniReact = m);