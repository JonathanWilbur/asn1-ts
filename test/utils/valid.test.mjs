import * as asn1 from "../../dist/index.mjs";
import { describe, it } from "node:test";
import { strict as assert } from "node:assert";

import decodeIEEE754DoublePrecisionFloat from "../../dist/utils/decodeIEEE754DoublePrecisionFloat.mjs";
import decodeIEEE754SinglePrecisionFloat from "../../dist/utils/decodeIEEE754SinglePrecisionFloat.mjs";
import decodeSignedBigEndianInteger from "../../dist/utils/decodeSignedBigEndianInteger.mjs";
import decodeUnsignedBigEndianInteger from "../../dist/utils/decodeUnsignedBigEndianInteger.mjs";
import decodeX690RealNumber from "../../dist/utils/decodeX690RealNumber.mjs";
import dissectFloat from "../../dist/utils/dissectFloat.mjs";
import encodeIEEE754DoublePrecisionFloat from "../../dist/utils/encodeIEEE754DoublePrecisionFloat.mjs";
import encodeIEEE754SinglePrecisionFloat from "../../dist/utils/encodeIEEE754SinglePrecisionFloat.mjs";
import encodeSignedBigEndianInteger from "../../dist/utils/encodeSignedBigEndianInteger.mjs";
import encodeUnsignedBigEndianInteger from "../../dist/utils/encodeUnsignedBigEndianInteger.mjs";
import encodeX690BinaryRealNumber from "../../dist/utils/encodeX690BinaryRealNumber.mjs";
import getBitFromBase128 from "../../dist/utils/getBitFromBase128.mjs";
import getBitFromBase256 from "../../dist/utils/getBitFromBase256.mjs";
import packBits from "../../dist/utils/packBits.mjs";
import setBitInBase128 from "../../dist/utils/setBitInBase128.mjs";
import setBitInBase256 from "../../dist/utils/setBitInBase256.mjs";
import unpackBits from "../../dist/utils/unpackBits.mjs";

// Thanks, ChatGPT 4o.
function areFloatsEqual(a, b) {
    // return Math.abs(a - b) < epsilon;
    return a.toFixed(8) === b.toFixed(8);
}

describe("decodeIEEE754DoublePrecisionFloat()", () => {
    it("works", () => {
        // Taken directly from https://en.wikipedia.org/wiki/Double-precision_floating-point_format.
        const encoded1 = new Uint8Array([ 0x3F, 0x88, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00 ]);
        const decoded1 = 3 / 256;
        assert(areFloatsEqual(decodeIEEE754DoublePrecisionFloat(encoded1), decoded1));
    });
});

describe("decodeIEEE754SinglePrecisionFloat()", () => {
    it("works", () => {
        // Taken directly from https://en.wikipedia.org/wiki/Single-precision_floating-point_format.
        const encoded1 = new Uint8Array([ 0x40, 0x49, 0x0f, 0xdb ]);
        const decoded1 = 3.14159274101;
        assert(areFloatsEqual(decodeIEEE754SinglePrecisionFloat(encoded1), decoded1));
    });
});

describe("decodeSignedBigEndianInteger()", () => {
    it("works", () => {
        assert.equal(decodeSignedBigEndianInteger(new Uint8Array([ 0x00 ])), 0);
        assert.equal(decodeSignedBigEndianInteger(new Uint8Array([ 0x01 ])), 1);
        assert.equal(decodeSignedBigEndianInteger(new Uint8Array([ 0xFF ])), -1);
        assert.equal(decodeSignedBigEndianInteger(new Uint8Array([ 0x7F ])), 127);
        assert.equal(decodeSignedBigEndianInteger(new Uint8Array([ 0x80 ])), -128);
        assert.equal(decodeSignedBigEndianInteger(new Uint8Array([ 0x01, 0xFF ])), 511);
        assert.equal(decodeSignedBigEndianInteger(new Uint8Array([ 0x7F, 0xFF ])), 32767);
        assert.equal(decodeSignedBigEndianInteger(new Uint8Array([ 0x80, 0x00 ])), -32768);
    })
});

describe("decodeUnsignedBigEndianInteger()", () => {
    it("works", () => {
        assert.equal(decodeUnsignedBigEndianInteger(new Uint8Array([ 0x00 ])), 0);
        assert.equal(decodeUnsignedBigEndianInteger(new Uint8Array([ 0x01 ])), 1);
        assert.equal(decodeUnsignedBigEndianInteger(new Uint8Array([ 0xFF ])), 255);
        assert.equal(decodeUnsignedBigEndianInteger(new Uint8Array([ 0x7F ])), 127);
        assert.equal(decodeUnsignedBigEndianInteger(new Uint8Array([ 0x80 ])), 128);
        assert.equal(decodeUnsignedBigEndianInteger(new Uint8Array([ 0x01, 0xFF ])), 511);
        assert.equal(decodeUnsignedBigEndianInteger(new Uint8Array([ 0x7F, 0xFF ])), 32767);
        assert.equal(decodeUnsignedBigEndianInteger(new Uint8Array([ 0xFF, 0xFF ])), 65535);
    })
});

