import Logger from "./utils/logger";

export default class Plugin {
    logger: Logger;
    _ready: boolean = false;
    constructor() {
        this.logger = new Logger(Object.getPrototypeOf(this).name);
    }
    start() {}
    stop() {}
}