const asn1 = require("../../dist/index.js");

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
                bits[i] = Boolean(i % 2);
            }

            el.bitString = bits;
            expect(el.bitString).toEqual(bits);
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
            expect(el.octetString).toEqual(bytes);
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
            expect(el.objectDescriptor).toBe(str);

            el.utf8String = str;
            expect(el.utf8String).toBe(str);

            el.universalString = str;
            expect(el.universalString).toBe(str);

            el.bmpString = str;
            expect(el.bmpString).toBe(str);
        });
    });
});
