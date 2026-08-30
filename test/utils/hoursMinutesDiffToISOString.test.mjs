import * as asn1 from "../../dist/index.mjs";
import { describe, it } from "node:test";
import { strict as assert } from "node:assert";
import hoursMinutesDiffToISOString from "../../dist/utils/hoursMinutesDiffToISOString.mjs";

describe("hoursMinutesDiffToISOString()", () => {
    it("stringifies a typical hour-minute with a positive offset", () => {
        assert.equal(
            hoursMinutesDiffToISOString(new asn1.HOURS_MINUTES_DIFF_ENCODING(15, 58, 300)),
            "15:58+05:00",
        );
    });

    it("pads hours and minutes and uses Z for a zero offset", () => {
        assert.equal(
            hoursMinutesDiffToISOString(new asn1.HOURS_MINUTES_DIFF_ENCODING(1, 2, 0)),
            "01:02Z",
        );
    });

    it("stringifies a negative offset and a half-hour offset", () => {
        assert.equal(
            hoursMinutesDiffToISOString(new asn1.HOURS_MINUTES_DIFF_ENCODING(15, 58, -300)),
            "15:58-05:00",
        );
        assert.equal(
            hoursMinutesDiffToISOString(new asn1.HOURS_MINUTES_DIFF_ENCODING(24, 0, 90)),
            "24:00+01:30",
        );
    });
});

describe("HOURS_MINUTES_DIFF_ENCODING stringification", () => {
    it("delegates toISOString, toString, and toJSON to hoursMinutesDiffToISOString", () => {
        const hoursMinutes = new asn1.HOURS_MINUTES_DIFF_ENCODING(15, 58, 300);
        assert.equal(hoursMinutes.toISOString(), hoursMinutesDiffToISOString(hoursMinutes));
        assert.equal(hoursMinutes.toISOString(), "15:58+05:00");
        assert.equal(hoursMinutes.toString(), "15:58+05:00");
        assert.equal(hoursMinutes.toJSON(), "15:58+05:00");
    });
});

describe("HOURS_MINUTES_DIFF_ENCODING.fromISOString()", () => {
    it("parses positive, negative, and Z offsets", () => {
        const parsed = asn1.HOURS_MINUTES_DIFF_ENCODING.fromISOString("15:58+05:00");
        assert.equal(parsed.hours, 15);
        assert.equal(parsed.minutes, 58);
        assert.equal(parsed.minutes_diff, 300);
        assert.equal(asn1.HOURS_MINUTES_DIFF_ENCODING.fromISOString("01:02Z").minutes_diff, 0);
        assert.equal(asn1.HOURS_MINUTES_DIFF_ENCODING.fromISOString("15:58-05:00").toISOString(), "15:58-05:00");
    });

    it("rejects hour-minutes without an offset, and fromString delegates to fromISOString", () => {
        assert.throws(() => asn1.HOURS_MINUTES_DIFF_ENCODING.fromISOString("15:58"));
        assert.equal(
            asn1.HOURS_MINUTES_DIFF_ENCODING.fromString("15:58+05:00").toISOString(),
            "15:58+05:00",
        );
    });
});
