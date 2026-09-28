import { isDotDelimitedRelativeOID } from "../../dist/validators/index.mjs";
import { describe, it } from "node:test";
import { strict as assert } from "node:assert";

describe("isDotDelimitedRelativeOID()", () => {
    it("accepts a single arc", () => {
        for (const s of ["0", "1", "9", "39", "40", "840", "113549"]) {
            assert.equal(isDotDelimitedRelativeOID(s), true, s);
        }
    });

    it("accepts multiple arcs with unconstrained values", () => {
        const valid: string[] = [
            "0.0",
            "3.2.1",
            "10.1.2",
            "0.40.1",
            "1.100.2",
            "840.113549.1.1.1",
            "4.0.0",
            // Arbitrarily large arcs are syntactically valid.
            `${"9".repeat(100)}.3`,
            `3.${"9".repeat(100)}`,
        ];
        for (const s of valid) {
            assert.equal(isDotDelimitedRelativeOID(s), true, s);
        }
    });

    it("rejects trailing periods, empty arcs, and leading zeroes", () => {
        for (const s of [
            "1.2.",
            ".1.2",
            "1..2",
            "1.2..3",
            ".1.2.3",
            "1.2.3.",
            ".",
            "..",
            "00",
            "01",
            "00.1",
            "0.00",
            "01.2.3",
            "1.02.3",
            "1.2.03",
        ]) {
            assert.equal(isDotDelimitedRelativeOID(s), false, s);
        }
    });

    it("rejects empty and non-numeric input", () => {
        for (const s of ["", "a", "1.2a.3", "1.2.3a", "-1.2", "1.-2", "1,2,3", " 1.2", "1.2 "]) {
            assert.equal(isDotDelimitedRelativeOID(s), false, JSON.stringify(s));
        }
        for (const v of [undefined, null, 42, {}, [], true]) {
            assert.equal(isDotDelimitedRelativeOID(v), false);
        }
    });

    it("narrows to the branded type", () => {
        const s: string = "840.113549";
        if (isDotDelimitedRelativeOID(s)) {
            const branded: typeof s & unknown = s;
            assert.equal(branded, "840.113549");
        } else {
            assert.fail("expected narrowing");
        }
    });
});
