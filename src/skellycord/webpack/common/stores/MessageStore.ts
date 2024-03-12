import { getViaStoreName } from "@skellycord/webpack/lazy";
import * as stores from "discord-types/stores";

export let MessageStore: stores.MessageStore;

getViaStoreName("MessageStore").then(m => MessageStore = m);