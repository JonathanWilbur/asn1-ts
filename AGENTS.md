# AGENTS.md

## Cursor Cloud specific instructions

`asn1-ts` (`@wildboar/asn1`) is a pure, dependency-free TypeScript library for
ASN.1 X.690 encoding/decoding (BER/CER/DER). Documentation can be found in
`documentation/`.

Standard commands live in `package.json` `scripts` and
`.github/workflows/nodejs.yml`.

Key points:

- Build/type-check (`npm run build`, i.e. `tsc`) is the closest thing to a lint
  step — there is no separate lint script. `tsconfig.json` uses very strict
  settings, so the build fails on unused locals, etc.
- Tests use the native Node runner: `npm test`. Tests import from the compiled
  `dist/`, so **you must run `npm run build` before `npm test`**. The update
  script only installs deps; it does not build.
- Source is ESM-only `.mts` under `source/`; compiled output goes to `dist/`
  (gitignored). Public entry is `dist/index.mjs`; a secondary `./functional`
  export maps to `dist/functional.mjs`.
- Optional alternate-runtime checks (not needed for the primary Node path, and
  Bun/Deno are not installed by the update script): `npm run bun-test` (Bun) and
  `npm run deno-test` (Deno).
- Quick sanity check of the library: construct a `DERElement`, set a value (e.g.
  `el.integer = 42`, or
  `el.objectIdentifier = ObjectIdentifier.fromParts([1,2,840,113549])`), call
  `el.toBytes()`, then decode with a fresh `DERElement().fromBytes(...)`. Note
  OIDs are built via `ObjectIdentifier.fromParts([...])`, not the constructor.
