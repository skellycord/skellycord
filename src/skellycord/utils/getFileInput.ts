import sleep from "./sleep";

export default async function(accept: string): Promise<FileList> {
    const fakeInput = document.createElement("input");
    fakeInput.type = "file";
    fakeInput.accept = accept;
    fakeInput.click();
    let files;
    fakeInput.addEventListener("change", async () => {
        files = fakeInput.files;
    });

    while (!files) await sleep();

    return files;
}