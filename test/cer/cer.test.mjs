import * as asn1 from "../../dist/index.mjs";
import { describe, it } from "node:test";
import { strict as assert } from "node:assert";

describe("Canonical Encoding Rules", function () {
    it("encodes and decodes long BIT STRINGs correctly", () => {
        const longOddBits = new Array(4053);
        const longEvenBits = new Array(4000);

        const el = new asn1.CERElement();
        [
            longOddBits,
            longEvenBits,
        ].forEach((bits) => {
            for (let i = 0; i < bits.length; i++) {
                bits[i] = (i % 2);
            }

            el.bitString = new Uint8ClampedArray(bits);
            assert.deepEqual(el.bitString, new Uint8ClampedArray(bits));
        });
    });

    it("encodes and decodes long OCTET STRINGs correctly", () => {
        const longOddBytes = new Uint8Array(4053);
        const longEvenBytes = new Uint8Array(4000);

        const el = new asn1.CERElement();
        [
            longOddBytes,
            longEvenBytes,
        ].forEach((bytes) => {
            el.octetString = bytes;
            assert.deepEqual(el.octetString, Buffer.from(bytes));
        });
    });

    it("encodes and decodes long strings correctly", () => {
        // An odd length deliberately chosen so that it is not evenly
        // divisible by 1000.
        const longOddString = "1234567".repeat(453);

        // Intentionally evenly divisible by 1000.
        const longEvenString = "1234567890".repeat(400);

        const el = new asn1.CERElement();
        [
            longOddString,
            longEvenString,
        ].forEach((str) => {
            el.objectDescriptor = str;
            assert.equal(el.objectDescriptor, str);

            el.utf8String = str;
            assert.equal(el.utf8String, str);

            el.universalString = str;
            assert.equal(el.universalString, str);

            el.bmpString = str;
            assert.equal(el.bmpString, str);
        });
    });
});
