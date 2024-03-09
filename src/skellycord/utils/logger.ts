interface LogColors {
    log: string;
    warn: string;
    error: string;
}

export default class Logger {
    logNames: string[] = [];
    colors: LogColors = {
        log: "blue",
        warn: "gold",
        error: "red"
    };

    constructor(...logNames: string[]) {
        this.logNames = logNames;
    }

    private makeCssBit(logType: keyof LogColors) {
        return ["%c" + this.logNames.map(v => `[${v}]`).join(" "), `font-weight:bold;color:${this.colors[logType]}`];
    }

    log(...data) {
        console.log(...this.makeCssBit("log"), ...data);
    }

    warn(...data) {
        console.warn(...this.makeCssBit("warn"), ...data);
    }

    error(...data) {
        console.error(...this.makeCssBit("error"), ...data);
    }

    group(...data) {
        console.group(...this.makeCssBit("log"), ...data);
    }

    groupCollapsed(...data) {
        console.groupCollapsed(...this.makeCssBit("log"), ...data);
    }


}

export const logger = new Logger("Skellycord");