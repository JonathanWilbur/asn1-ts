const base128Length = require("../../dist/node/utils/base128Length.js").default;
const base256Length = require("../../dist/node/utils/base256Length.js").default;
const decodeBase128 = require("../../dist/node/utils/decodeBase128.js").default;
const decodeIEEE754DoublePrecisionFloat = require("../../dist/node/utils/decodeIEEE754DoublePrecisionFloat.js").default;
const decodeIEEE754SinglePrecisionFloat = require("../../dist/node/utils/decodeIEEE754SinglePrecisionFloat.js").default;
const decodeSignedBigEndianInteger = require("../../dist/node/utils/decodeSignedBigEndianInteger.js").default;
const decodeUnsignedBigEndianInteger = require("../../dist/node/utils/decodeUnsignedBigEndianInteger.js").default;
const decodeX690RealNumber = require("../../dist/node/utils/decodeX690RealNumber.js").default;
const dissectFloat = require("../../dist/node/utils/dissectFloat.js").default;
const encodeBase128 = require("../../dist/node/utils/encodeBase128.js").default;
const encodeIEEE754DoublePrecisionFloat = require("../../dist/node/utils/encodeIEEE754DoublePrecisionFloat.js").default;
const encodeIEEE754SinglePrecisionFloat = require("../../dist/node/utils/encodeIEEE754SinglePrecisionFloat.js").default;
const encodeSignedBigEndianInteger = require("../../dist/node/utils/encodeSignedBigEndianInteger.js").default;
const encodeUnsignedBigEndianInteger = require("../../dist/node/utils/encodeUnsignedBigEndianInteger.js").default;
const encodeX690Base10RealNumber = require("../../dist/node/utils/encodeX690Base10RealNumber.js").default;
const encodeX690BinaryRealNumber = require("../../dist/node/utils/encodeX690BinaryRealNumber.js").default;
const getBitFromBase128 = require("../../dist/node/utils/getBitFromBase128.js").default;
const getBitFromBase256 = require("../../dist/node/utils/getBitFromBase256.js").default;
const packBits = require("../../dist/node/utils/packBits.js").default;
const setBitInBase128 = require("../../dist/node/utils/setBitInBase128.js").default;
const setBitInBase256 = require("../../dist/node/utils/setBitInBase256.js").default;
const unpackBits = require("../../dist/node/utils/unpackBits.js").default;

describe("encodeSignedBigEndianInteger()", () => {
    it("works", () => {
        for (let i = -100000; i < 100000; i += 7) {
            expect(decodeSignedBigEndianInteger(encodeSignedBigEndianInteger(i))).toBe(i);
        }
    });
});
