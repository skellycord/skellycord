import { getViaProps } from "@skellycord/webpack/lazy";

export let images;

getViaProps(
    "getGuildMemberAvatarURL"
).then(m => images = m);