const asn1 = require("../dist/index.js");

describe("X.690 abstract codec", () => {
    it("correctly identifies canonical ordering of tag classes", () => {
        const data1 = [
            new asn1.DERElement(
                asn1.ASN1TagClass.application,
                asn1.ASN1Construction.primitive,
                0,
            ),
            new asn1.DERElement(
                asn1.ASN1TagClass.private,
                asn1.ASN1Construction.primitive,
                0,
            ),
        ];

        const data2 = [
            new asn1.DERElement(
                asn1.ASN1TagClass.universal,
                asn1.ASN1Construction.primitive,
                0,
            ),
            new asn1.DERElement(
                asn1.ASN1TagClass.application,
                asn1.ASN1Construction.primitive,
                0,
            ),
            new asn1.DERElement(
                asn1.ASN1TagClass.private,
                asn1.ASN1Construction.primitive,
                0,
            ),
            new asn1.DERElement(
                asn1.ASN1TagClass.context,
                asn1.ASN1Construction.primitive,
                0,
            ),
        ];

        const data3 = [
            new asn1.DERElement(
                asn1.ASN1TagClass.universal,
                asn1.ASN1Construction.primitive,
                0,
            ),
            new asn1.DERElement(
                asn1.ASN1TagClass.context,
                asn1.ASN1Construction.primitive,
                0,
            ),
        ];

        expect(asn1.DERElement.isInCanonicalOrder(data1)).toBeTruthy();
        expect(asn1.DERElement.isInCanonicalOrder(data2)).toBeTruthy();
        expect(asn1.DERElement.isInCanonicalOrder(data3)).toBeTruthy();
    });

    it("correctly identifies non-canonical ordering of tag classes", () => {
        const data1 = [
            new asn1.DERElement(
                asn1.ASN1TagClass.universal,
                asn1.ASN1Construction.primitive,
                0,
            ),
            new asn1.DERElement(
                asn1.ASN1TagClass.private,
                asn1.ASN1Construction.primitive,
                0,
            ),
            new asn1.DERElement(
                asn1.ASN1TagClass.application,
                asn1.ASN1Construction.primitive,
                0,
            ),
            new asn1.DERElement(
                asn1.ASN1TagClass.context,
                asn1.ASN1Construction.primitive,
                0,
            ),
        ];

        const data2 = [
            new asn1.DERElement(
                asn1.ASN1TagClass.context,
                asn1.ASN1Construction.primitive,
                0,
            ),
            new asn1.DERElement(
                asn1.ASN1TagClass.application,
                asn1.ASN1Construction.primitive,
                0,
            ),
            new asn1.DERElement(
                asn1.ASN1TagClass.private,
                asn1.ASN1Construction.primitive,
                0,
            ),
            new asn1.DERElement(
                asn1.ASN1TagClass.universal,
                asn1.ASN1Construction.primitive,
                0,
            ),
        ];

        const data3 = [
            new asn1.DERElement(
                asn1.ASN1TagClass.universal,
                asn1.ASN1Construction.primitive,
                0,
            ),
            new asn1.DERElement(
                asn1.ASN1TagClass.application,
                asn1.ASN1Construction.primitive,
                0,
            ),
            new asn1.DERElement(
                asn1.ASN1TagClass.universal,
                asn1.ASN1Construction.primitive,
                0,
            ),
            new asn1.DERElement(
                asn1.ASN1TagClass.universal,
                asn1.ASN1Construction.primitive,
                0,
            ),
        ];

        expect(asn1.DERElement.isInCanonicalOrder(data1)).toBeFalsy();
        expect(asn1.DERElement.isInCanonicalOrder(data2)).toBeFalsy();
        expect(asn1.DERElement.isInCanonicalOrder(data3)).toBeFalsy();
    });

    it("correctly identifies canonical ordering of tag number", () => {
        // Simple ascending
        const data1 = [
            new asn1.DERElement(
                asn1.ASN1TagClass.universal,
                asn1.ASN1Construction.primitive,
                0,
            ),
            new asn1.DERElement(
                asn1.ASN1TagClass.universal,
                asn1.ASN1Construction.primitive,
                1,
            ),
            new asn1.DERElement(
                asn1.ASN1TagClass.universal,
                asn1.ASN1Construction.primitive,
                2,
            ),
        ];

        // No change between elements
        const data2 = [
            new asn1.DERElement(
                asn1.ASN1TagClass.universal,
                asn1.ASN1Construction.primitive,
                0,
            ),
            new asn1.DERElement(
                asn1.ASN1TagClass.universal,
                asn1.ASN1Construction.primitive,
                0,
            ),
            new asn1.DERElement(
                asn1.ASN1TagClass.universal,
                asn1.ASN1Construction.primitive,
                0,
            ),
        ];

        // Ascending between two classes
        const data3 = [
            new asn1.DERElement(
                asn1.ASN1TagClass.universal,
                asn1.ASN1Construction.primitive,
                0,
            ),
            new asn1.DERElement(
                asn1.ASN1TagClass.universal,
                asn1.ASN1Construction.primitive,
                1,
            ),
            new asn1.DERElement(
                asn1.ASN1TagClass.application,
                asn1.ASN1Construction.primitive,
                0,
            ),
            new asn1.DERElement(
                asn1.ASN1TagClass.application,
                asn1.ASN1Construction.primitive,
                1,
            ),
        ];

        expect(asn1.DERElement.isInCanonicalOrder(data1)).toBeTruthy();
        expect(asn1.DERElement.isInCanonicalOrder(data2)).toBeTruthy();
        expect(asn1.DERElement.isInCanonicalOrder(data3)).toBeTruthy();
    });

    it("correctly identifies non-canonical ordering of tag number", () => {
        // Simple ascending
        const data1 = [
            new asn1.DERElement(
                asn1.ASN1TagClass.universal,
                asn1.ASN1Construction.primitive,
                0,
            ),
            new asn1.DERElement(
                asn1.ASN1TagClass.universal,
                asn1.ASN1Construction.primitive,
                2,
            ),
            new asn1.DERElement(
                asn1.ASN1TagClass.universal,
                asn1.ASN1Construction.primitive,
                1,
            ),
        ];

        // Ascending between two classes
        const data2 = [
            new asn1.DERElement(
                asn1.ASN1TagClass.universal,
                asn1.ASN1Construction.primitive,
                0,
            ),
            new asn1.DERElement(
                asn1.ASN1TagClass.universal,
                asn1.ASN1Construction.primitive,
                1,
            ),
            new asn1.DERElement(
                asn1.ASN1TagClass.universal,
                asn1.ASN1Construction.application,
                5,
            ),
            new asn1.DERElement(
                asn1.ASN1TagClass.universal,
                asn1.ASN1Construction.application,
                4,
            ),
        ];

        expect(asn1.DERElement.isInCanonicalOrder(data1)).toBeFalsy();
        expect(asn1.DERElement.isInCanonicalOrder(data2)).toBeFalsy();
    });

    it("correctly identifies element arrays with duplicated (tag class, tag number) values", () => {
        const data1 = [
            new asn1.DERElement(
                asn1.ASN1TagClass.universal,
                asn1.ASN1Construction.primitive,
                0,
            ),
            new asn1.DERElement(
                asn1.ASN1TagClass.universal,
                asn1.ASN1Construction.primitive,
                2,
            ),
            new asn1.DERElement(
                asn1.ASN1TagClass.universal,
                asn1.ASN1Construction.primitive,
                2,
            ),
        ];

        const data2 = [
            new asn1.DERElement(
                asn1.ASN1TagClass.universal,
                asn1.ASN1Construction.primitive,
                2,
            ),
            new asn1.DERElement(
                asn1.ASN1TagClass.universal,
                asn1.ASN1Construction.primitive,
                0,
            ),
            new asn1.DERElement(
                asn1.ASN1TagClass.universal,
                asn1.ASN1Construction.primitive,
                2,
            ),
        ];

        expect(asn1.DERElement.isUniquelyTagged(data1)).toBeFalsy();
        expect(asn1.DERElement.isUniquelyTagged(data2)).toBeFalsy();
    });

    it("correctly identifies element arrays with non-duplicated (tag class, tag number) values", () => {
        const data1 = [
            new asn1.DERElement(
                asn1.ASN1TagClass.universal,
                asn1.ASN1Construction.primitive,
                0,
            ),
            new asn1.DERElement(
                asn1.ASN1TagClass.universal,
                asn1.ASN1Construction.primitive,
                2,
            ),
            new asn1.DERElement(
                asn1.ASN1TagClass.application,
                asn1.ASN1Construction.primitive,
                2,
            ),
        ];

        const data2 = [
            new asn1.DERElement(
                asn1.ASN1TagClass.application,
                asn1.ASN1Construction.primitive,
                2,
            ),
            new asn1.DERElement(
                asn1.ASN1TagClass.universal,
                asn1.ASN1Construction.primitive,
                0,
            ),
            new asn1.DERElement(
                asn1.ASN1TagClass.private,
                asn1.ASN1Construction.primitive,
                2,
            ),
        ];
        expect(asn1.DERElement.isUniquelyTagged(data1)).toBeTruthy();
        expect(asn1.DERElement.isUniquelyTagged(data2)).toBeTruthy();
    });
});
