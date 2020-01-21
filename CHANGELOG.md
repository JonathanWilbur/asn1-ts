# Changelog

## [3.0.0] - Unreleased

### Added :seedling:

- Dozens of macros that alias the native types and make the code look and feel more like ASN.1.
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
