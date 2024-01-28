const { join } = require("path");
const { red, green, blue, PATHS, TYPE_FLAGS } = require("./constants.js");
const fs = require("fs");
const { execSync } = require("child_process");
const pack = require("../../package.json");


const { platform, env, argv, exit } = process;

const rebuild = argv.includes("-r");
const uninject = argv.includes("-u");
const unPrefix = uninject ? "un" : "";

let discordTarget = "stable";  
const flagTarget = TYPE_FLAGS.find(flag => argv.some(arg => arg.toLowerCase() === flag));
if (flagTarget) discordTarget = flagTarget.replace("-", "");
const displayTarget = `discord${discordTarget !== "stable" ? `-${discordTarget}` : ""}`;

blue(`Skellycord v${pack.version}`);
blue(`Target: ${discordTarget} ~ OS: ${platform}`);

let discordPath = PATHS[platform][discordTarget];

switch (platform) {
    case "linux":
        discordPath = discordPath.find(p => fs.existsSync(p));
        // eslint-disable-next-line indent
        break;
    case "win32":
        discordPath = join(env.LOCALAPPDATA, discordPath);
        break;
}

if (!discordPath || !fs.existsSync(discordPath)) {
    red(`No ${displayTarget} installation found.`);
    exit();
}

const appVersion = fs.readdirSync(discordPath).filter(d => !d.startsWith(".")).find(d => /(\d+\.)?(\d+\.)?(\*|\d+)$/gm.test(d));
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
    if (err) red(`An error occured in writing to the desktop core.\n${err}`);
    // todo, kill discord process
    else green(`Skellycord ${unPrefix}injected successfully. Be sure to restart ${displayTarget}.`);
});

function buildAndCopy() {
    deleteFiles();

    blue("Building mod...");
    execSync(`node ${join(__dirname, "bundle.js")}`, { stdio: "ignore" });

    blue("Copying files to desktop core...");
    const buildDir = join(__dirname, "..", "..", "build", "skellycord");
    if (!fs.existsSync(join(desktopCoreDir, "skellycord"))) fs.mkdirSync(join(desktopCoreDir, "skellycord"));
    for (const file of fs.readdirSync(buildDir)) {
        fs.writeFileSync(join(desktopCoreDir, "skellycord", file), fs.readFileSync(join(buildDir, file)));
    }

    if (rebuild) green("Skellycord rebuilt successfully.");
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