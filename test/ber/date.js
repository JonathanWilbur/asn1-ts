describe('The UTCTime regular expression', () => {
    const regex = asn1.utcTimeRegex;
    it('decodes all valid UTCTime formats correctly', () => {
        let result;

        result = regex.exec("751231112233Z");
        expect(result.groups.year).toBe("75");
        expect(result.groups.month).toBe("12");
        expect(result.groups.date).toBe("31");
        expect(result.groups.hour).toBe("11");
        expect(result.groups.minute).toBe("22");
        expect(result.groups.second).toBe("33");
        expect(result.groups.offset).toBe("Z");

        result = regex.exec("751231112233+0500");
        expect(result.groups.year).toBe("75");
        expect(result.groups.month).toBe("12");
        expect(result.groups.date).toBe("31");
        expect(result.groups.hour).toBe("11");
        expect(result.groups.minute).toBe("22");
        expect(result.groups.second).toBe("33");
        expect(result.groups.offset).toBe("+0500");

        result = regex.exec("751231112233-0500");
        expect(result.groups.year).toBe("75");
        expect(result.groups.month).toBe("12");
        expect(result.groups.date).toBe("31");
        expect(result.groups.hour).toBe("11");
        expect(result.groups.minute).toBe("22");
        expect(result.groups.second).toBe("33");
        expect(result.groups.offset).toBe("-0500");

        result = regex.exec("7512311122Z");
        expect(result.groups.year).toBe("75");
        expect(result.groups.month).toBe("12");
        expect(result.groups.date).toBe("31");
        expect(result.groups.hour).toBe("11");
        expect(result.groups.minute).toBe("22");
        expect(result.groups.second).toBeUndefined();
        expect(result.groups.offset).toBe("Z");

        result = regex.exec("7512311122-0600");
        expect(result.groups.year).toBe("75");
        expect(result.groups.month).toBe("12");
        expect(result.groups.date).toBe("31");
        expect(result.groups.hour).toBe("11");
        expect(result.groups.minute).toBe("22");
        expect(result.groups.second).toBeUndefined();
        expect(result.groups.offset).toBe("-0600");
    });

    it('does not decode all invalid UTCTime formats', () => {
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

describe('The GeneralizedTime regular expression', () => {
    let regex = asn1.generalizedTimeRegex;
    it('decodes all valid GeneralizedTime formats correctly', () => {
        let result;

        result = regex.exec("19751231112233Z");
        expect(result.groups.year).toBe("1975");
        expect(result.groups.month).toBe("12");
        expect(result.groups.date).toBe("31");
        expect(result.groups.hour).toBe("11");
        expect(result.groups.minute).toBe("22");
        expect(result.groups.second).toBe("33");
        expect(result.groups.millisecond).toBeUndefined();
        expect(result.groups.offset).toBe("Z");

        result = regex.exec("19751231112233+0500");
        expect(result.groups.year).toBe("1975");
        expect(result.groups.month).toBe("12");
        expect(result.groups.date).toBe("31");
        expect(result.groups.hour).toBe("11");
        expect(result.groups.minute).toBe("22");
        expect(result.groups.second).toBe("33");
        expect(result.groups.millisecond).toBeUndefined();
        expect(result.groups.offset).toBe("+0500");

        result = regex.exec("19751231112233-0500");
        expect(result.groups.year).toBe("1975");
        expect(result.groups.month).toBe("12");
        expect(result.groups.date).toBe("31");
        expect(result.groups.hour).toBe("11");
        expect(result.groups.minute).toBe("22");
        expect(result.groups.second).toBe("33");
        expect(result.groups.millisecond).toBeUndefined();
        expect(result.groups.offset).toBe("-0500");

        result = regex.exec("197512311122Z");
        expect(result.groups.year).toBe("1975");
        expect(result.groups.month).toBe("12");
        expect(result.groups.date).toBe("31");
        expect(result.groups.hour).toBe("11");
        expect(result.groups.minute).toBe("22");
        expect(result.groups.second).toBeUndefined();
        expect(result.groups.millisecond).toBeUndefined();
        expect(result.groups.offset).toBe("Z");

        result = regex.exec("197512311122-0600");
        expect(result.groups.year).toBe("1975");
        expect(result.groups.month).toBe("12");
        expect(result.groups.date).toBe("31");
        expect(result.groups.hour).toBe("11");
        expect(result.groups.minute).toBe("22");
        expect(result.groups.second).toBeUndefined();
        expect(result.groups.millisecond).toBeUndefined();
        expect(result.groups.offset).toBe("-0600");

        result = regex.exec("1975123111Z");
        expect(result.groups.year).toBe("1975");
        expect(result.groups.month).toBe("12");
        expect(result.groups.date).toBe("31");
        expect(result.groups.hour).toBe("11");
        expect(result.groups.minute).toBeUndefined();
        expect(result.groups.second).toBeUndefined();
        expect(result.groups.millisecond).toBeUndefined();
        expect(result.groups.offset).toBe("Z");

        result = regex.exec("1975123111-0600");
        expect(result.groups.year).toBe("1975");
        expect(result.groups.month).toBe("12");
        expect(result.groups.date).toBe("31");
        expect(result.groups.hour).toBe("11");
        expect(result.groups.minute).toBeUndefined();
        expect(result.groups.second).toBeUndefined();
        expect(result.groups.millisecond).toBeUndefined();
        expect(result.groups.offset).toBe("-0600");

        result = regex.exec("19751231112233.12345Z");
        expect(result.groups.year).toBe("1975");
        expect(result.groups.month).toBe("12");
        expect(result.groups.date).toBe("31");
        expect(result.groups.hour).toBe("11");
        expect(result.groups.minute).toBe("22");
        expect(result.groups.second).toBe("33");
        expect(result.groups.millisecond).toBe("12345");
        expect(result.groups.offset).toBe("Z");

        result = regex.exec("19751231112233.12345+0500");
        expect(result.groups.year).toBe("1975");
        expect(result.groups.month).toBe("12");
        expect(result.groups.date).toBe("31");
        expect(result.groups.hour).toBe("11");
        expect(result.groups.minute).toBe("22");
        expect(result.groups.second).toBe("33");
        expect(result.groups.millisecond).toBe("12345");
        expect(result.groups.offset).toBe("+0500");

        result = regex.exec("19751231112233.12345-0500");
        expect(result.groups.year).toBe("1975");
        expect(result.groups.month).toBe("12");
        expect(result.groups.date).toBe("31");
        expect(result.groups.hour).toBe("11");
        expect(result.groups.minute).toBe("22");
        expect(result.groups.second).toBe("33");
        expect(result.groups.millisecond).toBe("12345");
        expect(result.groups.offset).toBe("-0500");

        result = regex.exec("197512311122.12345Z");
        expect(result.groups.year).toBe("1975");
        expect(result.groups.month).toBe("12");
        expect(result.groups.date).toBe("31");
        expect(result.groups.hour).toBe("11");
        expect(result.groups.minute).toBe("22");
        expect(result.groups.second).toBeUndefined();
        expect(result.groups.millisecond).toBe("12345");
        expect(result.groups.offset).toBe("Z");

        result = regex.exec("197512311122.12345-0600");
        expect(result.groups.year).toBe("1975");
        expect(result.groups.month).toBe("12");
        expect(result.groups.date).toBe("31");
        expect(result.groups.hour).toBe("11");
        expect(result.groups.minute).toBe("22");
        expect(result.groups.second).toBeUndefined();
        expect(result.groups.millisecond).toBe("12345");
        expect(result.groups.offset).toBe("-0600");

        result = regex.exec("1975123111.12345Z");
        expect(result.groups.year).toBe("1975");
        expect(result.groups.month).toBe("12");
        expect(result.groups.date).toBe("31");
        expect(result.groups.hour).toBe("11");
        expect(result.groups.minute).toBeUndefined();
        expect(result.groups.second).toBeUndefined();
        expect(result.groups.millisecond).toBe("12345");
        expect(result.groups.offset).toBe("Z");

        result = regex.exec("1975123111.12345-0600");
        expect(result.groups.year).toBe("1975");
        expect(result.groups.month).toBe("12");
        expect(result.groups.date).toBe("31");
        expect(result.groups.hour).toBe("11");
        expect(result.groups.minute).toBeUndefined();
        expect(result.groups.second).toBeUndefined();
        expect(result.groups.millisecond).toBe("12345");
        expect(result.groups.offset).toBe("-0600");
    });

    it('does not decode all invalid GeneralizedTime formats', () => {
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