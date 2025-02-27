import * as asn1 from "../../../dist/index.mjs";
import { describe, it } from "node:test";
import { strict as assert } from "node:assert";

[
    asn1.BERElement,
    asn1.CERElement,
    asn1.DERElement,
].forEach((CodecElement) => {
    describe(CodecElement.constructor.name, () => {
        it("throws when decoding an excessively large INTEGER", () => {
            const el = new CodecElement();
            el.value = new Uint8Array([ 0xFF, 0xFF, 0xFF, 0xFF, 0xF3 ]);
            assert.throws(() => el.integer);
        });

        it("throws when decoding an OBJECT IDENTIFIER that contains an excessively large number", () => {
            const el = new CodecElement();
            el.value = new Uint8Array([ 0x43, 0x8F, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF ]);
            assert.throws(() => el.objectIdentifier);
        });

        it("throws when decoding an excessively large ENUMERATED", () => {
            const el = new CodecElement();
            el.value = new Uint8Array([ 0xFF, 0xFF, 0xFF, 0xFF, 0xF3 ]);
            assert.throws(() => el.enumerated);
        });

        it("throws when decoding a RELATIVE OID that contains an excessively large number", () => {
            const el = new CodecElement();
            el.value = new Uint8Array([ 0x8F, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF ]);
            assert.throws(() => el.relativeObjectIdentifier);
        });
    });
});
