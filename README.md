# Skellycord
THE discord mod of all time. Very much WIP.

[Discord Server](https://discord.gg/aW3We2VKna)

## [Installation](https://github.com/skellycord/installer)
An installer for the mod is availible in the form of an NPM package.

```
npm i -g skellycord-installer

skellycord-installer
```

## Development 

First, run:
```
git clone https://github.com/skellycord/skellycord
cd skellycord
npm i # or bun i
```


Skellycord comes with the following script commands:

- `build [--ghSha="" --types --releaseState]` - Builds the mod asar and outputs it to "dist".

- `inject [-stable|ptb|canary]` - Ditto, but copies the asar to a discord instance.

- `uninject [-stable|ptb|canary]` - Erases asar from a discord instance.

Bun alternatives to these commands can be used with the prefix `bun:`

## Contribution
Before sending a pull request to this repo, ensure the following:
- Your code complies with the repo's [eslint](https://github.com/skellycord/skellycord/blob/master/.eslintrc.js) configuration.