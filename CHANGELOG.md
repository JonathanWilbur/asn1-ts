# Changelog

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
