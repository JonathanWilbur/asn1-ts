import * as asn1 from "../../dist/index.mjs";
import {
    ContentOctetChunkCursor,
    ContentOctetByteCursor,
    compareContentOctets,
    compareContentOctetsToBytes,
    compareDirectoryStringChars,
    compareNumericStringDigits,
} from "../../dist/utils/compareEncoded/index.mjs";
import { describe, it } from "node:test";
import { strict as assert } from "node:assert";

const {
    BERElement,
    CERElement,
    DERElement,
    ASN1Construction,
    ASN1UniversalType,
    A_EQUALS_B,
    A_GREATER_THAN_B,
    A_INVALID,
    A_LESS_THAN_B,
    B_INVALID,
} = asn1;

function primitiveOctetString (bytes) {
    const el = new BERElement();
    el.tagNumber = ASN1UniversalType.octetString;
    el.octetString = bytes;
    return el;
}

function constructedFromBytes (tagNumber, tlvBytes) {
    const el = new BERElement();
    el.fromBytes(new Uint8Array([ tagNumber, tlvBytes.length, ...tlvBytes ]));
    return el;
}

describe("ContentOctetChunkCursor", () => {
    it("yields one chunk for a primitive element", () => {
        const el = primitiveOctetString(new Uint8Array([ 0x41, 0x42, 0x43 ]));
        const cursor = new ContentOctetChunkCursor(el);
        const chunks = [];
        let chunk;
        while ((chunk = cursor.nextChunk()) !== undefined) {
            chunks.push(chunk);
        }
        assert.equal(chunks.length, 1);
        assert.deepEqual(chunks[0], new Uint8Array([ 0x41, 0x42, 0x43 ]));
    });

    it("yields multiple chunks for constructed OCTET STRING fragments", () => {
        const data = new Uint8Array([
            0x04, 0x04, 0x01, 0x02, 0x03, 0x04,
            0x04, 0x02, 0x05, 0x06,
            0x04, 0x02, 0x07, 0x08,
        ]);
        const el = constructedFromBytes(0x24, data);
        const cursor = new ContentOctetChunkCursor(el);
        const chunks = [];
        let chunk;
        while ((chunk = cursor.nextChunk()) !== undefined) {
            chunks.push([ ...chunk ]);
        }
        assert.deepEqual(chunks, [
            [ 0x01, 0x02, 0x03, 0x04 ],
            [ 0x05, 0x06 ],
            [ 0x07, 0x08 ],
        ]);
    });

    it("walks nested constructed encodings", () => {
        const data = new Uint8Array([
            0x24, 0x11,
            0x04, 0x04, 0x01, 0x02, 0x03, 0x04,
            0x24, 0x05,
            0x04, 0x03, 0x05, 0x06, 0x07,
            0x04, 0x02, 0x08, 0x09,
        ]);
        const el = constructedFromBytes(0x24, data);
        const bytes = [];
        const cursor = new ContentOctetByteCursor(el);
        let b;
        while ((b = cursor.nextByte()) !== undefined) {
            bytes.push(b);
        }
        assert.deepEqual(bytes, [
            0x01, 0x02, 0x03, 0x04, 0x05, 0x06, 0x07, 0x08, 0x09,
        ]);
    });

    it("throws on invalid fragment tag", () => {
        const data = new Uint8Array([
            0x02, 0x01, 0x2A,
        ]);
        const el = constructedFromBytes(0x24, data);
        const cursor = new ContentOctetChunkCursor(el);
        assert.throws(() => cursor.nextChunk(), asn1.ASN1ConstructionError);
    });
});

