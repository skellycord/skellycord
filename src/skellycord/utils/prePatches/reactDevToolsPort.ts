import { IS_DESKTOP } from "../constants";

export default function() {
    if (!IS_DESKTOP) return;
    
    const reactPort = document.createElement("script");
    reactPort.src = "http://localhost:8097";

    document.head.appendChild(reactPort);
}