import { getViaStoreName } from "@skellycord/webpack/lazy";
import * as stores from "discord-types/stores";

export let GuildStore: stores.GuildStore;

getViaStoreName("GuildStore").then(m => GuildStore = m);