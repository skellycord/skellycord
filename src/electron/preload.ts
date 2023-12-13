import * as electron from "electron/renderer";
import { readFileSync } from "fs";
import { join } from "path";

const ogPreload = process.env.DISCORD_PRELOAD;
if (ogPreload) require(ogPreload);

electron.webFrame.executeJavaScript(readFileSync(join(__dirname, "skellycord.min.js"), { encoding: "utf8" }));