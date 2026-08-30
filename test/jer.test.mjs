import * as asn1 from "../dist/index.mjs";
import { describe, it } from "node:test";
import { strict as assert } from "node:assert";

describe("JSON Encoding Rules", () => {
    it("Converts a BigInt into a string", () => {
        const el = new asn1.BERElement();
        el.tagNumber = 2;
        el.integer = 45081095376109356095179030960913561n;
        assert.equal(el.toJSON(), "45081095376109356095179030960913561");
    });

    it("pads OCTET STRING bytes to two hex characters", () => {
        const el = new asn1.BERElement();
        el.tagNumber = asn1.ASN1UniversalType.octetString;
        el.octetString = new Uint8Array([ 0x00, 0x0a, 0x0b, 0xff ]);
        assert.equal(el.toJSON(), "000a0bff");
        el.octetString = new Uint8Array(0);
        assert.equal(el.toJSON(), "");
    });

    it("pads packed BIT STRING bytes to two hex characters", () => {
        const el = new asn1.BERElement();
        el.tagNumber = asn1.ASN1UniversalType.bitString;
        el.bitString = new Uint8ClampedArray([ 0, 0, 0, 0, 1, 0, 1, 0 ]);
        assert.deepEqual(el.toJSON(), { length: 8, value: "0a" });
        el.bitString = new Uint8ClampedArray([ 1, 0, 1 ]);
        assert.deepEqual(el.toJSON(), { length: 3, value: "a0" });
    });

    it("hex-encodes only the OCTET STRING view, not the backing ArrayBuffer", () => {
        const backing = Buffer.from([ 0xff, 0xff, 0x04, 0x02, 0x0a, 0x0b, 0xee, 0xee ]);
        const el = new asn1.BERElement();
        el.fromBytes(backing.subarray(2), true);
        assert.equal(el.toJSON(), "0a0b");
        assert.equal(el.toString(), "'0a0b'H");
    });
});
