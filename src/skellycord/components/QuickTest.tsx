import { React } from "@skellycord/webpack/common";

export default function DumbComponent() {
    const [ text, setText ] = React.useState("Hello World!");
    
    return <p>{ text }</p>;
}