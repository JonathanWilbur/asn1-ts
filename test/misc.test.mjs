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
        const ds = asn1.ObjectIdentifier.fromParts([ 2, 5 ]);
        const attributeTypes = asn1.ObjectIdentifier.fromParts([ 4 ], ds);
        assert.deepEqual(attributeTypes.nodes, [ 2, 5, 4 ]);
    });
});

describe("ObjectIdentifier", () => {
    it("compares correctly", () => {
        const oid1 = asn1.ObjectIdentifier.fromParts([ 2, 5, 4, 3 ]);
        const oid2 = asn1.ObjectIdentifier.fromParts([ 2, 5, 4, 3 ]);
        const oid3 = asn1.ObjectIdentifier.fromParts([ 2, 5, 4, 5 ]);
        const oid4 = asn1.ObjectIdentifier.fromParts([ 1, 5, 4, 3 ]);
        assert(asn1.ObjectIdentifier.compare(oid1, oid2));
        assert(!asn1.ObjectIdentifier.compare(oid1, oid3));
        assert(!asn1.ObjectIdentifier.compare(oid1, oid4));
    });
});

/**
 * Encode an unsigned integer as one X.690 OBJECT IDENTIFIER arc (base-128).
 * @param {number | bigint} arc
 * @returns {number[]}
 */
function encodeOidArc (arc) {
    let v = typeof arc === "bigint" ? arc : BigInt(arc);
    const bytes = [ Number(v & 0x7Fn) ];
    v >>= 7n;
    while (v > 0n) {
        bytes.push(Number(v & 0x7Fn) | 0x80);
        v >>= 7n;
    }
    bytes.reverse();
    return bytes;
}

/**
 * Construct an OBJECT IDENTIFIER from arcs that may be `number` or `bigint`.
 * @param {(number | bigint)[]} arcs
 * @returns {asn1.ObjectIdentifier}
 */
function oidFromArcs (arcs) {
    const combined = BigInt(arcs[0]) * 40n + BigInt(arcs[1]);
    const bytes = encodeOidArc(combined);
    for (let i = 2; i < arcs.length; i++) {
        bytes.push(...encodeOidArc(arcs[i]));
    }
    return asn1.ObjectIdentifier.fromBytes(Uint8Array.from(bytes));
}

