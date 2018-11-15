describe('X.690 abstract codec', () => {

    it('correctly identifies canonical ordering of tag classes', () => {
        const data1 = [
            new DERElement(
                ASN1TagClass.application,
                ASN1Construction.primitive,
                0
            ),
            new DERElement(
                ASN1TagClass.private,
                ASN1Construction.primitive,
                0
            )
        ];

        const data2 = [
            new DERElement(
                ASN1TagClass.universal,
                ASN1Construction.primitive,
                0
            ),
            new DERElement(
                ASN1TagClass.application,
                ASN1Construction.primitive,
                0
            ),
            new DERElement(
                ASN1TagClass.private,
                ASN1Construction.primitive,
                0
            ),
            new DERElement(
                ASN1TagClass.context,
                ASN1Construction.primitive,
                0
            )
        ];

        const data3 = [
            new DERElement(
                ASN1TagClass.universal,
                ASN1Construction.primitive,
                0
            ),
            new DERElement(
                ASN1TagClass.context,
                ASN1Construction.primitive,
                0
            )
        ];

        expect(DERElement.isInCanonicalOrder(data1)).toBeTruthy();
        expect(DERElement.isInCanonicalOrder(data2)).toBeTruthy();
        expect(DERElement.isInCanonicalOrder(data3)).toBeTruthy();
    });

    it('correctly identifies non-canonical ordering of tag classes', () => {

        const data1 = [
            new DERElement(
                ASN1TagClass.universal,
                ASN1Construction.primitive,
                0
            ),
            new DERElement(
                ASN1TagClass.private,
                ASN1Construction.primitive,
                0
            ),
            new DERElement(
                ASN1TagClass.application,
                ASN1Construction.primitive,
                0
            ),
            new DERElement(
                ASN1TagClass.context,
                ASN1Construction.primitive,
                0
            )
        ];

        const data2 = [
            new DERElement(
                ASN1TagClass.context,
                ASN1Construction.primitive,
                0
            ),
            new DERElement(
                ASN1TagClass.application,
                ASN1Construction.primitive,
                0
            ),
            new DERElement(
                ASN1TagClass.private,
                ASN1Construction.primitive,
                0
            ),
            new DERElement(
                ASN1TagClass.universal,
                ASN1Construction.primitive,
                0
            )
        ];

        const data3 = [
            new DERElement(
                ASN1TagClass.universal,
                ASN1Construction.primitive,
                0
            ),
            new DERElement(
                ASN1TagClass.application,
                ASN1Construction.primitive,
                0
            ),
            new DERElement(
                ASN1TagClass.universal,
                ASN1Construction.primitive,
                0
            ),
            new DERElement(
                ASN1TagClass.universal,
                ASN1Construction.primitive,
                0
            )
        ];

        expect(DERElement.isInCanonicalOrder(data1)).toBeFalsy();
        expect(DERElement.isInCanonicalOrder(data2)).toBeFalsy();
        expect(DERElement.isInCanonicalOrder(data3)).toBeFalsy();
    });

    it('correctly identifies canonical ordering of tag number', () => {

        // Simple ascending
        const data1 = [
            new DERElement(
                ASN1TagClass.universal,
                ASN1Construction.primitive,
                0
            ),
            new DERElement(
                ASN1TagClass.universal,
                ASN1Construction.primitive,
                1
            ),
            new DERElement(
                ASN1TagClass.universal,
                ASN1Construction.primitive,
                2
            )
        ];

        // No change between elements
        const data2 = [
            new DERElement(
                ASN1TagClass.universal,
                ASN1Construction.primitive,
                0
            ),
            new DERElement(
                ASN1TagClass.universal,
                ASN1Construction.primitive,
                0
            ),
            new DERElement(
                ASN1TagClass.universal,
                ASN1Construction.primitive,
                0
            )
        ];

        // Ascending between two classes
        const data3 = [
            new DERElement(
                ASN1TagClass.universal,
                ASN1Construction.primitive,
                0
            ),
            new DERElement(
                ASN1TagClass.universal,
                ASN1Construction.primitive,
                1
            ),
            new DERElement(
                ASN1TagClass.application,
                ASN1Construction.primitive,
                0
            ),
            new DERElement(
                ASN1TagClass.application,
                ASN1Construction.primitive,
                1
            )
        ];

        expect(DERElement.isInCanonicalOrder(data1)).toBeTruthy();
        expect(DERElement.isInCanonicalOrder(data2)).toBeTruthy();
        expect(DERElement.isInCanonicalOrder(data3)).toBeTruthy();
    });

    it('correctly identifies non-canonical ordering of tag number', () => {

        // Simple ascending
        const data1 = [
            new DERElement(
                ASN1TagClass.universal,
                ASN1Construction.primitive,
                0
            ),
            new DERElement(
                ASN1TagClass.universal,
                ASN1Construction.primitive,
                2
            ),
            new DERElement(
                ASN1TagClass.universal,
                ASN1Construction.primitive,
                1
            )
        ];

        // Ascending between two classes
        const data2 = [
            new DERElement(
                ASN1TagClass.universal,
                ASN1Construction.primitive,
                0
            ),
            new DERElement(
                ASN1TagClass.universal,
                ASN1Construction.primitive,
                1
            ),
            new DERElement(
                ASN1TagClass.universal,
                ASN1Construction.application,
                5
            ),
            new DERElement(
                ASN1TagClass.universal,
                ASN1Construction.application,
                4
            )
        ];

        expect(DERElement.isInCanonicalOrder(data1)).toBeFalsy();
        expect(DERElement.isInCanonicalOrder(data2)).toBeFalsy();
    });

    it('correctly identifies element arrays with duplicated (tag class, tag number) values', () => {
        const data1 = [
            new DERElement(
                ASN1TagClass.universal,
                ASN1Construction.primitive,
                0
            ),
            new DERElement(
                ASN1TagClass.universal,
                ASN1Construction.primitive,
                2
            ),
            new DERElement(
                ASN1TagClass.universal,
                ASN1Construction.primitive,
                2
            )
        ];

        const data2 = [
            new DERElement(
                ASN1TagClass.universal,
                ASN1Construction.primitive,
                2
            ),
            new DERElement(
                ASN1TagClass.universal,
                ASN1Construction.primitive,
                0
            ),
            new DERElement(
                ASN1TagClass.universal,
                ASN1Construction.primitive,
                2
            )
        ];

        expect(DERElement.isUniquelyTagged(data1)).toBeFalsy();
        expect(DERElement.isUniquelyTagged(data2)).toBeFalsy();
    });

    it('correctly identifies element arrays with non-duplicated (tag class, tag number) values', () => {
        const data1 = [
            new DERElement(
                ASN1TagClass.universal,
                ASN1Construction.primitive,
                0
            ),
            new DERElement(
                ASN1TagClass.universal,
                ASN1Construction.primitive,
                2
            ),
            new DERElement(
                ASN1TagClass.application,
                ASN1Construction.primitive,
                2
            )
        ];

        const data2 = [
            new DERElement(
                ASN1TagClass.application,
                ASN1Construction.primitive,
                2
            ),
            new DERElement(
                ASN1TagClass.universal,
                ASN1Construction.primitive,
                0
            ),
            new DERElement(
                ASN1TagClass.private,
                ASN1Construction.primitive,
                2
            )
        ];
        expect(DERElement.isUniquelyTagged(data1)).toBeTruthy();
        expect(DERElement.isUniquelyTagged(data2)).toBeTruthy();
    });
});