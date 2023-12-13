import { homedir } from "os";

// whats chalk
export const green = string => console.log(`\x1b[32m|\x1b[0m ${string}`);
export const red = string => console.error(`\x1b[31m|\x1b[0m ${string}`);
export const blue = string => console.log(`\x1b[34m|\x1b[0m ${string}`);
export const yellow = string => console.log(`\x1b[34m|\x1b[0m ${string}`);

export const TYPE_FLAGS: string[] = ["-stable", "-ptb", "-canary"];

// todo: find more linux paths
export const PATHS = {
    win32: {
        stable: "Discord",
        ptb: "DiscordPTB",
        canary: "DiscordCanary"
    },
    linux: {
        stable: [
            "/usr/share/discord",
            "/usr/lib64/discord",
            "/opt/discord"
        ],
        ptb: [
            "/usr/share/discord-ptb",
            "/usr/lib64/discord-ptb",
            "/opt/discord-ptb"
        ],
        canary: [
            "/usr/share/discord-canary",
            "/usr/lib64/discord-canary",
            "/opt/discord-canary"
        ]
    },
    darwin: {
        stable: homedir() + "/Library/Application Support/discord",
        ptb: homedir() + "/Library/Application Support/discordptb",
        canary: homedir() + "/Library/Application Support/discordcanary"
    }
};