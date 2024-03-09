import { getViaStoreName } from "@skellycord/webpack/lazy";
import * as stores from "discord-types/stores";

export let SelectedGuildStore: stores.SelectedGuildStore;

getViaStoreName("SelectedGuildStore").then(m => SelectedGuildStore = m);