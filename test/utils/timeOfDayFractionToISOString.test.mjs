import * as asn1 from "../../dist/index.mjs";
import { describe, it } from "node:test";
import { strict as assert } from "node:assert";
import timeOfDayFractionToISOString from "../../dist/utils/timeOfDayFractionToISOString.mjs";

describe("timeOfDayFractionToISOString()", () => {
    it("stringifies a typical fractional time of day", () => {
        assert.equal(
            timeOfDayFractionToISOString(new asn1.TIME_OF_DAY_FRACTION_ENCODING(15, 58, 23, 123)),
            "15:58:23.123",
        );
    });

    it("pads hours, minutes, and seconds to two digits", () => {
        assert.equal(
            timeOfDayFractionToISOString(new asn1.TIME_OF_DAY_FRACTION_ENCODING(1, 2, 3, 5)),
            "01:02:03.5",
        );
    });

    it("always includes the fractional part, including zero", () => {
        assert.equal(
            timeOfDayFractionToISOString(new asn1.TIME_OF_DAY_FRACTION_ENCODING(0, 0, 0, 0)),
            "00:00:00.0",
        );
        assert.equal(
            timeOfDayFractionToISOString(new asn1.TIME_OF_DAY_FRACTION_ENCODING(24, 0, 0, 0)),
            "24:00:00.0",
        );
    });

    it("stringifies a leap second with a fraction", () => {
        assert.equal(
            timeOfDayFractionToISOString(new asn1.TIME_OF_DAY_FRACTION_ENCODING(23, 59, 60, 1)),
            "23:59:60.1",
        );
    });
});

describe("TIME_OF_DAY_FRACTION_ENCODING stringification", () => {
    it("delegates toISOString, toString, and toJSON to timeOfDayFractionToISOString", () => {
        const time = new asn1.TIME_OF_DAY_FRACTION_ENCODING(15, 58, 23, 123);
        assert.equal(time.toISOString(), timeOfDayFractionToISOString(time));
        assert.equal(time.toISOString(), "15:58:23.123");
        assert.equal(time.toString(), "15:58:23.123");
        assert.equal(time.toJSON(), "15:58:23.123");
    });
});

describe("TIME_OF_DAY_FRACTION_ENCODING.fromISOString()", () => {
    it("parses typical, padded, and zero-fraction times", () => {
        const parsed = asn1.TIME_OF_DAY_FRACTION_ENCODING.fromISOString("15:58:23.123");
        assert.equal(parsed.hours, 15);
        assert.equal(parsed.minutes, 58);
        assert.equal(parsed.seconds, 23);
        assert.equal(parsed.fractional_part, 123);
        assert.equal(asn1.TIME_OF_DAY_FRACTION_ENCODING.fromISOString("01:02:03.5").toISOString(), "01:02:03.5");
        assert.equal(asn1.TIME_OF_DAY_FRACTION_ENCODING.fromISOString("00:00:00.0").fractional_part, 0);
    });

    it("rejects times without a fraction, and fromString delegates to fromISOString", () => {
        assert.throws(() => asn1.TIME_OF_DAY_FRACTION_ENCODING.fromISOString("15:58:23"));
        assert.equal(
            asn1.TIME_OF_DAY_FRACTION_ENCODING.fromString("15:58:23.123").toISOString(),
            "15:58:23.123",
        );
    });
});
