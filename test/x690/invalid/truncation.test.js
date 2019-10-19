const asn1 = require("../../../dist/index.js");

[
    asn1.BERElement,
    asn1.DERElement,
].forEach((CodecElement) => {
    describe(CodecElement.constructor.name, () => {
        it("throws when decoding an element with a truncated tag number", () => {
            const el = new CodecElement();
            expect(() => el.fromBytes(new Uint8Array([ 31, 0x80, 0x06  ]))).toThrow();
        });

        it("throws when decoding a truncated OBJECT IDENTIFIER", () => {
            const el = new CodecElement();
            el.value = new Uint8Array([ 0x42, 0x80 ]);
            expect(() => el.objectIdentifier).toThrow();
        });

        it("throws when decoding a truncated RELATIVE OID", () => {
            const el = new CodecElement();
            el.value = new Uint8Array([ 0x80, 0x81 ]);
            expect(() => el.relativeObjectIdentifier).toThrow();
        });

        it("throws when decoding a truncated UniversalString", () => {
            const el = new CodecElement();
            el.value = new Uint8Array([ 0x00, 0x00, 0x00 ]);
            expect(() => el.universalString).toThrow();
        });

        it("throws when decoding a truncated BMPString", () => {
            const el = new CodecElement();
            el.value = new Uint8Array([ 0x00 ]);
            expect(() => el.bmpString).toThrow();
        });
    });
});