describe("decodeX690RealNumber()", () => {
    it("works", () => {
        assert(areFloatsEqual(decodeX690RealNumber(new Uint8Array([ 0x80, 225, 160, 0, 0, 0 ])), 1.25));
    })
});

describe("dissectFloat()", () => {
    it("works", () => {
        for (let i = 0; i < 100; i++) {
            const testValue = (Math.random() * Number.MAX_SAFE_INTEGER * 2);
            const dissected = dissectFloat(testValue);
            const ratio = (
                (dissected.negative ? -1 : 1)
                * dissected.mantissa
                * Math.pow(2, dissected.exponent)
            ) / testValue;
            assert(areFloatsEqual(ratio, 1));
        }
    })
});

// NOTE: This test might fail on some machines due to floating-point imprecision.
describe("encodeIEEE754DoublePrecisionFloat()", () => {
    it("works", () => {
        // Taken directly from https://en.wikipedia.org/wiki/Double-precision_floating-point_format.
        const decoded1 = 3 / 256;
        const encoded1 = new Uint8Array([ 0x3F, 0x88, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00 ]);
        assert.deepEqual(encodeIEEE754DoublePrecisionFloat(decoded1), encoded1);
    });
});

describe("encodeIEEE754SinglePrecisionFloat()", () => {
    it("works", () => {
        // Taken directly from https://en.wikipedia.org/wiki/Single-precision_floating-point_format.
        const decoded1 = 3.14159274101;
        const encoded1 = new Uint8Array([ 0x40, 0x49, 0x0f, 0xdb ]);
        assert.deepEqual(encodeIEEE754SinglePrecisionFloat(decoded1), encoded1);
    });
});

describe("encodeSignedBigEndianInteger()", () => {
    it("works", () => {
        assert.deepEqual(encodeSignedBigEndianInteger(0), new Uint8Array([ 0x00 ]));
        assert.deepEqual(encodeSignedBigEndianInteger(1), new Uint8Array([ 0x01 ]));
        assert.deepEqual(encodeSignedBigEndianInteger(-1), new Uint8Array([ 0xFF ]));
        assert.deepEqual(encodeSignedBigEndianInteger(127), new Uint8Array([ 0x7F ]));
        assert.deepEqual(encodeSignedBigEndianInteger(-128), new Uint8Array([ 0x80 ]));
        assert.deepEqual(encodeSignedBigEndianInteger(511), new Uint8Array([ 0x01, 0xFF ]));
        assert.deepEqual(encodeSignedBigEndianInteger(32767), new Uint8Array([ 0x7F, 0xFF ]));
        assert.deepEqual(encodeSignedBigEndianInteger(-32768), new Uint8Array([ 0x80, 0x00 ]));
    });
});

describe("encodeUnsignedBigEndianInteger()", () => {
    it("works", () => {
        assert.deepEqual(encodeUnsignedBigEndianInteger(0), Buffer.from([ 0x00 ]));
        assert.deepEqual(encodeUnsignedBigEndianInteger(1), Buffer.from([ 0x01 ]));
        assert.deepEqual(encodeUnsignedBigEndianInteger(255), Buffer.from([ 0xFF ]));
        assert.deepEqual(encodeUnsignedBigEndianInteger(127), Buffer.from([ 0x7F ]));
        assert.deepEqual(encodeUnsignedBigEndianInteger(128), Buffer.from([ 0x80 ]));
        assert.deepEqual(encodeUnsignedBigEndianInteger(511), Buffer.from([ 0x01, 0xFF ]));
        assert.deepEqual(encodeUnsignedBigEndianInteger(32767), Buffer.from([ 0x7F, 0xFF ]));
        assert.deepEqual(encodeUnsignedBigEndianInteger(65535), Buffer.from([ 0xFF, 0xFF ]));
    })
});

describe("encodeX690BinaryRealNumber()", () => {
    /**
     * Note that this differs from the encoding of the same number, because the
     * DER require that the binary real be encoded in such a way that the
     * mantissa encodes either zero or an odd number.
     */
    assert.deepEqual(encodeX690BinaryRealNumber(1.25), new Uint8Array([ 0x80, 254, 5 ]));
});

describe("getBitFromBase128()", () => {
    it("works", () => {
        const b1 = new Uint8Array([ 0x81, 0x00 ]);
        assert.equal(getBitFromBase128(b1, 7), true);
        assert.equal(getBitFromBase128(b1, 8), false);
        assert.equal(getBitFromBase128(b1, 6), false);

        const b2 = new Uint8Array([ 0x82, 0x40 ]);
        assert.equal(getBitFromBase128(b2, 7), false);
        assert.equal(getBitFromBase128(b2, 8), true);
        assert.equal(getBitFromBase128(b2, 6), true);
    })
});

