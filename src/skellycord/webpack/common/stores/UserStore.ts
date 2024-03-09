import { getViaStoreName } from "@skellycord/webpack/lazy";
import * as stores from "discord-types/stores";

export let UserStore: stores.UserStore;

getViaStoreName("UserStore").then(m => UserStore = m);