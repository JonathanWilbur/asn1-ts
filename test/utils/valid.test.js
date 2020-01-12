const base128Length = require("../../dist/utils/base128Length.js").default;
const base256Length = require("../../dist/utils/base256Length.js").default;
const decodeBase128 = require("../../dist/utils/decodeBase128.js").default;
const decodeIEEE754DoublePrecisionFloat = require("../../dist/utils/decodeIEEE754DoublePrecisionFloat.js").default;
const decodeIEEE754SinglePrecisionFloat = require("../../dist/utils/decodeIEEE754SinglePrecisionFloat.js").default;
const decodeSignedBigEndianInteger = require("../../dist/utils/decodeSignedBigEndianInteger.js").default;
const decodeUnsignedBigEndianInteger = require("../../dist/utils/decodeUnsignedBigEndianInteger.js").default;
const decodeX690RealNumber = require("../../dist/utils/decodeX690RealNumber.js").default;
const dissectFloat = require("../../dist/utils/dissectFloat.js").default;
const encodeBase128 = require("../../dist/utils/encodeBase128.js").default;
const encodeIEEE754DoublePrecisionFloat = require("../../dist/utils/encodeIEEE754DoublePrecisionFloat.js").default;
const encodeIEEE754SinglePrecisionFloat = require("../../dist/utils/encodeIEEE754SinglePrecisionFloat.js").default;
const encodeSignedBigEndianInteger = require("../../dist/utils/encodeSignedBigEndianInteger.js").default;
const encodeUnsignedBigEndianInteger = require("../../dist/utils/encodeUnsignedBigEndianInteger.js").default;
const encodeX690Base10RealNumber = require("../../dist/utils/encodeX690Base10RealNumber.js").default;
const encodeX690BinaryRealNumber = require("../../dist/utils/encodeX690BinaryRealNumber.js").default;
const getBitFromBase128 = require("../../dist/utils/getBitFromBase128.js").default;
const getBitFromBase256 = require("../../dist/utils/getBitFromBase256.js").default;
const packBits = require("../../dist/utils/packBits.js").default;
const setBitInBase128 = require("../../dist/utils/setBitInBase128.js").default;
const setBitInBase256 = require("../../dist/utils/setBitInBase256.js").default;
const unpackBits = require("../../dist/utils/unpackBits.js").default;

describe("base128Length()", () => {
    it("predicts that five bytes are needed to encode four bytes of data", () => {
        expect(base128Length(4)).toBe(5);
    });
});

describe("base256Length()", () => {
    it("predicts that four bytes were encoded within five bytes", () => {
        expect(base256Length(5)).toBe(5);
    })
});

describe("decodeBase128()", () => {
    it("works", () => {
        const encoded1 = new Uint8Array([ 0x80, 0x80, 0x80, 0x80, 0x00 ]);
        const decoded1 = new Uint8Array([ 0x00, 0x00, 0x00, 0x00, 0x00 ]);
        expect(decodeBase128(encoded1)).toEqual(decoded1);
    })
});


describe("decodeIEEE754DoublePrecisionFloat()", () => {
    it("works", () => {
        // Taken directly from https://en.wikipedia.org/wiki/Double-precision_floating-point_format.
        const encoded1 = new Uint8Array([ 0x3F, 0x88, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00 ]);
        const decoded1 = 3 / 256;
        expect(decodeIEEE754DoublePrecisionFloat(encoded1)).toBeCloseTo(decoded1, 8);
    });
});

describe("decodeIEEE754SinglePrecisionFloat()", () => {
    it("works", () => {
        // Taken directly from https://en.wikipedia.org/wiki/Single-precision_floating-point_format.
        const encoded1 = new Uint8Array([ 0x40, 0x49, 0x0f, 0xdb ]);
        const decoded1 = 3.14159274101;
        expect(decodeIEEE754SinglePrecisionFloat(encoded1)).toBeCloseTo(decoded1, 5);
    });
});

