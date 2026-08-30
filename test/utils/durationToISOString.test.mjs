import * as asn1 from "../../dist/index.mjs";
import { describe, it } from "node:test";
import { strict as assert } from "node:assert";
import durationToISOString from "../../dist/utils/durationToISOString.mjs";

const frac = (number_of_digits, fractional_value) => ({
    number_of_digits,
    fractional_value,
});

describe("durationToISOString()", () => {
    it("stringifies an empty duration as PT0S", () => {
        assert.equal(
            durationToISOString(new asn1.DURATION_EQUIVALENT()),
            "PT0S",
        );
    });

    it("stringifies a full date-time duration", () => {
        assert.equal(
            durationToISOString(new asn1.DURATION_EQUIVALENT(
                2020, 3, undefined, 7, 15, 58, 23,
            )),
            "P2020Y3M7DT15H58M23S",
        );
    });

    it("stringifies a date-only duration without a time designator", () => {
        assert.equal(
            durationToISOString(new asn1.DURATION_EQUIVALENT(1, 2, undefined, 3)),
            "P1Y2M3D",
        );
    });

    it("stringifies a time-only duration with a time designator", () => {
        assert.equal(
            durationToISOString(new asn1.DURATION_EQUIVALENT(
                undefined, undefined, undefined, undefined, 1, 2, 3,
            )),
            "PT1H2M3S",
        );
        assert.equal(
            durationToISOString(new asn1.DURATION_EQUIVALENT(
                undefined, undefined, undefined, undefined, 1,
            )),
            "PT1H",
        );
    });

    it("omits absent components and still inserts T before time", () => {
        assert.equal(
            durationToISOString(new asn1.DURATION_EQUIVALENT(
                2020, 3, undefined, 7, undefined, 58, 23,
            )),
            "P2020Y3M7DT58M23S",
        );
    });

    it("omits zeroed components", () => {
        assert.equal(
            durationToISOString(new asn1.DURATION_EQUIVALENT(
                0, 3, undefined, 0,
            )),
            "P3M",
        );
        assert.equal(
            durationToISOString(new asn1.DURATION_EQUIVALENT(
                undefined, undefined, 0,
            )),
            "PT0S",
        );
    });

    it("stringifies weeks", () => {
        assert.equal(
            durationToISOString(new asn1.DURATION_EQUIVALENT(
                undefined, undefined, 4,
            )),
            "P4W",
        );
    });

    it("stringifies a fractional weeks duration", () => {
        assert.equal(
            durationToISOString(new asn1.DURATION_EQUIVALENT(
                undefined, undefined, 4, undefined, undefined, undefined, undefined,
                frac(4, 5678),
            )),
            "P4.5678W",
        );
    });

    it("attaches the fraction to the smallest present component", () => {
        assert.equal(
            durationToISOString(new asn1.DURATION_EQUIVALENT(
                2020, 3, undefined, 7, 15, 58, 23, frac(3, 123),
            )),
            "P2020Y3M7DT15H58M23.123S",
        );
        assert.equal(
            durationToISOString(new asn1.DURATION_EQUIVALENT(
                2020, 3, undefined, 7, undefined, 58, undefined, frac(3, 123),
            )),
            "P2020Y3M7DT58.123M",
        );
        assert.equal(
            durationToISOString(new asn1.DURATION_EQUIVALENT(
                undefined, undefined, undefined, undefined, 15, undefined, undefined,
                frac(1, 5),
            )),
            "PT15.5H",
        );
        assert.equal(
            durationToISOString(new asn1.DURATION_EQUIVALENT(
                undefined, undefined, undefined, 7, undefined, undefined, undefined,
                frac(2, 25),
            )),
            "P7.25D",
        );
        assert.equal(
            durationToISOString(new asn1.DURATION_EQUIVALENT(
                undefined, 3, undefined, undefined, undefined, undefined, undefined,
                frac(1, 5),
            )),
            "P3.5M",
        );
        assert.equal(
            durationToISOString(new asn1.DURATION_EQUIVALENT(
                1, undefined, undefined, undefined, undefined, undefined, undefined,
                frac(2, 25),
            )),
            "P1.25Y",
        );
    });

    it("pads the fractional value to number_of_digits", () => {
        assert.equal(
            durationToISOString(new asn1.DURATION_EQUIVALENT(
                undefined, undefined, undefined, undefined, undefined, 0, undefined,
                frac(2, 5),
            )),
            "PT0.05M",
        );
        assert.equal(
            durationToISOString(new asn1.DURATION_EQUIVALENT(
                undefined, undefined, undefined, undefined, undefined, undefined, 1,
                frac(5, 3),
            )),
            "PT1.00003S",
        );
    });

    it("keeps a zero integer part when that component carries the fraction", () => {
        assert.equal(
            durationToISOString(new asn1.DURATION_EQUIVALENT(
                undefined, undefined, undefined, undefined, undefined, undefined, 0,
                frac(3, 123),
            )),
            "PT0.123S",
        );
    });

    it("ignores a fractional part when no component is present", () => {
        const value = {
            years: undefined,
            months: undefined,
            weeks: undefined,
            days: undefined,
            hours: undefined,
            minutes: undefined,
            seconds: undefined,
            fractional_part: frac(3, 123),
        };
        assert.equal(durationToISOString(value), "PT0S");
    });

    it("stringifies bigint component values", () => {
        const value = {
            years: 1n,
            months: 2n,
            weeks: undefined,
            days: 3n,
            hours: 4n,
            minutes: 5n,
            seconds: 6n,
            fractional_part: undefined,
        };
        assert.equal(durationToISOString(value), "P1Y2M3DT4H5M6S");
    });
});

describe("DURATION_EQUIVALENT.toISOString()", () => {
    it("delegates to durationToISOString", () => {
        const duration = new asn1.DURATION_EQUIVALENT(
            2020, 3, undefined, 7, 15, 58, 23,
        );
        assert.equal(duration.toISOString(), durationToISOString(duration));
        assert.equal(duration.toISOString(), "P2020Y3M7DT15H58M23S");
    });

    it("does not change toString value notation", () => {
        const duration = new asn1.DURATION_EQUIVALENT(1, 2, undefined, 3);
        assert.equal(duration.toISOString(), "P1Y2M3D");
        assert.match(duration.toString(), /^DURATION \{ /);
    });
});
