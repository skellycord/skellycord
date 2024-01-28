import Plugin from "@skellycord/apis/plugins";
import * as Startup from "./_Startup";
import * as DummyPlugin from "./DummyPlugin";

// uhhhhh 
// there's probably a better way to do this
export default [
    Startup,
    DummyPlugin
] as Plugin[];