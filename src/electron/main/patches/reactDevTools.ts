import { app, session } from "electron";
import { join } from "path";
import { homedir } from "os";
import { existsSync, readdirSync } from "fs";

const { platform, env } = process;

const REACT_DEVTOOLS_ID = "fmkadmapgofadopljbjfkapdkoienihi";
const CHROME_PATHS = [
    ["Chromium"],
    ["Google", "Chrome"]
];

const LINUX_PATHS = [
    "google-chrome",
    "chromium",
    "google-chrome-beta",
    "google-chrome-canary"
];

(function() {
    let reactDevToolsPath;
    switch (platform) {
        case "win32":
            for (const chrome of CHROME_PATHS) {
                const path = join(
                    env.LOCALAPPDATA!,
                    ...chrome,
                    "User Data"
                );
                if (existsSync(path)) {
                    reactDevToolsPath = path;
                    break;
                }
            }
            break;
        case "darwin":
            for (const chrome of CHROME_PATHS) {
                const path = join(
                    homedir(),
                    "Library",
                    "Application Support",
                    ...chrome
                );
                if (existsSync(path)) {
                    reactDevToolsPath = path;
                    break;
                }
            }
            break;
        case "linux":
            for (const chrome of LINUX_PATHS) {
                const path = join(
                    homedir(),
                    ".config",
                    ...chrome
                );

                if (existsSync(path)) {
                    reactDevToolsPath = path;
                    break;
                }
            }
    }

    reactDevToolsPath = join(
        reactDevToolsPath,
        "Default",
        "Extensions",
        REACT_DEVTOOLS_ID
    );

    if (!existsSync(reactDevToolsPath)) return;

    reactDevToolsPath = join(
        reactDevToolsPath,
        readdirSync(reactDevToolsPath)
            .find(d => /^(0|[1-9]\d*)\.(0|[1-9]\d*)\.(0|[1-9]\d*)_0/.test(d))!
    );

    console.log("Path complete lol:", reactDevToolsPath);

    app.whenReady().then(() =>
        session.defaultSession.loadExtension(reactDevToolsPath)
            .then((v) => console.log(`ReactDevTools ${v.version} loaded`))
            .catch(e => console.error("ReactDevTools didn't load", e))
    );
})();