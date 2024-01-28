import Plugin from "@skellycord/apis/plugins";
import { devs } from "@skellycord/utils";

export const name = "DummyPlugin";
export const description = "";
export const developers = [devs.Skullbite];
export const patches: Plugin["patches"] = [{
    find: ".jsx",
    replace: [{
        target: /.\.jsx/,
        replacement: "window.skellypupper.webpack.common.React.createElement"
    }]
}, 
{
    find: ".Features.DISABLE_VIDEO",
    replace: [{
        target: /.\.apply\(this, arguments\)/,
        replacement: "console.log(arguments)"
    }]
}];

export function start() {
    console.log("this is a test");
}