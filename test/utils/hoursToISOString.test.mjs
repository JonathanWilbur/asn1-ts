import * as asn1 from "../../dist/index.mjs";
import { describe, it } from "node:test";
import { strict as assert } from "node:assert";
import hoursToISOString from "../../dist/utils/hoursToISOString.mjs";

describe("hoursToISOString()", () => {
    it("stringifies a typical hour", () => {
        assert.equal(
            hoursToISOString(new asn1.HOURS_ENCODING(15)),
            "15",
        );
    });

    it("pads hours to two digits", () => {
        assert.equal(
            hoursToISOString(new asn1.HOURS_ENCODING(1)),
            "01",
        );
    });

    it("stringifies midnight and end-of-day", () => {
        assert.equal(
            hoursToISOString(new asn1.HOURS_ENCODING(0)),
            "00",
        );
        assert.equal(
            hoursToISOString(new asn1.HOURS_ENCODING(24)),
            "24",
        );
    });
});

describe("HOURS_ENCODING stringification", () => {
    it("delegates toISOString, toString, and toJSON to hoursToISOString", () => {
        const hours = new asn1.HOURS_ENCODING(15);
        assert.equal(hours.toISOString(), hoursToISOString(hours));
        assert.equal(hours.toISOString(), "15");
        assert.equal(hours.toString(), "15");
        assert.equal(hours.toJSON(), "15");
    });
});

describe("HOURS_ENCODING.fromISOString()", () => {
    it("parses typical, padded, and end-of-day hours", () => {
        assert.equal(asn1.HOURS_ENCODING.fromISOString("15").hours, 15);
        assert.equal(asn1.HOURS_ENCODING.fromISOString("01").toISOString(), "01");
        assert.equal(asn1.HOURS_ENCODING.fromISOString("24").hours, 24);
    });

    it("rejects malformed hours, and fromString delegates to fromISOString", () => {
        assert.throws(() => asn1.HOURS_ENCODING.fromISOString("1"));
        assert.equal(asn1.HOURS_ENCODING.fromString("15").toISOString(), "15");
    });
});
