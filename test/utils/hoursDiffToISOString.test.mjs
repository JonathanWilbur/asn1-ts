import * as asn1 from "../../dist/index.mjs";
import { describe, it } from "node:test";
import { strict as assert } from "node:assert";
import hoursDiffToISOString from "../../dist/utils/hoursDiffToISOString.mjs";

describe("hoursDiffToISOString()", () => {
    it("stringifies a typical hour with a positive offset", () => {
        assert.equal(
            hoursDiffToISOString(new asn1.HOURS_DIFF_ENCODING(15, 300)),
            "15+05:00",
        );
    });

    it("pads hours and uses Z for a zero offset", () => {
        assert.equal(
            hoursDiffToISOString(new asn1.HOURS_DIFF_ENCODING(1, 0)),
            "01Z",
        );
    });

    it("stringifies a negative offset and a half-hour offset", () => {
        assert.equal(
            hoursDiffToISOString(new asn1.HOURS_DIFF_ENCODING(15, -300)),
            "15-05:00",
        );
        assert.equal(
            hoursDiffToISOString(new asn1.HOURS_DIFF_ENCODING(24, 90)),
            "24+01:30",
        );
    });
});

describe("HOURS_DIFF_ENCODING stringification", () => {
    it("delegates toISOString, toString, and toJSON to hoursDiffToISOString", () => {
        const hours = new asn1.HOURS_DIFF_ENCODING(15, 300);
        assert.equal(hours.toISOString(), hoursDiffToISOString(hours));
        assert.equal(hours.toISOString(), "15+05:00");
        assert.equal(hours.toString(), "15+05:00");
        assert.equal(hours.toJSON(), "15+05:00");
    });
});

describe("HOURS_DIFF_ENCODING.fromISOString()", () => {
    it("parses positive, negative, and Z offsets", () => {
        const parsed = asn1.HOURS_DIFF_ENCODING.fromISOString("15+05:00");
        assert.equal(parsed.hours, 15);
        assert.equal(parsed.minutes_diff, 300);
        assert.equal(asn1.HOURS_DIFF_ENCODING.fromISOString("01Z").minutes_diff, 0);
        assert.equal(asn1.HOURS_DIFF_ENCODING.fromISOString("15-05:00").minutes_diff, -300);
        assert.equal(asn1.HOURS_DIFF_ENCODING.fromISOString("24+01:30").minutes_diff, 90);
    });

    it("rejects hours without an offset, and fromString delegates to fromISOString", () => {
        assert.throws(() => asn1.HOURS_DIFF_ENCODING.fromISOString("15"));
        assert.equal(asn1.HOURS_DIFF_ENCODING.fromString("15+05:00").toISOString(), "15+05:00");
    });
});
