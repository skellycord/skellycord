const { join } = require("path");
const { findPath, utils: { red, green } } = require("skellycord-installer");
const { readFileSync, writeFile } = require("fs");

module.exports = function(target, deleteCallback, exitCallback) {
    const displayTarget = `discord${target !== "stable" ? `-${target}` : ""}`;
    let corePath;
    try {
        corePath = findPath(target);
    }
    catch (e) {
        red(`No ${displayTarget} installation found.`);
        exitCallback(1);
    }

    const coreFile = readFileSync(join(corePath, "index.js"), "utf8");

    if (coreFile.split("\n").length == 1) {
        red("Nothing to uninject...");
        exitCallback(1);
    }

    deleteCallback(corePath);

    const code = "module.exports = require('./core.asar');";

    writeFile(join(corePath, "index.js"), code, err => {
        if (err) red("Failed to write to the desktop core.");
        else green(`Skellycord uninjected successfully. Be sure to restart ${displayTarget}.`);

        exitCallback(err ? 1 : 0);
    });
};