describe("compareContentOctets", () => {
    it("returns [matched, A_EQUALS_B] for equal primitive values", () => {
        const a = primitiveOctetString(new Uint8Array([ 0x01, 0x02, 0x03 ]));
        const b = primitiveOctetString(new Uint8Array([ 0x01, 0x02, 0x03 ]));
        assert.deepEqual(compareContentOctets(a, b), [ 3, A_EQUALS_B ]);
    });

    it("returns matched count and ordering sign on mismatch", () => {
        const a = primitiveOctetString(new Uint8Array([ 0x01, 0x02, 0x03 ]));
        const b = primitiveOctetString(new Uint8Array([ 0x01, 0x09, 0x03 ]));
        assert.deepEqual(compareContentOctets(a, b), [ 1, A_LESS_THAN_B ]);
        assert.deepEqual(compareContentOctets(b, a), [ 1, A_GREATER_THAN_B ]);
    });

    it("supports prefix semantics when one value is shorter", () => {
        const a = primitiveOctetString(new Uint8Array([ 0x01, 0x02 ]));
        const b = primitiveOctetString(new Uint8Array([ 0x01, 0x02, 0x03 ]));
        assert.deepEqual(compareContentOctets(a, b), [ 2, A_LESS_THAN_B ]);
        assert.deepEqual(compareContentOctets(b, a), [ 2, A_GREATER_THAN_B ]);
    });

    it("folds ASCII case when requested", () => {
        const a = primitiveOctetString(new Uint8Array([ 0x41, 0x42 ]));
        const b = primitiveOctetString(new Uint8Array([ 0x61, 0x62 ]));
        assert.deepEqual(compareContentOctets(a, b, { asciiCaseFold: true }), [ 2, A_EQUALS_B ]);
        assert.deepEqual(compareContentOctets(a, b, { asciiCaseFold: false }), [ 0, A_LESS_THAN_B ]);
    });

    it("compares against Uint8Array reference bytes", () => {
        const a = primitiveOctetString(new Uint8Array([ 0x48, 0x69 ]));
        assert.deepEqual(compareContentOctetsToBytes(a, new Uint8Array([ 0x48, 0x69 ])), [ 2, A_EQUALS_B ]);
        assert.deepEqual(compareContentOctetsToBytes(a, new Uint8Array([ 0x48 ])), [ 1, A_GREATER_THAN_B ]);
    });

    it("compares constructed BER to primitive with same content", () => {
        const primitive = primitiveOctetString(new Uint8Array([ 0x30, 0x31, 0x32, 0x33 ]));
        const data = new Uint8Array([
            0x04, 0x02, 0x30, 0x31,
            0x04, 0x02, 0x32, 0x33,
        ]);
        const constructed = constructedFromBytes(0x24, data);
        assert.deepEqual(compareContentOctets(primitive, constructed), [ 4, A_EQUALS_B ]);
        assert.equal(primitive.octetMatches(constructed), true);
    });

    it("compares constructed NumericString BER bytes", () => {
        const data = new Uint8Array([
            0x32, 0x12,
            0x04, 0x04, 0x30, 0x31, 0x32, 0x33,
            0x24, 0x04,
            0x04, 0x02, 0x34, 0x35,
            0x04, 0x04, 0x36, 0x37, 0x38, 0x39,
        ]);
        const constructed = new BERElement();
        constructed.fromBytes(data);
        const primitive = new BERElement();
        primitive.numericString = "0123456789";
        assert.equal(constructed.octetMatches(primitive), true);
    });

    it("returns [0, A_EQUALS_B] for equal empty values", () => {
        const a = primitiveOctetString(new Uint8Array(0));
        const b = primitiveOctetString(new Uint8Array(0));
        assert.deepEqual(compareContentOctets(a, b), [ 0, A_EQUALS_B ]);
    });
});

describe("compareDirectoryStringChars", () => {
    function printable (bytes) {
        const el = new BERElement();
        el.printableString = new TextDecoder().decode(bytes);
        return el;
    }

    it("ignores leading and trailing whitespace", () => {
        const a = printable(new Uint8Array([ 0x20, 0x41, 0x42, 0x20 ]));
        const b = printable(new Uint8Array([ 0x41, 0x42 ]));
        assert.deepEqual(compareDirectoryStringChars(a, b), [ 2, A_EQUALS_B ]);
        assert.equal(a.stringMatches(b), true);
    });

    it("collapses internal whitespace", () => {
        const a = printable(new Uint8Array([ 0x41, 0x20, 0x20, 0x42 ]));
        const b = printable(new Uint8Array([ 0x41, 0x20, 0x42 ]));
        assert.deepEqual(compareDirectoryStringChars(a, b), [ 3, A_EQUALS_B ]);
    });

    it("maps TAB and CR to space before collapsing", () => {
        const a = printable(new Uint8Array([ 0x41, 0x09, 0x42 ]));
        const b = printable(new Uint8Array([ 0x41, 0x20, 0x42 ]));
        assert.deepEqual(compareDirectoryStringChars(a, b), [ 3, A_EQUALS_B ]);
    });

    it("skips other control characters", () => {
        const a = printable(new Uint8Array([ 0x41, 0x01, 0x42 ]));
        const b = printable(new Uint8Array([ 0x41, 0x42 ]));
        assert.deepEqual(compareDirectoryStringChars(a, b), [ 2, A_EQUALS_B ]);
    });

    it("folds ASCII case by default", () => {
        const a = printable(new Uint8Array([ 0x41, 0x42 ]));
        const b = printable(new Uint8Array([ 0x61, 0x62 ]));
        assert.deepEqual(compareDirectoryStringChars(a, b), [ 2, A_EQUALS_B ]);
        assert.deepEqual(compareDirectoryStringChars(a, b, { asciiCaseFold: false }), [ 0, A_LESS_THAN_B ]);
    });

    it("compares constructed encoding with split whitespace", () => {
        const data = new Uint8Array([
            0x33, 0x0A,
            0x04, 0x03, 0x41, 0x20, 0x42,
            0x04, 0x03, 0x20, 0x43, 0x44,
        ]);
        const constructed = new BERElement();
        constructed.fromBytes(data);
        const primitive = new BERElement();
        primitive.printableString = "A B CD";
        assert.equal(constructed.stringMatches(primitive), true);
    });
});

