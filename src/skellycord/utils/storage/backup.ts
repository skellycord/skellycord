import { MOD_STORAGE_KEY, TEMP_CORE_STORAGE_KEY } from "../constants";

export function importData() {
    const fakeInput = document.createElement("input");
    fakeInput.type = "file";
    fakeInput.accept = "text/json";
    fakeInput.click();
    fakeInput.addEventListener("change", async () => {
        const text = await fakeInput.files[0].text();
        const data = JSON.parse(text);

        for (const key of Object.keys(data)) {
            if (
                key !== MOD_STORAGE_KEY &&
                key !== TEMP_CORE_STORAGE_KEY &&
                !key.startsWith("SkellyPlugin_")
            ) continue;

            localStorage.setItem(key, data[key]);
        }
    });

    fakeInput.remove();
}

export function exportData() {
    const skellyJsonLol = {};

    for (let i = 0; i < localStorage.length; i++) {
        const curKey = localStorage.key(i);

        if (
            curKey !== MOD_STORAGE_KEY &&
            curKey !== TEMP_CORE_STORAGE_KEY &&
            !curKey.startsWith("SkellyPlugin_")
        ) continue;

        skellyJsonLol[curKey] = localStorage.getItem(curKey);
    }

    const linkThingy = document.createElement("a");

    linkThingy.href = "data:text/json;charset=utf-8,"
        + encodeURIComponent(JSON.stringify(skellyJsonLol));
    linkThingy.download = "skellycord_backup.json";

    linkThingy.click();
    linkThingy.remove();
}

export function clearData() {
    for (let i = 0; i < localStorage.length; i++) {
        const curKey = localStorage.key(i);
        if (
            curKey !== MOD_STORAGE_KEY &&
            curKey !== TEMP_CORE_STORAGE_KEY &&
            !curKey.startsWith("SkellyPlugin_")
        ) continue;

        localStorage.removeItem(curKey);
    }
}