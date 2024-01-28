import { after } from "@skellycord/utils/patcher";
import Plugin from "@skellycord/apis/plugins";
import { common, filters, getLazy } from "@skellycord/webpack";
import SettingsSection from "./SettingsSection";
import { Settings, devs } from "@skellycord/utils";

export const name = "_Startup";
export const developers = [devs.Skullbite];
export const description = "guuh rfnirndire";
export const patches: Plugin["patches"] = [{
    find: ".versionHash",
    replace: [{
        target: /.versionHash/,
        replacement: ".1"
    }]
}];

export async function start(settings: Settings) {
    const { React, megaModule: { Spinner, createToast, showToast } } = common;

    if (settings.get("firstStart", true)) {
        showToast(createToast("Skellycord is injected, hi."));
        settings.set("firstStart", false);
    }

    const settingsSect = await getLazy(filters.byPrototypes("getPredicateSections", "renderSidebar"));

    after(settingsSect.prototype, "getPredicateSections", (_, res: any[]) => {
        if (!res.find(d => d.label === "User Settings")) return;
        res.splice(res.findIndex(d => d.section === "Advanced") + 2, 0, 
            { section: "HEADER", label: "Skellycord" },
            { icon: React.createElement(Spinner), 
                ...generateSection("Test", () => React.createElement(SettingsSection)) },
            DIVIDER
        );

        return res;
    });
}

const DIVIDER = { section: "DIVIDER" };
function generateSection(name: string, element: any) {
    return {
        section: name,
        label: name,
        element
    };
}