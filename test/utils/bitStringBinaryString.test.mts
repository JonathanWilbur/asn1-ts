import bitStringToBinaryString from "../../dist/utils/bitStringToBinaryString.mjs";
import binaryStringToBitString from "../../dist/utils/binaryStringToBitString.mjs";
import { describe, it } from "node:test";
import { strict as assert } from "node:assert";

function naiveToBinary (bits: Uint8ClampedArray): string {
    let s = "";
    for (let i = 0; i < bits.length; i++) {
        s += bits[i] ? "1" : "0";
    }
    return s;
}

describe("bitStringToBinaryString()", () => {
    it("converts an empty BIT STRING to an empty string", () => {
        assert.equal(bitStringToBinaryString(new Uint8ClampedArray(0)), "");
    });

    it("converts single bits", () => {
        assert.equal(bitStringToBinaryString(new Uint8ClampedArray([1])), "1");
        assert.equal(bitStringToBinaryString(new Uint8ClampedArray([0])), "0");
    });

    it("converts byte-aligned values", () => {
        assert.equal(
            bitStringToBinaryString(new Uint8ClampedArray([1, 1, 0, 0, 1, 0, 1, 0])),
            "11001010",
        );
    });

    it("converts non-byte-aligned values, including a trailing partial byte", () => {
        assert.equal(
            bitStringToBinaryString(new Uint8ClampedArray([1, 0, 1])),
            "101",
        );
        assert.equal(
            bitStringToBinaryString(new Uint8ClampedArray([
                1, 1, 0, 0, 1, 0, 1, 0,
                1, 1, 1, 1, 0, 0, 0, 0,
                1, 0, 1,
            ])),
            "1100101011110000101",
        );
    });

    it("matches the naive conversion on pseudo-random inputs of many lengths", () => {
        let seed = 0x12345678;
        const next = (): number => {
            seed = (seed * 1664525 + 1013904223) >>> 0;
            return seed & 1;
        };
        for (const len of [0, 1, 2, 7, 8, 9, 15, 16, 17, 100, 1000]) {
            const bits = new Uint8ClampedArray(len);
            for (let i = 0; i < len; i++) {
                bits[i] = next();
            }
            assert.equal(bitStringToBinaryString(bits), naiveToBinary(bits));
        }
    });
});

describe("binaryStringToBitString()", () => {
    it("converts an empty string to an empty BIT STRING", () => {
        const ret = binaryStringToBitString("");
        assert.ok(ret instanceof Uint8ClampedArray);
        assert.equal(ret.length, 0);
    });

    it("converts known strings", () => {
        assert.deepEqual(
            Array.from(binaryStringToBitString("101")),
            [1, 0, 1],
        );
        assert.deepEqual(
            Array.from(binaryStringToBitString("11001010")),
            [1, 1, 0, 0, 1, 0, 1, 0],
        );
    });

    it("rejects characters other than '0' and '1'", () => {
        for (const bad of ["2", "a", " ", "10 10", "10a01", "01\n10", "+1", "-0"]) {
            assert.throws(() => binaryStringToBitString(bad));
        }
        // Characters below "0" must also be rejected (not silently clamped to 0).
        assert.throws(() => binaryStringToBitString("1\x00"));
        assert.throws(() => binaryStringToBitString("1/"));
    });

    it("round-trips with bitStringToBinaryString()", () => {
        const cases = ["", "0", "1", "101", "1100101011110000101", "0".repeat(1000) + "1".repeat(37)];
        for (const s of cases) {
            assert.equal(bitStringToBinaryString(binaryStringToBitString(s)), s);
        }
        const bits = new Uint8ClampedArray([1, 1, 0, 0, 1, 0, 1, 0, 1, 0, 1]);
        assert.deepEqual(
            Array.from(binaryStringToBitString(bitStringToBinaryString(bits))),
            Array.from(bits),
        );
    });
});
