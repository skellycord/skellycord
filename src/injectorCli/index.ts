import { join } from "path";
import { red, green, blue, PATHS, TYPE_FLAGS } from "./constants";
import * as fs from "fs";
import { execSync } from "child_process";
import pack from "../../package.json";

const { platform, env, argv, exit } = process;

const rebuild: boolean = argv.includes("-r");
const uninject: boolean = argv.includes("-u");
const unPrefix: string = uninject ? "un" : "";

let discordTarget: string = "stable";    
const flagTarget = TYPE_FLAGS.find(flag => argv.some(arg => arg.toLowerCase() === flag));
if (flagTarget) discordTarget = flagTarget.replace("-", "");
const displayTarget: string = `discord${discordTarget !== "stable" ? `-${discordTarget}` : ""}`;

blue(`Skellycord v${pack.version}`);
blue(`Target: ${discordTarget} ~ OS: ${platform}`);

let discordPath = PATHS[platform][discordTarget];

switch (platform) {
    case "linux":
        discordPath = discordPath.find(p => fs.existsSync(p));
        // eslint-disable-next-line indent
        break;
    case "win32":
        discordPath = join((env as { LOCALAPPDATA: string }).LOCALAPPDATA, discordPath);
        break;
}

if (!discordPath || !fs.existsSync(discordPath)) {
    red(`No ${displayTarget} installation found.`);
    exit();
}

const appVersion: string = fs.readdirSync(discordPath).filter(d => !d.startsWith(".")).find(d => /(\d+\.)?(\d+\.)?(\*|\d+)$/gm.test(d));
const desktopCoreDir = join(discordPath, appVersion, "modules", "discord_desktop_core");

const coreFile = fs.readFileSync(join(desktopCoreDir, "index.js"), "utf8");

// already injected?
if (coreFile.split("\n").length != 1) {
    if (!uninject) {
        if (coreFile.includes("skellycord")) {
            if (rebuild) buildAndCopy();
            else red("Skellycord is already injected.");
        }
        else red("A different mod appears to be injected. Please uninject it and try again.");
        
        exit();
    }
}
else if (uninject) {
    red("Nothing to uninject...");
    exit();
}

if (!uninject) buildAndCopy();
else deleteFiles();


let code: string = "module.exports = require('./core.asar');";
if (!uninject) code = "require('./skellycord/patcher.min.js');\n" + code;

fs.writeFile(join(desktopCoreDir, "index.js"), code, err => {
    if (err) red(`An error occured in writing to the desktop core.\n${err}`);
    // todo, kill discord process
    else green(`Skellycord ${unPrefix}injected successfully! Be sure to restart ${displayTarget}.`);
});

function buildAndCopy() {
    deleteFiles();

    blue("Building mod...");
    execSync(`bun ${join(__dirname, "bundle.ts")}`);

    blue("Copying files to desktop core...");
    const buildDir = join(__dirname, "..", "..", "build", "skellycord");
    if (!fs.existsSync(join(desktopCoreDir, "skellycord"))) fs.mkdirSync(join(desktopCoreDir, "skellycord"));
    for (const file of fs.readdirSync(buildDir)) {
        fs.writeFileSync(join(desktopCoreDir, "skellycord", file), fs.readFileSync(join(buildDir, file)));
    }

    if (rebuild) green("Skellycord rebuilt successfully!");
}

function deleteFiles() {
    if (fs.existsSync(join(desktopCoreDir, "skellycord"))) {
        blue("Deleting files from desktop core...");
        fs.rmdirSync(join(desktopCoreDir, "skellycord"), { recursive: true });
    }

    if (fs.existsSync(join(__dirname, "..", "..", "build", "skellycord"))) {
        fs.rmdirSync(join(__dirname, "..", "..", "build", "skellycord"), { recursive: true });
    }
}