# My Mistakes in Making This Library

## Object-Orientation

The biggest mistake, by far, is not using a functional approach to decoding
serialized data elements. If I had written the decoding logic in functions
that can read data elements from a stream of bytes and return both the
number of bytes read as well as the unmarshalled data as well, I could have
used this _within_ (behind the scenes) of the object-oriented interface.

As a concrete example, a decoding function written in this manner would
look like this:

```typescript
interface ASN1DecodingResult<T> {
    result: T;
    bytesStartIndex: number;
    bytesRead: number;
    error: Error;
}

function decodeInteger (
    bytes: Uint8Array,
    startIndex: number,
    length: number,
): ASN1DecodingResult<number> {
    ///
}

function decodeObjectIdentifier (
    bytes: Uint8Array,
    startIndex: number,
): ASN1DecodingResult<ObjectIdentifier> {
    ///
}
```

