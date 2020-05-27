const asn1 = require("../../dist/node/index.js");

[
    asn1.BERElement,
    asn1.CERElement,
    asn1.DERElement,
].forEach((CodecElement) => {
    describe(`${CodecElement.constructor.name}.fromSequence()`, () => {
        it("encodes a sequence correctly", () => {
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
        it("encodes a sequence correctly", () => {
            const el = CodecElement.fromSet([
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
            expect(el.set.length).toBe(2);
            expect(el.set[0].boolean).toBe(false);
            expect(el.set[1].boolean).toBe(true);
        });
    });
});
