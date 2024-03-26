interface LogColors {
    log: string;
    warn: string;
    error: string;
}

export function createLogger(...logNames: string[]) {
    const logObj = {
        logNames,
        colors: {
            log: "blue",
            warn: "gold",
            error: "red"
        },
        log: (...data) => console.log(...makeLogNames("log", logNames, logObj.colors), ...data),
        warn: (...data) => console.warn(...makeLogNames("warn", logNames, logObj.colors), ...data),
        error: (...data) => console.error(...makeLogNames("error", logNames, logObj.colors), ...data),
        group: (...data) => console.group(...makeLogNames("log", logNames, logObj.colors), ...data),
        groupCollapsed: (...data) => console.groupCollapsed(...makeLogNames("log", logNames, logObj.colors), ...data)
    };

    return logObj;
}

function makeLogNames(logType: keyof LogColors, logNames: string[], colors: LogColors) {
    return ["%c" + logNames.map(v => `[${v}]`).join(" "), `font-weight:bold;color:${colors[logType]}`];
}

export default createLogger("Skellycord");