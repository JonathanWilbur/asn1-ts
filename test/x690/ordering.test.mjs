import * as asn1 from "../../dist/index.mjs";
import { describe, it, test } from "node:test";
import { strict as assert } from "node:assert";

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

        assert(asn1.isInCanonicalOrder(data1));
        assert(asn1.isInCanonicalOrder(data2));
        assert(asn1.isInCanonicalOrder(data3));
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

        assert(!asn1.isInCanonicalOrder(data1));
        assert(!asn1.isInCanonicalOrder(data2));
        assert(!asn1.isInCanonicalOrder(data3));
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

        assert(asn1.isInCanonicalOrder(data1));
        assert(asn1.isInCanonicalOrder(data2));
        assert(asn1.isInCanonicalOrder(data3));
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

        assert(!asn1.isInCanonicalOrder(data1));
        assert(!asn1.isInCanonicalOrder(data2));
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

        assert(!asn1.isUniquelyTagged(data1));
        assert(!asn1.isUniquelyTagged(data2));
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
        assert(asn1.isUniquelyTagged(data1));
        assert(asn1.isUniquelyTagged(data2));
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
        assert.equal(elements1[0].tagClass, asn1.ASN1TagClass.universal);
        assert.equal(elements1[1].tagClass, asn1.ASN1TagClass.application);
        assert.equal(elements1[2].tagClass, asn1.ASN1TagClass.context);
        assert.equal(elements1[3].tagClass, asn1.ASN1TagClass.private);

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
        assert.equal(elements2[0].tagNumber, 3);
        assert.equal(elements2[1].tagNumber, 5);
        assert.equal(elements2[2].tagNumber, 6);
        assert.equal(elements2[3].tagNumber, 10);

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
        assert(elements3[0].tagNumber, 5);
        assert(elements3[1].tagNumber, 6);
        assert(elements3[2].tagNumber, 10);
        assert(elements3[3].tagNumber, 3);
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
        assert.equal(elements1[0].value[0], 0);
        assert.equal(elements1[1].value[0], 1);
        assert.equal(elements1[2].value[0], 2);
        assert.equal(elements1[3].value[0], 3);

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
        assert.equal(elements2[0].value[0], 0);
        assert.equal(elements2[1].value[0], 1);
        assert.equal(elements2[2].value[0], 2);
        assert.equal(elements2[3].value[0], 3);

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
        assert.equal(elements3[0].value.length, 1);
        assert.equal(elements3[1].value.length, 3);

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
        assert.equal(elements4[0].value.length, 3);
        assert.equal(elements4[1].value.length, 2);
    });
});
