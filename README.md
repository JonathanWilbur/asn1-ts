# ASN.1 TypeScript Library

Feature-complete, specification-compliant TypeScript library for encoding and
decoding ASN.1 data structures using the Basic Encoding Rules (BER),
Canonical Encoding Rules (CER), and Distinguished Encoding Rules (DER).

Install via `npm install asn1-ts`.

**Table of Contents**

- [Library Usage](#library-usage)
  - [Data Types](#data-types)
  - [Encoding and Decoding](#encoding-and-decoding)
  - [Error Handling](#error-handling)
  - [BIT STRING](#bit-string)
  - [OBJECT IDENTIFIER](#object-identifier)
- [Building](#building)
- [See Also](#see-also)

## Library Usage

### Data Types

In this library, all ASN.1 data types are represented as aliases to TypeScript /
JavaScript types in `source/macros.ts`. For your convenience these aliases are
copied here:

```typescript
export type OPTIONAL<T> = T | undefined;
export type BOOLEAN = boolean;
export type INTEGER = number | bigint;
export type BIT_STRING = Uint8ClampedArray;
export type OCTET_STRING = Uint8Array;
export type NULL = null;
export type OBJECT_IDENTIFIER = ObjectIdentifier;
export type ObjectDescriptor = string;
export type EXTERNAL = External;
export type REAL = number;
export type INSTANCE_OF = External;
export type ENUMERATED = number;
export type EMBEDDED_PDV = EmbeddedPDV;
export type UTF8String = string;
export type RELATIVE_OID = number[];
export type SEQUENCE<T> = T[];
export type SEQUENCE_OF<T> = T[];
export type SET<T> = T[];
export type SET_OF<T> = T[];
export type GraphicString = string;
export type NumericString = string;
export type VisibleString = string;
export type PrintableString = string;
export type ISO646String = string;
export type TeletexString = Uint8Array;
export type GeneralString = string;
export type T61String = Uint8Array;
export type UniversalString = string;
export type VideotexString = Uint8Array;
export type BMPString = string;
export type IA5String = string;
// export type CharacterString = CharacterString;
export { default as CharacterString } from "./types/CharacterString";
export type UTCTime = Date;
export type GeneralizedTime = Date;
export type TIME = string;
export type DATE = Date;
export type TIME_OF_DAY = Date;
export type DATE_TIME = Date;
export type DURATION = DURATION_EQUIVALENT;
export type OID_IRI = string;
export type RELATIVE_OID_IRI = string;
```

Native ASN.1 types that don't have an obvious corollary to a native JavaScript
type have an implementation in the `types` folder. This includes these types:

- `OBJECT IDENTIFIER`, implemented as `ObjectIdentifier`
- `EXTERNAL`, implemented as `External`
- `EMBEDDED PDV`, implemented as `EmbeddedPDV`
- `CHARACTER STRING`, implemented as `CharacterString`

The `TYPE-IDENTIFIER` object class is implemented as `TypeIdentifier`. There are
also implementation of all of the structured time types specified in the ITU
Recommendation X.696 in `types/time`.

### Encoding and Decoding

For each codec in the library, usage entails instantiating the class,
then using that class' properties to get and set the encoded value.
For all classes, the empty constructor creates an `END OF CONTENT`
element. The remaining constructors will be codec-specific.

Here is a TypeScript example of encoding with Basic Encoding Rules, using the
`BERElement` class.

```typescript
let el: BERElement = new BERElement();
el.tagClass = ASN1TagClass.universal; // Not technically necessary.
el.construction = ASN1Construction.primitive; // Not technically necessary.
el.tagNumber = ASN1UniversalType.integer;
el.integer = 1433; // Now the data is encoded.
console.log(el.integer); // Logs '1433'
```

... and here is how you would decode that same element:

```typescript
const encodedData: Uint8Array = el.toBytes();
const el2: BERElement = new BERElement();
el2.fromBytes(encodedData);
console.log(el2.integer); // Logs 1433
```

Tests under the `test` directory can also serve as examples.

In this library, you can use the Basic Encoding Rules, Canonical Encoding Rules,
and Distinguished Encoding Rules via the `BERElement`, `CERElement`, and
`DERElement` classes respectively. You should use `DERElement` for anything that
will be cryptographically signed or hashed.

The tag class can be read and written via the `tagClass` property using the
`ASN1TagClass` enum. The construction (whether it is constructed or primitive)
of the element can be read and written via the `construction` property using the
`ASN1Construction` enum. The tag number can be set using the `tagNumber`
property. For your convenience, the `ASN1UniveralType` enum contains the tag
numbers of the `UNIVERSAL` tags by the data type.

Generic "bytes" are represented with the `Buffer` class. You can convert ASN.1
elements to and from bytes using `toBytes()` and `fromBytes()`. `fromBytes()`
returns an integer indicating the number of bytes read from the `Uint8Array`.
Here is an example of how you would decode multiple back-to-back encoded ASN.1
elements from a buffer:

```typescript
const encodedElements: BERElement[] = [];
let i: number = 0;
while (i < value.length) {
    const next: BERElement = new BERElement();
    i += next.fromBytes(value.slice(i));
    encodedElements.push(next);
}
```

Here are the properties available for you to get and set ASN.1 values:

```typescript
set boolean (value: BOOLEAN);
get boolean (): BOOLEAN;
set integer (value: INTEGER);
get integer (): INTEGER;
set bitString (value: BIT_STRING);
get bitString (): BIT_STRING;
set octetString (value: OCTET_STRING);
get octetString (): OCTET_STRING;
set objectIdentifier (value: OBJECT_IDENTIFIER);
get objectIdentifier (): OBJECT_IDENTIFIER;
set objectDescriptor (value: ObjectDescriptor);
get objectDescriptor (): ObjectDescriptor;
set external (value: EXTERNAL);
get external (): EXTERNAL;
set real (value: REAL);
get real (): REAL;
set enumerated (value: ENUMERATED);
get enumerated (): ENUMERATED;
set embeddedPDV (value: EMBEDDED_PDV);
get embeddedPDV (): EMBEDDED_PDV;
set utf8String (value: UTF8String);
get utf8String (): UTF8String;
set relativeObjectIdentifier (value: RELATIVE_OID);
get relativeObjectIdentifier (): RELATIVE_OID;
set time (value: TIME);
get time (): TIME;
set sequence (value: SEQUENCE<ASN1Element>);
get sequence (): SEQUENCE<ASN1Element>;
set set (value: SET<ASN1Element>);
get set (): SET<ASN1Element>;
set numericString (value: NumericString);
get numericString (): NumericString;
set printableString (value: PrintableString);
get printableString (): PrintableString;
set teletexString (value: TeletexString);
get teletexString (): TeletexString;
set videotexString (value: VideotexString);
get videotexString (): VideotexString;
set ia5String (value: IA5String);
get ia5String (): IA5String;
set utcTime (value: UTCTime);
get utcTime (): UTCTime;
set generalizedTime (value: GeneralizedTime);
get generalizedTime (): GeneralizedTime;
set graphicString (value: GraphicString);
get graphicString (): GraphicString;
set visibleString (value: VisibleString);
get visibleString (): VisibleString;
set generalString (value: GeneralString);
get generalString (): GeneralString;
set universalString (value: UniversalString);
get universalString (): UniversalString;
set characterString (value: CharacterString);
get characterString (): CharacterString;
set bmpString (value: BMPString);
get bmpString (): BMPString;
set date (value: DATE);
get date (): DATE;
set timeOfDay (value: TIME_OF_DAY);
get timeOfDay (): TIME_OF_DAY;
set dateTime (value: DATE_TIME);
get dateTime (): DATE_TIME;
set duration (value: DURATION);
get duration (): DURATION;
set oidIRI (value: OID_IRI);
get oidIRI (): OID_IRI;
set relativeOIDIRI (value: RELATIVE_OID_IRI);
get relativeOIDIRI (): RELATIVE_OID_IRI;
```

There are shorthand equivalents of the getters and setters above (created to
make source files more concise), but these will be removed in a future version.

ASN.1 elements (`BERElement`, `CERElement`, and `DERElement`) support the
`toString()` and `toJSON()` properties. **In general**, `toString()` encodes the
elements according to how their values would be represented in an ASN.1 file.
**In general**, `toJSON()` encodes the elements according to the JSON Encoding
Rules (JER).

Finally, there are functional equivalents of the codecs above in `functional.ts`
such as `_decodeUTF8String`. These will not be documented (for now). They were
implemented to support [Wildboar Software](https://wildboarsoftware.com/en)'s
[ASN.1 Compiler](https://wildboarsoftware.com/en/asn1-compilation). You can look
at the source code for the NPM package `@wildboar/x500` for an example for how
it works.

### Error Handling

This library throws a few subtypes of `ASN1Error`, which is a subtype of
`Error`. These are:

- `ASN1NotImplementedError`, which is thrown when some functionality of this
  library is not implemented.
- `ASN1RecursionError`, which is thrown when an ASN.1 element is too deeply
  constructed (e.g. a string is encoded on a construction of constructions of
  constructions, etc.).
- `ASN1TruncationError`, which is thrown when the ASN.1 element was too short.
  This error may be thrown when you are receiving encoded ASN.1 elements over a
  network and you simply have not received the complete encoding yet. For this
  reason, if you are reading ASN.1 elements from a network buffer, you may have
  to catch this error and just wait for more data to come in.
- `ASN1OverflowError`, which is thrown when an encoded data type, such as an
  `INTEGER` or an arc of an `OBJECT IDENTIFIER` encodes such a large value that
  this library cannot encode or decode it.
- `ASN1SizeError`, which is thrown when a value is encoded on an incorrect
  number of bytes. This can happen with a `UNIVERSAL` type is encoded on a wrong
  number of bytes (such as a `BOOLEAN` being encoded on more than one byte), or
  it can be thrown by third-party libraries when a `SIZE` constraint is
  violated.
- `ASN1PaddingError`, which is thrown when an encoded value has prohibited
  padding bytes. For instance, in the Basic Encoding Rules encoding of an
  `INTEGER`, the integer must be encoded on the minimum number of octets
  possible; any encoding containing more than the minimum would throw this
  error.
- `ASN1UndefinedError`, which is thrown when some encoding is not defined, such
  as an unrecognized encoding for a `REAL` value.
- `ASN1CharactersError`, which is thrown when a string contains a character that
  is prohibited for that string type.
- `ASN1ConstructionError`, which is thrown when the construction of an ASN.1
  element is incorrect, such as an `INTEGER` being "constructed." This may also
  be thrown by third-party libraries when a `SEQUENCE` is constructed of an
  invalid sequence of elements.

### BIT STRING

In this library, `BIT STRING` is represented by a `Uint8ClampedArray`. Set bits
are represented by a value of `1` and unset bits are represented by a value of
`0`. To "pack" these bytes into bytes, you can use `packBits`, and to reverse
this, you can use `unpackBits`. Note that this does not include the "unused
bits" prefix that the `BIT STRING` requires; `packBits` and `unpackBits` are
only responsible for packing eight bits into a byte, and the reverse,
respectively.

### OBJECT IDENTIFIER

`OBJECT IDENTIFIER` is represented as objects of the `ObjectIdentifier` class.

You can encode and decode object identifiers to and from their dot-delimited
string representations (e.g. `2.5.4.3`) using `toString()` and
`ObjectIdentifier.fromString()` (the latter is a static method.)

## Building

You can build this library by running `npm run build`.
The outputs will all be in `dist`. `dist/node/index.js` is the root for usage in
NodeJS.

## See Also

- [Libraries that use `asn1-ts`](https://github.com/Wildboar-Software/asn1-typescript-libraries)
- [Meerkat DSA](https://wildboar-software.github.io/directory/), an application
  that uses `asn1-ts`.
* [X.680 - Abstract Syntax Notation One (ASN.1)](https://www.itu.int/rec/T-REC-X.680/en)
* [X.690 - BER, CER, and DER](https://www.itu.int/rec/T-REC-X.690/en)
* [ASN.1: Communication Between Heterogeneous Systems](https://www.oss.com/asn1/resources/books-whitepapers-pubs/dubuisson-asn1-book.PDF) by Olivier Dubuisson
