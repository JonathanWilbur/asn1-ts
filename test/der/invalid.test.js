const asn1 = require("../../dist/index.js");

/**
 * Until the issue linked below is fixed, all of these tests can only ensure
 * that an error is thrown, but not that a specific type of error is thrown.
 * See https://github.com/jasmine/jasmine/issues/819.
 */
describe("Distinguished Encoding Rules", () => {
    it("throws an exception when decoding a length that could have been encoded on fewer octets", () => {
        const el = new asn1.DERElement();
        const data = new Uint8Array([ 0x05, 0x83, 0x00, 0x00, 0x01, 0xFF ]);
        expect(() => el.fromBytes(data)).toThrow();
    });

    it("throws an exception when decoding a multi-byte BOOLEAN", () => {
        const el = new asn1.DERElement();
        el.value = new Uint8Array([ 0x01, 0x01 ]);
        expect(() => el.boolean).toThrow();
    });

    it("throws an exception when decoding a BOOLEAN that is not 0x00 or 0xFF", () => {
        const el = new asn1.DERElement();
        el.value = new Uint8Array([ 0x38 ]);
        expect(() => el.boolean).toThrow();
    });

    it("throws an exception when decoding a BIT STRING with a deceptive first byte", () => {
        const el = new asn1.DERElement();
        el.value = new Uint8Array([ 0x05 ]);
        expect(() => el.bitString).toThrow();
    });

    it("throws an exception when decoding a BIT STRING with trailing set bits", () => {
        const el = new asn1.DERElement();
        el.value = new Uint8Array([ 0x03, 0x02 ]);
        expect(() => el.bitString).toThrow();
    });

    it("throws an exception when decoding a BIT STRING with a first byte greater than 7", () => {
        const el = new asn1.DERElement();
        el.value = new Uint8Array([ 0x08, 0x0F, 0xF0 ]);
        expect(() => el.bitString).toThrow();
    });

    it("throws an exception when decoding a constructed BIT STRING whose non-terminal subcomponents start with non-zero value bytes", () => {
        const data = [
            0x23, 0x0E,
            0x03, 0x02, 0x03, 0x0F, // The 0x03 is what should cause this to throw.
            0x23, 0x04,
            0x03, 0x02, 0x00, 0x0F,
            0x03, 0x02, 0x05, 0xF0,
        ];
        const element = new asn1.DERElement();
        element.fromBytes(data);
        expect(() => element.bitString).toThrow();
    });
});
