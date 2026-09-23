import {
    ASN1Construction,
    ASN1TagClass,
    ASN1UniversalType,
    BERElement,
} from "../../dist/index.mjs";
import compareBitStrings from "../../dist/utils/compareBitStrings.mjs";
import { describe, it } from "node:test";
import { strict as assert } from "node:assert";

function primitiveBitString (contents: number[]): BERElement {
    const el = new BERElement(
        ASN1TagClass.universal,
        ASN1Construction.primitive,
        ASN1UniversalType.bitString,
    );
    el.value = new Uint8Array(contents);
    return el;
}

function constructedBitString (fragments: BERElement[]): BERElement {
    const el = new BERElement(
        ASN1TagClass.universal,
        ASN1Construction.constructed,
        ASN1UniversalType.bitString,
    );
    el.construct(fragments);
    return el;
}

describe("compareBitStrings()", () => {
    it("compares the bit view, not unused bytes in the backing buffer", () => {
        const offsetView = new Uint8ClampedArray([ 0, 0, 1, 0, 1 ]).subarray(2);
        const sameBits = new Uint8ClampedArray([ 1, 0, 1 ]);
        assert.equal(compareBitStrings(offsetView, sameBits), true);

        const longerBuffer = new Uint8ClampedArray([ 1, 0, 1, 1 ]);
        const prefix = longerBuffer.subarray(0, 3);
        assert.equal(compareBitStrings(prefix, longerBuffer), false);
        assert.equal(compareBitStrings(prefix, sameBits), true);
    });

    describe("encoded BIT STRING", () => {
        // 19 significant bits: 11001010 11110000 101. Unused count is 5.
        const clean = primitiveBitString([ 5, 0b11001010, 0b11110000, 0b10100000 ]);
        const dirtyTrailing = primitiveBitString([ 5, 0b11001010, 0b11110000, 0b10111111 ]);
        const differentLastBit = primitiveBitString([ 5, 0b11001010, 0b11110000, 0b10000000 ]);
        const differentMiddle = primitiveBitString([ 5, 0b11001010, 0b11110001, 0b10100000 ]);

        it("ignores unused bits in the final content octet", () => {
            assert.equal(compareBitStrings(clean, dirtyTrailing), true);
            assert.equal(compareBitStrings(dirtyTrailing, clean), true);
        });

        it("rejects a difference in a significant bit of the final octet", () => {
            assert.equal(compareBitStrings(clean, differentLastBit), false);
        });

        it("rejects a difference in an earlier octet", () => {
            assert.equal(compareBitStrings(clean, differentMiddle), false);
        });

        it("treats a different unused-bits count as a different length", () => {
            const eightBits = primitiveBitString([ 0, 0b11111111 ]);
            const sevenBits = primitiveBitString([ 1, 0b11111111 ]);
            assert.equal(compareBitStrings(eightBits, sevenBits), false);
        });

        it("matches an empty BIT STRING", () => {
            assert.equal(compareBitStrings(
                primitiveBitString([ 0 ]),
                primitiveBitString([ 0 ]),
            ), true);
        });

        it("matches a constructed encoding to an equivalent primitive encoding", () => {
            const constructed = constructedBitString([
                primitiveBitString([ 0, 0b11001010 ]),
                primitiveBitString([ 0, 0b11110000 ]),
                primitiveBitString([ 5, 0b10111111 ]),
            ]);
            assert.equal(compareBitStrings(constructed, clean), true);
            assert.equal(compareBitStrings(clean, constructed), true);
            assert.equal(compareBitStrings(constructed, differentLastBit), false);
        });

        it("matches constructed encodings that split the same bits differently", () => {
            const byBytes = constructedBitString([
                primitiveBitString([ 0, 0b11001010 ]),
                primitiveBitString([ 0, 0b11110000 ]),
                primitiveBitString([ 5, 0b10100000 ]),
            ]);
            const firstTwoCombined = constructedBitString([
                primitiveBitString([ 0, 0b11001010, 0b11110000 ]),
                primitiveBitString([ 5, 0b10110101 ]),
            ]);
            assert.equal(compareBitStrings(byBytes, firstTwoCombined), true);
        });

        it("matches a nested constructed BIT STRING", () => {
            const nested = constructedBitString([
                constructedBitString([
                    primitiveBitString([ 0, 0b11001010, 0b11110000 ]),
                ]),
                primitiveBitString([ 5, 0b10100011 ]),
            ]);
            assert.equal(compareBitStrings(nested, dirtyTrailing), true);
        });
    });

    describe("mixed BIT_STRING and element", () => {
        // Same 19 bits as the encoded examples above.
        const bits = new Uint8ClampedArray([
            1, 1, 0, 0, 1, 0, 1, 0,
            1, 1, 1, 1, 0, 0, 0, 0,
            1, 0, 1,
        ]);
        const clean = primitiveBitString([ 5, 0b11001010, 0b11110000, 0b10100000 ]);
        const dirtyTrailing = primitiveBitString([ 5, 0b11001010, 0b11110000, 0b10111111 ]);
        const constructed = constructedBitString([
            primitiveBitString([ 0, 0b11001010 ]),
            primitiveBitString([ 0, 0b11110000 ]),
            primitiveBitString([ 5, 0b10111111 ]),
        ]);

        it("converts an element to a BIT_STRING before comparing", () => {
            assert.equal(compareBitStrings(bits, clean), true);
            assert.equal(compareBitStrings(clean, bits), true);
            assert.equal(compareBitStrings(bits, dirtyTrailing), true);
            assert.equal(compareBitStrings(dirtyTrailing, bits), true);
            assert.equal(compareBitStrings(bits, constructed), true);
            assert.equal(compareBitStrings(constructed, bits), true);
        });

        it("rejects a decoded value whose bits differ", () => {
            const shorter = bits.subarray(0, -1);
            assert.equal(compareBitStrings(shorter, clean), false);
            assert.equal(compareBitStrings(constructed, shorter), false);
        });

        it("matches an empty decoded value to an empty encoding", () => {
            assert.equal(compareBitStrings(
                new Uint8ClampedArray(0),
                primitiveBitString([ 0 ]),
            ), true);
        });
    });
});
