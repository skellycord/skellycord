import sleep from "./sleep";

/* just a lil short fetch function because xhr is faster it seems */
export default async function(method: string, url: string) {
    const xhr = new XMLHttpRequest();
    let data;
    xhr.open(method, url);
    xhr.onload = () => data = xhr.response;
    xhr.send();

    while (!data) await sleep();

    return data;
}