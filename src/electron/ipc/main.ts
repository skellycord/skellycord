import * as fs from "fs";
import { ipcMain } from "electron";
import * as events from "./events";

function readFile(_, filePath: string) {
    return fs.readFileSync(filePath).toString();
}

function fileExists(_, filePath: string) {
    return fs.existsSync(filePath);
}

ipcMain.handle(events.READ_FILE, readFile);
ipcMain.handle(events.FILE_EXISTS, fileExists);