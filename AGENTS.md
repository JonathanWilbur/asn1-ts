# AGENTS.md

## Cursor Cloud specific instructions

`asn1-ts` (`@wildboar/asn1`) is a pure, dependency-free TypeScript library for ASN.1 X.690 encoding/decoding (BER/CER/DER). There are **no runtime services, databases, or network dependencies** — "running" the product means building the library and exercising its codecs from a JS runtime.

Standard commands live in `package.json` `scripts` and `.github/workflows/nodejs.yml`. Key points:

- Build/type-check (`npm run build`, i.e. `tsc`) is the closest thing to a lint step — there is no separate lint script. `tsconfig.json` uses very strict settings, so the build fails on unused locals, etc.
- Tests use the native Node runner: `npm test` (`node --test`). Tests import from the compiled `dist/`, so **you must run `npm run build` before `npm test`**. The update script only installs deps; it does not build.
- Node 22+ is required (CI matrix is Node 22.x and 25.x). The dev toolchain pins `typescript ^6` and `@types/node ^25`.
- Source is ESM-only `.mts` under `source/`; compiled output goes to `dist/` (gitignored). Public entry is `dist/index.mjs`; a secondary `./functional` export maps to `dist/functional.mjs`.
- Optional alternate-runtime checks (not needed for the primary Node path, and Bun/Deno are not installed by the update script): `npm run buntest` (Bun) and `npm run denocheck` (Deno).
- Quick sanity check of the library: construct a `DERElement`, set a value (e.g. `el.integer = 42`, or `el.objectIdentifier = ObjectIdentifier.fromParts([1,2,840,113549])`), call `el.toBytes()`, then decode with a fresh `DERElement().fromBytes(...)`. Note OIDs are built via `ObjectIdentifier.fromParts([...])`, not the constructor.
