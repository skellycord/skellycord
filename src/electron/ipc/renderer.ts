import { ipcRenderer } from "electron";
import { join } from "path";
import * as events from "./events";

export const fileUtils = {
    join: join
};

export async function readFile(filePath: string): Promise<string> {
    return ipcRenderer.invoke(events.READ_FILE, filePath);
}

export async function fileExists(filePath: string) {
    return ipcRenderer.invoke(events.FILE_EXISTS, filePath);
}