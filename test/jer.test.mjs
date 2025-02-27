import * as asn1 from "../dist/index.mjs";
import { describe, it } from "node:test";
import { strict as assert } from "node:assert";

describe("JSON Encoding Rules", () => {
    it("Converts a BigInt into a string", () => {
        const el = new asn1.BERElement();
        el.tagNumber = 2;
        el.integer = 45081095376109356095179030960913561n;
        assert.equal(el.toJSON(), "45081095376109356095179030960913561");
    });
});
