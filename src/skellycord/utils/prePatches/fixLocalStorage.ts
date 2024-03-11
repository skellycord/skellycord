// goosemoddery
// https://github.com/GooseMod/GooseMod/blob/master/src/util/discord/fixLocalStorage.js
export default function() {
    const frame = document.createElement("frame");
    frame.src = "about:blank";

    document.head.appendChild(frame);

    const storageDef = Object.getOwnPropertyDescriptor(frame.contentWindow, "localStorage");

    Object.defineProperty(window, "localStorage", storageDef);

    frame.remove();
}