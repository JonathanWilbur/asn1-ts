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

## Why Use This Library?

I believe this library is the first **complete** implementation of ASN.1,
meaning that it implements **all** data types defined in the specification,
and encodes and decodes **exactly** as specified.

I have never seen any implementation of ASN.1 elsewhere that supports all
data types; in fact, most just implement the ten or so most common types.
Several implementations I have seen do not support things that
are supported by the specification, such as constructed strings.

This library is **fully compliant to the specification**. If I am wrong,
please write up an issue and I will correct it.

## Why Not Use This Library?

This library is meant to be **fully compliant to the specification**, not
lightweight. If you need a web application that encodes and decodes very simple
ASN.1 data and loads lightning-fast, this may not be the library for you.

## Building

You can build this library by running `npm run build`.
The outputs will all be in `dist`.

- `dist/index.js` is the root for usage in NodeJS.
- `dist/asn1.min.js` is the entire ASN.1 library for the web browser, which is
  minified, and accessible under the variable `asn1`.

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

In this library, you can use the Basic Encoding Rules, Canonical Encoding Rules,
and Distinguished Encoding Rules via the `BERElement`, `CERElement`, and
`DERElement` classes respectively. You should use `DERElement` for anything that
will be cryptographically signed or hashed.

## Future Development

- [x] Implement a function for ITU X.690, Section 11.6.
- [ ] Implement these codecs:
  - [ ] Octet Encoding Rules (This is used by Simple Transportation Management Protocol (STMP) and DATEX-ASN.)
  - [ ] Canonical Octet Encoding Rules
  - [ ] NTCIP Encoding Rules (This is used by Simple Transportation Management Protocol (STMP) and DATEX-ASN.)
  - [ ] JSON Encoding Rules (May require changes to ASN1Element, or a separate element.)
  - [x] ~~Lightweight Encoding Rules~~ (I cannot find a standard anywhere for this.)
  - [ ] BACNet Encoding Rules
  - [ ] Packed Encoding Rules
    - [ ] Basic Aligned Packed Encoding Rules (PER) (This is used by MCS / T.125, which is used by RDP. I believe it is also used by J2735 / DSRC.)
    - [ ] Make a separate RDPER (Remoted Desktop Protocol Encoding Rules)
    - [ ] Basic Unaligned Packed Encoding Rules (UPER) (May require changes to ASN1Element) (Used by 3GPP RRC)
    - [ ] Canonical Aligned Packed Encoding Rules (CPER)
    - [ ] Canonical Unaligned Packed Encoding Rules (CUPER) (May require changes to ASN1Element)
- [ ] Internationalized strings
- [x] ~~Serverless Functions~~ (May be done in a different repo.)

## See Also

* [X.680 - Abstract Syntax Notation One (ASN.1)](https://www.itu.int/rec/T-REC-X.680/en)
* [X.690 - BER, CER, and DER](https://www.itu.int/rec/T-REC-X.690/en)
* [X.691 - Packed Encoding Rules](https://www.itu.int/rec/T-REC-X.691-201508-I/en)
* [X.693 - XML Encoding Rules](https://www.itu.int/rec/T-REC-X.693/en)
* [X.696 - Octet Encoding Rules](https://www.itu.int/rec/T-REC-X.696-201508-I/en)
* [X.697 - JSON Encoding Rules](https://www.itu.int/rec/T-REC-X.697-201710-I/en)
* [ISO 16484-5:2017 - BACNet Encoding Rules](https://www.iso.org/standard/71935.html)
* [NTCIP 1102:2004 - Octet Encoding Rules (OER) Base Protocol](https://www.nema.org/Standards/Pages/Octet-Encoding-Rules-Base-Protocol.aspx)
* [ASN.1: Communication Between Heterogeneous Systems](https://www.oss.com/asn1/resources/books-whitepapers-pubs/dubuisson-asn1-book.PDF) by Olivier Dubuisson
