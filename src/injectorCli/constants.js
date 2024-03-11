const { existsSync, mkdirSync } = require("fs");
const { homedir } = require("os");
const { join } = require("path");
const { env, platform } = require("process");

// whats chalk
exports.green = string => console.log(`\x1b[32m|\x1b[0m ${string}`);
exports.red = string => console.error(`\x1b[31m|\x1b[0m ${string}`);
exports.blue = string => console.log(`\x1b[34m|\x1b[0m ${string}`);
exports.yellow = string => console.log(`\x1b[34m|\x1b[0m ${string}`);

exports.injectorJoin = (...strings) => join(__dirname, "..", ...strings);

exports.makeDirIfNonExistent = path => {
    if (!existsSync(path)) mkdirSync(path);
};

exports.TYPE_FLAGS = ["-stable", "-ptb", "-canary"];

const MACOS_PARTIAL_PATH = ["Library", "Application Support"];
const LINUX_PARTIAL_PATH = [".config"];

function findPath(target) {
    let suffix = target !== "stable" ? target : "";
    switch (platform) {
        case "win32": 
            const suffixSplit = suffix.split("");
            suffixSplit[0] = suffixSplit[0].toUpperCase(0);
            suffix = suffixSplit.join("");
            return join(env.LOCALAPPDATA, "Discord" + suffix);
        case "darwin": return join(homedir(), ...MACOS_PARTIAL_PATH, "discord" + suffix);
        case "linux": return join(homedir(), ...LINUX_PARTIAL_PATH, "discord" + suffix);
    }
}

exports.findPath = findPath;