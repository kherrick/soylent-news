#!/usr/bin/env node

import { readFile, writeFile } from "fs/promises";

(async () => {
  const manifest = await readFile("manifest.json", "utf-8");

  writeFile(
    "manifest.json",
    JSON.stringify({
      ...JSON.parse(manifest),
      scope: "/soylent-news/",
      start_url: "/soylent-news/",
    }),
    "utf-8"
  );
})();
