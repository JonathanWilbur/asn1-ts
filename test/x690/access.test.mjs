import * as asn1 from "../../dist/index.mjs";
import { describe, it } from "node:test";
import { strict as assert } from "node:assert";

[
    asn1.BERElement,
    asn1.CERElement,
    asn1.DERElement,
].forEach((CodecElement) => {
    describe(CodecElement.constructor.name, () => {
        it("does not change in value when the BOOLEAN accessor is called", () => {
            const el = new CodecElement();
            el.value = new Uint8Array([ 0xFF ]);
            assert.equal(el.boolean, el.boolean);
        });

        it("does not change in value when the INTEGER accessor is called", () => {
            const el = new CodecElement();
            el.value = new Uint8Array([ 0xF3 ]);
            assert.equal(el.integer, el.integer);
        });

        it("does not change in value when the BIT STRING accessor is called", () => {
            const el = new CodecElement();
            el.value = new Uint8Array([ 0x03, 0xC0 ]);
            assert.deepEqual(el.bitString, el.bitString);
        });

        it("does not change in value when the OCTET STRING accessor is called", () => {
            const el = new CodecElement();
            el.value = new Uint8Array([ 0xFF ]);
            assert.deepEqual(el.octetString, el.octetString);
        });

        it("does not change in value when the OBJECT IDENTIFIER accessor is called", () => {
            const el = new CodecElement();
            el.value = new Uint8Array([ 0x42, 0x03 ]);
            assert.deepEqual(el.objectIdentifier, el.objectIdentifier);
        });

        it("does not change in value when the ObjectDescriptor accessor is called", () => {
            const el = new CodecElement();
            el.value = new Uint8Array([ 0x39 ]);
            assert.equal(el.objectDescriptor, el.objectDescriptor);
        });

        it("does not change in value when the REAL accessor is called", () => {
            const el = new CodecElement();
            el.value = new Uint8Array([ asn1.ASN1SpecialRealValue.plusInfinity ]);
            assert.equal(el.real, el.real);
        });

        it("does not change in value when the ENUMERATED accessor is called", () => {
            const el = new CodecElement();
            el.value = new Uint8Array([ 0xFF ]);
            assert.equal(el.enumerated, el.enumerated);
        });

        it("does not change in value when the UTF8String accessor is called", () => {
            const el = new CodecElement();
            el.value = new Uint8Array([ 0x39, 0x42 ]);
            assert.equal(el.utf8String, el.utf8String);
        });

        it("does not change in value when the RELATIVE OID accessor is called", () => {
            const el = new CodecElement();
            el.value = new Uint8Array([ 0x06, 0x03 ]);
            assert.deepEqual(el.relativeObjectIdentifier, el.relativeObjectIdentifier);
        });

        it("does not change in value when the SEQUENCE accessor is called", () => {
            const el = new CodecElement();
            el.construction = asn1.ASN1Construction.constructed;
            el.value = new Uint8Array([ 1, 1, 0xFF, 2, 1, 0x00 ]);
            assert.deepEqual(el.sequence, el.sequence);
        });

        it("does not change in value when the SET accessor is called", () => {
            const el = new CodecElement();
            el.construction = asn1.ASN1Construction.constructed;
            el.value = new Uint8Array([ 1, 1, 0xFF, 2, 1, 0x00 ]);
            assert.deepEqual(el.sequence, el.sequence);
        });

        it("does not change in value when the NumericString accessor is called", () => {
            const el = new CodecElement();
            el.value = new Uint8Array([ 0x39, 0x36 ]);
            assert.equal(el.numericString, el.numericString);
        });

        it("does not change in value when the PrintableString accessor is called", () => {
            const el = new CodecElement();
            el.value = new Uint8Array([ 0x39, 0x42 ]);
            assert.equal(el.printableString, el.printableString);
        });

        it("does not change in value when the TeletexString accessor is called", () => {
            const el = new CodecElement();
            el.value = new Uint8Array([ 0xFF ]);
            assert.deepEqual(el.teletexString, el.teletexString);
        });

        it("does not change in value when the Videotex accessor is called", () => {
            const el = new CodecElement();
            el.value = new Uint8Array([ 0xFF ]);
            assert.deepEqual(el.videotexString, el.videotexString);
        });

        it("does not change in value when the IA5String accessor is called", () => {
            const el = new CodecElement();
            el.value = new Uint8Array([ 0x39, 0x42 ]);
            assert.equal(el.ia5String, el.ia5String);
        });

        // it('does not change in value when the UTCTime accessor is called', () => {
        //     const el = new CodecElement();
        //     el.utcTime = new Date();
        //     assert.deepEqual(el.utcTime, el.utcTime);
        // });

        // it('does not change in value when the GeneralizedTime accessor is called', () => {
        //     const el = new CodecElement();
        //     el.generalizedTime = new Date();
        //     assert.deepEqual(el.generalizedTime, el.generalizedTime);
        // });

        it("does not change in value when the GraphicString accessor is called", () => {
            const el = new CodecElement();
            el.graphicString = "asdf";
            assert.equal(el.graphicString, el.graphicString);
        });

        it("does not change in value when the VisibleString accessor is called", () => {
            const el = new CodecElement();
            el.visibleString = "asdf";
            assert.equal(el.visibleString, el.visibleString);
        });

        it("does not change in value when the GeneralString accessor is called", () => {
            const el = new CodecElement();
            el.generalString = "asdf";
            assert.equal(el.generalString, el.generalString);
        });

        it("does not change in value when the UniversalString accessor is called", () => {
            const el = new CodecElement();
            el.universalString = "asdf";
            assert.equal(el.universalString, el.universalString);
        });

        it("does not change in value when the BMPString accessor is called", () => {
            const el = new CodecElement();
            el.bmpString = "asdf";
            assert.equal(el.bmpString, el.bmpString);
        });
    });
});
