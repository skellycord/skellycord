# Skellycord
Discord modification (currently wip)

## Usage
Skellycord can be interacted with using either npm or bun.

### NPM
```bash
npm i

# Mod Injection
npm run inject [-- -stable|ptb|canary]
npm run reinject [-- -stable|ptb|canary]
npm run uninject [-- -stable|ptb|canary]
# Mod Development
npm run build [--types]
```

### Bun
```bash
bun i

# Mod Injection
bun bun:inject [-stable|ptb|canary]
bun bun:reinject [-stable|ptb|canary]
bun bun:uninject [-stable|ptb|canary]
# Mod Development
bun bun:build [--types]
```

## Contribution
Before sending a pull request to this repo, ensure the following:
- Your code complies with the repo's [eslint](github.com/skullbite/skellycord/blob/master/.eslintrc.js) configuration.