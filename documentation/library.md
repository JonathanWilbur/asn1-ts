# Usage

## Terminology

* This library uses the term "element" to refer to a datum encoded using one of the ASN.1 codecs.
* This library uses the term "mantissa" instead of "significand," because "mantissa" is what's used in the specification.

## Structure

This library begins with `source/asn1.ts`, whose flagship item is `ASN1Element`,
the abstract class from which all other codecs must inherit. An `ASN1Element`
represents a single encoded value (although it could be a single `SEQUENCE`
or `SET`). In the `source/asn1/codecs` directory, you will find all of the codecs that
inherit from `ASN1Element`. The `BERElement` class, for instance, can be found in
`ber.ts`, and it represents a ASN.1 value, encoded via the Basic Encoding Rules
(BER) specified in the
[International Telecommunications Union](https://www.itu.int/en/pages/default.aspx)'s
[X.690 - ASN.1 encoding rules](https://www.itu.int/rec/T-REC-X.690/en).

## Usage

For each codec in the library, usage entails instantiating the class,
then using that class' properties to get and set the encoded value.
For all classes, the empty constructor creates an `END OF CONTENT`
element. The remaining constructors will be codec-specific.

Here is an example of encoding with Basic Encoding Rules, using the
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

Each codec contains accessors and mutators for each ASN.1 data type. Each property
takes or returns the data type you would expect it to return (for instance, the
`integer` property returns a signed integral type), and each property is given
the unabbreviated name of the data type it encodes, with aliases mapping the
abbreviated names to the unabbreviated names. There are a few exceptions:

* Properties do not exist for these types:
  * `END OF CONTENT`
  * `NULL`
  * `EXTERNAL`
  * `EmbeddedPDV`
  * `CharacterString`

### Encoding Selected Types

#### `END OF CONTENT`

Just calling the default constructor produces an `END OF CONTENT` element. For
example:

```typescript
let ber : BERElement = new BERElement();
```

However, you should not need to do this. When you encode data in indefinite-
length form, the codec should append the `END OF CONTENT` octets for you.

#### `ANY`

You just encode any data type like normal, then call `toBytes()`.
The returned value can be inserted where `ANY` goes.

#### `CHOICE`

Mind [CVE-2011-1142](https://nvd.nist.gov/vuln/detail/CVE-2011-1142).

You just encode any data type like normal, then call `toBytes()`.
The returned value can be inserted where `CHOICE` goes.

#### `SET OF`

This is encoded the same way that `SET` is encoded.

#### `SEQUENCE OF`

This is encoded the same way that `SEQUENCE` is encoded.

### Error Handling

At the moment there are only two exceptions: `ASN1Error` and
`ASN1NotImplementedException`, the latter of which means that this library
has something that has not been implemented. Everything else will be an
`ASN1Error`.