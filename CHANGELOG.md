# Changelog

## [Unreleased]

- Make `instanceof ASN1Element` and `instanceof ObjectIdentifier` work across
  duplicate installs of this package by stamping `Symbol.for` brands and
  implementing `Symbol.hasInstance`. Codec classes override `hasInstance` so
  `el instanceof DERElement` stays false for BER/CER elements.
- `encode()`, `encodeExternal`, and `_encode_choice` now recognize elements and
  OIDs from another copy (or older copies that have no brand) by structure:
  elements via `tagClass` / `tagNumber` / `construction` / `toBytes`, OIDs via
  `toBytes` / `isEqualTo`. The previous OID duck-type checked instance
  `fromParts`, which is static and never matched a real foreign OID.
- Functional `_decodeSequence` / `_decodeSet` (and the `*Of` variants) call
  `sequenceElements` / `setElements` when present instead of using
  `instanceof DERElement` (so zero-copy still works for a foreign element).
- Export `ASN1_ELEMENT_BRAND`, `BER_ELEMENT_BRAND`, `CER_ELEMENT_BRAND`,
  `DER_ELEMENT_BRAND`, `OBJECT_IDENTIFIER_BRAND`, `isASN1ElementLike`, and
  `isObjectIdentifierLike`.
- Pad hexadecimal `toJSON()` encodings of `OCTET STRING` and packed `BIT STRING`
  bytes to two characters per octet. Hex conversion uses only the typed-array
  view so it does not dump the backing `ArrayBuffer`.

## [11.2.1]

- Fix jsr deployment
- Update `SECURITY.md`

## [11.2.0]

- Huge performance improvements: `INTEGER` and `BIT STRING` encode/decode,
  BOOLEAN encode, DATE and other time-type codecs, OID encode/decode, string
  validation, constructed deconstruction, and TLV encoding.
- Add ISO 8601 display and parsing on the X.696 TIME encoding types:
  `fromISOString()` / `fromString()`, `toISOString()` / `toString()` /
  `toJSON()`. `DURATION_EQUIVALENT` gained `toISOString()`.
- Add `ObjectIdentifier.fromStringWithBigArcs()` and `nodesBigAndSmall` so OID
  arcs larger than `Number.MAX_SAFE_INTEGER` can be constructed and inspected
  exactly. `toString()` falls back to this path when `nodes` would overflow.
- Export whole-string validators: `isGraphicString`, `isNumericString`,
  `isPrintableString`, `isVisibleString`, `isTimeString`, and `isTimeCharacter`.
- Add `canEncodeAsBMPString()`.
- Add `toStringEx()` / `toJSONEx()` so recursion depth can be controlled.
  Print `EXTERNAL`, `EMBEDDED PDV`, and `CHARACTER STRING` in ASN.1 value
  notation from `ASN1Element.toString()`.
- Bound `toString()` / `toJSON()` recursion for `SEQUENCE`, `SET`, `EXTERNAL`,
  `EMBEDDED PDV`, and `CHARACTER STRING` by threading the TTL into nested
  values instead of restarting at 100.
- Decode BER / CER / DER with optional zero-copy (`fromBytes(bytes, zeroCopy)`).
  Functional `_decodeSequence`, `_decodeSet`, `_decodeSequenceOf`, and
  `_decodeSetOf` now alias the parent content octets. Use the new
  `_decodeSequenceCloned`, `_decodeSetCloned`, `_decodeSequenceOfCloned`, and
  `_decodeSetOfCloned` (or `sequence` / `set` getters) when you need
  independently owned buffers.
- Fix `ObjectIdentifier.fromBytes()` treating a leading `0x80` as a missing
  first arc instead of prohibited padding. Large arcs no longer throw
  overflow during `fromBytes()`; they can be decoded via the big-arc APIs.
- Fix constructed `BIT STRING` deconstruction so only the last fragment's
  unused-bits octet is kept.
- Fix recursion handling when determining indefinite-length encodings.
- Decode `EXTERNAL` / `EMBEDDED PDV` / `CHARACTER STRING` identification OIDs
  by primitive vs constructed encoding instead of try/catch.

