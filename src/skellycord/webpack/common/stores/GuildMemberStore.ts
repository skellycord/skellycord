import { getViaStoreName } from "@skellycord/webpack/lazy";
import * as stores from "discord-types/stores";

export let GuildMemberStore: stores.GuildMemberStore;

getViaStoreName("GuildMemberStore").then(m => GuildMemberStore = m);