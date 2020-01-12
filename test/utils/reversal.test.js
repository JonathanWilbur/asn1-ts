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

describe("encodeSignedBigEndianInteger()", () => {
    it("works", () => {
        for (let i = -100000; i < 100000; i += 7) {
            expect(decodeSignedBigEndianInteger(encodeSignedBigEndianInteger(i))).toBe(i);
        }
    });
});
