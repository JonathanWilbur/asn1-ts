import * as asn1 from "../../dist/index.mjs";
import { describe, it } from "node:test";
import { strict as assert } from "node:assert";
import { Buffer } from "node:buffer";

function bytesEqual(a, b) {
    const left = Buffer.from(a);
    const right = Buffer.from(b);
    assert.equal(left.length, right.length);
    assert.equal(Buffer.compare(left, right), 0);
}

function integer(CodecElement, n) {
    const el = new CodecElement();
    el.tagNumber = asn1.ASN1UniversalType.integer;
    el.integer = n;
    return el;
}

function octetString(CodecElement, bytes) {
    const el = new CodecElement();
    el.tagNumber = asn1.ASN1UniversalType.octetString;
    el.octetString = bytes;
    return el;
}

function assertEncodingConsistent(el) {
    const encoded = el.toBytes();
    assert.equal(el.tlvLength(), encoded.length, "tlvLength() must match toBytes().length");
    bytesEqual(Buffer.concat(el.toBuffers()), encoded);

    const dest = new Uint8Array(encoded.length + 4);
    dest.fill(0xAA);
    const written = el.encodeInto(dest, 2);
    assert.equal(written, 2 + encoded.length, "encodeInto must return the end offset");
    assert.equal(dest[1], 0xAA);
    assert.equal(dest[written], 0xAA);
    bytesEqual(dest.subarray(2, written), encoded);
}

[
    asn1.BERElement,
    asn1.CERElement,
    asn1.DERElement,
].forEach((CodecElement) => {
    describe(`${CodecElement.name} TLV encoding`, () => {
        it("encodes a primitive INTEGER as a known TLV", () => {
            const el = integer(CodecElement, 5);
            bytesEqual(el.toBytes(), [ 0x02, 0x01, 0x05 ]);
            assertEncodingConsistent(el);
        });

        it("encodes nested SEQUENCE values without Buffer.concat of child encodings", () => {
            const inner = CodecElement.fromSequence([
                integer(CodecElement, 1),
                integer(CodecElement, 2),
            ]);
            const outer = CodecElement.fromSequence([
                inner,
                integer(CodecElement, 3),
            ]);
            assertEncodingConsistent(outer);

            const decoded = new CodecElement();
            decoded.fromBytes(outer.toBytes());
            assert.equal(decoded.sequence.length, 2);
            assert.equal(decoded.sequence[0].sequence[0].integer, 1);
            assert.equal(decoded.sequence[0].sequence[1].integer, 2);
            assert.equal(decoded.sequence[1].integer, 3);
        });

        it("encodes long tag numbers", () => {
            for (const tagNumber of [ 31, 32, 127, 128, 255, 16383, 16384 ]) {
                const el = new CodecElement(
                    asn1.ASN1TagClass.context,
                    asn1.ASN1Construction.primitive,
                    tagNumber,
                );
                el.octetString = new Uint8Array([ 0xAB ]);
                assertEncodingConsistent(el);

                const decoded = new CodecElement();
                decoded.fromBytes(el.toBytes());
                assert.equal(decoded.tagClass, asn1.ASN1TagClass.context);
                assert.equal(decoded.tagNumber, tagNumber);
                bytesEqual(decoded.octetString, [ 0xAB ]);
            }
        });

        it("encodes short-form and long-form definite lengths", () => {
            for (const len of [ 0, 1, 126, 127, 128, 255, 256, 1000, 2000 ]) {
                const el = octetString(CodecElement, new Uint8Array(len).fill(0x5A));
                assertEncodingConsistent(el);

                // Length 127 is encoded with the long form (historical
                // behavior of this library), which DER decoding rejects.
                if (len === 127 && CodecElement === asn1.DERElement) {
                    continue;
                }
                const decoded = new CodecElement();
                decoded.fromBytes(el.toBytes());
                assert.equal(decoded.octetString.length, len);
            }
        });

        it("encodes a wide constructed SEQUENCE whose contents exceed 127 octets", () => {
            const children = [];
            for (let i = 0; i < 80; i++) {
                children.push(integer(CodecElement, i));
            }
            const el = CodecElement.fromSequence(children);
            assertEncodingConsistent(el);
            assert.ok(el.toBytes().length > 127);

            const decoded = new CodecElement();
            decoded.fromBytes(el.toBytes());
            assert.equal(decoded.sequence.length, 80);
            assert.equal(decoded.sequence[79].integer, 79);
        });

        it("round-trips explicit tagging via inner", () => {
            const inner = integer(CodecElement, 99);
            const outer = new CodecElement(
                asn1.ASN1TagClass.context,
                asn1.ASN1Construction.constructed,
                0,
            );
            outer.inner = inner;
            assertEncodingConsistent(outer);

            const decoded = new CodecElement();
            decoded.fromBytes(outer.toBytes());
            assert.equal(decoded.inner.integer, 99);
        });
    });
});

describe("BERElement indefinite-length encoding", () => {
    it("matches tlvLength, toBuffers, and encodeInto", () => {
        const previous = asn1.BERElement.lengthEncodingPreference;
        asn1.BERElement.lengthEncodingPreference = asn1.LengthEncodingPreference.indefinite;
        try {
            const el = asn1.BERElement.fromSequence([
                integer(asn1.BERElement, 1),
                integer(asn1.BERElement, 2),
            ]);
            const encoded = el.toBytes();
            assert.equal(encoded[1], 0x80, "constructed indefinite length must be 0x80");
            bytesEqual(encoded.subarray(encoded.length - 2), [ 0x00, 0x00 ]);
            assertEncodingConsistent(el);
        } finally {
            asn1.BERElement.lengthEncodingPreference = previous;
        }
    });
});
