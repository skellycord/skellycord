import { getViaStoreName } from "@skellycord/webpack/lazy";
import * as stores from "discord-types/stores";

export let ChannelStore: stores.ChannelStore;

getViaStoreName("ChannelStore").then(m => ChannelStore = m);