const { existsSync, mkdirSync } = require("fs");
const { join } = require("path");

exports.injectorJoin = (...strings) => join(__dirname, "..", ...strings);

exports.makeDirIfNonExistent = path => {
    if (!existsSync(path)) mkdirSync(path);
};

exports.TYPE_FLAGS = ["-stable", "-ptb", "-canary"];