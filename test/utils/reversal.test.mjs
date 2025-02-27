import * as asn1 from "../../dist/index.mjs";
import { describe, it } from "node:test";
import { strict as assert } from "node:assert";

// const decodeSignedBigEndianInteger = require("../../dist/node/utils/decodeSignedBigEndianInteger.js").default;
// const encodeSignedBigEndianInteger = require("../../dist/node/utils/encodeSignedBigEndianInteger.js").default;

describe("encodeSignedBigEndianInteger()", () => {
    it("works", () => {
        for (let i = -100000; i < 100000; i += 7) {
            assert.equal(asn1.decodeSignedBigEndianInteger(asn1.encodeSignedBigEndianInteger(i)), i);
        }
    });
});
