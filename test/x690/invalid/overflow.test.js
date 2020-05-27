const asn1 = require("../../../dist/node/index.js");

[
    asn1.BERElement,
    asn1.CERElement,
    asn1.DERElement,
].forEach((CodecElement) => {
    describe(CodecElement.constructor.name, () => {
        it("throws when decoding an excessively large INTEGER", () => {
            const el = new CodecElement();
            el.value = new Uint8Array([ 0xFF, 0xFF, 0xFF, 0xFF, 0xF3 ]);
            expect(() => el.integer).toThrow();
        });

        it("throws when decoding an OBJECT IDENTIFIER that contains an excessively large number", () => {
            const el = new CodecElement();
            el.value = new Uint8Array([ 0x43, 0x8F, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF ]);
            expect(() => el.objectIdentifier).toThrow();
        });

        it("throws when decoding an excessively large ENUMERATED", () => {
            const el = new CodecElement();
            el.value = new Uint8Array([ 0xFF, 0xFF, 0xFF, 0xFF, 0xF3 ]);
            expect(() => el.enumerated).toThrow();
        });

        it("throws when decoding a RELATIVE OID that contains an excessively large number", () => {
            const el = new CodecElement();
            el.value = new Uint8Array([ 0x8F, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF ]);
            expect(() => el.relativeObjectIdentifier).toThrow();
        });
    });
});
