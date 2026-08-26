import * as asn1 from "../../../dist/index.mjs";
import { describe, it } from "node:test";
import { strict as assert } from "node:assert";

[
    asn1.BERElement,
    asn1.CERElement,
    asn1.DERElement,
].forEach((CodecElement) => {
    describe(`${CodecElement.constructor.name}`, () => {
        it("Throws when encoding a DURATION with week and date-time components", () => {
            const el = new CodecElement();
            assert.throws(() => {
                const duration = new asn1.DURATION_EQUIVALENT(2020, 3, 4, 7, 15, 58, 23);
                el.duration = duration;
            });
        });

        it("Throws when decoding a DURATION with week and date-time components", () => {
            const el = new CodecElement();
            el.value = new Uint8Array([
                0x32, 0x30, 0x32, 0x30, "Y".charCodeAt(0),
                0x33, "M".charCodeAt(0),
                0x35, "W".charCodeAt(0),
                0x37, "D".charCodeAt(0),
            ]);

            assert.throws(() => el.duration);
        });

        it("Throws when encoding a DURATION with any negative components", () => {
            const el = new CodecElement();
            for (let i = 0; i < 7; i++) {
                const components = [ 2020, 3, 4, 7, 15, 58, 23 ];
                components[i] = (components[i] * -1);
                assert.throws(() => {
                    const duration = new asn1.DURATION_EQUIVALENT(...components);
                    el.duration = duration;
                });
            }
        });

        it("Throws when decoding a DURATION with a negative component", () => {
            const el = new CodecElement();
            el.value = new Uint8Array([
                0x32, 0x30, 0x32, 0x30, "Y".charCodeAt(0),
                "-".charCodeAt(0),
                0x33, "M".charCodeAt(0),
                0x37, "D".charCodeAt(0),
                "T".charCodeAt(0),
                0x31, 0x35, "H".charCodeAt(0),
                0x35, 0x38, "M".charCodeAt(0),
                0x32, 0x33, "S".charCodeAt(0),
            ]);
            assert.throws(() => {
                el.duration = duration;
            });
        });

        it("Throws when encoding a DURATION with multiple fractional components", () => {
            const el = new CodecElement();
            assert.throws(() => {
                const duration = new asn1.DURATION_EQUIVALENT(
                    2020, 3, undefined, 7.25, 15, 58, 23,
                );
                el.duration = duration;
            });

            assert.throws(() => {
                const duration2 = new asn1.DURATION_EQUIVALENT(
                    2020, 3, undefined, 7.25, 15, 58, 23, {
                        number_of_digits: 3,
                        fractional_value: 123,
                    },
                );
                el.duration = duration2;
            });
        });

        it("Throws when decoding a DURATION with multiple fractional components", () => {
            const el = new CodecElement();
            el.value = new Uint8Array([
                0x32, 0x30, 0x32, 0x30, "Y".charCodeAt(0),
                0x33, "M".charCodeAt(0),
                ".".charCodeAt(0), 0x30, 0x31, 0x32, 0x39,
                0x37, "D".charCodeAt(0),
                "T".charCodeAt(0),
                0x31, 0x35, "H".charCodeAt(0),
                0x35, 0x38, "M".charCodeAt(0),
                0x32, 0x33,
                ".".charCodeAt(0), 0x31, 0x32, 0x33,
                "S".charCodeAt(0),
            ]);
            assert.throws(() => el.duration);
        });

        it("Throws when decoding a DURATION with misordered components", () => {
            const el = new CodecElement();
            el.value = new Uint8Array([
                0x32, 0x30, 0x32, 0x30, "Y".charCodeAt(0),
                0x33, "M".charCodeAt(0),
                0x37, "D".charCodeAt(0),
                0x31, 0x35, "H".charCodeAt(0),
                "T".charCodeAt(0),
                0x35, 0x38, "M".charCodeAt(0),
                0x32, 0x33, "S".charCodeAt(0),
            ]);
            assert.throws(() => el.duration);
        });

        it("Throws when decoding a DURATION with unrecognized letters", () => {
            const el = new CodecElement();
            el.value = new Uint8Array([
                0x32, 0x30, 0x32, 0x30, "Y".charCodeAt(0),
                0x33, "Q".charCodeAt(0),
                0x37, "D".charCodeAt(0),
                "T".charCodeAt(0),
                0x31, 0x35, "H".charCodeAt(0),
                0x35, 0x38, "X".charCodeAt(0),
                0x32, 0x33, "S".charCodeAt(0),
            ]);
            assert.throws(() => el.duration);
        });

        it("Throws when decoding a DURATION with multiple periods", () => {
            const el = new CodecElement();
            el.value = new Uint8Array([
                0x32, 0x30, 0x32, 0x30, "Y".charCodeAt(0),
                0x33, "M".charCodeAt(0),
                0x37, "D".charCodeAt(0),
                "T".charCodeAt(0),
                0x31, 0x35, "H".charCodeAt(0),
                0x35, 0x38, "M".charCodeAt(0),
                0x32, 0x33,
                ".".charCodeAt(0), 0x34, 0x35, 0x36,
                ".".charCodeAt(0), 0x31, 0x32, 0x33,
                "S".charCodeAt(0),
            ]);
            assert.throws(() => el.duration);
        });

        it("Throws when decoding a DURATION with the fractional component before a smaller component", () => {
            const el = new CodecElement();
            el.value = new Uint8Array([
                0x32, 0x30, 0x32, 0x30, "Y".charCodeAt(0),
                0x33, "M".charCodeAt(0),
                0x37, "D".charCodeAt(0),
                "T".charCodeAt(0),
                0x31, 0x35, "H".charCodeAt(0),
                0x35, 0x38, ".".charCodeAt(0), 0x31, 0x32, 0x33, "M".charCodeAt(0),
                0x32, 0x33, "S".charCodeAt(0),
            ]);
            assert.throws(() => el.duration);
        });
    });
});

