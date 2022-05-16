#!/usr/bin/env zx

const content = await fs.readFile("./package.json");
const pkg = JSON.parse(content.toString());

const actor = process.env.DOCKER_USER_NAME.toLowerCase();
await $`docker build . -t ghcr.io/${actor}/http-echo:${pkg.version} --no-cache`;
await $`docker tag ghcr.io/${actor}/http-echo:${pkg.version} ghcr.io/${actor}/http-echo:latest`;
