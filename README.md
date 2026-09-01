# ASN.1 TypeScript Library

[![JSR](https://jsr.io/badges/@wildboar/asn1)](https://jsr.io/@wildboar/asn1)

Feature-complete, specification-compliant TypeScript library for encoding and
decoding ASN.1 data structures using the Basic Encoding Rules (BER),
Canonical Encoding Rules (CER), and Distinguished Encoding Rules (DER).

This library is published on both
[npmjs.com](https://www.npmjs.com/package/asn1-ts) and on
[jsr.io](https://jsr.io/@wildboar/asn1). You can install it via
`npm install asn1-ts` or `npx jsr add @wildboar/asn1`. As of version 9.0.0 and
above, this library is ESM only: no more CommonJS. There are no runtime
dependencies. It is licensed under the MIT License.

This library should work on NodeJS, Bun, and Deno, and it should compile with
any reasonably new TypeScript version. If it does not work for you in these
cases, please let me know!

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
JavaScript types in `source/macros.mts`. For your convenience these aliases are
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
export { default as CharacterString } from "./types/CharacterString.mjs";
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

`INTEGER` is `number | bigint`. Use `bigint` for values that do not fit in a
JavaScript safe integer; getters return `bigint` in that case as well.

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
import {
    ASN1Construction,
    ASN1TagClass,
    ASN1UniversalType,
    BERElement,
    DERElement,
    ObjectIdentifier,
} from "asn1-ts";

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
property. For your convenience, the `ASN1UniversalType` enum contains the tag
numbers of the `UNIVERSAL` tags by the data type.

Encoded values are `Uint8Array`s. You can convert ASN.1 elements to and from
bytes using `toBytes()` and `fromBytes()`. `fromBytes()` returns an integer
indicating the number of bytes read from the `Uint8Array`. Here is an example
of how you would decode multiple back-to-back encoded ASN.1 elements:

```typescript
const encodedElements: BERElement[] = [];
let i: number = 0;
while (i < value.length) {
    const next: BERElement = new BERElement();
    i += next.fromBytes(value.slice(i));
    encodedElements.push(next);
}
```

Most structured values are `SEQUENCE` or `SET`. `fromSequence` and `fromSet`
build those from child elements; `null` and `undefined` children are omitted,
which is how `OPTIONAL` fields are left out. Read children back with the
`sequence` and `set` accessors.

```typescript
const seq = DERElement.fromSequence([
    new DERElement(
        ASN1TagClass.universal,
        ASN1Construction.primitive,
        ASN1UniversalType.integer,
        1433,
    ),
    undefined, // omitted OPTIONAL
]);
console.log(seq.sequence[0].integer); // Logs 1433
```

IMPLICIT tagging is a context-specific (or application / private) tag on the
value itself. EXPLICIT tagging wraps another element; use the `inner` accessor.

```typescript
// IMPLICIT INTEGER [0]
const implicit = new DERElement();
implicit.tagClass = ASN1TagClass.context;
implicit.tagNumber = 0;
implicit.integer = 1433;

// EXPLICIT INTEGER [0]
const inner = new DERElement();
inner.tagNumber = ASN1UniversalType.integer;
inner.integer = 1433;
const explicit = new DERElement();
explicit.tagClass = ASN1TagClass.context;
explicit.tagNumber = 0;
explicit.inner = inner;
console.log(explicit.inner.integer); // Logs 1433
```

Value accessors are named after the ASN.1 type (`boolean`, `integer`,
`bitString`, `octetString`, `objectIdentifier`, `utf8String`, `sequence`,
`set`, `utcTime`, and so on). There are shorthand equivalents of those getters
and setters (created to make source files more concise), but these will be
removed in a future version.

ASN.1 elements (`BERElement`, `CERElement`, and `DERElement`) support the
`toString()` and `toJSON()` methods. **In general**, `toString()` encodes the
elements according to how their values would be represented in an ASN.1 file.
**In general**, `toJSON()` encodes the elements according to the JSON Encoding
Rules (JER).

Finally, there are functional equivalents of the codecs above in
`asn1-ts/functional` (for example `_decodeUTF8String`). These will not be
documented (for now). They were implemented to support
[Wildboar Software](https://wildboarsoftware.com/en)'s
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
`ObjectIdentifier.fromString()` (the latter is a static method.) You can also
construct them from arcs (as `number`s) or from arcs and a prefix using
`fromParts`.

An overview:

- `byteLength()` - Get the length of the encoded OID in bytes.
- `toBytes()` - Encode the OID onto bytes. This copies into a new `Uint8Array`
  which is safe to mutate.
- `toBytesUnsafe()` - Obtain the OID's internal bytes. Mutating these bytes
  results in undefined behavior, but this is zero-copy, so it is an order of
  magnitude faster. Only for use by smart bois.
- `dotDelimitedNotation` (getter) - Get the OID as a dot-delimited string (e.g. `2.5.4.3`)
- `asn1Notation` (getter) - Get the OID as ASN.1 notation (e.g. `{ 2 5 4 3 }`)
- `fromString(string)` (static) - Construct from a dot-delimited numeric string
- `fromBytes(Uint8Array)` (static) - Construct from BER / DER encoding (content octets only)
- `fromBytesUnsafe(Uint8Array)` (static) - Same as `fromBytes` but no validation.
  Less safe, but faster.
- `isEqualTo(ObjectIdentifier)` - Compare two OIDs, returning `true` if same.
- `toString()` - Convert this OID to a dot-delimited string (e.g. `2.5.4.3`)
- `toJSON()` - Convert this OID to a dot-delimited string (e.g. `2.5.4.3`)

There are now some functions in `ObjectIdentifier` for handling large arcs:

- `(static) fromStringWithBigArcs(s: string)` - Can parse strings with huge
  arcs, but at the expense of performance.
- `nodesBigAndSmall` (getter) - Get arcs as `(number | bigint)[]`. Comes at the expense of
  performance. Use `nodes`, which returns `number[]` unless you need this.

### TIME Types

ITU-T Recommendation X.696 defines several `SEQUENCE` types that describe how
various `TIME` subtypes are encoded according to the Octet Encoding Rules (OER).
These types are defined as `class` types and exported from this module. Almost
all of them have `toString()` and `fromString()` implemented, which generally
displays and parses them to and from ISO 8601 strings. They don't do much else.

These types are:

- `HOURS_MINUTES_ENCODING`
- `YEAR_ENCODING`
- `HOURS_DIFF_ENCODING`
- `DURATION_EQUIVALENT`
- `TIME_OF_DAY_FRACTION_ENCODING`
- `TIME_OF_DAY_DIFF_ENCODING`
- `DURATION_INTERVAL_ENCODING`
- `DATE_ENCODING`
- `HOURS_ENCODING`
- `YEAR_MONTH_ENCODING`
- `HOURS_MINUTES_DIFF_ENCODING`
- `TIME_OF_DAY_FRACTION_DIFF_ENCODING`
- `TIME_OF_DAY_ENCODING`

## Building

You can build this library by running `npm run build`.
The outputs will all be in `dist`. The public entry is `dist/index.mjs`;
`asn1-ts/functional` maps to `dist/functional.mjs`.

## Other Types

This package defines types `CharacterString`, `EmbeddedPDV`, and `External`,
which don't really have much functionality other than `toString()` and `toJSON()`.

## AI Usage Statement

The vast majority of code in this package was written by a human, but AI re-wrote
some functions to improve performance, and added unit tests and benchmarks. A
small amount of Cursor's tab completion AI contributed to this codebase.

The code that is written by AI is not blindly trusted. I review it with as much
scrutiny as I would apply to a human's code. You can see for yourself in this
repository's PR history.

## See Also

- [Libraries that use `asn1-ts`](https://github.com/Wildboar-Software/asn1-typescript-libraries)
- [Meerkat DSA](https://wildboar-software.github.io/directory/), an X.500
  directory server that uses `asn1-ts`.
* [X.680 - Abstract Syntax Notation One (ASN.1)](https://www.itu.int/rec/T-REC-X.680/en)
* [X.690 - BER, CER, and DER](https://www.itu.int/rec/T-REC-X.690/en)
* [ASN.1: Communication Between Heterogeneous Systems](https://www.oss.com/asn1/resources/books-whitepapers-pubs/dubuisson-asn1-book.PDF) by Olivier Dubuisson
