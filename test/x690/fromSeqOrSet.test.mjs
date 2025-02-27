import * as asn1 from "../../dist/index.mjs";
import { describe, it } from "node:test";
import { strict as assert } from "node:assert";

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
            assert.equal(el.sequence.length, 2);
            assert.equal(el.sequence[0].boolean, false);
            assert.equal(el.sequence[1].boolean, true);
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
            assert.equal(el.setOf.length, 2);
            assert.equal(el.setOf[0].boolean, false);
            assert.equal(el.setOf[1].boolean, true);
        });
    });
});
