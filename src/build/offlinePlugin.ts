import { createHash } from "node:crypto";
import { readdirSync, readFileSync, writeFileSync } from "node:fs";
import { join, relative } from "node:path";
import type { Plugin } from "vite";

/** Precache every built asset, including the lazily loaded Three.js scene. */
export function offlinePlugin(): Plugin {
  return {
    name: "presentation-offline",
    apply: "build",
    closeBundle() {
      const output = join(process.cwd(), "dist");
      const walk = (dir: string): string[] =>
        readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
          const path = join(dir, entry.name);
          return entry.isDirectory() ? walk(path) : [path];
        });
      const files = walk(output).filter((file) => !file.endsWith("/sw.js"));
      const version = createHash("sha256");
      for (const file of files) version.update(readFileSync(file));
      const name = `swea-1249-${version.digest("hex").slice(0, 12)}`;
      const assets = files.map(
        (file) => "/" + relative(output, file).split("\\").join("/"),
      );
      const worker = `const CACHE = ${JSON.stringify(name)};
const ASSETS = ${JSON.stringify(assets)};
self.addEventListener('install', event => {
  event.waitUntil(caches.open(CACHE).then(cache => cache.addAll(ASSETS)));
});
self.addEventListener('activate', event => {
  event.waitUntil(caches.keys().then(keys => Promise.all(keys
    .filter(key => key.startsWith('swea-1249-') && key !== CACHE)
    .map(key => caches.delete(key)))).then(() => self.clients.claim()));
});
self.addEventListener('fetch', event => {
  const request = event.request;
  const url = new URL(request.url);
  if (request.method !== 'GET' || url.origin !== self.location.origin) return;
  if (request.mode === 'navigate') {
    event.respondWith(fetch(request).catch(() => caches.match('/index.html')));
  } else if (ASSETS.includes(url.pathname)) {
    event.respondWith(caches.match(url.pathname).then(cached => cached || fetch(request)));
  }
});
`;
      writeFileSync(join(output, "sw.js"), worker);
    },
  };
}
