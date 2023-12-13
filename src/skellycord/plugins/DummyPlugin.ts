import Plugin from "@modules/plugin";

export default class DummyPlugin extends Plugin {
    start(): void {
        console.log("This is a test");
    }

    stop(): void {
        console.log("This might be a test");
    }
}