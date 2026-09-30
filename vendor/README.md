# vendor/

## motion-13.4.6.esm.js

[Motion](https://motion.dev) 13.4.6 — MIT licensed, free. Vendored rather than loaded
from a CDN on purpose: this page is the CTA destination for every Moda campaign link,
so it must not depend on a third party being up.

Tree-shaken to the four functions the landing page actually uses
(`animate`, `inView`, `stagger`, `scroll`) — 61 KB raw, ~23 KB gzipped, versus 147 KB
for the full standalone build.

Reproduce:

```
npm i motion@13.4.6 esbuild
echo 'export { animate, inView, stagger, scroll } from "motion";' > entry.js
npx esbuild entry.js --bundle --format=esm --minify --outfile=vendor/motion-13.4.6.esm.js
```

To upgrade: bump the version in both the install command and the filename, rebuild,
and update the import in `../motion.js`.
