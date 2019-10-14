const asn1 = require("../../dist/index.js");

describe("BERElement.fromSequence()", () => {
    it("encodes a sequence correctly", () => {
        const el = asn1.BERElement.fromSequence([
            new asn1.BERElement(
                asn1.ASN1TagClass.universal,
                asn1.ASN1Construction.primitive,
                asn1.ASN1UniversalType.boolean,
                false,
            ),
            null,
            new asn1.BERElement(
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

describe("BERElement.fromSet()", () => {
    it("encodes a sequence correctly", () => {
        const el = asn1.BERElement.fromSet([
            new asn1.BERElement(
                asn1.ASN1TagClass.universal,
                asn1.ASN1Construction.primitive,
                asn1.ASN1UniversalType.boolean,
                false,
            ),
            null,
            new asn1.BERElement(
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
