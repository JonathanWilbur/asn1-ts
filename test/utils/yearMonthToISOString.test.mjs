import * as asn1 from "../../dist/index.mjs";
import { describe, it } from "node:test";
import { strict as assert } from "node:assert";
import yearMonthToISOString from "../../dist/utils/yearMonthToISOString.mjs";

describe("yearMonthToISOString()", () => {
    it("stringifies a typical year-month", () => {
        assert.equal(
            yearMonthToISOString(new asn1.YEAR_MONTH_ENCODING(2020, 3)),
            "2020-03",
        );
    });

    it("pads year and month to ISO 8601 widths", () => {
        assert.equal(
            yearMonthToISOString(new asn1.YEAR_MONTH_ENCODING(5, 1)),
            "0005-01",
        );
        assert.equal(
            yearMonthToISOString(new asn1.YEAR_MONTH_ENCODING(0, 12)),
            "0000-12",
        );
    });

    it("stringifies a bigint year and a negative year", () => {
        assert.equal(
            yearMonthToISOString(new asn1.YEAR_MONTH_ENCODING(2020n, 12)),
            "2020-12",
        );
        assert.equal(
            yearMonthToISOString(new asn1.YEAR_MONTH_ENCODING(-43, 3)),
            "-0043-03",
        );
    });
});

describe("YEAR_MONTH_ENCODING stringification", () => {
    it("delegates toISOString, toString, and toJSON to yearMonthToISOString", () => {
        const yearMonth = new asn1.YEAR_MONTH_ENCODING(2020, 3);
        assert.equal(yearMonth.toISOString(), yearMonthToISOString(yearMonth));
        assert.equal(yearMonth.toISOString(), "2020-03");
        assert.equal(yearMonth.toString(), "2020-03");
        assert.equal(yearMonth.toJSON(), "2020-03");
    });
});

describe("YEAR_MONTH_ENCODING.fromISOString()", () => {
    it("parses typical, padded, and negative year-months", () => {
        const parsed = asn1.YEAR_MONTH_ENCODING.fromISOString("2020-03");
        assert.equal(parsed.year, 2020);
        assert.equal(parsed.month, 3);
        assert.equal(asn1.YEAR_MONTH_ENCODING.fromISOString("0005-01").toISOString(), "0005-01");
        assert.equal(asn1.YEAR_MONTH_ENCODING.fromISOString("-0043-03").year, -43);
    });

    it("rejects malformed year-months, and fromString delegates to fromISOString", () => {
        assert.throws(() => asn1.YEAR_MONTH_ENCODING.fromISOString("2020-3"));
        assert.equal(asn1.YEAR_MONTH_ENCODING.fromString("2020-03").toISOString(), "2020-03");
    });
});
