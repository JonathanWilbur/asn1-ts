import * as asn1 from "../../dist/index.mjs";
import { describe, it } from "node:test";
import { strict as assert } from "node:assert";

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
            assert.deepEqual(el.value, new Uint8Array([
                0x32, 0x30, 0x32, 0x30, "Y".charCodeAt(0),
                0x33, "M".charCodeAt(0),
                0x37, "D".charCodeAt(0),
                "T".charCodeAt(0),
                0x31, 0x35, "H".charCodeAt(0),
                0x35, 0x38, "M".charCodeAt(0),
                0x32, 0x33, "S".charCodeAt(0),
            ]));
            const output = el.duration;
            assert.equal(output.years, 2020);
            assert.equal(output.months, 3);
            assert.equal(output.weeks, undefined);
            assert.equal(output.days, 7);
            assert.equal(output.hours, 15);
            assert.equal(output.minutes, 58);
            assert.equal(output.seconds, 23);
            assert.equal(output.fractional_part, undefined);
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
            assert.deepEqual(el.value, new Uint8Array([
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
            assert.equal(output.years, 2020);
            assert.equal(output.months, 3);
            assert.equal(output.weeks, undefined);
            assert.equal(output.days, 7);
            assert.equal(output.hours, 15);
            assert.equal(output.minutes, 58);
            assert.equal(output.seconds, 23);
            assert.deepEqual(output.fractional_part, {
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
            assert.deepEqual(el.value, new Uint8Array([ 0x34, "W".charCodeAt(0) ]));
            const output = el.duration;
            assert.equal(output.years, undefined);
            assert.equal(output.months, undefined);
            assert.equal(output.weeks, 4);
            assert.equal(output.days, undefined);
            assert.equal(output.hours, undefined);
            assert.equal(output.minutes, undefined);
            assert.equal(output.seconds, undefined);
            assert.equal(output.fractional_part, undefined);
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
            assert.deepEqual(el.value, new Uint8Array([
                0x34,
                ".".charCodeAt(0),
                0x35, 0x36, 0x37, 0x38,
                "W".charCodeAt(0),
            ]));
            const output = el.duration;
            assert.equal(output.years, undefined);
            assert.equal(output.months, undefined);
            assert.equal(output.weeks, 4);
            assert.equal(output.days, undefined);
            assert.equal(output.hours, undefined);
            assert.equal(output.minutes, undefined);
            assert.equal(output.seconds, undefined);
            assert.deepEqual(output.fractional_part, {
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
            assert.deepEqual(el.value, new Uint8Array([
                0x32, 0x30, 0x32, 0x30, "Y".charCodeAt(0),
                0x33, "M".charCodeAt(0),
                0x37, "D".charCodeAt(0),
                "T".charCodeAt(0),
                // 0x31, 0x35, "H".charCodeAt(0),
                0x35, 0x38, "M".charCodeAt(0),
                0x32, 0x33, "S".charCodeAt(0),
            ]));
            const output = el.duration;
            assert.equal(output.years, 2020);
            assert.equal(output.months, 3);
            assert.equal(output.weeks, undefined);
            assert.equal(output.days, 7);
            assert.equal(output.hours, undefined);
            assert.equal(output.minutes, 58);
            assert.equal(output.seconds, 23);
            assert.equal(output.fractional_part, undefined);
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
            assert.deepEqual(el.value, new Uint8Array([
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
            assert.equal(output.years, 2020);
            assert.equal(output.months, 3);
            assert.equal(output.weeks, undefined);
            assert.equal(output.days, 7);
            assert.equal(output.hours, undefined);
            assert.equal(output.minutes, 58);
            assert.equal(output.seconds, undefined);
            assert.deepEqual(output.fractional_part, {
                number_of_digits: 3,
                fractional_value: 123,
            });
        });
    });
});
