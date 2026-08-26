import * as asn1 from "../../dist/index.mjs";
import { describe, it } from "node:test";
import { strict as assert } from "node:assert";

describe("Distinguished Encoding Rules", () => {
    it("throws an exception when decoding a length that could have been encoded on fewer octets", () => {
        const cases = [
            // Long form with 1 content octet, but length ≤ 127 (must use short form).
            new Uint8Array([ 0x05, 0x81, 0x01, 0xFF ]),
            // Long form with 2 content octets, but length ≤ 0xFF.
            new Uint8Array([ 0x05, 0x82, 0x00, 0x01, 0xFF ]),
            // Long form with 3 content octets, but length ≤ 0xFFFF (incl. values with MSB set).
            ...(() => {
                const data = new Uint8Array(5 + 0x8000);
                data[0] = 0x04;
                data[1] = 0x83;
                data[2] = 0x00;
                data[3] = 0x80;
                data[4] = 0x00;
                return [ data ];
            })(),
            // Long form with 3 content octets and leading zeros (classic case).
            new Uint8Array([ 0x05, 0x83, 0x00, 0x00, 0x01, 0xFF ]),
            // Long form with 4 content octets, but length ≤ 0xFFFFFF.
            new Uint8Array([ 0x05, 0x84, 0x00, 0x00, 0x00, 0x01, 0xFF ]),
        ];
        for (const data of cases) {
            const el = new asn1.DERElement();
            assert.throws(() => el.fromBytes(data));
        }
    });

    it("accepts minimal long-form lengths", () => {
        // length 128 fits in one long-form content octet (cannot use short form).
        const el = new asn1.DERElement();
        const data = new Uint8Array(131);
        data[0] = 0x04;
        data[1] = 0x81;
        data[2] = 0x80;
        assert.equal(el.fromBytes(data), 131);
        assert.equal(el.value.length, 128);
    });

    it("throws an exception when decoding a multi-byte BOOLEAN", () => {
        const el = new asn1.DERElement();
        el.value = new Uint8Array([ 0x01, 0x01 ]);
        assert.throws(() => el.boolean);
    });

    it("throws an exception when decoding a BOOLEAN that is not 0x00 or 0xFF", () => {
        const el = new asn1.DERElement();
        el.value = new Uint8Array([ 0x38 ]);
        assert.throws(() => el.boolean);
    });

    it("throws an exception when decoding a BIT STRING with a deceptive first byte", () => {
        const el = new asn1.DERElement();
        el.value = new Uint8Array([ 0x05 ]);
        assert.throws(() => el.bitString);
    });

    it("throws an exception when decoding a BIT STRING with trailing set bits", () => {
        const el = new asn1.DERElement();
        el.value = new Uint8Array([ 0x03, 0x02 ]);
        assert.throws(() => el.bitString);
    });

    it("throws an exception when decoding a BIT STRING with a first byte greater than 7", () => {
        const el = new asn1.DERElement();
        el.value = new Uint8Array([ 0x08, 0x0F, 0xF0 ]);
        assert.throws(() => el.bitString);
    });

    it("throws an exception when decoding a constructed BIT STRING whose non-terminal subcomponents start with non-zero value bytes", () => {
        const data = new Uint8Array([
            0x23, 0x0E,
            0x03, 0x02, 0x03, 0x0F, // The 0x03 is what should cause this to throw.
            0x23, 0x04,
            0x03, 0x02, 0x00, 0x0F,
            0x03, 0x02, 0x05, 0xF0,
        ]);
        const element = new asn1.DERElement();
        element.fromBytes(data);
        assert.throws(() => element.bitString);
    });
});
