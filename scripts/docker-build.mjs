#!/usr/bin/env zx

const content = await fs.readFile("./package.json");
const pkg = JSON.parse(content.toString());

const actor = process.env.GITHUB_ACTOR.toLowerCase();
await $`docker build . -t ghcr.io/${actor}/http-echo:${pkg.version} --no-cache`;
