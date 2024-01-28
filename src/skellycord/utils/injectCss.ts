export default (css: string) => {
    const coolStyle = document.createElement("style");
    coolStyle.id = "_skellycord-css";
    coolStyle.textContent = css;
    document.head.appendChild(coolStyle);
    
    return () => {
        document.head.removeChild(coolStyle);
        coolStyle.remove();
    };
};