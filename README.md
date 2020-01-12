# ASN.1 TypeScript Library

* Author: [Jonathan M. Wilbur](https://github.com/JonathanWilbur) <[jonathan@wilbur.space](mailto:jonathan@wilbur.space)>
* Copyright Year: 2020
* License: [MIT License](https://mit-license.org/)

This library was based off of my [D ASN.1 Library](https://github.com/JonathanWilbur/asn1-d).

## What is ASN.1?

ASN.1 stands for *Abstract Syntax Notation*. ASN.1 was first specified in
[X.680 - Abstract Syntax Notation One (ASN.1)](https://www.itu.int/rec/T-REC-X.680/en),
by the [International Telecommunications Union](https://www.itu.int/en/pages/default.aspx).
ASN.1 messages can be encoded in one of several encoding/decoding standards.
It provides a system of types that are extensible, and can presumably describe
every protocol. You can think of it as a protocol for describing other protocols
as well as a family of standards for encoding and decoding said protocols.
It is similar to Google's [Protocol Buffers](https://developers.google.com/protocol-buffers/),
or Sun Microsystems' [External Data Representation (XDR)](https://tools.ietf.org/html/rfc1014).

For more information on what ASN.1 is, see `documentation/asn1.md`.

## Building

You can build this library by running `npm run build`.
The outputs will all be in `dist`.

- `dist/index.js` is the root for usage in NodeJS.
- `dist/asn1.min.js` is the entire ASN.1 library for the web browser, which is
  minified, and accessible under the variable `asn1`.
- `dist/ber.min.js` is only the Basic Encoding Rules (BER), minified.
- `dist/cer.min.js` is only the Canonical Encoding Rules (CER), minified.
- `dist/der.min.js` is only the Distinguished Encoding Rules (DER), minified.

In many cases, you will only need one set of encoding rules or the other, so it
is recommended to use either `ber.min.js` or `der.min.js` in your web
application instead of `asn1.min.js`.

## Library Usage

For each codec in the library, usage entails instantiating the class,
then using that class' properties to get and set the encoded value.
For all classes, the empty constructor creates an `END OF CONTENT`
element. The remaining constructors will be codec-specific.

Here is a TypeScript example of encoding with Basic Encoding Rules, using the
`BERElement` class.

```typescript
let el : BERElement = new BERElement();
el.typeTag = ASN1UniversalType.integer;
el.integer = 1433; // Now the data is encoded.
console.log(el.integer); // Logs '1433'
```

... and here is how you would decode that same element:

```typescript
let encodedData : Uint8Array = el.toBytes();
let el2 : BERElement = new BERElement();
el2.fromBytes(encodedData);
console.log(el2.integer); // Logs '1433'
```

Tests under the `test` directory can also serve as examples.

## Future Development

- [ ] Encode `REAL` in Base-2 format in the DER encoder, because X.509 forbids base-10 encoding.
- [x] Macros, like `OPTIONAL<T>`
- [x] Encode a `Set` of elements as `SET`
- [ ] Implement these codecs:
  - [ ] Octet Encoding Rules (This is used by Simple Transportation Management Protocol (STMP) and DATEX-ASN.)
    - [x] Generic helpers
      - [x] `encodeBase128`
      - [x] `decodeBase128`
      - [x] `encodeBigEndianSignedInteger`
      - [x] `encodeBigEndianUnsignedInteger`
      - [x] `decodeBigEndianSignedInteger`
      - [x] `decodeBigEndianUnsignedInteger`
      - [x] ~~`encodeSignedInt8`~~ (These turned out to be totally unnecessary.)
      - [x] ~~`encodeSignedInt16`~~ (These turned out to be totally unnecessary.)
      - [x] ~~`encodeSignedInt32`~~ (These turned out to be totally unnecessary.)
      - [x] ~~`encodeSignedInt64`~~ (These turned out to be totally unnecessary.)
      - [x] ~~`encodeUnsignedInt8`~~ (These turned out to be totally unnecessary.)
      - [x] ~~`encodeUnsignedInt16`~~ (These turned out to be totally unnecessary.)
      - [x] ~~`encodeUnsignedInt32`~~ (These turned out to be totally unnecessary.)
      - [x] ~~`encodeUnsignedInt64`~~ (These turned out to be totally unnecessary.)
      - [x] ~~`decodeSignedInt8`~~ (These turned out to be totally unnecessary.)
      - [x] ~~`decodeSignedInt16`~~ (These turned out to be totally unnecessary.)
      - [x] ~~`decodeSignedInt32`~~ (These turned out to be totally unnecessary.)
      - [x] ~~`decodeSignedInt64`~~ (These turned out to be totally unnecessary.)
      - [x] ~~`decodeUnsignedInt8`~~ (These turned out to be totally unnecessary.)
      - [x] ~~`decodeUnsignedInt16`~~ (These turned out to be totally unnecessary.)
      - [x] ~~`decodeUnsignedInt32`~~ (These turned out to be totally unnecessary.)
      - [x] ~~`decodeUnsignedInt64`~~ (These turned out to be totally unnecessary.)
      - [x] `encodeIEEE754SinglePrecisionFloat`
      - [x] `encodeIEEE754DoublePrecisionFloat`
      - [x] `decodeIEEE754SinglePrecisionFloat`
      - [x] `decodeIEEE754DoublePrecisionFloat`
      - [x] `dissectFloat`
      - [x] `encodeX690BinaryRealNumber` (Base always = 0, Mantissa is odd, min octets for M and E.)
      - [x] `encodeX690Base10RealNumber`
      - [x] `decodeX690RealNumber`
      - [x] `packBits`
      - [x] `unpackBits`
  - [ ] Canonical Octet Encoding Rules
  - [ ] NTCIP Encoding Rules
  - [ ] JSON Encoding Rules (May require changes to ASN1Element, or a separate element.)
  - [x] ~~Lightweight Encoding Rules~~ (I cannot find a standard anywhere for this.)
  - [ ] BACNet Encoding Rules? (ISO 16484-5:2017)
  - [ ] Packed Encoding Rules
    - [ ] Basic Aligned Packed Encoding Rules (PER) (This is used by MCS / T.125, which is used by RDP. I believe it is also used by J2735 / DSRC.)
    - [ ] Basic Unaligned Packed Encoding Rules (UPER) (May require changes to ASN1Element) (Used by 3GPP RRC)
    - [ ] Canonical Aligned Packed Encoding Rules (CPER)
    - [ ] Canonical Unaligned Packed Encoding Rules (CUPER) (May require changes to ASN1Element)
- [ ] Internationalized strings.
- [ ] Document mistake of not returning number of bytes read for accessors.
- [ ] Serverless Functions
  - [ ] `ValidateSize`
  - [ ] `ValidateRange`
  - [ ] A function to encode almost every type.
  - [ ] A function to decode almost every type.
  - [ ] All things relating to JSON Encoding Rules.
- [ ] Compatibility-breaking changes
  - [ ] Error UUIDs.
  - [ ] Use the `name` field in errors.
  - [ ] Pass in the offending element into errors.
  - [ ] Use `Uint8ClampedArray` to represent `BIT STRING`.
  - [ ] Get rid of the codec-specific libraries.
  - [ ] Make `TypeIdentifier` a `default` export.
  - [ ] Make all functions use the macros instead of native types?

## See Also

* [X.680 - Abstract Syntax Notation One (ASN.1)](https://www.itu.int/rec/T-REC-X.680/en), published by the
[International Telecommunications Union](https://www.itu.int/en/pages/default.aspx).
* [X.690 - BER, CER, and DER](https://www.itu.int/rec/T-REC-X.690/en), published by the
[International Telecommunications Union](https://www.itu.int/en/pages/default.aspx).
* [X.691 - Packed Encoding Rules](https://www.itu.int/rec/T-REC-X.691-201508-I/en).
* [ASN.1: Communication Between Heterogeneous Systems](https://www.oss.com/asn1/resources/books-whitepapers-pubs/dubuisson-asn1-book.PDF) by Olivier Dubuisson
