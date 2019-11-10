const asn1 = require("../../dist/index.js");

[
    asn1.BERElement,
    asn1.CERElement,
    asn1.DERElement,
].forEach((CodecElement) => {
    describe(`${CodecElement.constructor.name}'s constructor`, () => {
        it("encodes undefined correctly", () => {
            const el = new CodecElement();
            expect(el.tagClass).toBe(asn1.ASN1UniversalType.endOfContent);
            expect(el.construction).toBe(asn1.ASN1Construction.primitive);
            expect(el.tagNumber).toBe(asn1.ASN1UniversalType.endOfContent);
            expect(el.octetString.length).toBe(0);
        });

        it("encodes a BOOLEAN correctly", () => {
            const el = new CodecElement(
                asn1.ASN1TagClass.universal,
                asn1.ASN1Construction.primitive,
                asn1.ASN1UniversalType.boolean,
                true,
            );
            expect(el.boolean).toBe(true);
        });

        it("encodes an INTEGER correctly", () => {
            const el = new CodecElement(
                asn1.ASN1TagClass.universal,
                asn1.ASN1Construction.primitive,
                asn1.ASN1UniversalType.integer,
                5,
            );
            expect(el.integer).toBe(5);
        });

        it("encodes an OCTET STRING correctly", () => {
            const el = new CodecElement(
                asn1.ASN1TagClass.universal,
                asn1.ASN1Construction.primitive,
                asn1.ASN1UniversalType.octetString,
                new Uint8Array([ 1, 3, 5, 7 ]),
            );
            expect(el.octetString).toEqual(new Uint8Array([ 1, 3, 5, 7 ]));
        });

        it("encodes a UTF8String correctly", () => {
            const el = new CodecElement(
                asn1.ASN1TagClass.universal,
                asn1.ASN1Construction.primitive,
                asn1.ASN1UniversalType.utf8String,
                "Hello World!",
            );
            expect(el.utf8String).toBe("Hello World!");
        });

        it("encodes another element correctly", () => {
            const inner = new CodecElement(
                asn1.ASN1TagClass.universal,
                asn1.ASN1Construction.primitive,
                asn1.ASN1UniversalType.boolean,
                true
            );

            const el = new CodecElement(
                asn1.ASN1TagClass.universal,
                asn1.ASN1Construction.constructed,
                asn1.ASN1UniversalType.sequence,
                inner,
            );
            expect(el.sequence[0].boolean).toBe(true);
        });

        it("encodes an OBJECT IDENTIFIER correctly", () => {
            const el = new CodecElement(
                asn1.ASN1TagClass.universal,
                asn1.ASN1Construction.primitive,
                asn1.ASN1UniversalType.objectIdentifier,
                new asn1.ObjectIdentifier([ 2, 4, 6, 8 ]),
            );
            expect(el.objectIdentifier.nodes).toEqual([ 2, 4, 6, 8 ]);
        });

        it("encodes a SEQUENCE correctly", () => {
            const el = new CodecElement(
                asn1.ASN1TagClass.universal,
                asn1.ASN1Construction.constructed,
                asn1.ASN1UniversalType.sequence,
                [
                    false,
                    "Hello!",
                    13,
                    [
                        new Date(2019, 10, 4),
                        new asn1.ObjectIdentifier([ 1, 3, 5 ]),
                    ],
                ],
            );
            const containedElements = el.sequence;
            expect(containedElements.length).toEqual(4);
            expect(containedElements[0].boolean).toBe(false);
        });

        it("encodes a Date correctly", () => {
            const el = new CodecElement(
                asn1.ASN1TagClass.universal,
                asn1.ASN1Construction.primitive,
                asn1.ASN1UniversalType.generalizedTime,
                new Date(2019, 10, 3),
            );
            expect(el.generalizedTime.toISOString().slice(0, 8))
                .toBe((new Date(2019, 10, 3)).toISOString().slice(0, 8));
        });
    });
});