describe("ObjectIdentifier.nodesBigAndSmall", () => {
    it("matches nodes for typical OIDs, with every arc a number", () => {
        const oid = asn1.ObjectIdentifier.fromParts([ 1, 2, 840, 113549, 1, 1, 1 ]);
        const bigAndSmall = oid.nodesBigAndSmall;
        assert.deepEqual(bigAndSmall, [ 1, 2, 840, 113549, 1, 1, 1 ]);
        assert.deepEqual(bigAndSmall, oid.nodes);
        for (const arc of bigAndSmall) {
            assert.equal(typeof arc, "number");
        }
    });

    it("uses the single-byte fast path", () => {
        const oid = asn1.ObjectIdentifier.fromParts([ 2, 5, 4, 3 ]);
        assert.deepEqual(oid.nodesBigAndSmall, [ 2, 5, 4, 3 ]);
    });

    it("decodes 2-byte, 3-byte, and 4-byte arcs as numbers", () => {
        const oid = asn1.ObjectIdentifier.fromParts([ 1, 2, 128, 16384, 2097152 ]);
        const bigAndSmall = oid.nodesBigAndSmall;
        assert.deepEqual(bigAndSmall, [ 1, 2, 128, 16384, 2097152 ]);
        assert.deepEqual(bigAndSmall, oid.nodes);
        for (const arc of bigAndSmall) {
            assert.equal(typeof arc, "number");
        }
    });

    it("decodes 5-byte through 7-byte arcs as numbers", () => {
        const oid = asn1.ObjectIdentifier.fromParts([
            1, 2,
            0x10000000, // 5 bytes
            0x800000000, // 6 bytes
            0x40000000000, // 7 bytes
        ]);
        const bigAndSmall = oid.nodesBigAndSmall;
        assert.deepEqual(bigAndSmall, [ 1, 2, 0x10000000, 0x800000000, 0x40000000000 ]);
        assert.deepEqual(bigAndSmall, oid.nodes);
    });

    it("decodes Number.MAX_SAFE_INTEGER as a number", () => {
        const oid = asn1.ObjectIdentifier.fromParts([ 1, 2, Number.MAX_SAFE_INTEGER ]);
        const bigAndSmall = oid.nodesBigAndSmall;
        assert.deepEqual(bigAndSmall, [ 1, 2, Number.MAX_SAFE_INTEGER ]);
        assert.equal(typeof bigAndSmall[2], "number");
        assert.deepEqual(bigAndSmall, oid.nodes);
    });

    it("decodes an 8-byte arc just above Number.MAX_SAFE_INTEGER as a bigint", () => {
        const huge = BigInt(Number.MAX_SAFE_INTEGER) + 1n;
        const oid = oidFromArcs([ 1, 2, huge ]);
        const bigAndSmall = oid.nodesBigAndSmall;
        assert.equal(bigAndSmall[0], 1);
        assert.equal(bigAndSmall[1], 2);
        assert.equal(typeof bigAndSmall[2], "bigint");
        assert.equal(bigAndSmall[2], huge);
        assert.throws(() => oid.nodes, asn1.ASN1OverflowError);
    });

    it("does not round an arc that is not an exact IEEE-754 integer", () => {
        // 2^53 + 1 is the smallest integer above MAX_SAFE_INTEGER that a
        // Number cannot represent (the ulp at 2^53 is 2). Applying the 8th
        // base-128 octet with Number arithmetic and then calling BigInt()
        // would yield 2^53, not 2^53 + 1. 2^56 + 1 is the same trap one
        // octet further on (9-byte encoding, ulp at 2^56 is 8).
        const eightByteArc = (1n << 53n) + 1n;
        const nineByteArc = (1n << 56n) + 1n;
        assert.notEqual(BigInt(Number(eightByteArc)), eightByteArc);
        assert.notEqual(BigInt(Number(nineByteArc)), nineByteArc);

        const oid = oidFromArcs([ 1, 2, eightByteArc, nineByteArc ]);
        const bigAndSmall = oid.nodesBigAndSmall;
        assert.equal(typeof bigAndSmall[2], "bigint");
        assert.equal(bigAndSmall[2], eightByteArc);
        assert.equal(typeof bigAndSmall[3], "bigint");
        assert.equal(bigAndSmall[3], nineByteArc);
    });

    it("decodes a 9-or-more-byte arc as a bigint", () => {
        const huge = 1n << 100n;
        const oid = oidFromArcs([ 1, 2, huge, 5 ]);
        const bigAndSmall = oid.nodesBigAndSmall;
        assert.deepEqual(bigAndSmall.slice(0, 2), [ 1, 2 ]);
        assert.equal(typeof bigAndSmall[2], "bigint");
        assert.equal(bigAndSmall[2], huge);
        assert.equal(typeof bigAndSmall[3], "number");
        assert.equal(bigAndSmall[3], 5);
        assert.throws(() => oid.nodes, asn1.ASN1OverflowError);
    });

    it("returns a bigint second arc when 40*first+second exceeds Number.MAX_SAFE_INTEGER", () => {
        const hugeSecond = BigInt(Number.MAX_SAFE_INTEGER) + 1n;
        const oid = oidFromArcs([ 2, hugeSecond ]);
        const bigAndSmall = oid.nodesBigAndSmall;
        assert.equal(bigAndSmall[0], 2);
        assert.equal(typeof bigAndSmall[1], "bigint");
        assert.equal(bigAndSmall[1], hugeSecond);
        assert.throws(() => oid.nodes, asn1.ASN1OverflowError);
    });

    it("keeps a large but safe second arc as a number when only the combined subcomponent overflows", () => {
        // Combined first subcomponent is 80 + second. When second is
        // MAX_SAFE_INTEGER - 40, combined exceeds MAX_SAFE_INTEGER, but the
        // second arc itself still fits in a number.
        const second = Number.MAX_SAFE_INTEGER - 40;
        const oid = oidFromArcs([ 2, second ]);
        const bigAndSmall = oid.nodesBigAndSmall;
        assert.equal(bigAndSmall[0], 2);
        assert.equal(typeof bigAndSmall[1], "number");
        assert.equal(bigAndSmall[1], second);
    });

    it("decodes mixed number and bigint arcs", () => {
        const huge = (1n << 70n) + 123n;
        const oid = oidFromArcs([ 2, 999, 1, huge, 0, 99 ]);
        const bigAndSmall = oid.nodesBigAndSmall;
        assert.equal(bigAndSmall[0], 2);
        assert.equal(bigAndSmall[1], 999);
        assert.equal(bigAndSmall[2], 1);
        assert.equal(typeof bigAndSmall[3], "bigint");
        assert.equal(bigAndSmall[3], huge);
        assert.equal(bigAndSmall[4], 0);
        assert.equal(bigAndSmall[5], 99);
    });

    it("throws on prohibited padding", () => {
        const oid = asn1.ObjectIdentifier.fromBytesUnsafe(new Uint8Array([ 0x2A, 0x80, 0x06 ]));
        assert.throws(() => oid.nodesBigAndSmall, asn1.ASN1PaddingError);
    });

    it("throws on a truncated encoding", () => {
        const oid = asn1.ObjectIdentifier.fromBytesUnsafe(new Uint8Array([ 0x2A, 0x81 ]));
        assert.throws(() => oid.nodesBigAndSmall, asn1.ASN1TruncationError);
    });
});

