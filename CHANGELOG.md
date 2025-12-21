# Changelog

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
