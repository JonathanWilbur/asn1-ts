const asn1 = require("../../dist/index.js");

describe("Distinguished Encoding Rules", function () {
    /**
     * This test uses utf8String, but just about any string type can be used.
     * The real purpose for using a string type is to pick a type that calls
     * deconstruct(), which recurses automatically, whether the subelements
     * are of definite-length or indefinite-length encoding.
     */
    it("throws an exception when decoding excessively nested definite-length elements", function () {
        let data = [ 0x0C, 0x02, "H".charCodeAt(0), "i".charCodeAt(0) ];
        for (let i = 0; i < (asn1.DERElement.nestingRecursionLimit + 2); i++) {
            data = ([ 0x2C, data.length ]).concat(data);
        }
        const el = new asn1.DERElement();
        el.fromBytes(new Uint8Array(data));
        expect(() => el.utf8String).toThrow();
    });

    /**
     * This should not throw, because the decoding of definite-length encoded
     * elements does not recurse automatically, unless you decode type that calls
     * deconstruct() or BIT STRING.
     */
    it("does not throw an exception when manually decoding highly nested definite-length elements", function () {
        let data = [ 0x0C, 0x02, "H".charCodeAt(0), "i".charCodeAt(0) ];
        for (let i = 0; i < (asn1.DERElement.nestingRecursionLimit + 2); i++) {
            data = ([ 0x2C, data.length ]).concat(data);
        }
        const el = new asn1.DERElement();
        el.fromBytes(new Uint8Array(data));
        for (let i = 0; i < (asn1.DERElement.nestingRecursionLimit + 1); i++) {
            el.fromBytes(el.value);
        }
        expect(el.fromBytes(el.value)).toBe(4);
    });

    it("encodes and decodes a constructed BIT STRING correctly", function () {
        const data = [
            0x23, 0x0E,
            0x03, 0x02, 0x00, 0x0F,
            0x23, 0x04,
            0x03, 0x02, 0x00, 0x0F,
            0x03, 0x02, 0x05, 0xF0,
        ];

        const element = new asn1.DERElement();
        element.fromBytes(data);
        expect(() => element.bitString).toThrow();
    });

    it("encodes and decodes a constructed OCTET STRING correctly", function () {
        const data = new Uint8Array([
            0x24, 0x11,
            0x04, 0x04, 0x01, 0x02, 0x03, 0x04,
            0x24, 0x05,
            0x04, 0x03, 0x05, 0x06, 0x07,
            0x04, 0x02, 0x08, 0x09,
        ]);

        const element = new asn1.DERElement();
        element.fromBytes(data);
        expect(() => element.octetString).toThrow();
    });

    it("encodes and decodes a constructed ObjectDescriptor correctly", function () {
        const data = new Uint8Array([
            0x27, 0x12,
            0x07, 0x04, 0x53, 0x68, 0x69, 0x61, // S h i a
            0x27, 0x04,
            0x07, 0x02, 0x4C, 0x61, // L a
            0x07, 0x04, 0x42, 0x54, 0x46, 0x4F, // B T F O
        ]);

        const element = new asn1.DERElement();
        element.fromBytes(data);
        expect(() => element.objectDescriptor).toThrow();
    });

    it("encodes and decodes a constructed NumericString correctly", function () {
        const data = new Uint8Array([
            0x32, 0x12,
            0x12, 0x04, 0x30, 0x31, 0x32, 0x33, // 0 1 2 3
            0x32, 0x04,
            0x12, 0x02, 0x34, 0x35, // 4 5
            0x12, 0x04, 0x36, 0x37, 0x38, 0x39, // 6 7 8 9
        ]);

        const element = new asn1.DERElement();
        element.fromBytes(data);
        expect(() => element.numericString).toThrow();
    });

    it("encodes and decodes a constructed PrintableString correctly", function () {
        const data = new Uint8Array([
            0x33, 0x12,
            0x13, 0x04, 0x30, 0x31, 0x32, 0x33, // 0 1 2 3
            0x33, 0x04,
            0x13, 0x02, 0x34, 0x35, // 4 5
            0x13, 0x04, 0x36, 0x37, 0x38, 0x39, // 6 7 8 9
        ]);

        const element = new asn1.DERElement();
        element.fromBytes(data);
        expect(() => element.printableString).toThrow();
    });
});