[
    asn1.CERElement,
    asn1.DERElement,
].forEach((CodecElement) => {
    describe(`${CodecElement.constructor.name} DURATION canonical rules`, () => {
        it("Throws when decoding a DURATION with a zeroed date component", () => {
            const el = new CodecElement();
            el.value = new Uint8Array([
                0x31, "Y".charCodeAt(0),
                0x30, "M".charCodeAt(0),
                0x31, "D".charCodeAt(0),
            ]);
            assert.throws(() => el.duration);
        });

        it("Throws when decoding a DURATION with a zeroed time component", () => {
            const el = new CodecElement();
            el.value = new Uint8Array([
                "T".charCodeAt(0),
                0x31, "H".charCodeAt(0),
                0x30, "M".charCodeAt(0),
                0x31, "S".charCodeAt(0),
            ]);
            assert.throws(() => el.duration);
        });

        it("Throws when decoding a DURATION of zero weeks", () => {
            const el = new CodecElement();
            el.value = new Uint8Array([ 0x30, "W".charCodeAt(0) ]);
            assert.throws(() => el.duration);
        });

        it("Throws when decoding a DURATION of 0S", () => {
            const el = new CodecElement();
            el.value = new Uint8Array([
                "T".charCodeAt(0),
                0x30, "S".charCodeAt(0),
            ]);
            assert.throws(() => el.duration);
        });

        it("Still decodes a non-zero fractional component that starts with 0", () => {
            const el = new CodecElement();
            el.value = new Uint8Array([
                "T".charCodeAt(0),
                0x30, ".".charCodeAt(0), 0x35, "S".charCodeAt(0),
            ]);
            const output = el.duration;
            assert.equal(output.seconds, 0);
            assert.deepEqual(output.fractional_part, {
                number_of_digits: 1,
                fractional_value: 5,
            });
        });
    });
});

describe("BERElement DURATION", () => {
    it("Allows zeroed components", () => {
        const el = new asn1.BERElement();
        el.value = new Uint8Array([
            0x31, "Y".charCodeAt(0),
            0x30, "M".charCodeAt(0),
            0x31, "D".charCodeAt(0),
        ]);
        const output = el.duration;
        assert.equal(output.years, 1);
        assert.equal(output.months, 0);
        assert.equal(output.days, 1);
    });
});