describe("ObjectIdentifier.fromStringWithBigArcs", () => {
    it("matches fromString for typical OIDs", () => {
        const s = "1.2.840.113549.1.1.1";
        const fromSmall = asn1.ObjectIdentifier.fromString(s);
        const fromBig = asn1.ObjectIdentifier.fromStringWithBigArcs(s);
        assert(asn1.ObjectIdentifier.compare(fromSmall, fromBig));
        assert.deepEqual(fromBig.nodes, [ 1, 2, 840, 113549, 1, 1, 1 ]);
        assert.deepEqual(fromBig.nodesBigAndSmall, fromBig.nodes);
    });

    it("encodes a leading-zero decimal arc the same as fromString", () => {
        const fromSmall = asn1.ObjectIdentifier.fromString("2.5.04.3");
        const fromBig = asn1.ObjectIdentifier.fromStringWithBigArcs("2.5.04.3");
        assert(asn1.ObjectIdentifier.compare(fromSmall, fromBig));
        assert.deepEqual(fromBig.nodes, [ 2, 5, 4, 3 ]);
    });

    it("preserves an 8-byte arc that is not an exact IEEE-754 integer", () => {
        const huge = (1n << 53n) + 1n;
        const s = `1.2.${huge}`;
        const oid = asn1.ObjectIdentifier.fromStringWithBigArcs(s);
        assert.equal(typeof oid.nodesBigAndSmall[2], "bigint");
        assert.equal(oid.nodesBigAndSmall[2], huge);
        assert(!asn1.ObjectIdentifier.compare(oid, asn1.ObjectIdentifier.fromString(s)));
        assert(asn1.ObjectIdentifier.compare(oid, oidFromArcs([ 1, 2, huge ])));
    });

    it("preserves a 9-or-more-byte arc", () => {
        const huge = (1n << 100n) + 99n;
        const oid = asn1.ObjectIdentifier.fromStringWithBigArcs(`1.2.${huge}.5`);
        assert.deepEqual(oid.nodesBigAndSmall.slice(0, 2), [ 1, 2 ]);
        assert.equal(oid.nodesBigAndSmall[2], huge);
        assert.equal(oid.nodesBigAndSmall[3], 5);
        assert(asn1.ObjectIdentifier.compare(oid, oidFromArcs([ 1, 2, huge, 5 ])));
        assert.throws(() => oid.nodes, asn1.ASN1OverflowError);
    });

    it("preserves a huge ITU-T second arc", () => {
        const hugeSecond = BigInt(Number.MAX_SAFE_INTEGER) + 1n;
        const oid = asn1.ObjectIdentifier.fromStringWithBigArcs(`2.${hugeSecond}.1`);
        assert.equal(oid.nodesBigAndSmall[0], 2);
        assert.equal(oid.nodesBigAndSmall[1], hugeSecond);
        assert.equal(oid.nodesBigAndSmall[2], 1);
        assert(asn1.ObjectIdentifier.compare(oid, oidFromArcs([ 2, hugeSecond, 1 ])));
    });

    it("preserves mixed small and huge arcs", () => {
        const huge = (1n << 70n) + 123n;
        const oid = asn1.ObjectIdentifier.fromStringWithBigArcs(`2.999.1.${huge}.0.99`);
        assert.equal(oid.nodesBigAndSmall[0], 2);
        assert.equal(oid.nodesBigAndSmall[1], 999);
        assert.equal(oid.nodesBigAndSmall[2], 1);
        assert.equal(oid.nodesBigAndSmall[3], huge);
        assert.equal(oid.nodesBigAndSmall[4], 0);
        assert.equal(oid.nodesBigAndSmall[5], 99);
    });

    it("throws when there are fewer than two arcs", () => {
        assert.throws(() => asn1.ObjectIdentifier.fromStringWithBigArcs("1"), /less than two nodes/);
        assert.throws(() => asn1.ObjectIdentifier.fromStringWithBigArcs(""), SyntaxError);
    });

    it("throws when the first arc is not 0, 1, or 2", () => {
        assert.throws(() => asn1.ObjectIdentifier.fromStringWithBigArcs("3.1.1"), /first node must be 0, 1, or 2/);
    });

    it("throws when the second arc exceeds 39 and the first arc is 0 or 1", () => {
        assert.throws(() => asn1.ObjectIdentifier.fromStringWithBigArcs("0.40"), /cannot exceed 39/);
        assert.throws(() => asn1.ObjectIdentifier.fromStringWithBigArcs("1.40"), /cannot exceed 39/);
        const oid = asn1.ObjectIdentifier.fromStringWithBigArcs("0.39.1");
        assert.deepEqual(oid.nodes, [ 0, 39, 1 ]);
    });

    it("throws on a non-decimal or empty arc", () => {
        assert.throws(() => asn1.ObjectIdentifier.fromStringWithBigArcs("1.2.0x10"), SyntaxError);
        assert.throws(() => asn1.ObjectIdentifier.fromStringWithBigArcs("1.2."), SyntaxError);
        assert.throws(() => asn1.ObjectIdentifier.fromStringWithBigArcs("1..2"), SyntaxError);
        assert.throws(() => asn1.ObjectIdentifier.fromStringWithBigArcs("-1.2"), SyntaxError);
    });
});

describe("ObjectIdentifier.toString", () => {
    it("uses the number path for typical OIDs", () => {
        const oid = asn1.ObjectIdentifier.fromParts([ 1, 2, 840, 113549, 1, 1, 1 ]);
        assert.equal(oid.toString(), "1.2.840.113549.1.1.1");
    });

    it("prints arcs larger than Number.MAX_SAFE_INTEGER exactly", () => {
        const huge = (1n << 53n) + 1n;
        const oid = asn1.ObjectIdentifier.fromStringWithBigArcs(`1.2.${huge}`);
        assert.equal(oid.toString(), `1.2.${huge}`);
        assert.throws(() => oid.nodes, asn1.ASN1OverflowError);
    });

    it("round-trips a huge arc with fromStringWithBigArcs", () => {
        const huge = (1n << 100n) + 99n;
        const s = `2.999.${huge}.0`;
        const oid = asn1.ObjectIdentifier.fromStringWithBigArcs(s);
        assert.equal(oid.toString(), s);
        const again = asn1.ObjectIdentifier.fromStringWithBigArcs(oid.toString());
        assert(asn1.ObjectIdentifier.compare(oid, again));
    });
});