describe("getBitFromBase256()", () => {
    it("works", () => {
        const b1 = new Uint8Array([ 0x81, 0x04 ]);
        assert.equal(getBitFromBase256(b1, 15), true);
        assert.equal(getBitFromBase256(b1, 14), false);
        assert.equal(getBitFromBase256(b1, 9), false);
        assert.equal(getBitFromBase256(b1, 8), true);
        assert.equal(getBitFromBase256(b1, 7), false);
        assert.equal(getBitFromBase256(b1, 3), false);
        assert.equal(getBitFromBase256(b1, 2), true);
        assert.equal(getBitFromBase256(b1, 1), false);

        const b2 = new Uint8Array([ 0x00, 0x01 ]);
        for (let i = 1; i < (b2.length * 8); i++) {
            assert.equal(getBitFromBase256(b2, i), false);
        }
        assert.equal(getBitFromBase256(b2, 0), true);
    })
});

describe("packBits()", () => {
    it("works", () => {
        const bits1 = new Uint8ClampedArray([ 0x01, 0x00, 0x01, 0x00 ]);
        assert.deepEqual(packBits(bits1), new Uint8Array([ 0xA0 ]));

        const bits2 = new Uint8ClampedArray([ 0x01, 0x00, 0x01, 0x00, 0x01, 0x01, 0x01, 0x01, 0x01, 0x00, 0x01, 0x00 ]);
        assert.deepEqual(packBits(bits2), new Uint8Array([ 0xAF, 0xA0 ]));
    })
});

describe("setBitInBase128()", () => {
    const b1 = new Uint8Array([ 0x00, 0x00 ]);
    setBitInBase128(b1, 7, true);
    assert.deepEqual(b1, new Uint8Array([ 0x01, 0x00 ]));

    const b2 = new Uint8Array([ 0x00, 0x00 ]);
    setBitInBase128(b2, 6, true);
    assert.deepEqual(b2, new Uint8Array([ 0x00, 0x40 ]));

    const b3 = new Uint8Array([ 0x00, 0x00 ]);
    setBitInBase128(b3, 0, true);
    assert.deepEqual(b3, new Uint8Array([ 0x00, 0x01 ]));

    const b4 = new Uint8Array([ 0xFF, 0xFF ]);
    setBitInBase128(b4, 7, false);
    assert.deepEqual(b4, new Uint8Array([ 0xFE, 0xFF ]));

    const b5 = new Uint8Array([ 0xFF, 0xFF ]);
    setBitInBase128(b5, 6, false);
    assert.deepEqual(b5, new Uint8Array([ 0xFF, 0xBF ]));

    const b6 = new Uint8Array([ 0xFF, 0xFF ]);
    setBitInBase128(b6, 0, false);
    assert.deepEqual(b6, new Uint8Array([ 0xFF, 0xFE ]));
});

describe("setBitInBase256()", () => {
    const b1 = new Uint8Array([ 0x00, 0x00 ]);
    setBitInBase256(b1, 8, true);
    assert.deepEqual(b1, new Uint8Array([ 0x01, 0x00 ]));

    const b2 = new Uint8Array([ 0x00, 0x00 ]);
    setBitInBase256(b2, 7, true);
    assert.deepEqual(b2, new Uint8Array([ 0x00, 0x80 ]));

    const b3 = new Uint8Array([ 0x00, 0x00 ]);
    setBitInBase256(b3, 0, true);
    assert.deepEqual(b3, new Uint8Array([ 0x00, 0x01 ]));

    const b4 = new Uint8Array([ 0xFF, 0xFF ]);
    setBitInBase256(b4, 7, false);
    assert.deepEqual(b4, new Uint8Array([ 0xFF, 0x7F ]));

    const b5 = new Uint8Array([ 0xFF, 0xFF ]);
    setBitInBase256(b5, 6, false);
    assert.deepEqual(b5, new Uint8Array([ 0xFF, 0xBF ]));

    const b6 = new Uint8Array([ 0xFF, 0xFF ]);
    setBitInBase256(b6, 0, false);
    assert.deepEqual(b6, new Uint8Array([ 0xFF, 0xFE ]));
});

describe("unpackBits()", () => {
    it("works", () => {
        const bits1 = new Uint8ClampedArray([ 0x01, 0x00, 0x01, 0x00, 0x00, 0x00, 0x00, 0x00 ]);
        assert.deepEqual(unpackBits(new Uint8Array([ 0xA0 ])), bits1);

        const bits2 = new Uint8ClampedArray([
            0x01, 0x00, 0x01, 0x00, 0x01, 0x01, 0x01, 0x01,
            0x01, 0x00, 0x01, 0x00, 0x00, 0x00, 0x00, 0x00 ]);
        assert.deepEqual(unpackBits(new Uint8Array([ 0xAF, 0xA0 ])), bits2);
    })
});
