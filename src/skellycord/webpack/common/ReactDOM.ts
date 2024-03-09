import { getViaProps } from "../lazy";

export let ReactDOM: typeof import("react-dom");

getViaProps(
    "createPortal",
    "findDOMNode",
    "hydrate"
).then(m => ReactDOM = m);