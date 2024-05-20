const inquirer = require("inquirer");
const { existsSync } = require("fs");
const { findPath, findDesktopCorePath, REPO, NIGHTLY_RELEASE_ID, deleteAsar, green, blue, red, yellow } = require("./utils.js");
const inject = require("./injectorFuncs/inject.js");
const { writeFile } = require("fs/promises");
const { join } = require("path");
const uninject = require("./injectorFuncs/uninject.js");

console.clear();
blue("SKELLYCORD CLI", true);

const availibleVersions = [];
for (const target of ["stable", "ptb", "canary"]) {
    const path = findPath(target);

    if (existsSync(path)) availibleVersions.push(target);
}

if (!availibleVersions.length) {
    console.log("No discord instances are availible.");
    preExit();
}

const questions = [
    {
        type: "list",
        name: "action",
        message: "Select Action",
        choices: [
            "Inject",
            "Uninject",
            "Exit"
        ]
    },
    {
        type: "list",
        name: "discordVer",
        message: "Select Discord Instance",
        choices: availibleVersions
    }
];

const prompt = inquirer.createPromptModule();
let action;

prompt(questions[0]).then(ans => {
    if (ans.action === "Exit") {
        preExit();
        return;
    }
    action = ans.action;

    prompt(questions[1]).then(ans => {
        const deskswordPath = findPath(ans.discordVer);
        if (!existsSync(deskswordPath)) {
            console.log("No discord installation found.");
            preExit();
        }

        console.clear();
        switch (action) {
            case "Inject":
                inject(
                    ans.discordVer,
                    downloadAndCopy,
                    preExit
                );
                break;
            case "Uninject":
                uninject(
                    ans.discordVer,
                    deleteAsar,
                    preExit
                );
                break;
        }
    });
});

async function downloadAndCopy(corePath, exitCallback) {
    console.clear();
    const res = await fetch(`https://api.github.com/repos/${REPO}/releases/${NIGHTLY_RELEASE_ID}/assets`);
    const assets = await res.json();

    const { name, browser_download_url } = assets.find(a => a.name === "skellycord.asar");

    const skellysar = await fetch(browser_download_url);
    const content = await skellysar.text();

    try {
        blue("Downloading skellycord.asar...");
        await writeFile(join(corePath, name), content);
    }
    catch (e) {
        red("Failed to download skellycord.asar.");
        exitCallback(1);
    }

    blue("Writing skellycord.asar to core...");
    await writeFile(join(corePath, "skellycord.asar"), content);
}

function preExit(status) {
    yellow("Press any key to exit...");
    process.stdin.setRawMode(true);
    process.stdin.resume();
    process.stdin.on("data", () => process.exit(status));
}