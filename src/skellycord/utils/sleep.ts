export default async function sleep(ms = 1) {
    return await new Promise(r => setTimeout(r, ms));
}