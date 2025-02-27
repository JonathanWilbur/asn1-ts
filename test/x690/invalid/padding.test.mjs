import * as asn1 from "../../../dist/index.mjs";
import { describe, it } from "node:test";
import { strict as assert } from "node:assert";

[
    asn1.BERElement,
    asn1.CERElement,
    asn1.DERElement,
].forEach((CodecElement) => {
    describe(CodecElement.constructor.name, () => {
        it("throws when decoding an element with unnecessary padding bytes on the tag number", () => {
            const el = new CodecElement();
            assert.throws(() => el.fromBytes(new Uint8Array([ 31, 0x80, 0x06  ])));
        });

        it("throws when decoding an INTEGER with unnecessary padding", () => {
            const el = new CodecElement();
            el.value = new Uint8Array([ 0xFF, 0xFF, 0xF3 ]);
            assert.throws(() => el.integer);
        });

        it("throws when decoding an OBJECT IDENTIFIER with unnecessary padding", () => {
            const el = new CodecElement();
            el.value = new Uint8Array([ 0x42, 0x80, 0x06 ]);
            assert.throws(() => el.objectIdentifier);
        });

        it("throws when decoding an ENUMERATED with unnecessary padding", () => {
            const el = new CodecElement();
            el.value = new Uint8Array([ 0xFF, 0xFF, 0xF3 ]);
            assert.throws(() => el.enumerated);
        });

        it("throws when decoding a RELATIVE OID with unnecessary padding", () => {
            const el = new CodecElement();
            el.value = new Uint8Array([ 0x80, 0x06 ]);
            assert.throws(() => el.relativeObjectIdentifier);
        });
    });
});
