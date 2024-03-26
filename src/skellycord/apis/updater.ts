import { logger } from "@skellycord/utils";
import { GITHUB, LAST_COMMIT } from "@skellycord/utils/constants";

export let LAST_COMMITS = [];

async function initUpdateLoop() {
    const LOOP_SPEED = 60e3 * 15;
    
    setInterval(async () => LAST_COMMITS = await getModCommits(), LOOP_SPEED);
}

export async function getModCommits() {
    const res = await fetch(`https://api.github.com/repos/${GITHUB}/commits`);
    return await res.json();
}

export function modNeedsToUpdate(commits: any[]) {
    if (!commits) return false;
    return commits.findIndex(commit => commit.sha === LAST_COMMIT) != 0;
}

if (LAST_COMMIT) initUpdateLoop();
else logger.warn("No commit associated with instance, commits will not be fetched.");