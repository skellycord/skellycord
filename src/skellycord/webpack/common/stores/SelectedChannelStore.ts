import { getViaStoreName } from "@skellycord/webpack/lazy";
import * as stores from "discord-types/stores";

export let SelectedChannelStore: stores.SelectedChannelStore;

getViaStoreName("SelectedChannelStore").then(m => SelectedChannelStore = m);