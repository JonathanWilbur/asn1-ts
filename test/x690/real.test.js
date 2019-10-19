const asn1 = require("../../dist/index.js");

[
    asn1.BERElement,
    asn1.DERElement,
].forEach((CodecElement) => {
    describe(`${CodecElement.constructor.name} Base-10 REAL decoder`, () => {
        // These examples are taken directly from ISO 6093
        it("decodes all valid NR1 expressions correctly", () => {
            const regex = asn1.nr1Regex;

            // Unsigned NR1
            expect(regex.test("0004902")).toBe(true);
            expect(regex.test("  04902")).toBe(true);
            expect(regex.test("   4902")).toBe(true);
            expect(regex.test("0001234")).toBe(true);
            expect(regex.test("   1234")).toBe(true);
            expect(regex.test("0000000")).toBe(true);
            expect(regex.test("      0")).toBe(true);
            expect(regex.test("1234567")).toBe(true);

            // Signed NR1
            expect(regex.test("+004902")).toBe(true);
            expect(regex.test(" +04902")).toBe(true);
            expect(regex.test("  +4902")).toBe(true);
            expect(regex.test("   4902")).toBe(true);
            expect(regex.test("+001234")).toBe(true);
            expect(regex.test("  +1234")).toBe(true);
            expect(regex.test("   1234")).toBe(true);
            expect(regex.test("-56780")).toBe(true);
            expect(regex.test(" -56780")).toBe(true);
            expect(regex.test("+000000")).toBe(true);
            expect(regex.test("     +0")).toBe(true);
            expect(regex.test("      0")).toBe(true);
        });

        // These examples are taken directly from ISO 6093
        it("decodes all valid NR2 expressions correctly", () => {
            const regex = asn1.nr2Regex;

            // Unsigned NR2
            expect(regex.test("1327.000")).toBe(true);
            expect(regex.test("0001327.")).toBe(true);
            expect(regex.test("   1327.")).toBe(true);
            expect(regex.test("00123,45")).toBe(true);
            expect(regex.test("  123,45")).toBe(true);
            expect(regex.test("  1237,0")).toBe(true);
            expect(regex.test("00.00001")).toBe(true);
            expect(regex.test("1234,567")).toBe(true);
            expect(regex.test("000,0000")).toBe(true);
            expect(regex.test("     0,0")).toBe(true);

            // Signed NR2
            expect(regex.test("+1327.00")).toBe(true);
            expect(regex.test("  +1327.")).toBe(true);
            expect(regex.test("   1327.")).toBe(true);
            expect(regex.test("0+123,45")).toBe(true);
            expect(regex.test("  123,45")).toBe(true);
            expect(regex.test(" +1237,0")).toBe(true);
            expect(regex.test("  1237,0")).toBe(true);
            expect(regex.test("+0.00001")).toBe(true);
            expect(regex.test("-5,67800")).toBe(true);
            expect(regex.test("-05,6780")).toBe(true);
            expect(regex.test("1234,567")).toBe(true);
            expect(regex.test("+0,00000")).toBe(true);
            expect(regex.test("    +0,0")).toBe(true);
            expect(regex.test("     0,0")).toBe(true);
            expect(regex.test("      0,")).toBe(true);
        });

        // These examples are taken directly from ISO 6093
        it("decodes all valid NR3 expressions correctly", () => {
            const regex = asn1.nr3Regex;

            // Signed NR3
            expect(regex.test("+0,56E+4")).toBe(true);
            expect(regex.test("+5.6e+03")).toBe(true);
            expect(regex.test("+0,3E-04")).toBe(true);
            expect(regex.test(" 0,3e-04")).toBe(true);
            expect(regex.test("-2,8E+00")).toBe(true);
            expect(regex.test("+0,0E+00")).toBe(true);
            expect(regex.test("   0.e+0")).toBe(true);
        });
    });


    describe(`${CodecElement.constructor.name} Base-2 REAL decoder`, () => {
        it("decodes all valid Base-2 REALs correctly", () => {
            const el = new CodecElement();
            el.value = new Uint8Array([ 0x80, 0xFB, 0x05 ]);
            expect(el.real).toBeCloseTo(0.15625);
        });
    });
});
