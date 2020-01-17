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

- [x] Encode `REAL` in Base-2 format in the DER encoder, because X.509 forbids base-10 encoding.
- [x] Macros, like `OPTIONAL<T>`
- [x] Encode a `Set` of elements as `SET`
- [ ] Implement these codecs:
  - [ ] Octet Encoding Rules (This is used by Simple Transportation Management Protocol (STMP) and DATEX-ASN.)
    - [x] Add `TIME` types
      - [x] `YEAR-ENCODING`
      - [x] `YEAR-MONTH-ENCODING`
      - [x] `DATE-ENCODING`
      - [x] `HOURS-ENCODING`
      - [x] `HOURS-DIFF-ENCODING`
      - [x] `HOURS-MINUTES-ENCODING`
      - [x] `HOURS-MINUTES-DIFF-ENCODING`
      - [x] `TIME-OF-DAY-ENCODING`
      - [x] `TIME-OF-DAY-DIFF-ENCODING`
      - [x] `TIME-OF-DAY-FRACTION-ENCODING`
      - [x] `TIME-OF-DAY-FRACTION-DIFF-ENCODING`
      - [x] `DURATION-INTERVAL-ENCODING`
  - [ ] Canonical Octet Encoding Rules
  - [ ] NTCIP Encoding Rules (This is used by Simple Transportation Management Protocol (STMP) and DATEX-ASN.)
  - [ ] JSON Encoding Rules (May require changes to ASN1Element, or a separate element.)
  - [x] ~~Lightweight Encoding Rules~~ (I cannot find a standard anywhere for this.)
  - [ ] BACNet Encoding Rules? (ISO 16484-5:2017)
  - [ ] Packed Encoding Rules
    - [ ] Basic Aligned Packed Encoding Rules (PER) (This is used by MCS / T.125, which is used by RDP. I believe it is also used by J2735 / DSRC.)
    - [ ] Make a separate RDPER (Remoted Desktop Protocol Encoding Rules)
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
  - [x] ~~Error UUIDs.~~ (Though this would have been better from the start, the benefits of changing to this would be minimal, especially since the errors are not generally actionable in the first place.)
  - [x] Enable `encode()` to encode `BIT STRING`
  - [x] Pass in the offending element into errors.
  - [x] Use `Uint8ClampedArray` to represent `BIT STRING`.
  - [x] Get rid of the codec-specific libraries.
  - [x] Make `TypeIdentifier` a `default` export.
  - [x] Make all functions use the macros instead of native types?
  - [x] Document recommendation of macros.
  - [x] Get rid of TODOs
  - [x] Refactor methods out of `ASN1Element`
  - [ ] Support the new 2015 data types:
    - [x] `TIME`
    - [x] `DATE`
    - [x] `TIME-OF-DAY`
    - [x] `DATE-TIME`
    - [ ] `DURATION` (This will require a sort of "mini-parser.")
    - [x] `OID-IRI`
    - [x] `RELATIVE-OID-IRI`
    - [ ] Add validation
  - [ ] `openType` accessor (because X.696 requires a length determinant on all open types.)

## See Also

* [X.680 - Abstract Syntax Notation One (ASN.1)](https://www.itu.int/rec/T-REC-X.680/en), published by the
[International Telecommunications Union](https://www.itu.int/en/pages/default.aspx).
* [X.690 - BER, CER, and DER](https://www.itu.int/rec/T-REC-X.690/en), published by the
[International Telecommunications Union](https://www.itu.int/en/pages/default.aspx).
* [X.691 - Packed Encoding Rules](https://www.itu.int/rec/T-REC-X.691-201508-I/en).
* [ASN.1: Communication Between Heterogeneous Systems](https://www.oss.com/asn1/resources/books-whitepapers-pubs/dubuisson-asn1-book.PDF) by Olivier Dubuisson
