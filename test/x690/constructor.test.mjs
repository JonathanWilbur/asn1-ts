import * as asn1 from "../../dist/index.mjs";
import { describe, it } from "node:test";
import { strict as assert } from "node:assert";

[
    asn1.BERElement,
    asn1.CERElement,
    asn1.DERElement,
].forEach((CodecElement) => {
    describe(`${CodecElement.constructor.name}'s constructor`, () => {
        it("encodes undefined correctly", () => {
            const el = new CodecElement();
            assert.equal(el.tagClass, asn1.ASN1UniversalType.endOfContent);
            assert.equal(el.construction, asn1.ASN1Construction.primitive);
            assert.equal(el.tagNumber, asn1.ASN1UniversalType.endOfContent);
            assert.equal(el.octetString.length, 0);
        });

        it("encodes a BOOLEAN correctly", () => {
            const el = new CodecElement(
                asn1.ASN1TagClass.universal,
                asn1.ASN1Construction.primitive,
                asn1.ASN1UniversalType.boolean,
                true,
            );
            assert.equal(el.boolean, true);
        });

        it("encodes an INTEGER correctly", () => {
            const el = new CodecElement(
                asn1.ASN1TagClass.universal,
                asn1.ASN1Construction.primitive,
                asn1.ASN1UniversalType.integer,
                5,
            );
            assert.equal(el.integer, 5);
        });

        it("encodes an OCTET STRING correctly", () => {
            const el = new CodecElement(
                asn1.ASN1TagClass.universal,
                asn1.ASN1Construction.primitive,
                asn1.ASN1UniversalType.octetString,
                new Uint8Array([ 1, 3, 5, 7 ]),
            );
            assert.deepEqual(el.octetString, new Uint8Array([ 1, 3, 5, 7 ]));
        });

        it("encodes a UTF8String correctly", () => {
            const el = new CodecElement(
                asn1.ASN1TagClass.universal,
                asn1.ASN1Construction.primitive,
                asn1.ASN1UniversalType.utf8String,
                "Hello World!",
            );
            assert.equal(el.utf8String, "Hello World!");
        });

        it("encodes another element correctly", () => {
            const inner = new CodecElement(
                asn1.ASN1TagClass.universal,
                asn1.ASN1Construction.primitive,
                asn1.ASN1UniversalType.boolean,
                true,
            );

            const el = new CodecElement(
                asn1.ASN1TagClass.universal,
                asn1.ASN1Construction.constructed,
                asn1.ASN1UniversalType.sequence,
                inner,
            );
            assert.equal(el.sequence[0].boolean, true);
        });

        it("encodes an OBJECT IDENTIFIER correctly", () => {
            const el = new CodecElement(
                asn1.ASN1TagClass.universal,
                asn1.ASN1Construction.primitive,
                asn1.ASN1UniversalType.objectIdentifier,
                new asn1.ObjectIdentifier([ 2, 4, 6, 8 ]),
            );
            assert.deepEqual(el.objectIdentifier.nodes, [ 2, 4, 6, 8 ]);
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
            assert.deepEqual(containedElements.length, 4);
            assert.equal(containedElements[0].boolean, false);
        });

        it("encodes a Date correctly", () => {
            const el = new CodecElement(
                asn1.ASN1TagClass.universal,
                asn1.ASN1Construction.primitive,
                asn1.ASN1UniversalType.generalizedTime,
                new Date(2019, 10, 3),
            );
            assert.equal(
                el.generalizedTime.toISOString().slice(0, 10),
                (new Date(2019, 10, 3)).toISOString().slice(0, 10)
            );
        });
    });
});
