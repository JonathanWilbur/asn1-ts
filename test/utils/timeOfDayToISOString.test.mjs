import * as asn1 from "../../dist/index.mjs";
import { describe, it } from "node:test";
import { strict as assert } from "node:assert";
import timeOfDayToISOString from "../../dist/utils/timeOfDayToISOString.mjs";

describe("timeOfDayToISOString()", () => {
    it("stringifies a typical time of day", () => {
        assert.equal(
            timeOfDayToISOString(new asn1.TIME_OF_DAY_ENCODING(15, 58, 23)),
            "15:58:23",
        );
    });

    it("pads hours, minutes, and seconds to two digits", () => {
        assert.equal(
            timeOfDayToISOString(new asn1.TIME_OF_DAY_ENCODING(1, 2, 3)),
            "01:02:03",
        );
    });

    it("stringifies midnight and end-of-day", () => {
        assert.equal(
            timeOfDayToISOString(new asn1.TIME_OF_DAY_ENCODING(0, 0, 0)),
            "00:00:00",
        );
        assert.equal(
            timeOfDayToISOString(new asn1.TIME_OF_DAY_ENCODING(24, 0, 0)),
            "24:00:00",
        );
    });

    it("stringifies a leap second", () => {
        assert.equal(
            timeOfDayToISOString(new asn1.TIME_OF_DAY_ENCODING(23, 59, 60)),
            "23:59:60",
        );
    });
});

describe("TIME_OF_DAY_ENCODING stringification", () => {
    it("delegates toISOString, toString, and toJSON to timeOfDayToISOString", () => {
        const time = new asn1.TIME_OF_DAY_ENCODING(15, 58, 23);
        assert.equal(time.toISOString(), timeOfDayToISOString(time));
        assert.equal(time.toISOString(), "15:58:23");
        assert.equal(time.toString(), "15:58:23");
        assert.equal(time.toJSON(), "15:58:23");
    });
});

describe("TIME_OF_DAY_ENCODING.fromISOString()", () => {
    it("parses typical, padded, and leap-second times", () => {
        const parsed = asn1.TIME_OF_DAY_ENCODING.fromISOString("15:58:23");
        assert.equal(parsed.hours, 15);
        assert.equal(parsed.minutes, 58);
        assert.equal(parsed.seconds, 23);
        assert.equal(asn1.TIME_OF_DAY_ENCODING.fromISOString("01:02:03").toISOString(), "01:02:03");
        assert.equal(asn1.TIME_OF_DAY_ENCODING.fromISOString("23:59:60").seconds, 60);
    });

    it("rejects malformed times, and fromString delegates to fromISOString", () => {
        assert.throws(() => asn1.TIME_OF_DAY_ENCODING.fromISOString("15:58"));
        assert.equal(asn1.TIME_OF_DAY_ENCODING.fromString("15:58:23").toISOString(), "15:58:23");
    });
});
