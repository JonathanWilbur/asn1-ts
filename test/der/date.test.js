const asn1 = require("../../dist/index.js");

describe("The UTCTime regular expression", () => {
    const regex = asn1.utcTimeRegex;
    it("decodes all valid UTCTime formats correctly", () => {
        let result;

        result = regex.exec("751231112233Z");
        expect(result[1]).toBe("75");
        expect(result[2]).toBe("12");
        expect(result[3]).toBe("31");
        expect(result[4]).toBe("11");
        expect(result[5]).toBe("22");
        expect(result[6]).toBe("33");
        expect(result[7]).toBe("Z");

        result = regex.exec("751231112233+0500");
        expect(result[1]).toBe("75");
        expect(result[2]).toBe("12");
        expect(result[3]).toBe("31");
        expect(result[4]).toBe("11");
        expect(result[5]).toBe("22");
        expect(result[6]).toBe("33");
        expect(result[7]).toBe("+0500");

        result = regex.exec("751231112233-0500");
        expect(result[1]).toBe("75");
        expect(result[2]).toBe("12");
        expect(result[3]).toBe("31");
        expect(result[4]).toBe("11");
        expect(result[5]).toBe("22");
        expect(result[6]).toBe("33");
        expect(result[7]).toBe("-0500");

        result = regex.exec("7512311122Z");
        expect(result[1]).toBe("75");
        expect(result[2]).toBe("12");
        expect(result[3]).toBe("31");
        expect(result[4]).toBe("11");
        expect(result[5]).toBe("22");
        expect(result[6]).toBeUndefined();
        expect(result[7]).toBe("Z");

        result = regex.exec("7512311122-0600");
        expect(result[1]).toBe("75");
        expect(result[2]).toBe("12");
        expect(result[3]).toBe("31");
        expect(result[4]).toBe("11");
        expect(result[5]).toBe("22");
        expect(result[6]).toBeUndefined();
        expect(result[7]).toBe("-0600");
    });

    it("does not decode all invalid UTCTime formats", () => {
        expect(regex.exec("19751231112233Z")).toBeNull();
        expect(regex.exec("751231112233+05000")).toBeNull();
        expect(regex.exec("751231112233+Z")).toBeNull();
        expect(regex.exec("751231112233-Z")).toBeNull();
        expect(regex.exec("751231112233+0500Z")).toBeNull();
        expect(regex.exec("751231112233+05Z")).toBeNull();
        expect(regex.exec("751231112233-05Z")).toBeNull();
        expect(regex.exec("7512311122+05000")).toBeNull();
        expect(regex.exec("7512311122+Z")).toBeNull();
        expect(regex.exec("7512311122-Z")).toBeNull();
        expect(regex.exec("7512311122+0500Z")).toBeNull();
        expect(regex.exec("7512311122+05Z")).toBeNull();
        expect(regex.exec("7512311122-05Z")).toBeNull();
    });
});

