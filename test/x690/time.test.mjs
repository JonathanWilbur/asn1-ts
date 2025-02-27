import * as asn1 from "../../dist/index.mjs";
import { describe, it } from "node:test";
import { strict as assert } from "node:assert";

[
    asn1.BERElement,
    asn1.CERElement,
    asn1.DERElement,
].forEach((CodecElement) => {
    describe(CodecElement.constructor.name, () => {
        it("Encodes a DATE correctly", () => {
            const el = new CodecElement();
            el.date = new Date(2020, 3, 7);
            assert.deepEqual(el.value, new Uint8Array([
                0x32, 0x30, 0x32, 0x30, 0x30, 0x34, 0x30, 0x37,
            ]));
            const output = el.date;
            assert.equal(output.getFullYear(), 2020);
            assert.equal(output.getMonth(), 3);
            assert.equal(output.getDate(), 7);
        });

        it("Encodes a TIME-OF-DAY correctly", () => {
            const el = new CodecElement();
            el.timeOfDay = new Date(2020, 3, 7, 15, 58, 23);
            assert.deepEqual(el.value, new Uint8Array([
                0x31, 0x35, 0x35, 0x38, 0x32, 0x33,
            ]));
            const output = el.timeOfDay;
            assert.equal(output.getHours(), 15);
            assert.equal(output.getMinutes(), 58);
            assert.equal(output.getSeconds(), 23);
        });

        it("Encodes a DATE-TIME correctly", () => {
            const el = new CodecElement();
            el.dateTime = new Date(2020, 3, 7, 15, 58, 23);
            assert.deepEqual(el.value, new Uint8Array([
                0x32, 0x30, 0x32, 0x30, 0x30, 0x34, 0x30, 0x37,
                0x31, 0x35, 0x35, 0x38, 0x32, 0x33,
            ]));
            const output = el.dateTime;
            assert.equal(output.getFullYear(), 2020);
            assert.equal(output.getMonth(), 3);
            assert.equal(output.getDate(), 7);
            assert.equal(output.getHours(), 15);
            assert.equal(output.getMinutes(), 58);
            assert.equal(output.getSeconds(), 23);
        });
    });
});
