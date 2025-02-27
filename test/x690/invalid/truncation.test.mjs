import * as asn1 from "../../../dist/index.mjs";
import { describe, it } from "node:test";
import { strict as assert } from "node:assert";

[
    asn1.BERElement,
    asn1.CERElement,
    asn1.DERElement,
].forEach((CodecElement) => {
    describe(CodecElement.constructor.name, () => {
        it("throws when decoding an element with a truncated tag number", () => {
            const el = new CodecElement();
            assert.throws(() => el.fromBytes(new Uint8Array([ 31, 0x80, 0x06  ])));
        });

        it("throws when decoding a truncated OBJECT IDENTIFIER", () => {
            const el = new CodecElement();
            el.value = new Uint8Array([ 0x42, 0x80 ]);
            assert.throws(() => el.objectIdentifier);
        });

        it("throws when decoding a truncated RELATIVE OID", () => {
            const el = new CodecElement();
            el.value = new Uint8Array([ 0x80, 0x81 ]);
            assert.throws(() => el.relativeObjectIdentifier);
        });

        it("throws when decoding a truncated UniversalString", () => {
            const el = new CodecElement();
            el.value = new Uint8Array([ 0x00, 0x00, 0x00 ]);
            assert.throws(() => el.universalString);
        });

        it("throws when decoding a truncated BMPString", () => {
            const el = new CodecElement();
            el.value = new Uint8Array([ 0x00 ]);
            assert.throws(() => el.bmpString);
        });
    });
});
