import { getViaProps } from "@skellycord/webpack/lazy";

export let constants;

getViaProps(
    "ACTIVITY_PLATFORM_TYPES",
    "AnalyticsGameOpenTypes"
).then(m => constants = m);