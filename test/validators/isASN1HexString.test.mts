import { isASN1HexString, toASN1HexString } from "../../dist/validators/index.mjs";
import { describe, it } from "node:test";
import { strict as assert } from "node:assert";

describe("isASN1HexString()", () => {
    it("accepts valid hexadecimal strings", () => {
        for (const s of [
            "''H",
            "'00'H",
            "'04DEFA'H",
            "'04defa'H", // Lower-case digits are valid.
            "'04DeFa'H", // Mixed-case digits are valid.
            "'FF'H",
            `'${"ab".repeat(500)}'H`,
        ]) {
            assert.equal(isASN1HexString(s), true, s);
        }
    });

    it("rejects odd digit counts and non-hexadecimal digits", () => {
        for (const s of [
            "'0'H", // Odd number of digits cannot encode whole octets.
            "'ABC'H",
            "'0G'H",
            "'ZZ'H",
            "'12 34'H", // Whitespace is not permitted.
            "'12\n34'H",
        ]) {
            assert.equal(isASN1HexString(s), false, JSON.stringify(s));
        }
    });

    it("rejects malformed framing", () => {
        for (const s of [
            "",
            "'",
            "'H",
            "''",
            "'00'",
            "'00'h", // Lowercase "h" is not valid.
            "'00'B", // Wrong trailing letter.
            "00'H", // Missing leading quote.
            "'00'H ", // Trailing whitespace.
            " '00'H",
            "'00''H", // Stray quote.
            "''HH",
        ]) {
            assert.equal(isASN1HexString(s), false, JSON.stringify(s));
        }
    });

    it("rejects non-string input", () => {
        for (const v of [undefined, null, 42, {}, [], true]) {
            assert.equal(isASN1HexString(v), false);
        }
    });

    it("narrows to the branded type", () => {
        const s: string = "'04DEFA'H";
        if (isASN1HexString(s)) {
            const branded: typeof s & unknown = s;
            assert.equal(branded, "'04DEFA'H");
        } else {
            assert.fail("expected narrowing");
        }
    });
});

describe("toASN1HexString()", () => {
    it("brands valid literals", () => {
        assert.equal(toASN1HexString("'04DEFA'H"), "'04DEFA'H");
        assert.equal(toASN1HexString("''H"), "''H");
    });

    it("throws on invalid input", () => {
        for (const s of ["'ABC'H", "'00'h", "04DE", ""]) {
            assert.throws(() => toASN1HexString(s));
        }
    });
});
