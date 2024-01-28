import { join } from "path";
import * as fs from "fs";
import { homedir } from "os";
import { ipcMain } from "electron";
import * as events from "./events";

let CONFIG_PATH = "";
switch (process.platform) 
{
    case "win32": CONFIG_PATH = (process.env as { LOCALAPPDATA: string }).LOCALAPPDATA + "/Skellycord";
    break;
    case "linux": CONFIG_PATH = homedir() + "/.config/skellycord";
    break;
    case "darwin": CONFIG_PATH = homedir() + "/Library/Application Support/Skellycord";
    break;
}

if (!fs.existsSync(CONFIG_PATH)) {
    fs.mkdirSync(CONFIG_PATH);
    fs.writeFileSync(join(CONFIG_PATH, "quick.css"), "");
}

function readFile(_, filePath: string) {
    return fs.readFileSync(join(CONFIG_PATH, filePath)).toString();
}

function fileExists(_, filePath: string) {
    return fs.existsSync(join(CONFIG_PATH, filePath));
}

ipcMain.handle(events.READ_FILE, readFile);
ipcMain.handle(events.FILE_EXISTS, fileExists);