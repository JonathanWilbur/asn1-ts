import * as asn1 from "../../dist/index.mjs";
import { describe, it } from "node:test";
import { strict as assert } from "node:assert";

describe("Basic Encoding Rules", () => {
    it("throws an exception when decoding a multi-byte BOOLEAN", () => {
        const el = new asn1.BERElement();
        el.value = new Uint8Array([ 0x01, 0x01 ]);
        assert.throws(() => el.boolean);
    });

    it("throws an exception when decoding a BIT STRING with a deceptive first byte", () => {
        const el = new asn1.BERElement();
        el.value = new Uint8Array([ 0x05 ]);
        assert.throws(() => el.bitString);
    });

    it("throws an exception when decoding a BIT STRING with a first byte greater than 7", () => {
        const el = new asn1.BERElement();
        el.value = new Uint8Array([ 0x08, 0x0F, 0xF0 ]);
        assert.throws(() => el.bitString);
    });

    it("throws an exception when decoding a constructed BIT STRING whose non-terminal subcomponents start with non-zero value bytes", () => {
        const data = [
            0x23, 0x0E,
            0x03, 0x02, 0x03, 0x0F, // The 0x03 is what should cause this to throw.
            0x23, 0x04,
            0x03, 0x02, 0x00, 0x0F,
            0x03, 0x02, 0x05, 0xF0,
        ];
        const element = new asn1.BERElement();
        element.fromBytes(data);
        assert.throws(() => element.bitString);
    });

    it("throws when a non-last nested constructed BIT STRING has unused bits", () => {
        const data = new Uint8Array([
            0x23, 0x08,
            0x23, 0x04,
            0x03, 0x02, 0x03, 0xF0, // unused=3; this constructed child is not last.
            0x03, 0x02, 0x00, 0x0F,
        ]);
        const element = new asn1.BERElement();
        element.fromBytes(data);
        assert.throws(() => element.bitString);
    });

    it("throws when a constructed BIT STRING contains a child of the wrong tag class", () => {
        const data = new Uint8Array([
            0x23, 0x04,
            0x83, 0x02, 0x00, 0x0F, // [CONTEXT 3]
        ]);
        const element = new asn1.BERElement();
        element.fromBytes(data);
        assert.throws(() => element.bitString);
    });

    it("throws when a constructed BIT STRING contains a child of the wrong tag number", () => {
        const data = new Uint8Array([
            0x23, 0x04,
            0x04, 0x02, 0x00, 0x0F, // OCTET STRING
        ]);
        const element = new asn1.BERElement();
        element.fromBytes(data);
        assert.throws(() => element.bitString);
    });

    it("throws when a constructed BIT STRING contains an empty primitive fragment", () => {
        const data = new Uint8Array([
            0x23, 0x06,
            0x03, 0x00,             // empty primitive BIT STRING
            0x03, 0x02, 0x00, 0x0F,
        ]);
        const element = new asn1.BERElement();
        element.fromBytes(data);
        assert.throws(() => element.bitString);
    });

    it("throws when constructed BIT STRING nesting exceeds the recursion limit", () => {
        let data = [ 0x03, 0x02, 0x00, 0x0F ];
        for (let i = 0; i < (asn1.BERElement.nestingRecursionLimit + 1); i++) {
            data = [ 0x23, data.length ].concat(data);
        }
        const element = new asn1.BERElement();
        element.fromBytes(new Uint8Array(data));
        assert.throws(() => element.bitString);
    });
});
