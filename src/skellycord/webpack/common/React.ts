import { getViaProps } from "../lazy";

export let React: typeof import("react");

getViaProps(
    "createElement", 
    "__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED"
).then(m => React = m);