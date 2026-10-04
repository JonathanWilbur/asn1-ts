import { isASN1BinaryString, toASN1BinaryString } from "../../dist/validators/index.mjs";
import { describe, it } from "node:test";
import { strict as assert } from "node:assert";

describe("isASN1BinaryString()", () => {
    it("accepts valid binary strings", () => {
        for (const s of ["''B", "'0'B", "'1'B", "'1001010'B", "'0000'B", `'${"01".repeat(500)}'B`]) {
            assert.equal(isASN1BinaryString(s), true, s);
        }
    });

    it("rejects non-binary digits and malformed framing", () => {
        for (const s of [
            "",
            "'",
            "'B",
            "''",
            "'0'",
            "'0'b", // Lowercase "b" is not valid.
            "'0'H", // Wrong trailing letter.
            "0'B", // Missing leading quote.
            "'0'B ", // Trailing whitespace.
            " '0'B",
            "'02'B",
            "'10 10'B", // Whitespace is not permitted.
            "'1\n0'B",
            "''b",
            "'0''B", // Stray quote.
            "''BB",
        ]) {
            assert.equal(isASN1BinaryString(s), false, JSON.stringify(s));
        }
    });

    it("narrows to the branded type", () => {
        const s: string = "'1001010'B";
        if (isASN1BinaryString(s)) {
            const branded: typeof s & unknown = s;
            assert.equal(branded, "'1001010'B");
        } else {
            assert.fail("expected narrowing");
        }
    });
});

describe("toASN1BinaryString()", () => {
    it("brands valid literals", () => {
        assert.equal(toASN1BinaryString("'1001'B"), "'1001'B");
        assert.equal(toASN1BinaryString("''B"), "''B");
    });

    it("throws on invalid input", () => {
        for (const s of ["'102'B", "'1'b", "1001", ""]) {
            assert.throws(() => toASN1BinaryString(s));
        }
    });
});
