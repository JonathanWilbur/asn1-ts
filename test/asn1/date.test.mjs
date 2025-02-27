import * as asn1 from "../../dist/index.mjs";
import { describe, it } from "node:test";
import { strict as assert } from "node:assert";

describe("The UTCTime regular expression", () => {
    const regex = asn1.utcTimeRegex;
    it("decodes all valid UTCTime formats correctly", () => {
        let result;

        result = regex.exec("751231112233Z");
        assert.equal(result[1], "75");
        assert.equal(result[2], "12");
        assert.equal(result[3], "31");
        assert.equal(result[4], "11");
        assert.equal(result[5], "22");
        assert.equal(result[6], "33");
        assert.equal(result[7], "Z");

        result = regex.exec("751231112233+0500");
        assert.equal(result[1], "75");
        assert.equal(result[2], "12");
        assert.equal(result[3], "31");
        assert.equal(result[4], "11");
        assert.equal(result[5], "22");
        assert.equal(result[6], "33");
        assert.equal(result[7], "+0500");

        result = regex.exec("751231112233-0500");
        assert.equal(result[1], "75");
        assert.equal(result[2], "12");
        assert.equal(result[3], "31");
        assert.equal(result[4], "11");
        assert.equal(result[5], "22");
        assert.equal(result[6], "33");
        assert.equal(result[7], "-0500");

        result = regex.exec("7512311122Z");
        assert.equal(result[1], "75");
        assert.equal(result[2], "12");
        assert.equal(result[3], "31");
        assert.equal(result[4], "11");
        assert.equal(result[5], "22");
        assert.equal(result[6], undefined);
        assert.equal(result[7], "Z");

        result = regex.exec("7512311122-0600");
        assert.equal(result[1], "75");
        assert.equal(result[2], "12");
        assert.equal(result[3], "31");
        assert.equal(result[4], "11");
        assert.equal(result[5], "22");
        assert.equal(result[6], undefined);
        assert.equal(result[7], "-0600");
    });

    it("does not decode all invalid UTCTime formats", () => {
        assert.equal(regex.exec("19751231112233Z"), null);
        assert.equal(regex.exec("751231112233+05000"), null);
        assert.equal(regex.exec("751231112233+Z"), null);
        assert.equal(regex.exec("751231112233-Z"), null);
        assert.equal(regex.exec("751231112233+0500Z"), null);
        assert.equal(regex.exec("751231112233+05Z"), null);
        assert.equal(regex.exec("751231112233-05Z"), null);
        assert.equal(regex.exec("7512311122+05000"), null);
        assert.equal(regex.exec("7512311122+Z"), null);
        assert.equal(regex.exec("7512311122-Z"), null);
        assert.equal(regex.exec("7512311122+0500Z"), null);
        assert.equal(regex.exec("7512311122+05Z"), null);
        assert.equal(regex.exec("7512311122-05Z"), null);
    });
});

