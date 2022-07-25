const asn1 = require("../../dist/node/index.js");

[
    asn1.BERElement,
    asn1.CERElement,
    asn1.DERElement,
].forEach((CodecElement) => {
    describe(`${CodecElement.constructor.name}.fromSequence()`, () => {
        it("encodes a SEQUENCE correctly", () => {
            const el = CodecElement.fromSequence([
                new CodecElement(
                    asn1.ASN1TagClass.universal,
                    asn1.ASN1Construction.primitive,
                    asn1.ASN1UniversalType.boolean,
                    false,
                ),
                null,
                new CodecElement(
                    asn1.ASN1TagClass.universal,
                    asn1.ASN1Construction.primitive,
                    asn1.ASN1UniversalType.boolean,
                    true,
                ),
                undefined,
            ]);
            expect(el.sequence.length).toBe(2);
            expect(el.sequence[0].boolean).toBe(false);
            expect(el.sequence[1].boolean).toBe(true);
        });
    });

    describe(`${CodecElement.constructor.name}.fromSet()`, () => {
        it("encodes a SET correctly", () => {
            const el = CodecElement.fromSetOf([
                new CodecElement(
                    asn1.ASN1TagClass.universal,
                    asn1.ASN1Construction.primitive,
                    asn1.ASN1UniversalType.boolean,
                    false,
                ),
                null,
                new CodecElement(
                    asn1.ASN1TagClass.universal,
                    asn1.ASN1Construction.primitive,
                    asn1.ASN1UniversalType.boolean,
                    true,
                ),
                undefined,
            ]);
            expect(el.setOf.length).toBe(2);
            expect(el.setOf[0].boolean).toBe(false);
            expect(el.setOf[1].boolean).toBe(true);
        });
    });
});
