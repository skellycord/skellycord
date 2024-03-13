export default function(css: string) {
    const coolStyle = document.createElement("style");
    coolStyle.id = "_skellycord-css";
    coolStyle.textContent = /http(s?):\/\//.test(css) ? `@import url(${css});` : css;

    if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", () => document.body.appendChild(coolStyle));
    else document.body.appendChild(coolStyle);
    
    return {
        edit: (content: string) => coolStyle.textContent = content.startsWith("http") && /http(s?):\/\//.test(content) ? `@import url(${content});` : content,
        revert: () => coolStyle.remove()
    };
}