describe("The GeneralizedTime regular expression", () => {
    const regex = asn1.generalizedTimeRegex;
    it("decodes all valid GeneralizedTime formats correctly", () => {
        let result;

        result = regex.exec("19751231112233Z");
        assert.equal(result[1], "1975");
        assert.equal(result[2], "12");
        assert.equal(result[3], "31");
        assert.equal(result[4], "11");
        assert.equal(result[5], "22");
        assert.equal(result[6], "33");
        assert.equal(result[7], undefined);
        assert.equal(result[8], "Z");

        result = regex.exec("19751231112233+0500");
        assert.equal(result[1], "1975");
        assert.equal(result[2], "12");
        assert.equal(result[3], "31");
        assert.equal(result[4], "11");
        assert.equal(result[5], "22");
        assert.equal(result[6], "33");
        assert.equal(result[7], undefined);
        assert.equal(result[8], "+0500");

        result = regex.exec("19751231112233-0500");
        assert.equal(result[1], "1975");
        assert.equal(result[2], "12");
        assert.equal(result[3], "31");
        assert.equal(result[4], "11");
        assert.equal(result[5], "22");
        assert.equal(result[6], "33");
        assert.equal(result[7], undefined);
        assert.equal(result[8], "-0500");

        result = regex.exec("197512311122Z");
        assert.equal(result[1], "1975");
        assert.equal(result[2], "12");
        assert.equal(result[3], "31");
        assert.equal(result[4], "11");
        assert.equal(result[5], "22");
        assert.equal(result[6], undefined);
        assert.equal(result[7], undefined);
        assert.equal(result[8], "Z");

        result = regex.exec("197512311122-0600");
        assert.equal(result[1], "1975");
        assert.equal(result[2], "12");
        assert.equal(result[3], "31");
        assert.equal(result[4], "11");
        assert.equal(result[5], "22");
        assert.equal(result[6], undefined);
        assert.equal(result[7], undefined);
        assert.equal(result[8], "-0600");

        result = regex.exec("1975123111Z");
        assert.equal(result[1], "1975");
        assert.equal(result[2], "12");
        assert.equal(result[3], "31");
        assert.equal(result[4], "11");
        assert.equal(result[5], undefined);
        assert.equal(result[6], undefined);
        assert.equal(result[7], undefined);
        assert.equal(result[8], "Z");

        result = regex.exec("1975123111-0600");
        assert.equal(result[1], "1975");
        assert.equal(result[2], "12");
        assert.equal(result[3], "31");
        assert.equal(result[4], "11");
        assert.equal(result[5], undefined);
        assert.equal(result[6], undefined);
        assert.equal(result[7], undefined);
        assert.equal(result[8], "-0600");

        result = regex.exec("19751231112233.12345Z");
        assert.equal(result[1], "1975");
        assert.equal(result[2], "12");
        assert.equal(result[3], "31");
        assert.equal(result[4], "11");
        assert.equal(result[5], "22");
        assert.equal(result[6], "33");
        assert.equal(result[7], "12345");
        assert.equal(result[8], "Z");

        result = regex.exec("19751231112233.12345+0500");
        assert.equal(result[1], "1975");
        assert.equal(result[2], "12");
        assert.equal(result[3], "31");
        assert.equal(result[4], "11");
        assert.equal(result[5], "22");
        assert.equal(result[6], "33");
        assert.equal(result[7], "12345");
        assert.equal(result[8], "+0500");

        result = regex.exec("19751231112233.12345-0500");
        assert.equal(result[1], "1975");
        assert.equal(result[2], "12");
        assert.equal(result[3], "31");
        assert.equal(result[4], "11");
        assert.equal(result[5], "22");
        assert.equal(result[6], "33");
        assert.equal(result[7], "12345");
        assert.equal(result[8], "-0500");

        result = regex.exec("197512311122.12345Z");
        assert.equal(result[1], "1975");
        assert.equal(result[2], "12");
        assert.equal(result[3], "31");
        assert.equal(result[4], "11");
        assert.equal(result[5], "22");
        assert.equal(result[6], undefined);
        assert.equal(result[7], "12345");
        assert.equal(result[8], "Z");

        result = regex.exec("197512311122.12345-0600");
        assert.equal(result[1], "1975");
        assert.equal(result[2], "12");
        assert.equal(result[3], "31");
        assert.equal(result[4], "11");
        assert.equal(result[5], "22");
        assert.equal(result[6], undefined);
        assert.equal(result[7], "12345");
        assert.equal(result[8], "-0600");

        result = regex.exec("1975123111.12345Z");
        assert.equal(result[1], "1975");
        assert.equal(result[2], "12");
        assert.equal(result[3], "31");
        assert.equal(result[4], "11");
        assert.equal(result[5], undefined);
        assert.equal(result[6], undefined);
        assert.equal(result[7], "12345");
        assert.equal(result[8], "Z");

        result = regex.exec("1975123111.12345-0600");
        assert.equal(result[1], "1975");
        assert.equal(result[2], "12");
        assert.equal(result[3], "31");
        assert.equal(result[4], "11");
        assert.equal(result[5], undefined);
        assert.equal(result[6], undefined);
        assert.equal(result[7], "12345");
        assert.equal(result[8], "-0600");
    });

    it("does not decode all invalid GeneralizedTime formats", () => {
        assert.equal(regex.exec("19751231112233+05000"), null);
        assert.equal(regex.exec("19751231112233+Z"), null);
        assert.equal(regex.exec("19751231112233-Z"), null);
        assert.equal(regex.exec("19751231112233+0500Z"), null);
        assert.equal(regex.exec("19751231112233+05Z"), null);
        assert.equal(regex.exec("19751231112233-05Z"), null);
        assert.equal(regex.exec("197512311122+05000"), null);
        assert.equal(regex.exec("197512311122+Z"), null);
        assert.equal(regex.exec("197512311122-Z"), null);
        assert.equal(regex.exec("197512311122+0500Z"), null);
        assert.equal(regex.exec("197512311122+05Z"), null);
        assert.equal(regex.exec("197512311122-05Z"), null);
        assert.equal(regex.exec("19751231112233.12345+05000"), null);
        assert.equal(regex.exec("19751231112233.12345+Z"), null);
        assert.equal(regex.exec("19751231112233.12345-Z"), null);
        assert.equal(regex.exec("19751231112233.12345+0500Z"), null);
        assert.equal(regex.exec("19751231112233.12345+05Z"), null);
        assert.equal(regex.exec("19751231112233.12345-05Z"), null);
        assert.equal(regex.exec("197512311122.12345+05000"), null);
        assert.equal(regex.exec("197512311122.12345+Z"), null);
        assert.equal(regex.exec("197512311122.12345-Z"), null);
        assert.equal(regex.exec("197512311122.12345+0500Z"), null);
        assert.equal(regex.exec("197512311122.12345+05Z"), null);
        assert.equal(regex.exec("197512311122.12345-05Z"), null);
    });
});