describe("decodeSignedBigEndianInteger()", () => {
    it("works", () => {
        expect(decodeSignedBigEndianInteger(new Uint8Array([ 0x00 ]))).toBe(0);
        expect(decodeSignedBigEndianInteger(new Uint8Array([ 0x01 ]))).toBe(1);
        expect(decodeSignedBigEndianInteger(new Uint8Array([ 0xFF ]))).toBe(-1);
        expect(decodeSignedBigEndianInteger(new Uint8Array([ 0x7F ]))).toBe(127);
        expect(decodeSignedBigEndianInteger(new Uint8Array([ 0x80 ]))).toBe(-128);
        expect(decodeSignedBigEndianInteger(new Uint8Array([ 0x01, 0xFF ]))).toBe(511);
        expect(decodeSignedBigEndianInteger(new Uint8Array([ 0x7F, 0xFF ]))).toBe(32767);
        expect(decodeSignedBigEndianInteger(new Uint8Array([ 0x80, 0x00 ]))).toBe(-32768);
    })
});

describe("decodeUnsignedBigEndianInteger()", () => {
    it("works", () => {
        expect(decodeUnsignedBigEndianInteger(new Uint8Array([ 0x00 ]))).toBe(0);
        expect(decodeUnsignedBigEndianInteger(new Uint8Array([ 0x01 ]))).toBe(1);
        expect(decodeUnsignedBigEndianInteger(new Uint8Array([ 0xFF ]))).toBe(255);
        expect(decodeUnsignedBigEndianInteger(new Uint8Array([ 0x7F ]))).toBe(127);
        expect(decodeUnsignedBigEndianInteger(new Uint8Array([ 0x80 ]))).toBe(128);
        expect(decodeUnsignedBigEndianInteger(new Uint8Array([ 0x01, 0xFF ]))).toBe(511);
        expect(decodeUnsignedBigEndianInteger(new Uint8Array([ 0x7F, 0xFF ]))).toBe(32767);
        expect(decodeUnsignedBigEndianInteger(new Uint8Array([ 0xFF, 0xFF ]))).toBe(65535);
    })
});

describe("decodeX690RealNumber()", () => {
    it("works", () => {
        expect(decodeX690RealNumber(new Uint8Array([ 0x80, 225, 160, 0, 0, 0 ]))).toBeCloseTo(1.25);
    })
});

describe("dissectFloat()", () => {
    it("works", () => {
        for (let i = 0; i < 100; i++) {
            const testValue = (Math.random() * Number.MAX_SAFE_INTEGER * 2);
            const dissected = dissectFloat(testValue);
            expect(
                (
                    (dissected.negative ? -1 : 1)
                    * dissected.mantissa
                    * Math.pow(2, dissected.exponent)
                ) / testValue,
            ).toBeCloseTo(1, 5);
        }
    })
});

describe("encodeBase128()", () => {
    it("works", () => {
        const decoded1 = new Uint8Array([ 0x00, 0x00, 0x00, 0x00 ]);
        const encoded1 = new Uint8Array([ 0x80, 0x80, 0x80, 0x80, 0x00 ]);
        expect(encodeBase128(decoded1)).toEqual(encoded1);
    })
});

// NOTE: This test might fail on some machines due to floating-point imprecision.
describe("encodeIEEE754DoublePrecisionFloat()", () => {
    it("works", () => {
        // Taken directly from https://en.wikipedia.org/wiki/Double-precision_floating-point_format.
        const decoded1 = 3 / 256;
        const encoded1 = new Uint8Array([ 0x3F, 0x88, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00 ]);
        expect(encodeIEEE754DoublePrecisionFloat(decoded1)).toEqual(encoded1);
    });
});

describe("encodeIEEE754SinglePrecisionFloat()", () => {
    it("works", () => {
        // Taken directly from https://en.wikipedia.org/wiki/Single-precision_floating-point_format.
        const decoded1 = 3.14159274101;
        const encoded1 = new Uint8Array([ 0x40, 0x49, 0x0f, 0xdb ]);
        expect(encodeIEEE754SinglePrecisionFloat(decoded1)).toEqual(encoded1);
    });
});

