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

const appVersion = fs.readdirSync(discordPath).filter(d => !d.startsWith(".")).find(d => /^(0|[1-9]\d*)\.(0|[1-9]\d*)\.(0|[1-9]\d*)/.test(d));
const coreThing = ["discord_desktop_core"];
if (platform === "win32") coreThing.splice(0, 0, "discord_desktop_core-1");
const desktopCoreDir = join(discordPath, appVersion, "modules", ...coreThing);

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
if (!uninject) code = "require('./skellycord/patcher.min.js');\n" + code;

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
    switch (argv0) {
        case "node":
        case "npm":
            cmd = "npm run build";
            break;
        case "bun":
            cmd = "bun bun:build";
    }
    
    execSync(cmd);

    blue("Copying files to desktop core...");
    const buildDir = injectorJoin("..", "dist");
    if (!fs.existsSync(join(desktopCoreDir, "skellycord"))) fs.mkdirSync(join(desktopCoreDir, "skellycord"));
    for (const file of fs.readdirSync(buildDir).filter(m => m.includes(".min.js"))) {
        fs.writeFileSync(join(desktopCoreDir, "skellycord", file), fs.readFileSync(join(buildDir, file)));
    }

    if (rebuild) green("Skellycord rebuilt successfully.");
}

function deleteFiles() {
    if (fs.existsSync(join(desktopCoreDir, "skellycord"))) {
        blue("Deleting files from desktop core...");
        fs.rmdirSync(join(desktopCoreDir, "skellycord"), { recursive: true });
    }

    /*if (fs.existsSync(injectorJoin("..", "dist"))) {
        fs.rmdirSync(injectorJoin("..", "dist"), { recursive: true });
    }*/
}