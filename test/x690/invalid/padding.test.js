const asn1 = require("../../../dist/node/index.js");

[
    asn1.BERElement,
    asn1.CERElement,
    asn1.DERElement,
].forEach((CodecElement) => {
    describe(CodecElement.constructor.name, () => {
        it("throws when decoding an element with unnecessary padding bytes on the tag number", () => {
            const el = new CodecElement();
            expect(() => el.fromBytes(new Uint8Array([ 31, 0x80, 0x06  ]))).toThrow();
        });

        it("throws when decoding an INTEGER with unnecessary padding", () => {
            const el = new CodecElement();
            el.value = new Uint8Array([ 0xFF, 0xFF, 0xF3 ]);
            expect(() => el.integer).toThrow();
        });

        it("throws when decoding an OBJECT IDENTIFIER with unnecessary padding", () => {
            const el = new CodecElement();
            el.value = new Uint8Array([ 0x42, 0x80, 0x06 ]);
            expect(() => el.objectIdentifier).toThrow();
        });

        it("throws when decoding an ENUMERATED with unnecessary padding", () => {
            const el = new CodecElement();
            el.value = new Uint8Array([ 0xFF, 0xFF, 0xF3 ]);
            expect(() => el.enumerated).toThrow();
        });

        it("throws when decoding a RELATIVE OID with unnecessary padding", () => {
            const el = new CodecElement();
            el.value = new Uint8Array([ 0x80, 0x06 ]);
            expect(() => el.relativeObjectIdentifier).toThrow();
        });
    });
});