describe("encodeSignedBigEndianInteger()", () => {
    it("works", () => {
        expect(encodeSignedBigEndianInteger(0)).toEqual(new Uint8Array([ 0x00 ]));
        expect(encodeSignedBigEndianInteger(1)).toEqual(new Uint8Array([ 0x01 ]));
        expect(encodeSignedBigEndianInteger(-1)).toEqual(new Uint8Array([ 0xFF ]));
        expect(encodeSignedBigEndianInteger(127)).toEqual(new Uint8Array([ 0x7F ]));
        expect(encodeSignedBigEndianInteger(-128)).toEqual(new Uint8Array([ 0x80 ]));
        expect(encodeSignedBigEndianInteger(511)).toEqual(new Uint8Array([ 0x01, 0xFF ]));
        expect(encodeSignedBigEndianInteger(32767)).toEqual(new Uint8Array([ 0x7F, 0xFF ]));
        expect(encodeSignedBigEndianInteger(-32768)).toEqual(new Uint8Array([ 0x80, 0x00 ]));
    });
});

describe("encodeUnsignedBigEndianInteger()", () => {
    it("works", () => {
        expect(encodeUnsignedBigEndianInteger(0)).toEqual(new Uint8Array([ 0x00 ]));
        expect(encodeUnsignedBigEndianInteger(1)).toEqual(new Uint8Array([ 0x01 ]));
        expect(encodeUnsignedBigEndianInteger(255)).toEqual(new Uint8Array([ 0xFF ]));
        expect(encodeUnsignedBigEndianInteger(127)).toEqual(new Uint8Array([ 0x7F ]));
        expect(encodeUnsignedBigEndianInteger(128)).toEqual(new Uint8Array([ 0x80 ]));
        expect(encodeUnsignedBigEndianInteger(511)).toEqual(new Uint8Array([ 0x01, 0xFF ]));
        expect(encodeUnsignedBigEndianInteger(32767)).toEqual(new Uint8Array([ 0x7F, 0xFF ]));
        expect(encodeUnsignedBigEndianInteger(65535)).toEqual(new Uint8Array([ 0xFF, 0xFF ]));
    })
});

// describe("encodeX690Base10RealNumber()", () => {
//     expect(encodeX690Base10RealNumber(3.14159)).toContain(new Uint8Array([ 0x33, 0x2E, 0x31, 0x34 ]));
//     expect(encodeX690Base10RealNumber(-3.14159)).toContain(new Uint8Array([ 0x2D, 0x33, 0x2E, 0x31, 0x34 ]));
// });

describe("encodeX690BinaryRealNumber()", () => {
    /**
     * Note that this differs from the encoding of the same number, because the
     * DER require that the binary real be encoded in such a way that the
     * mantissa encodes either zero or an odd number.
     */
    expect(encodeX690BinaryRealNumber(1.25)).toEqual(new Uint8Array([ 0x80, 254, 5 ]));
});

describe("getBitFromBase128()", () => {
    it("works", () => {
        const b1 = new Uint8Array([ 0x81, 0x00 ]);
        expect(getBitFromBase128(b1, 7)).toBe(true);
        expect(getBitFromBase128(b1, 8)).toBe(false);
        expect(getBitFromBase128(b1, 6)).toBe(false);

        const b2 = new Uint8Array([ 0x82, 0x40 ]);
        expect(getBitFromBase128(b2, 7)).toBe(false);
        expect(getBitFromBase128(b2, 8)).toBe(true);
        expect(getBitFromBase128(b2, 6)).toBe(true);
    })
});

describe("getBitFromBase256()", () => {
    it("works", () => {
        const b1 = new Uint8Array([ 0x81, 0x04 ]);
        expect(getBitFromBase256(b1, 15)).toBe(true);
        expect(getBitFromBase256(b1, 14)).toBe(false);
        expect(getBitFromBase256(b1, 9)).toBe(false);
        expect(getBitFromBase256(b1, 8)).toBe(true);
        expect(getBitFromBase256(b1, 7)).toBe(false);
        expect(getBitFromBase256(b1, 3)).toBe(false);
        expect(getBitFromBase256(b1, 2)).toBe(true);
        expect(getBitFromBase256(b1, 1)).toBe(false);

        const b2 = new Uint8Array([ 0x00, 0x01 ]);
        for (let i = 1; i < (b2.length * 8); i++) {
            expect(getBitFromBase256(b2, i)).toBe(false);
        }
        expect(getBitFromBase256(b2, 0)).toBe(true);
    })
});

