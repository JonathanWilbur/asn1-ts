import * as asn1 from "../../dist/index.mjs";
import { describe, it } from "node:test";
import { strict as assert } from "node:assert";

[
    asn1.BERElement,
    asn1.CERElement,
    asn1.DERElement,
].forEach((CodecElement) => {
    describe(CodecElement.constructor.name, () => {
        it("decodes tag class correctly", () => {
            const el = new CodecElement();
            el.fromBytes(new Uint8Array([ 0xF0, 0x00 ]));
            assert.equal(el.tagClass, asn1.ASN1TagClass.private);
        });
    });
});
