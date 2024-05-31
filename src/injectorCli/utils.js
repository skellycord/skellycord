const { existsSync, mkdirSync, readdirSync, rmSync } = require("fs");
const { homedir } = require("os");
const { join } = require("path");
const { env, platform } = require("process");

exports.REPO = "skellycord/skellycord";
exports.NIGHTLY_RELEASE_ID = "150324270";

// whats chalk
const makeLog = (string, color, bold=false, prefix="|") => console.log(`${bold ? "\x1b[1m" : ""}\x1b[${color}m${prefix}\x1b[0m${bold ? "\x1b[1m" : ""} ${string} ${bold ? "\x1b[0m" : ""}`);
exports.green = (string, bold=false, prefix="|") => makeLog(string, "32", bold, prefix);
exports.red = (string, bold=false, prefix="|") => makeLog(string, "31", bold, prefix);
exports.blue = (string, bold=false, prefix="|") => makeLog(string, "34", bold, prefix);
exports.yellow = (string, bold=false, prefix="|") => makeLog(string, "33", bold, prefix);

exports.injectorJoin = (...strings) => join(__dirname, "..", ...strings);

exports.makeDirIfNonExistent = path => {
    if (!existsSync(path)) mkdirSync(path);
};

exports.TYPE_FLAGS = ["-stable", "-ptb", "-canary"];

const MACOS_PARTIAL_PATH = ["Library", "Application Support"];
const LINUX_PARTIAL_PATH = [".config"];
const FLATPAK_PARTIAL_PATH = [".var", "app", "com.discordapp.Discord", "config", "discord"];

function findPath(target) {
    let suffix = target !== "stable" ? target : "";
    let appDir;
    switch (platform) {
        case "win32": 
            if (suffix.length) {
                const suffixSplit = suffix.split("");
                suffixSplit[0] = suffixSplit[0].toUpperCase();
                suffix = suffixSplit.join("");
            }
            appDir = join(env.LOCALAPPDATA, "Discord" + suffix);
            break;
        case "darwin": 
            appDir = join(homedir(), ...MACOS_PARTIAL_PATH, "discord" + suffix);
            break;
        case "linux":
            const LINUX_CONFIG = join(homedir(), ...LINUX_PARTIAL_PATH, "discord" + suffix);
            if (existsSync(LINUX_CONFIG)) appDir = LINUX_CONFIG;
            else appDir = join(homedir(), ...FLATPAK_PARTIAL_PATH);
    }
    if (!existsSync(appDir)) throw new ReferenceError("No discord path found.");

    const appVersion = readdirSync(appDir)
        .filter(d => !d.includes("ico"))
        .find(d => d.startsWith("app") || /^(0|[1-9]\d*)\.(0|[1-9]\d*)\.(0|[1-9]\d*)/.test(d));

    let desktopCoreDir = join(appDir, appVersion, "modules");
    if (platform === "win32") desktopCoreDir = join(
        desktopCoreDir,
        readdirSync(desktopCoreDir).find(f => f.includes("discord_desktop_core"))
    );

    return join(desktopCoreDir, "discord_desktop_core");
}

exports.findPath = findPath;

function deleteAsar(corePath) {
    if (existsSync(join(corePath, "skellycord.asar"))) {
        exports.blue("Deleting skellycord.asar from desktop core...");
        try {
            rmSync(join(corePath, "skellycord.asar"));
        }
        catch (e) {
            if (e.message.includes("resource busy")) exports.red("Failed to delete skellycord.asar, close discord and try again.");
        }
    }
}

exports.deleteAsar = deleteAsar;