import * as asn1 from "../../dist/index.mjs";
import { describe, it } from "node:test";
import { strict as assert } from "node:assert";
import dateToISOString from "../../dist/utils/dateToISOString.mjs";

describe("dateToISOString()", () => {
    it("stringifies a typical calendar date", () => {
        assert.equal(
            dateToISOString(new asn1.DATE_ENCODING(2020, 3, 7)),
            "2020-03-07",
        );
    });

    it("pads year, month, and day to ISO 8601 widths", () => {
        assert.equal(
            dateToISOString(new asn1.DATE_ENCODING(5, 1, 2)),
            "0005-01-02",
        );
    });

    it("stringifies year zero and a leap day", () => {
        assert.equal(
            dateToISOString(new asn1.DATE_ENCODING(0, 2, 29)),
            "0000-02-29",
        );
    });

    it("stringifies a bigint year and a negative year", () => {
        assert.equal(
            dateToISOString(new asn1.DATE_ENCODING(2020n, 12, 31)),
            "2020-12-31",
        );
        assert.equal(
            dateToISOString(new asn1.DATE_ENCODING(-43, 3, 15)),
            "-0043-03-15",
        );
    });
});

describe("DATE_ENCODING.toISOString()", () => {
    it("delegates to dateToISOString", () => {
        const date = new asn1.DATE_ENCODING(2020, 3, 7);
        assert.equal(date.toISOString(), dateToISOString(date));
        assert.equal(date.toISOString(), "2020-03-07");
    });
});

describe("DATE_ENCODING.fromISOString()", () => {
    it("parses typical, padded, and negative dates", () => {
        const typical = asn1.DATE_ENCODING.fromISOString("2020-03-07");
        assert.equal(typical.year, 2020);
        assert.equal(typical.month, 3);
        assert.equal(typical.day, 7);
        assert.equal(asn1.DATE_ENCODING.fromISOString("0005-01-02").toISOString(), "0005-01-02");
        assert.equal(asn1.DATE_ENCODING.fromISOString("-0043-03-15").year, -43);
    });

    it("rejects malformed dates, and fromString delegates to fromISOString", () => {
        assert.throws(() => asn1.DATE_ENCODING.fromISOString("2020-3-7"));
        assert.equal(asn1.DATE_ENCODING.fromString("2020-03-07").toISOString(), "2020-03-07");
    });
});
