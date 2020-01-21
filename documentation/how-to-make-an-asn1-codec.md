# How to make an ASN.1 codec

## Notes

- I do not know how `VisibleString` differs from `GraphicString`

## Categories of ASN.1 Codecs

From experience, I have found that there are broadly two categories of ASN.1
codecs: dynamically sized and statically sized. The popular BER, CER, and DER
specified in ITU X.690 are dynamically sized, which means that all serialized
data structures can be decoded without reading tags and that the decoding of
serialized data structures does not have to be "hard-coded," because there is
a length indicator associated with each element.

Encoding rules like PER and OER, however, do not _always_ use length indicators
with each element, and hence, the exact length of serialized elements must be--at
least sometime--known in advance.

The code used to decipher these differs wildly. Because of the
code-intelligible length encoding of dynamically-sized elements, these elements
can be broken in advance into separate chunks of bytes in the same way that
the HTML Document Object Model can return the inner contents of an HTML element
with `innerHTML()`.

With statically-sized decoding, the functions used to
decode elements must be given the _full stream of bytes_ in its entirety, and
the function must either read a fixed number of bytes from it, or use some
other rule for determining the number of bytes used in the element, such as
reading bytes until the most significant bit is unset, or reading a leading
unsigned integer that encodes the length. More concretely, the code for a
statically-sized decoder looks very imperative: "read this, then that, then
that." Each step of this process will have to return the number of bytes
that were read so the next decoding function can know where to start in the
byte stream. This is one of the key practical differences between statically
and dynamically sized codecs.

## Procedures for a Dynamically-sized Codec

- Make functions to parse base-128 unsigned integers (For the tag number)
- Make functions to decode both signed and unsigned big-endian integers
- Make the constructor
- `BOOLEAN`
  - Implement this before `SEQUENCE` or `SET` so you have one data type to
    test with.
- `SEQUENCE` and `SET`
  - Both will use the same code.
- `INTEGER`
- Reuse the `INTEGER` code in `ENUMERATED`
- `RELATIVE OID`
- Reuse the code from `RELATIVE OID` for `OBJECT IDENTIFIER`
- `NULL`
- `BIT STRING`
- `REAL`
- Create a `deconstruct()` method
  - This assembles the fragments of a string as an octet stream if it is
    constructed, or just returns the primitively-encoded octet stream if
    it is primitively-encoded.
- `OCTET STRING`
  - Do not mention `OCTET STRING` in any exception messages. This code should
    be kept generic enough to be reused by all other string types.
  - Make sure your code can recursively assemble a complete `OCTET STRING` from
    subelements if it is constructed-encoded.
  - Use some kind of recursion count to prevent infinite recursion bugs.
- Reuse the `OCTET STRING` code in all string types
  - Use the `OCTET STRING` accessor to assemble constructed strings, then
    perform the necessary validation on that. This will immensely cut down
    on code duplication, since most types support either primitive or
    constructed encoding.
  - Also, `UTCTime` and `GeneralizedTime` support constructed encoding, but
    validation cannot typically be done until the entire string is assembled,
    thereby necessitating this pattern.
    - It is also typically useful to create a string type, so you can seed
      test values by using `BERElement.utf8String = "20181231223344Z"`, for
      example, rather than manually writing out bytes.
- `BMPString`
- Reuse the code from `BMPString` to implement the similar `UniversalString`
- Implement `EXTERNAL`
- Reuse the code from `EXTERNAL` to implement the similar `EmbeddedPDV` and `CharacterString`.
