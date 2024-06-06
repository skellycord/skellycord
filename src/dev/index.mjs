import { join } from "path";
import { TYPE_FLAGS, injectorJoin } from "./utils.js";
import { writeFileSync, readFileSync } from "fs";
import { execSync } from "child_process";
import pkg from "../../package.json" with { type: "json" };
import { argv0, platform, argv } from "process";
import { inject, uninject, utils, deleteAsar } from "skellycord-installer";
const { blue } = utils;

const _uninject = argv.includes("-u");
const noRebuild = argv.includes("-nr");

let discordTarget = "stable"; 
const flagTarget = TYPE_FLAGS.find(flag => argv.some(arg => arg.toLowerCase() === flag));
if (flagTarget) discordTarget = flagTarget.replace("-", "");

blue(`Skellycord v${pkg.version}`, true);
blue(`Target: ${discordTarget} ~ OS: ${platform}`, true);
if (!_uninject) inject(
    discordTarget,
    buildAndCopy,
    process.exit
);
else uninject(
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

    writeFileSync(join(corePath, "skellycord.asar"), readFileSync(skellysar));
}