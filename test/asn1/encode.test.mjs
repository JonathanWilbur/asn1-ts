import * as asn1 from "../../dist/index.mjs";
import { describe, it } from "node:test";
import { strict as assert } from "node:assert";

[
    asn1.BERElement,
    asn1.CERElement,
    asn1.DERElement,
].forEach((CodecElement) => {
    describe(CodecElement.constructor.name, () => {
        it("encodes SET OF correctly", () => {
            const el1 = new CodecElement();
            el1.integer = 5;
            const el2 = new CodecElement();
            el2.utf8String = "Hello";
            const el3 = new CodecElement();
            el3.boolean = true;

            const setty = new CodecElement();
            setty.encode(new Set([ el1, el2, el3, 5, null, "hey", 4.5 ]));
            assert.equal(setty.setOf.length, 7);
        });
    });
});
