import { logger, quickXHR } from "@skellycord/utils";
import { GITHUB, LAST_COMMIT } from "@skellycord/utils/constants";

export let LAST_COMMITS = [];

async function initUpdateLoop() {
    const LOOP_SPEED = 60e3 * 15;

    const update = async () => LAST_COMMITS = await getModCommits();

    update().then(() => setInterval(update, LOOP_SPEED));
}

export async function getModCommits() {
    const res = await quickXHR("GET", `https://api.github.com/repos/${GITHUB}/commits`);
    return JSON.parse(res);
}

export function findCommitPoint() {
    return LAST_COMMITS.findIndex(commit => commit.sha === LAST_COMMIT);
}

export function modNeedsToUpdate() {
    return findCommitPoint() != 0;
}

if (LAST_COMMIT) initUpdateLoop();
else logger.warn("No commit associated with instance, commits will not be fetched.");