const asn1 = require("../../dist/node/index.js");

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
                asn1.ASN1TagClass.context,
                asn1.ASN1Construction.primitive,
                0,
            ),
            new asn1.DERElement(
                asn1.ASN1TagClass.private,
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

        expect(asn1.isInCanonicalOrder(data1)).toBeTruthy();
        expect(asn1.isInCanonicalOrder(data2)).toBeTruthy();
        expect(asn1.isInCanonicalOrder(data3)).toBeTruthy();
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

        expect(asn1.isInCanonicalOrder(data1)).toBeFalsy();
        expect(asn1.isInCanonicalOrder(data2)).toBeFalsy();
        expect(asn1.isInCanonicalOrder(data3)).toBeFalsy();
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

        expect(asn1.isInCanonicalOrder(data1)).toBeTruthy();
        expect(asn1.isInCanonicalOrder(data2)).toBeTruthy();
        expect(asn1.isInCanonicalOrder(data3)).toBeTruthy();
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
                asn1.ASN1Construction.primitive,
                5,
            ),
            new asn1.DERElement(
                asn1.ASN1TagClass.universal,
                asn1.ASN1Construction.primitive,
                4,
            ),
        ];

        expect(asn1.isInCanonicalOrder(data1)).toBeFalsy();
        expect(asn1.isInCanonicalOrder(data2)).toBeFalsy();
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

        expect(asn1.isUniquelyTagged(data1)).toBeFalsy();
        expect(asn1.isUniquelyTagged(data2)).toBeFalsy();
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
        expect(asn1.isUniquelyTagged(data1)).toBeTruthy();
        expect(asn1.isUniquelyTagged(data2)).toBeTruthy();
    });
});


describe("sortCanonically()", () => {
    test("correctly sorts elements according to canonical ordering", () => {
        const elements1 = [
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
                asn1.ASN1TagClass.universal,
                asn1.ASN1Construction.primitive,
                0,
            ),
            new asn1.DERElement(
                asn1.ASN1TagClass.private,
                asn1.ASN1Construction.primitive,
                0,
            ),
        ];

        asn1.sortCanonically(elements1);
        expect(elements1[0].tagClass).toBe(asn1.ASN1TagClass.universal);
        expect(elements1[1].tagClass).toBe(asn1.ASN1TagClass.application);
        expect(elements1[2].tagClass).toBe(asn1.ASN1TagClass.context);
        expect(elements1[3].tagClass).toBe(asn1.ASN1TagClass.private);

        const elements2 = [
            new asn1.DERElement(
                asn1.ASN1TagClass.context,
                asn1.ASN1Construction.primitive,
                6,
            ),
            new asn1.DERElement(
                asn1.ASN1TagClass.context,
                asn1.ASN1Construction.primitive,
                3,
            ),
            new asn1.DERElement(
                asn1.ASN1TagClass.context,
                asn1.ASN1Construction.primitive,
                10,
            ),
            new asn1.DERElement(
                asn1.ASN1TagClass.context,
                asn1.ASN1Construction.primitive,
                5,
            ),
        ];

        asn1.sortCanonically(elements2);
        expect(elements2[0].tagNumber).toBe(3);
        expect(elements2[1].tagNumber).toBe(5);
        expect(elements2[2].tagNumber).toBe(6);
        expect(elements2[3].tagNumber).toBe(10);

        const elements3 = [
            new asn1.DERElement(
                asn1.ASN1TagClass.private,
                asn1.ASN1Construction.primitive,
                3,
            ),
            new asn1.DERElement(
                asn1.ASN1TagClass.application,
                asn1.ASN1Construction.primitive,
                5,
            ),
            new asn1.DERElement(
                asn1.ASN1TagClass.application,
                asn1.ASN1Construction.primitive,
                6,
            ),
            new asn1.DERElement(
                asn1.ASN1TagClass.context,
                asn1.ASN1Construction.primitive,
                10,
            ),
        ];

        asn1.sortCanonically(elements3);
        expect(elements3[0].tagNumber).toBe(5);
        expect(elements3[1].tagNumber).toBe(6);
        expect(elements3[2].tagNumber).toBe(10);
        expect(elements3[3].tagNumber).toBe(3);
    });
});

describe("sortSetOfCanonically()", () => {
    test("correctly sorts elements according to ITU X.690-2015, Section 11.6", () => {
        const elements1 = [
            new asn1.DERElement(
                asn1.ASN1TagClass.context,
                asn1.ASN1Construction.primitive,
                0,
                new Uint8Array([ 0x00 ]),
            ),
            new asn1.DERElement(
                asn1.ASN1TagClass.context,
                asn1.ASN1Construction.primitive,
                0,
                new Uint8Array([ 0x01 ]),
            ),
            new asn1.DERElement(
                asn1.ASN1TagClass.context,
                asn1.ASN1Construction.primitive,
                0,
                new Uint8Array([ 0x02 ]),
            ),
            new asn1.DERElement(
                asn1.ASN1TagClass.context,
                asn1.ASN1Construction.primitive,
                0,
                new Uint8Array([ 0x03 ]),
            ),
        ];

        elements1.sort(asn1.compareSetOfElementsCanonically);
        expect(elements1[0].value[0]).toBe(0);
        expect(elements1[1].value[0]).toBe(1);
        expect(elements1[2].value[0]).toBe(2);
        expect(elements1[3].value[0]).toBe(3);

        const elements2 = [
            new asn1.DERElement(
                asn1.ASN1TagClass.context,
                asn1.ASN1Construction.primitive,
                0,
                new Uint8Array([ 0x03 ]),
            ),
            new asn1.DERElement(
                asn1.ASN1TagClass.context,
                asn1.ASN1Construction.primitive,
                0,
                new Uint8Array([ 0x02 ]),
            ),
            new asn1.DERElement(
                asn1.ASN1TagClass.context,
                asn1.ASN1Construction.primitive,
                0,
                new Uint8Array([ 0x00 ]),
            ),
            new asn1.DERElement(
                asn1.ASN1TagClass.context,
                asn1.ASN1Construction.primitive,
                0,
                new Uint8Array([ 0x01 ]),
            ),
        ];

        elements2.sort(asn1.compareSetOfElementsCanonically);
        expect(elements2[0].value[0]).toBe(0);
        expect(elements2[1].value[0]).toBe(1);
        expect(elements2[2].value[0]).toBe(2);
        expect(elements2[3].value[0]).toBe(3);

        const elements3 = [
            new asn1.DERElement(
                asn1.ASN1TagClass.context,
                asn1.ASN1Construction.primitive,
                0,
                new Uint8Array([ 0x02, 0x00, 0x01 ]),
            ),
            new asn1.DERElement(
                asn1.ASN1TagClass.context,
                asn1.ASN1Construction.primitive,
                0,
                new Uint8Array([ 0x02 ]),
            ),
        ];

        elements3.sort(asn1.compareSetOfElementsCanonically);
        expect(elements3[0].value.length).toBe(1);
        expect(elements3[1].value.length).toBe(3);

        const elements4 = [
            new asn1.DERElement(
                asn1.ASN1TagClass.context,
                asn1.ASN1Construction.primitive,
                0,
                new Uint8Array([ 0x02, 0x00, 0x01 ]),
            ),
            new asn1.DERElement(
                asn1.ASN1TagClass.context,
                asn1.ASN1Construction.primitive,
                0,
                new Uint8Array([ 0x02, 0x01 ]),
            ),
        ];

        elements4.sort(asn1.compareSetOfElementsCanonically);
        expect(elements4[0].value.length).toBe(3);
        expect(elements4[1].value.length).toBe(2);
    });
});
