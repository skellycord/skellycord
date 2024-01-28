import { common } from "src/skellycord/webpack";

// megaModule components are null on tsx call
// confusing
export default function() { 
    const { React } = common;

    return () => <>
        <p>this doesn't work yet</p>
        <button>Open Quick CSS</button>
    </>;
}