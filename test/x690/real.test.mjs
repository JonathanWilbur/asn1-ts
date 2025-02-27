import * as asn1 from "../../dist/index.mjs";
import { describe, it } from "node:test";
import { strict as assert } from "node:assert";

// Thanks, ChatGPT 4o.
function areFloatsEqual(a, b) {
    // return Math.abs(a - b) < epsilon;
    return a.toFixed(8) === b.toFixed(8);
}

[
    asn1.BERElement,
    asn1.CERElement,
    asn1.DERElement,
].forEach((CodecElement) => {
    describe(`${CodecElement.constructor.name} Base-10 REAL decoder`, () => {
        // These examples are taken directly from ISO 6093
        it("decodes all valid NR1 expressions correctly", () => {
            const regex = asn1.nr1Regex;

            // Unsigned NR1
            assert.equal(regex.test("0004902"), true);
            assert.equal(regex.test("  04902"), true);
            assert.equal(regex.test("   4902"), true);
            assert.equal(regex.test("0001234"), true);
            assert.equal(regex.test("   1234"), true);
            assert.equal(regex.test("0000000"), true);
            assert.equal(regex.test("      0"), true);
            assert.equal(regex.test("1234567"), true);

            // Signed NR1
            assert.equal(regex.test("+004902"), true);
            assert.equal(regex.test(" +04902"), true);
            assert.equal(regex.test("  +4902"), true);
            assert.equal(regex.test("   4902"), true);
            assert.equal(regex.test("+001234"), true);
            assert.equal(regex.test("  +1234"), true);
            assert.equal(regex.test("   1234"), true);
            assert.equal(regex.test("-56780"), true);
            assert.equal(regex.test(" -56780"), true);
            assert.equal(regex.test("+000000"), true);
            assert.equal(regex.test("     +0"), true);
            assert.equal(regex.test("      0"), true);
        });

        // These examples are taken directly from ISO 6093
        it("decodes all valid NR2 expressions correctly", () => {
            const regex = asn1.nr2Regex;

            // Unsigned NR2
            assert.equal(regex.test("1327.000"), true);
            assert.equal(regex.test("0001327."), true);
            assert.equal(regex.test("   1327."), true);
            assert.equal(regex.test("00123,45"), true);
            assert.equal(regex.test("  123,45"), true);
            assert.equal(regex.test("  1237,0"), true);
            assert.equal(regex.test("00.00001"), true);
            assert.equal(regex.test("1234,567"), true);
            assert.equal(regex.test("000,0000"), true);
            assert.equal(regex.test("     0,0"), true);

            // Signed NR2
            assert.equal(regex.test("+1327.00"), true);
            assert.equal(regex.test("  +1327."), true);
            assert.equal(regex.test("   1327."), true);
            assert.equal(regex.test("0+123,45"), true);
            assert.equal(regex.test("  123,45"), true);
            assert.equal(regex.test(" +1237,0"), true);
            assert.equal(regex.test("  1237,0"), true);
            assert.equal(regex.test("+0.00001"), true);
            assert.equal(regex.test("-5,67800"), true);
            assert.equal(regex.test("-05,6780"), true);
            assert.equal(regex.test("1234,567"), true);
            assert.equal(regex.test("+0,00000"), true);
            assert.equal(regex.test("    +0,0"), true);
            assert.equal(regex.test("     0,0"), true);
            assert.equal(regex.test("      0,"), true);
        });

        // These examples are taken directly from ISO 6093
        it("decodes all valid NR3 expressions correctly", () => {
            const regex = asn1.nr3Regex;

            // Signed NR3
            assert.equal(regex.test("+0,56E+4"), true);
            assert.equal(regex.test("+5.6e+03"), true);
            assert.equal(regex.test("+0,3E-04"), true);
            assert.equal(regex.test(" 0,3e-04"), true);
            assert.equal(regex.test("-2,8E+00"), true);
            assert.equal(regex.test("+0,0E+00"), true);
            assert.equal(regex.test("   0.e+0"), true);
        });
    });


    describe(`${CodecElement.constructor.name} Base-2 REAL decoder`, () => {
        it("decodes all valid Base-2 REALs correctly", () => {
            const el = new CodecElement();
            el.value = new Uint8Array([ 0x80, 0xFB, 0x05 ]);
            assert(areFloatsEqual(el.real, 0.15625));
        });
    });
});
