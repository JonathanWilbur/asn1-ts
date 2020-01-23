const asn1 = require("../../dist/index.js");

[
    asn1.BERElement,
    asn1.CERElement,
    asn1.DERElement,
].forEach((CodecElement) => {
    describe(CodecElement.constructor.name, () => {
        it("Encodes a DATE correctly", () => {
            const el = new CodecElement();
            el.date = new Date(2020, 3, 7);
            expect(el.value).toEqual(new Uint8Array([
                0x32, 0x30, 0x32, 0x30, 0x30, 0x34, 0x30, 0x37,
            ]));
            const output = el.date;
            expect(output.getFullYear()).toBe(2020);
            expect(output.getMonth()).toBe(3);
            expect(output.getDate()).toBe(7);
        });

        it("Encodes a TIME-OF-DAY correctly", () => {
            const el = new CodecElement();
            el.timeOfDay = new Date(2020, 3, 7, 15, 58, 23);
            expect(el.value).toEqual(new Uint8Array([
                0x31, 0x35, 0x35, 0x38, 0x32, 0x33,
            ]));
            const output = el.timeOfDay;
            expect(output.getHours()).toBe(15);
            expect(output.getMinutes()).toBe(58);
            expect(output.getSeconds()).toBe(23);
        });

        it("Encodes a DATE-TIME correctly", () => {
            const el = new CodecElement();
            el.dateTime = new Date(2020, 3, 7, 15, 58, 23);
            expect(el.value).toEqual(new Uint8Array([
                0x32, 0x30, 0x32, 0x30, 0x30, 0x34, 0x30, 0x37,
                0x31, 0x35, 0x35, 0x38, 0x32, 0x33,
            ]));
            const output = el.dateTime;
            expect(output.getFullYear()).toBe(2020);
            expect(output.getMonth()).toBe(3);
            expect(output.getDate()).toBe(7);
            expect(output.getHours()).toBe(15);
            expect(output.getMinutes()).toBe(58);
            expect(output.getSeconds()).toBe(23);
        });
    });
});
