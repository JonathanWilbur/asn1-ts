const asn1 = require("../../dist/index.js");

[
    asn1.BERElement,
    asn1.CERElement,
    asn1.DERElement,
].forEach((CodecElement) => {
    describe(`${CodecElement.constructor.name}`, () => {
        it("Encodes and decodes a non-fractional DURATION correctly", () => {
            const el = new CodecElement();

            const duration = new asn1.DURATION_EQUIVALENT(
                2020, 3, undefined, 7, 15, 58, 23,
            );

            el.duration = duration;
            expect(el.value).toEqual(new Uint8Array([
                0x32, 0x30, 0x32, 0x30, "Y".charCodeAt(0),
                0x33, "M".charCodeAt(0),
                0x37, "D".charCodeAt(0),
                "T".charCodeAt(0),
                0x31, 0x35, "H".charCodeAt(0),
                0x35, 0x38, "M".charCodeAt(0),
                0x32, 0x33, "S".charCodeAt(0),
            ]));
            const output = el.duration;
            expect(output.years).toBe(2020);
            expect(output.months).toBe(3);
            expect(output.weeks).toBeUndefined();
            expect(output.days).toBe(7);
            expect(output.hours).toBe(15);
            expect(output.minutes).toBe(58);
            expect(output.seconds).toBe(23);
            expect(output.fractional_part).toBeUndefined();
        });

        it("Encodes and decodes a fractional DURATION correctly", () => {
            const el = new CodecElement();

            const duration = new asn1.DURATION_EQUIVALENT(
                2020, 3, undefined, 7, 15, 58, 23, {
                    number_of_digits: 3,
                    fractional_value: 123,
                },
            );

            el.duration = duration;
            expect(el.value).toEqual(new Uint8Array([
                0x32, 0x30, 0x32, 0x30, "Y".charCodeAt(0),
                0x33, "M".charCodeAt(0),
                0x37, "D".charCodeAt(0),
                "T".charCodeAt(0),
                0x31, 0x35, "H".charCodeAt(0),
                0x35, 0x38, "M".charCodeAt(0),
                0x32, 0x33,
                ".".charCodeAt(0), 0x31, 0x32, 0x33,
                "S".charCodeAt(0),
            ]));
            const output = el.duration;
            expect(output.years).toBe(2020);
            expect(output.months).toBe(3);
            expect(output.weeks).toBeUndefined();
            expect(output.days).toBe(7);
            expect(output.hours).toBe(15);
            expect(output.minutes).toBe(58);
            expect(output.seconds).toBe(23);
            expect(output.fractional_part).toEqual({
                number_of_digits: 3,
                fractional_value: 123,
            });
        });

        it("Encodes and decodes a non-fractional weeks DURATION correctly", () => {
            const el = new CodecElement();

            const duration = new asn1.DURATION_EQUIVALENT(
                undefined, undefined, 4, undefined, undefined, undefined, undefined,
            );

            el.duration = duration;
            expect(el.value).toEqual(new Uint8Array([ 0x34, "W".charCodeAt(0) ]));
            const output = el.duration;
            expect(output.years).toBeUndefined();
            expect(output.months).toBeUndefined();
            expect(output.weeks).toBe(4);
            expect(output.days).toBeUndefined();
            expect(output.hours).toBeUndefined();
            expect(output.minutes).toBeUndefined();
            expect(output.seconds).toBeUndefined();
            expect(output.fractional_part).toBeUndefined();
        });

        it("Encodes and decodes a fractional weeks DURATION correctly", () => {
            const el = new CodecElement();

            const duration = new asn1.DURATION_EQUIVALENT(
                undefined, undefined, 4, undefined, undefined, undefined, undefined, {
                    number_of_digits: 4,
                    fractional_value: 5678,
                },
            );

            el.duration = duration;
            expect(el.value).toEqual(new Uint8Array([
                0x34,
                ".".charCodeAt(0),
                0x35, 0x36, 0x37, 0x38,
                "W".charCodeAt(0),
            ]));
            const output = el.duration;
            expect(output.years).toBeUndefined();
            expect(output.months).toBeUndefined();
            expect(output.weeks).toBe(4);
            expect(output.days).toBeUndefined();
            expect(output.hours).toBeUndefined();
            expect(output.minutes).toBeUndefined();
            expect(output.seconds).toBeUndefined();
            expect(output.fractional_part).toEqual({
                number_of_digits: 4,
                fractional_value: 5678,
            });
        });

        it("Encodes and decodes a non-fractional DURATION without all components correctly", () => {
            const el = new CodecElement();

            const duration = new asn1.DURATION_EQUIVALENT(
                2020, 3, undefined, 7, undefined, 58, 23,
            );

            el.duration = duration;
            expect(el.value).toEqual(new Uint8Array([
                0x32, 0x30, 0x32, 0x30, "Y".charCodeAt(0),
                0x33, "M".charCodeAt(0),
                0x37, "D".charCodeAt(0),
                "T".charCodeAt(0),
                // 0x31, 0x35, "H".charCodeAt(0),
                0x35, 0x38, "M".charCodeAt(0),
                0x32, 0x33, "S".charCodeAt(0),
            ]));
            const output = el.duration;
            expect(output.years).toBe(2020);
            expect(output.months).toBe(3);
            expect(output.weeks).toBeUndefined();
            expect(output.days).toBe(7);
            expect(output.hours).toBeUndefined();
            expect(output.minutes).toBe(58);
            expect(output.seconds).toBe(23);
            expect(output.fractional_part).toBeUndefined();
        });

        it("Encodes and decodes a fractional DURATION without all components correctly", () => {
            const el = new CodecElement();

            const duration = new asn1.DURATION_EQUIVALENT(
                2020, 3, undefined, 7, undefined, 58, undefined, {
                    number_of_digits: 3,
                    fractional_value: 123,
                },
            );

            el.duration = duration;
            expect(el.value).toEqual(new Uint8Array([
                0x32, 0x30, 0x32, 0x30, "Y".charCodeAt(0),
                0x33, "M".charCodeAt(0),
                0x37, "D".charCodeAt(0),
                "T".charCodeAt(0),
                // 0x31, 0x35, "H".charCodeAt(0),
                0x35, 0x38,
                ".".charCodeAt(0),
                0x31, 0x32, 0x33,
                "M".charCodeAt(0),
                // 0x32, 0x33, "S".charCodeAt(0),
            ]));
            const output = el.duration;
            expect(output.years).toBe(2020);
            expect(output.months).toBe(3);
            expect(output.weeks).toBeUndefined();
            expect(output.days).toBe(7);
            expect(output.hours).toBeUndefined();
            expect(output.minutes).toBe(58);
            expect(output.seconds).toBeUndefined();
            expect(output.fractional_part).toEqual({
                number_of_digits: 3,
                fractional_value: 123,
            });
        });
    });
});