describe("packBits()", () => {
    it("works", () => {
        const bits1 = new Int8Array([ 0x01, 0x00, 0x01, 0x00 ]);
        expect(packBits(bits1)).toEqual(new Uint8Array([ 0xA0 ]));

        const bits2 = new Int8Array([ 0x01, 0x00, 0x01, 0x00, 0x01, 0x01, 0x01, 0x01, 0x01, 0x00, 0x01, 0x00 ]);
        expect(packBits(bits2)).toEqual(new Uint8Array([ 0xAF, 0xA0 ]));
    })
});

describe("setBitInBase128()", () => {
    const b1 = new Uint8Array([ 0x00, 0x00 ]);
    setBitInBase128(b1, 7, true);
    expect(b1).toEqual(new Uint8Array([ 0x01, 0x00 ]));

    const b2 = new Uint8Array([ 0x00, 0x00 ]);
    setBitInBase128(b2, 6, true);
    expect(b2).toEqual(new Uint8Array([ 0x00, 0x40 ]));

    const b3 = new Uint8Array([ 0x00, 0x00 ]);
    setBitInBase128(b3, 0, true);
    expect(b3).toEqual(new Uint8Array([ 0x00, 0x01 ]));

    const b4 = new Uint8Array([ 0xFF, 0xFF ]);
    setBitInBase128(b4, 7, false);
    expect(b4).toEqual(new Uint8Array([ 0xFE, 0xFF ]));

    const b5 = new Uint8Array([ 0xFF, 0xFF ]);
    setBitInBase128(b5, 6, false);
    expect(b5).toEqual(new Uint8Array([ 0xFF, 0xBF ]));

    const b6 = new Uint8Array([ 0xFF, 0xFF ]);
    setBitInBase128(b6, 0, false);
    expect(b6).toEqual(new Uint8Array([ 0xFF, 0xFE ]));
});

describe("setBitInBase256()", () => {
    const b1 = new Uint8Array([ 0x00, 0x00 ]);
    setBitInBase256(b1, 8, true);
    expect(b1).toEqual(new Uint8Array([ 0x01, 0x00 ]));

    const b2 = new Uint8Array([ 0x00, 0x00 ]);
    setBitInBase256(b2, 7, true);
    expect(b2).toEqual(new Uint8Array([ 0x00, 0x80 ]));

    const b3 = new Uint8Array([ 0x00, 0x00 ]);
    setBitInBase256(b3, 0, true);
    expect(b3).toEqual(new Uint8Array([ 0x00, 0x01 ]));

    const b4 = new Uint8Array([ 0xFF, 0xFF ]);
    setBitInBase256(b4, 7, false);
    expect(b4).toEqual(new Uint8Array([ 0xFF, 0x7F ]));

    const b5 = new Uint8Array([ 0xFF, 0xFF ]);
    setBitInBase256(b5, 6, false);
    expect(b5).toEqual(new Uint8Array([ 0xFF, 0xBF ]));

    const b6 = new Uint8Array([ 0xFF, 0xFF ]);
    setBitInBase256(b6, 0, false);
    expect(b6).toEqual(new Uint8Array([ 0xFF, 0xFE ]));
});

describe("unpackBits()", () => {
    it("works", () => {
        const bits1 = new Int8Array([ 0x01, 0x00, 0x01, 0x00, 0x00, 0x00, 0x00, 0x00 ]);
        expect(unpackBits(new Uint8Array([ 0xA0 ]))).toEqual(bits1);

        const bits2 = new Int8Array([
            0x01, 0x00, 0x01, 0x00, 0x01, 0x01, 0x01, 0x01,
            0x01, 0x00, 0x01, 0x00, 0x00, 0x00, 0x00, 0x00 ]);
        expect(unpackBits(new Uint8Array([ 0xAF, 0xA0 ]))).toEqual(bits2);
    })
});