describe("The GeneralizedTime regular expression", () => {
    const regex = asn1.generalizedTimeRegex;
    it("decodes all valid GeneralizedTime formats correctly", () => {
        let result;

        result = regex.exec("19751231112233Z");
        expect(result[1]).toBe("1975");
        expect(result[2]).toBe("12");
        expect(result[3]).toBe("31");
        expect(result[4]).toBe("11");
        expect(result[5]).toBe("22");
        expect(result[6]).toBe("33");
        expect(result[7]).toBeUndefined();
        expect(result[8]).toBe("Z");

        result = regex.exec("19751231112233+0500");
        expect(result[1]).toBe("1975");
        expect(result[2]).toBe("12");
        expect(result[3]).toBe("31");
        expect(result[4]).toBe("11");
        expect(result[5]).toBe("22");
        expect(result[6]).toBe("33");
        expect(result[7]).toBeUndefined();
        expect(result[8]).toBe("+0500");

        result = regex.exec("19751231112233-0500");
        expect(result[1]).toBe("1975");
        expect(result[2]).toBe("12");
        expect(result[3]).toBe("31");
        expect(result[4]).toBe("11");
        expect(result[5]).toBe("22");
        expect(result[6]).toBe("33");
        expect(result[7]).toBeUndefined();
        expect(result[8]).toBe("-0500");

        result = regex.exec("197512311122Z");
        expect(result[1]).toBe("1975");
        expect(result[2]).toBe("12");
        expect(result[3]).toBe("31");
        expect(result[4]).toBe("11");
        expect(result[5]).toBe("22");
        expect(result[6]).toBeUndefined();
        expect(result[7]).toBeUndefined();
        expect(result[8]).toBe("Z");

        result = regex.exec("197512311122-0600");
        expect(result[1]).toBe("1975");
        expect(result[2]).toBe("12");
        expect(result[3]).toBe("31");
        expect(result[4]).toBe("11");
        expect(result[5]).toBe("22");
        expect(result[6]).toBeUndefined();
        expect(result[7]).toBeUndefined();
        expect(result[8]).toBe("-0600");

        result = regex.exec("1975123111Z");
        expect(result[1]).toBe("1975");
        expect(result[2]).toBe("12");
        expect(result[3]).toBe("31");
        expect(result[4]).toBe("11");
        expect(result[5]).toBeUndefined();
        expect(result[6]).toBeUndefined();
        expect(result[7]).toBeUndefined();
        expect(result[8]).toBe("Z");

        result = regex.exec("1975123111-0600");
        expect(result[1]).toBe("1975");
        expect(result[2]).toBe("12");
        expect(result[3]).toBe("31");
        expect(result[4]).toBe("11");
        expect(result[5]).toBeUndefined();
        expect(result[6]).toBeUndefined();
        expect(result[7]).toBeUndefined();
        expect(result[8]).toBe("-0600");

        result = regex.exec("19751231112233.12345Z");
        expect(result[1]).toBe("1975");
        expect(result[2]).toBe("12");
        expect(result[3]).toBe("31");
        expect(result[4]).toBe("11");
        expect(result[5]).toBe("22");
        expect(result[6]).toBe("33");
        expect(result[7]).toBe("12345");
        expect(result[8]).toBe("Z");

        result = regex.exec("19751231112233.12345+0500");
        expect(result[1]).toBe("1975");
        expect(result[2]).toBe("12");
        expect(result[3]).toBe("31");
        expect(result[4]).toBe("11");
        expect(result[5]).toBe("22");
        expect(result[6]).toBe("33");
        expect(result[7]).toBe("12345");
        expect(result[8]).toBe("+0500");

        result = regex.exec("19751231112233.12345-0500");
        expect(result[1]).toBe("1975");
        expect(result[2]).toBe("12");
        expect(result[3]).toBe("31");
        expect(result[4]).toBe("11");
        expect(result[5]).toBe("22");
        expect(result[6]).toBe("33");
        expect(result[7]).toBe("12345");
        expect(result[8]).toBe("-0500");

        result = regex.exec("197512311122.12345Z");
        expect(result[1]).toBe("1975");
        expect(result[2]).toBe("12");
        expect(result[3]).toBe("31");
        expect(result[4]).toBe("11");
        expect(result[5]).toBe("22");
        expect(result[6]).toBeUndefined();
        expect(result[7]).toBe("12345");
        expect(result[8]).toBe("Z");

        result = regex.exec("197512311122.12345-0600");
        expect(result[1]).toBe("1975");
        expect(result[2]).toBe("12");
        expect(result[3]).toBe("31");
        expect(result[4]).toBe("11");
        expect(result[5]).toBe("22");
        expect(result[6]).toBeUndefined();
        expect(result[7]).toBe("12345");
        expect(result[8]).toBe("-0600");

        result = regex.exec("1975123111.12345Z");
        expect(result[1]).toBe("1975");
        expect(result[2]).toBe("12");
        expect(result[3]).toBe("31");
        expect(result[4]).toBe("11");
        expect(result[5]).toBeUndefined();
        expect(result[6]).toBeUndefined();
        expect(result[7]).toBe("12345");
        expect(result[8]).toBe("Z");

        result = regex.exec("1975123111.12345-0600");
        expect(result[1]).toBe("1975");
        expect(result[2]).toBe("12");
        expect(result[3]).toBe("31");
        expect(result[4]).toBe("11");
        expect(result[5]).toBeUndefined();
        expect(result[6]).toBeUndefined();
        expect(result[7]).toBe("12345");
        expect(result[8]).toBe("-0600");
    });

    it("does not decode all invalid GeneralizedTime formats", () => {
        expect(regex.exec("19751231112233+05000")).toBeNull();
        expect(regex.exec("19751231112233+Z")).toBeNull();
        expect(regex.exec("19751231112233-Z")).toBeNull();
        expect(regex.exec("19751231112233+0500Z")).toBeNull();
        expect(regex.exec("19751231112233+05Z")).toBeNull();
        expect(regex.exec("19751231112233-05Z")).toBeNull();
        expect(regex.exec("197512311122+05000")).toBeNull();
        expect(regex.exec("197512311122+Z")).toBeNull();
        expect(regex.exec("197512311122-Z")).toBeNull();
        expect(regex.exec("197512311122+0500Z")).toBeNull();
        expect(regex.exec("197512311122+05Z")).toBeNull();
        expect(regex.exec("197512311122-05Z")).toBeNull();
        expect(regex.exec("19751231112233.12345+05000")).toBeNull();
        expect(regex.exec("19751231112233.12345+Z")).toBeNull();
        expect(regex.exec("19751231112233.12345-Z")).toBeNull();
        expect(regex.exec("19751231112233.12345+0500Z")).toBeNull();
        expect(regex.exec("19751231112233.12345+05Z")).toBeNull();
        expect(regex.exec("19751231112233.12345-05Z")).toBeNull();
        expect(regex.exec("197512311122.12345+05000")).toBeNull();
        expect(regex.exec("197512311122.12345+Z")).toBeNull();
        expect(regex.exec("197512311122.12345-Z")).toBeNull();
        expect(regex.exec("197512311122.12345+0500Z")).toBeNull();
        expect(regex.exec("197512311122.12345+05Z")).toBeNull();
        expect(regex.exec("197512311122.12345-05Z")).toBeNull();
    });
});
