#!/usr/bin/env zx

const content = await fs.readFile("./package.json");
const pkg = JSON.parse(content.toString());

await $`docker build . -t ghcr.io/Himenon/http-echo:${pkg.version} --no-cache`;
