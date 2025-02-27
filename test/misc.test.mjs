import * as asn1 from "../dist/index.mjs";
import { describe, it } from "node:test";
import { strict as assert } from "node:assert";

const MAX_SINT_32 = asn1.MAX_SINT_32;
const MIN_SINT_32 = asn1.MIN_SINT_32;
const MAX_UINT_32 = asn1.MAX_UINT_32;
const MIN_UINT_32 = asn1.MIN_UINT_32;

describe("The unsigned big-endian integer decoder", () => {
    it("decodes MIN_UINT_32 correctly", () => {
        const data = new Uint8Array([
            0x00, 0x00, 0x00, 0x00,
        ]);
        assert.equal(asn1.decodeUnsignedBigEndianInteger(data), MIN_UINT_32);
    });

    it("decodes 65535 correctly", () => {
        const data = new Uint8Array([
            0xFF, 0xFF,
        ]);
        assert.equal(asn1.decodeUnsignedBigEndianInteger(data), 65535);
    });

    it("decodes MAX_UINT_32 correctly", () => {
        const data = new Uint8Array([
            0xFF, 0xFF, 0xFF, 0xFF,
        ]);
        assert.equal(asn1.decodeUnsignedBigEndianInteger(data), MAX_UINT_32);
    });
});

describe("The signed big-endian integer decoder", () => {
    it("decodes zero correctly", () => {
        const data = new Uint8Array([
            0x00, 0x00, 0x00, 0x00,
        ]);
        assert.equal(asn1.decodeSignedBigEndianInteger(data), 0);
    });

    it("decodes 65535 correctly", () => {
        const data = new Uint8Array([
            0xFF, 0xFF,
        ]);
        assert.equal(asn1.decodeSignedBigEndianInteger(data), -1);
    });

    it("decodes MIN_SINT_32 correctly", () => {
        const data = new Uint8Array([
            0x80, 0x00, 0x00, 0x00,
        ]);
        assert.equal(asn1.decodeSignedBigEndianInteger(data), MIN_SINT_32);
    });

    it("decodes MAX_SINT_32 correctly", () => {
        const data = new Uint8Array([
            0x7F, 0xFF, 0xFF, 0xFF,
        ]);
        assert.equal(asn1.decodeSignedBigEndianInteger(data), MAX_SINT_32);
    });
});

describe("ObjectIdentifier with a prefix", () => {
    it("correctly uses the nodes from the prefix", () => {
        const ds = new asn1.ObjectIdentifier([ 2, 5 ]);
        const attributeTypes = new asn1.ObjectIdentifier([ 4 ], ds);
        assert.deepEqual(attributeTypes.nodes, [ 2, 5, 4 ]);
    });
});

describe("ObjectIdentifier", () => {
    it("compares correctly", () => {
        const oid1 = new asn1.ObjectIdentifier([ 2, 5, 4, 3 ]);
        const oid2 = new asn1.ObjectIdentifier([ 2, 5, 4, 3 ]);
        const oid3 = new asn1.ObjectIdentifier([ 2, 5, 4, 5 ]);
        const oid4 = new asn1.ObjectIdentifier([ 1, 5, 4, 3 ]);
        assert(asn1.ObjectIdentifier.compare(oid1, oid2));
        assert(!asn1.ObjectIdentifier.compare(oid1, oid3));
        assert(!asn1.ObjectIdentifier.compare(oid1, oid4));
    });
});
