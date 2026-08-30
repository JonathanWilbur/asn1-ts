import * as asn1 from "../../dist/index.mjs";
import { describe, it } from "node:test";
import { strict as assert } from "node:assert";
import yearToISOString from "../../dist/utils/yearToISOString.mjs";

describe("yearToISOString()", () => {
    it("stringifies a typical year", () => {
        assert.equal(
            yearToISOString(new asn1.YEAR_ENCODING(2020)),
            "2020",
        );
    });

    it("pads the year to at least four digits", () => {
        assert.equal(
            yearToISOString(new asn1.YEAR_ENCODING(5)),
            "0005",
        );
        assert.equal(
            yearToISOString(new asn1.YEAR_ENCODING(0)),
            "0000",
        );
    });

    it("stringifies a bigint year and a negative year", () => {
        assert.equal(
            yearToISOString(new asn1.YEAR_ENCODING(2020n)),
            "2020",
        );
        assert.equal(
            yearToISOString(new asn1.YEAR_ENCODING(-43)),
            "-0043",
        );
    });
});

describe("YEAR_ENCODING stringification", () => {
    it("delegates toISOString, toString, and toJSON to yearToISOString", () => {
        const year = new asn1.YEAR_ENCODING(2020);
        assert.equal(year.toISOString(), yearToISOString(year));
        assert.equal(year.toISOString(), "2020");
        assert.equal(year.toString(), "2020");
        assert.equal(year.toJSON(), "2020");
    });
});

describe("YEAR_ENCODING.fromISOString()", () => {
    it("parses typical, padded, and negative years", () => {
        assert.equal(asn1.YEAR_ENCODING.fromISOString("2020").year, 2020);
        assert.equal(asn1.YEAR_ENCODING.fromISOString("0005").toISOString(), "0005");
        assert.equal(asn1.YEAR_ENCODING.fromISOString("-0043").year, -43);
    });

    it("rejects malformed years, and fromString delegates to fromISOString", () => {
        assert.throws(() => asn1.YEAR_ENCODING.fromISOString("20"));
        assert.equal(asn1.YEAR_ENCODING.fromString("2020").toISOString(), "2020");
    });
});
