# ASN.1 TypeScript Library

* Author: [Jonathan M. Wilbur](https://jonathan.wilbur.space) <[jonathan@wilbur.space](mailto:jonathan@wilbur.space)>
* Copyright Year: 2019
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

## Why ASN.1?

ASN.1 is used in, or required by, multiple technologies, including:

* [X.509 Certificates](https://www.itu.int/rec/T-REC-X.509-201610-I/en), used in [SSL/TLS](https://tools.ietf.org/html/rfc5246)
* [Lightweight Directory Access Protocol (LDAP)](https://www.ietf.org/rfc/rfc4511.txt)
* [X.400](https://www.itu.int/rec/T-REC-X.400/en), the messaging system used by the U.S. Military
* [X.500](https://www.itu.int/rec/T-REC-X.500-201610-I/en)
* The [magnetic stripes](https://www.iso.org/standard/43317.html) on credit cards and debit cards
* Microsoft's [Remote Desktop Protocol (RDP)](https://msdn.microsoft.com/en-us/library/mt242409.aspx)
* [Simple Network Management Protocol (SNMP)](https://www.ietf.org/rfc/rfc1157.txt)
* [Common Management Information Protocol (CMIP)](https://www.itu.int/rec/T-REC-X.711/en)
* [Signalling System Number 7 (SS7)](https://www.itu.int/rec/T-REC-Q.700-199303-I/en),
  used to make most phone calls on the Public Switched Telephone Network (PSTN).
* [Kerberos 5](https://tools.ietf.org/html/rfc4120)
* [H.323](https://www.itu.int/rec/T-REC-H.323-200912-I/en) Video conferencing
* Biometrics Protocols:
  * [BioAPI Interworking Protocol (BIP)](https://www.iso.org/standard/43611.html)
  * [Common Biometric Exchange Formats Framework (CBEFF)](http://nvlpubs.nist.gov/nistpubs/Legacy/IR/nistir6529-a.pdf)
  * [Authentication Contexts for Biometrics (ACBio)](https://www.iso.org/standard/41531.html)
* [Computer Supported Telecommunications Applications (CSTA)](https://www.ecma-international.org/activities/Communications/TG11/cstaIII.htm)
* [Dedicated Short Range Communications (SAE J2735)](http://standards.sae.org/j2735_200911/)
* Cellular telephony:
  * [Global System for Mobile Communications (GSM)](http://www.ttfn.net/techno/smartcards/gsm11-11.pdf)
  * [Global Packet Radio Service (GPRS) / Enhanced Data Rates for Global Evolution (EDGE)](http://www.3gpp.org/technologies/keywords-acronyms/102-gprs-edge)
  * [Universal Mobile Telecommunications System (UTMS)](http://www.3gpp.org/DynaReport/25-series.htm)
  * [Long-Term Evolution (LTE)](http://www.3gpp.org/technologies/keywords-acronyms/98-lte)

If you look in the
[`asn1` directory of WireShark's source code](https://github.com/wireshark/wireshark/tree/master/epan/dissectors/asn1),
you'll see all of the protocols that use ASN.1.

This list can also be found in `documentation/asn1.md`.

## Building

You can build this library by running `npm run build`.
The outputs will all be in `dist`. `dist/asn1.min.js` is the entire ASN.1
library for the web browser, which is minified, and accessible under the
variable `asn1`.

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

## See Also

* [X.680 - Abstract Syntax Notation One (ASN.1)](https://www.itu.int/rec/T-REC-X.680/en), published by the
[International Telecommunications Union](https://www.itu.int/en/pages/default.aspx).
* [X.690 - ASN.1 encoding rules](https://www.itu.int/rec/T-REC-X.690/en), published by the
[International Telecommunications Union](https://www.itu.int/en/pages/default.aspx).
* [ASN.1: Communication Between Heterogeneous Systems](https://www.oss.com/asn1/resources/books-whitepapers-pubs/dubuisson-asn1-book.PDF) by Olivier Dubuisson