## [11.1.0]

- Add `ObjectIdentifier.byteLength()` - Returns the length of the X.690
  encoding's content octets
- Add `ObjectIdentifier.toBytesUnsafe()` - Obtains a reference to the underlying
  encoding that you pinky-promise not to modify. (Avoids an unnecessary
  allocation in cases where you are just reading the bytes.)
- Cache value returned from `ObjectIdentifier.dotDelimitedNotation`,
  `ObjectIdentifier.toString()`, and `ObjectIdentifier.toJSON()`.
- Removed some function call indirection in the functional API for small
  performance gains.

## [11.0.6]

- Fix an issue where, in some cases, decoding an integer can contain the entire
  underlying `ArrayBuffer`. To be clear, this is a security vulnerability and
  you should update this package to this version as soon as possible. (Sorry!)
  - This seems to have been a problem since version 7.0.4, starting with commit
    `a46d307b5094b706059f40df2afd044cbb81d4a1`.

## [11.0.5]

- Fix an [issue](https://github.com/JonathanWilbur/asn1-ts/pull/35) with imports
  - Thank you [`@hayes-mysten`](https://github.com/hayes-mysten)!
- Add missing type import

## [11.0.4]

- Fix the `Enbyteable` interface so that it returns a `Buffer` instead of a
  `Uint8Array`

## [11.0.3]

In light of
[this](https://www.typescriptlang.org/docs/handbook/release-notes/typescript-5-7.html#typedarrays-are-now-generic-over-arraybufferlike)
very breaking TypeScript change in TypeScript 5.7, the Prisma developers came up
with a pretty clever solution
[here](https://github.com/prisma/prisma/pull/28139/files#diff-84a6c6d9582ac715b1e97a45de988653ae2e33d10cdb979d6b5f643777ec015d)
so that their package can compile with versions before and after that change.

This package incorporates these changes.

## [11.0.2]

- Fix issue with calling `(B|C|D)ERelement.encode()` using object identifiers
  when you have multiple versions of this package installed. Internally,
  encoding of `EXTERNAL`, `EMBEDDED PDV`, and `CHARACTER STRING` now avoid this
  less reliable code-path _and_ the less reliable code-path has been improved.

## [11.0.0]

- Much more performant OID implementation
  - The constructor no longer accepts any arguments
    - It was replaced with `ObjectIdentifier.fromParts()`.
  - Merely finding and replacing `new ObjectIdentifier` with
    `ObjectIdentifier.fromParts` should be sufficient to upgrade.
- You can now construct OIDs from `ObjectIdentifier.fromBytes()` and
  `ObjectIdentifier.fromBytesUnsafe()`.

## [10.0.1]

- Performance improvements to string encoding
- Performance improvements to `SET`, `SEQUENCE`, `SET OF`, `SEQUENCE OF`, and `CHOICE` parsing.

## [10.0.0]

- **BREAKING**: Remove some deprecated APIs.
- Fix JSR package. See [this issue](https://github.com/jsr-io/jsr/issues/1145).
- Add JSDoc documentation.

## [9.0.3]

- Build to ES2020 target. Newer ECMAScript features are not used.

## [9.0.2]

- Fix bug when encoding `DATE` values having a year less than 1000.
- Fix bug when encoding `DATE-TIME` values having a year less than 1000.
- Fix bug when encoding `TIME-OF-DAY` values having hours, minutes, or seconds
  that are single-digit.
- Fix bug when encoding `UTCTime` values having a year less than 1000.
- Fix bug when encoding `GeneralizedTime` values having a year less than 1000.

## [9.0.1]

- Fix types export

## [9.0.0]

- Compile ESM Modules: no more CommonJS
- Stricter TypeScript Checks
- Native NodeJS Test Runner: no more Jest
- Deno Support
- Bun Support

## [8.0.5]

- Explicitly import `Buffer`
  - Apparently, this is required when running on Cloudflare Workers.
  - Closes [#32](https://github.com/JonathanWilbur/asn1-ts/issues/32).

## [8.0.4]

- Fix `UTCTime` and `GeneralizedTime` decoding to use the timezone offsets.
  - I think I mistakenly copied the DER decoders into the BER decoder without
    modification. Because the DER syntax is so strict, the parsing ignores
    timezones, because they shouldn't be present at all.
  - There is now a very rigorous test suite ensuring these are correct.
- I think `UTCTime` and `GeneralizedTime` should be a lot more performant too,
  since I am not using regular expressions anymore.
- Remove a `console.log()`. (Sorry! I _do_ know how to debug, but sometimes
  `console.log()` is just too dang easy.)

## [8.0.3]

- Significant performance improvements in encoding and decoding object identifiers.

## [8.0.2]

- Fixed catastrophic performance issue when serializing values

## [8.0.1]

- Fixed broken `ObjectIdentifier.fromString()`.

## [8.0.0]

- 4x faster object identifier encoding and decoding
- Performance optimization to avoid repeatedly re-allocating byte arrays

This is only a breaking change because a few functions you probably shouldn't
use to begin with have been removed and some fields that were `public` have
become `private`. For normal usage of this library, this should still be a
drop-in replacement.

## [7.1.12]

- Fix bugs in decoding `UTCTime` and `GeneralizedTime`.

## [7.0.11]

- Fix invalid type for `_encode_choice`
- Fix invalid validation of `SEQUENCE` types with a trailing root component type list.
  - This would cause an error saying `SEQUENCE '<sequence name>' had excess elements at the end.`

## [7.0.0]

Make `ENUMERATED` have `number` type only. This is most just to avoid breaking
existing code. This is important, because:

- In common use cases, you'll compare enumerated values. Using the `===` strict
  equality operator, a `bigint` will not equate to a `number` of similar value.
  So supporting `bigint` would complicate comparisons.
- You may wish to represent `ENUMERATED` types as actual enums. If you do, you
  would not be able to represent all decoded values as a member of that enum
  without first converting the `bigint` into a `number`.
- `ENUMERATED` types typically do not have absurdly large values.

## [6.0.0]

It's 2021 and we have Browserify and BigInt. We can use `Buffer` methods to
encode and decode integers (instead rolling our own implementation for
`Uint8Array`), and we can use `BigInt` so that we can support `INTEGER` and
`ENUMERATED` values that are infinitely large!

This does mean that I have removed the Webpack configuration. If you want this
in a web app, it really should just be packed along with your project as a whole
rather than imported separately. If you really want it as a separate import, the
only thing you should have to do is define `Buffer` in the global context.

## [5.0.0]

- Remove `anythingElseHandler` from `_decode_inextensible_choice` and use wildcard `"*"` instead.
- Fix definition of classes in `classes`.

## [3.0.0]

### Added :seedling:

- Dozens of macros that alias the native types and make the code look and feel more like ASN.1.
- Add the `prefix` argument to `ObjectIdentifier`, which permits another `ObjectIdentifier` as a prefix.
- Support for the `TIME` data type defined in ITU X.680:2015.
- Support for the `DATE` data type defined in ITU X.680:2015.
- Support for the `TIME-OF-DAY` data type defined in ITU X.680:2015.
- Support for the `DATE-TIME` data type defined in ITU X.680:2015.
- Support for the `DURATION` data type defined in ITU X.680:2015.
- Support for the `OID-IRI` data type defined in ITU X.680:2015.
- Support for the `RELATIVE-OID-IRI` data type defined in ITU X.680:2015.

### Changed :sweat_drops:

- :warning: Use `Uint8ClampedArray` to represent `BIT STRING`.
- `encode()` now encodes `Uint8ClampedArray` as a `BIT STRING`.
- Made `TypeIdentifier` a `default` export. (It should have been in the first place.)

### Removed :boom:

- `ASN1Element.decodeBigEndianUnsignedInteger()`
- `ASN1Element.decodeBigEndianSignedInteger()`
