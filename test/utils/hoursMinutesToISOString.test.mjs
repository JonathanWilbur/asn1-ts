import * as asn1 from "../../dist/index.mjs";
import { describe, it } from "node:test";
import { strict as assert } from "node:assert";
import hoursMinutesToISOString from "../../dist/utils/hoursMinutesToISOString.mjs";

describe("hoursMinutesToISOString()", () => {
    it("stringifies a typical hour-minute", () => {
        assert.equal(
            hoursMinutesToISOString(new asn1.HOURS_MINUTES_ENCODING(15, 58)),
            "15:58",
        );
    });

    it("pads hours and minutes to two digits", () => {
        assert.equal(
            hoursMinutesToISOString(new asn1.HOURS_MINUTES_ENCODING(1, 2)),
            "01:02",
        );
    });

    it("stringifies midnight and end-of-day", () => {
        assert.equal(
            hoursMinutesToISOString(new asn1.HOURS_MINUTES_ENCODING(0, 0)),
            "00:00",
        );
        assert.equal(
            hoursMinutesToISOString(new asn1.HOURS_MINUTES_ENCODING(24, 0)),
            "24:00",
        );
    });
});

describe("HOURS_MINUTES_ENCODING stringification", () => {
    it("delegates toISOString, toString, and toJSON to hoursMinutesToISOString", () => {
        const hoursMinutes = new asn1.HOURS_MINUTES_ENCODING(15, 58);
        assert.equal(hoursMinutes.toISOString(), hoursMinutesToISOString(hoursMinutes));
        assert.equal(hoursMinutes.toISOString(), "15:58");
        assert.equal(hoursMinutes.toString(), "15:58");
        assert.equal(hoursMinutes.toJSON(), "15:58");
    });
});

describe("HOURS_MINUTES_ENCODING.fromISOString()", () => {
    it("parses typical, padded, and end-of-day hour-minutes", () => {
        const parsed = asn1.HOURS_MINUTES_ENCODING.fromISOString("15:58");
        assert.equal(parsed.hours, 15);
        assert.equal(parsed.minutes, 58);
        assert.equal(asn1.HOURS_MINUTES_ENCODING.fromISOString("01:02").toISOString(), "01:02");
        assert.equal(asn1.HOURS_MINUTES_ENCODING.fromISOString("24:00").hours, 24);
    });

    it("rejects malformed hour-minutes, and fromString delegates to fromISOString", () => {
        assert.throws(() => asn1.HOURS_MINUTES_ENCODING.fromISOString("15:58:23"));
        assert.equal(asn1.HOURS_MINUTES_ENCODING.fromString("15:58").toISOString(), "15:58");
    });
});
