import { build } from "esbuild";
import { join } from "path";

function minimalConfig(entry: string, out: string) {
    return {
        entryPoints: [entry],
        outfile: out,
        sourcemap: true,
        minify: true,
        bundle: true,
        logLevel: "info"
    };
}

function buildMod() {
    // electron patcher
    build({
        ...minimalConfig(
            join(__dirname, "..", "electron", "patcher.ts"),
            join(__dirname, "..", "..", "build", "skellycord", "patcher.min.js")
        ),
        banner: { js: "/* skellycord electron main patcher */" },
        platform: "node",
        external: ["electron"],
        logLevel: "info"
    });

    // electron renderer
    build({
        ...minimalConfig(
            join(__dirname, "..", "electron", "preload.ts"),
            join(__dirname, "..", "..", "build", "skellycord", "preload.min.js")
        ),
        banner: { js: "/* skelly electron renderer patcher */" },
        platform: "node",
        external: ["electron"],
        logLevel: "info"
    });

    build({
        ...minimalConfig(
            join(__dirname, "..", "skellycord"),
            join(__dirname, "..", "..", "build", "skellycord", "skellycord.min.js")
        ),
        banner: { js: "/* skellycord mod */" },
        platform: "browser",
        logLevel: "info",
        jsxFactory: "window.webpack.common.React",
        jsxFragment: "window.webpack.common.React.Component"
    });
}

/*function buildAsar() {
    asar.createPackage(join(__dirname, ".."), join(__dirname, "..", "..", "build", "skellycord.asar"));
}

const plugin_cssImport = {
    name: "convertCssImport",
    setup: (build: PluginBuild) => {
        build.onLoad({ filter: /\.css$/ }, (args) => {
            return {
                contents: `import { injectCss } from "@utils";`,
                loader: "js"
            }
        })

    }
}*/

buildMod();