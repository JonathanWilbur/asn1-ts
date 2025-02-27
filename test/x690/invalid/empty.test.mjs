import * as asn1 from "../../../dist/index.mjs";
import { describe, it } from "node:test";
import { strict as assert } from "node:assert";

[
    asn1.BERElement,
    asn1.CERElement,
    asn1.DERElement,
].forEach((CodecElement) => {
    describe(CodecElement.constructor.name, () => {
        it("throws when decoding a zero-byte BOOLEAN", () => {
            const el = new CodecElement();
            el.value = new Uint8Array(0);
            assert.throws(() => el.boolean);
        });

        it("throws when decoding a zero-byte INTEGER", () => {
            const el = new CodecElement();
            el.value = new Uint8Array(0);
            assert.throws(() => el.integer);
        });

        it("throws when decoding a zero-byte BIT STRING", () => {
            const el = new CodecElement();
            el.value = new Uint8Array(0);
            assert.throws(() => el.bitString);
        });

        it("throws when decoding a zero-byte OBJECT IDENTIFIER", () => {
            const el = new CodecElement();
            el.value = new Uint8Array(0);
            assert.throws(() => el.objectIdentifier);
        });

        it("throws when decoding a zero-byte ENUMERATED", () => {
            const el = new CodecElement();
            el.value = new Uint8Array(0);
            assert.throws(() => el.enumerated);
        });

        it("throws when decoding a zero-byte UTCTime", () => {
            const el = new CodecElement();
            el.value = new Uint8Array(0);
            assert.throws(() => el.utcTime);
        });

        it("throws when decoding a zero-byte GeneralizedTime", () => {
            const el = new CodecElement();
            el.value = new Uint8Array(0);
            assert.throws(() => el.generalizedTime);
        });
    });
});
