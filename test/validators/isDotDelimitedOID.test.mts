import { isDotDelimitedOID } from "../../dist/validators/index.mjs";
import { describe, it } from "node:test";
import { strict as assert } from "node:assert";

describe("isDotDelimitedOID()", () => {
    it("accepts valid OIDs", () => {
        const valid: string[] = [
            "0.0",
            "0.9",
            "0.39",
            "1.0",
            "1.39",
            "2.0",
            "2.39",
            "2.40",
            "2.100",
            "0.0.0",
            "1.2.840.113549",
            "1.2.840.113549.1.1.1",
            "2.5.4.3",
            // Arbitrarily large arcs are syntactically valid.
            `2.${"9".repeat(100)}.3`,
        ];
        for (const s of valid) {
            assert.equal(isDotDelimitedOID(s), true, s);
        }
    });

    it("rejects a first arc other than 0, 1, or 2", () => {
        for (const s of ["3.2", "10.1.2", "4.0.0", "9.9.9"]) {
            assert.equal(isDotDelimitedOID(s), false, s);
        }
    });

    it("rejects a second arc over 39 when the first arc is 0 or 1", () => {
        for (const s of ["0.40", "1.40", "0.40.1", "1.100.2"]) {
            assert.equal(isDotDelimitedOID(s), false, s);
        }
        assert.equal(isDotDelimitedOID("0.39.0"), true);
        assert.equal(isDotDelimitedOID("1.39.9"), true);
    });

    it("rejects trailing periods, empty arcs, and leading zeroes", () => {
        for (const s of [
            "1.2.",
            ".1.2",
            "1..2",
            "1.2..3",
            ".1.2.3",
            "1.2.3.",
            "00.1",
            "0.00",
            "01.2.3",
            "1.02.3",
            "1.2.03",
            "2.5.4.03",
            "1.39.01",
        ]) {
            assert.equal(isDotDelimitedOID(s), false, s);
        }
    });

    it("rejects strings with fewer than two arcs and non-numeric input", () => {
        for (const s of ["", "0", "1", "00", "123", "a", "1.2a.3", "1.2.3a", "-1.2.3", "1.-2.3", "1,2,3", " 1.2.3", "1.2.3 "]) {
            assert.equal(isDotDelimitedOID(s), false, JSON.stringify(s));
        }
    });

    it("narrows to the branded type", () => {
        const s: string = "1.2.3";
        if (isDotDelimitedOID(s)) {
            const branded: typeof s & unknown = s;
            assert.equal(branded, "1.2.3");
        } else {
            assert.fail("expected narrowing");
        }
    });
});