describe("compareNumericStringDigits", () => {
    function numeric (text) {
        const el = new BERElement();
        el.numericString = text;
        return el;
    }

    it("ignores spaces and compares digits", () => {
        const a = numeric("12 34");
        const b = numeric("1234");
        assert.deepEqual(compareNumericStringDigits(a, b), [ 4, A_EQUALS_B ]);
        assert.equal(a.numericStringMatches(b), true);
    });

    it("returns B_INVALID when the second operand is invalid", () => {
        const a = numeric("123");
        const b = new BERElement();
        b.value = new Uint8Array([ 0x41 ]);
        b.tagNumber = ASN1UniversalType.numericString;
        assert.deepEqual(compareNumericStringDigits(a, b), [ 0, B_INVALID ]);
        assert.equal(a.numericStringMatches(b), undefined);
    });

    it("returns A_INVALID when the first operand is invalid", () => {
        const a = new BERElement();
        a.value = new Uint8Array([ 0x41 ]);
        a.tagNumber = ASN1UniversalType.numericString;
        const b = numeric("123");
        assert.deepEqual(compareNumericStringDigits(a, b), [ 0, A_INVALID ]);
        assert.equal(a.numericStringMatches(b), undefined);
    });

    it("counts digits matched before an invalid character on b", () => {
        const a = numeric("1299");
        const b = new BERElement();
        b.value = new Uint8Array([ 0x31, 0x32, 0x41 ]);
        b.tagNumber = ASN1UniversalType.numericString;
        assert.deepEqual(compareNumericStringDigits(a, b), [ 2, B_INVALID ]);
        assert.equal(a.numericStringMatches(b), undefined);
    });

    it("prefers A_INVALID when both operands are invalid at the same step", () => {
        const a = new BERElement();
        a.value = new Uint8Array([ 0x41 ]);
        a.tagNumber = ASN1UniversalType.numericString;
        const b = new BERElement();
        b.value = new Uint8Array([ 0x42 ]);
        b.tagNumber = ASN1UniversalType.numericString;
        assert.deepEqual(compareNumericStringDigits(a, b), [ 0, A_INVALID ]);
    });

    it("returns matched digit count on mismatch", () => {
        const a = numeric("12345");
        const b = numeric("12399");
        assert.deepEqual(compareNumericStringDigits(a, b), [ 3, A_LESS_THAN_B ]);
        assert.equal(a.numericStringMatches(b), false);
    });
});

describe("ASN1Element compare methods", () => {
    it("exposes result-code constants on the package export", () => {
        assert.equal(asn1.A_EQUALS_B, 0);
        assert.equal(asn1.A_LESS_THAN_B, -1);
        assert.equal(asn1.A_GREATER_THAN_B, 1);
        assert.equal(asn1.A_INVALID, -2);
        assert.equal(asn1.B_INVALID, 2);
    });

    it("octetCompare matches compareContentOctets", () => {
        const a = primitiveOctetString(new Uint8Array([ 0x01, 0x02, 0x03 ]));
        const b = primitiveOctetString(new Uint8Array([ 0x01, 0x09, 0x03 ]));
        assert.deepEqual(a.octetCompare(b), compareContentOctets(a, b));
        assert.deepEqual(a.octetCompare(b), [ 1, A_LESS_THAN_B ]);
    });

    it("stringCompare matches compareDirectoryStringChars", () => {
        const a = new BERElement();
        a.printableString = "Ab";
        const b = new BERElement();
        b.printableString = "ab";
        assert.deepEqual(a.stringCompare(b), compareDirectoryStringChars(a, b));
        assert.deepEqual(a.stringCompare(b), [ 2, A_EQUALS_B ]);
        assert.deepEqual(a.stringCompare(b, false), [ 0, A_LESS_THAN_B ]);
    });

    it("numericStringCompare matches compareNumericStringDigits", () => {
        const a = new BERElement();
        a.numericString = "12 34";
        const b = new BERElement();
        b.numericString = "1234";
        assert.deepEqual(a.numericStringCompare(b), compareNumericStringDigits(a, b));
        assert.deepEqual(a.numericStringCompare(b), [ 4, A_EQUALS_B ]);
    });
});

describe("cross-codec and ordering", () => {
    it("compares CER fragmented strings to primitive content", () => {
        const content = new Uint8Array(2500).fill(0x39);
        const cer = new CERElement();
        cer.utf8String = new TextDecoder().decode(content);
        const ber = new BERElement();
        ber.utf8String = new TextDecoder().decode(content);
        assert.equal(cer.octetMatches(ber), true);
    });

    it("compares DER primitive strings via fast path", () => {
        const a = new DERElement();
        a.printableString = "Test";
        const b = new DERElement();
        b.printableString = "Test";
        assert.equal(a.octetMatches(b), true);
        assert.equal(a.stringMatches(b), true);
    });

    it("sorts elements using the result code", () => {
        const mk = (bytes) => {
            const el = new BERElement();
            el.value = bytes;
            el.construction = ASN1Construction.primitive;
            el.tagNumber = ASN1UniversalType.octetString;
            return el;
        };
        const elements = [
            mk(new Uint8Array([ 0x03 ])),
            mk(new Uint8Array([ 0x01 ])),
            mk(new Uint8Array([ 0x02 ])),
        ];
        elements.sort((a, b) => a.octetCompare(b)[1]);
        assert.deepEqual(
            elements.map((el) => el.value[0]),
            [ 0x01, 0x02, 0x03 ],
        );
    });
});
