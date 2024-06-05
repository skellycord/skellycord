const { join } = require("path");
const { TYPE_FLAGS, injectorJoin } = require("./utils");
const { deleteAsar, utils: { blue } } = require("skellycord-installer");
const fs = require("fs");
const { execSync } = require("child_process");
const pack = require("../../package.json");
const { argv0 } = require("process");
const inject = require("./injectorFuncs/inject");
const _uninject = require("./injectorFuncs/uninject");

const { platform, argv } = process;

const uninject = argv.includes("-u");
const noRebuild = argv.includes("-nr");

let discordTarget = "stable"; 
const flagTarget = TYPE_FLAGS.find(flag => argv.some(arg => arg.toLowerCase() === flag));
if (flagTarget) discordTarget = flagTarget.replace("-", "");

blue(`Skellycord v${pack.version}`, true);
blue(`Target: ${discordTarget} ~ OS: ${platform}`, true);
if (!uninject) inject(
    discordTarget,
    buildAndCopy,
    process.exit
);
else _uninject(
    discordTarget,
    deleteAsar,
    process.exit
);


async function buildAndCopy(corePath) {
    deleteAsar(corePath);

    if (!noRebuild) {
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
    }
    

    blue("Copying skellycord.asar to desktop core...");
    const skellysar = injectorJoin("..", "dist", "skellycord.asar");

    fs.writeFileSync(join(corePath, "skellycord.asar"), fs.readFileSync(skellysar));
}
