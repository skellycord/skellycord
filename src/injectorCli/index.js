const { join } = require("path");
const { red, green, blue, TYPE_FLAGS, findPath, injectorJoin } = require("./constants.js");
const fs = require("fs");
const { execSync } = require("child_process");
const pack = require("../../package.json");
const { argv0 } = require("process");

const { platform, argv, exit } = process;

const rebuild = argv.includes("-r");
const uninject = argv.includes("-u");
const unPrefix = uninject ? "un" : "";

let discordTarget = "stable";  
const flagTarget = TYPE_FLAGS.find(flag => argv.some(arg => arg.toLowerCase() === flag));
if (flagTarget) discordTarget = flagTarget.replace("-", "");
const displayTarget = `discord${discordTarget !== "stable" ? `-${discordTarget}` : ""}`;

blue(`Skellycord v${pack.version}`, true);
blue(`Target: ${discordTarget} ~ OS: ${platform}`, true);
let discordPath = findPath(discordTarget);
if (!discordPath || !fs.existsSync(discordPath)) {
    red(`No ${displayTarget} installation found.`);
    exit();
}

//const appVersion = fs.readdirSync(discordPath).filter(d => d.startsWith("app")).find(d => /^(0|[1-9]\d*)\.(0|[1-9]\d*)\.(0|[1-9]\d*)/.test(d));
const appVersion = fs.readdirSync(discordPath)
    .filter(d => !d.includes("ico"))
    .find(d => d.startsWith("app") || /^(0|[1-9]\d*)\.(0|[1-9]\d*)\.(0|[1-9]\d*)/.test(d));

blue(`Found ${displayTarget} app version: ${appVersion}`);

let desktopCoreDir = join(discordPath, appVersion, "modules");

if (platform === "win32") desktopCoreDir = join(desktopCoreDir, fs.readdirSync(desktopCoreDir).find(f => f.includes("discord_desktop_core")));

desktopCoreDir = join(desktopCoreDir, "discord_desktop_core");

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

let code = "module.exports = require('./core.asar');";
if (!uninject) code = "require('./skellycord.asar/main.min.js');\n" + code;

fs.writeFile(join(desktopCoreDir, "index.js"), code, err => {
    if (err) red(`An error occured while writing to the desktop core.\n${err}`);
    // todo: kill discord process
    // is that even possible from shell...
    else green(`Skellycord ${unPrefix}injected successfully. Be sure to restart ${displayTarget}.`);
});

function buildAndCopy() {
    deleteFiles();

    blue("Building mod...");
    let cmd;
    if (platform === "win32") {
        if (argv0 === "node") cmd = "npm run build";
        else if (argv0.includes("bun.exe")) cmd = "bun bun:build";
    }
    else switch (argv0) {
        case "node":
        case "npm":
            cmd = "npm run build";
            break;
        case "bun":
            cmd = "bun bun:build";
    }
    
    execSync(cmd);

    blue("Copying skellycord.asar to desktop core...");
    const skellysar = injectorJoin("..", "dist", "skellycord.asar");

    fs.writeFileSync(join(desktopCoreDir, "skellycord.asar"), fs.readFileSync(skellysar));

    if (rebuild) green("Skellycord rebuilt successfully.");
}

function deleteFiles() {
    if (fs.existsSync(join(desktopCoreDir, "skellycord.asar"))) {
        blue("Deleting skellycord.asar from desktop core...");
        try {
            fs.rmSync(join(desktopCoreDir, "skellycord.asar"));
        }
        catch (e) {
            if (e.message.includes("resource busy")) red(`Failed to delete skellycord.asar, close ${displayTarget} and try again.`);
            exit();
        }
    }

    /*if (fs.existsSync(injectorJoin("..", "dist"))) {
        fs.rmdirSync(injectorJoin("..", "dist"), { recursive: true });
    }*/
}
