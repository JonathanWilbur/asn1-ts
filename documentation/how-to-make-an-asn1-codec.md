# How to make an ASN.1 codec

## Notes

- I do not know how `VisibleString` differs from `GraphicString`

## Procedure

- Make the constructor first
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
- `BMPString`
- Reuse the code from `BMPString` to implement the similar `UniversalString`
- Implement `EXTERNAL`
- Reuse the code from `EXTERNAL` to implement the similar `EmbeddedPDV` and `CharacterString`.