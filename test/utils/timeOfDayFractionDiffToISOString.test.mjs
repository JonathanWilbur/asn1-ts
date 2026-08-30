import * as asn1 from "../../dist/index.mjs";
import { describe, it } from "node:test";
import { strict as assert } from "node:assert";
import timeOfDayFractionDiffToISOString from "../../dist/utils/timeOfDayFractionDiffToISOString.mjs";

describe("timeOfDayFractionDiffToISOString()", () => {
    it("stringifies a typical fractional time of day with a positive offset", () => {
        assert.equal(
            timeOfDayFractionDiffToISOString(
                new asn1.TIME_OF_DAY_FRACTION_DIFF_ENCODING(15, 58, 23, 123, 300),
            ),
            "15:58:23.123+05:00",
        );
    });

    it("pads components and uses Z for a zero offset", () => {
        assert.equal(
            timeOfDayFractionDiffToISOString(
                new asn1.TIME_OF_DAY_FRACTION_DIFF_ENCODING(1, 2, 3, 5, 0),
            ),
            "01:02:03.5Z",
        );
    });

    it("stringifies a leap second with a negative offset", () => {
        assert.equal(
            timeOfDayFractionDiffToISOString(
                new asn1.TIME_OF_DAY_FRACTION_DIFF_ENCODING(23, 59, 60, 1, -90),
            ),
            "23:59:60.1-01:30",
        );
    });
});

describe("TIME_OF_DAY_FRACTION_DIFF_ENCODING stringification", () => {
    it("delegates toISOString, toString, and toJSON to timeOfDayFractionDiffToISOString", () => {
        const time = new asn1.TIME_OF_DAY_FRACTION_DIFF_ENCODING(15, 58, 23, 123, 300);
        assert.equal(time.toISOString(), timeOfDayFractionDiffToISOString(time));
        assert.equal(time.toISOString(), "15:58:23.123+05:00");
        assert.equal(time.toString(), "15:58:23.123+05:00");
        assert.equal(time.toJSON(), "15:58:23.123+05:00");
    });
});

describe("TIME_OF_DAY_FRACTION_DIFF_ENCODING.fromISOString()", () => {
    it("parses positive, negative, and Z offsets", () => {
        const parsed = asn1.TIME_OF_DAY_FRACTION_DIFF_ENCODING.fromISOString("15:58:23.123+05:00");
        assert.equal(parsed.hours, 15);
        assert.equal(parsed.minutes, 58);
        assert.equal(parsed.seconds, 23);
        assert.equal(parsed.fractional_part, 123);
        assert.equal(parsed.minutes_diff, 300);
        assert.equal(asn1.TIME_OF_DAY_FRACTION_DIFF_ENCODING.fromISOString("01:02:03.5Z").minutes_diff, 0);
        assert.equal(
            asn1.TIME_OF_DAY_FRACTION_DIFF_ENCODING.fromISOString("23:59:60.1-01:30").toISOString(),
            "23:59:60.1-01:30",
        );
    });

    it("rejects times without an offset, and fromString delegates to fromISOString", () => {
        assert.throws(() => asn1.TIME_OF_DAY_FRACTION_DIFF_ENCODING.fromISOString("15:58:23.123"));
        assert.equal(
            asn1.TIME_OF_DAY_FRACTION_DIFF_ENCODING.fromString("15:58:23.123+05:00").toISOString(),
            "15:58:23.123+05:00",
        );
    });
});
