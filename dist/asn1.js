"use strict";
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const errors = __importStar(require("./errors"));
const values_1 = require("./values");
class ASN1Element {
    constructor() {
        this.recursionCount = 0;
        this.tagClass = values_1.ASN1TagClass.universal;
        this.construction = values_1.ASN1Construction.primitive;
        this.tagNumber = 0;
        this.value = new Uint8Array(0);
    }
    get length() {
        return this.value.length;
    }
    static validateDateTime(dataType, year, month, date, hours, minutes, seconds) {
        switch (month) {
            case 0:
            case 2:
            case 4:
            case 6:
            case 7:
            case 9:
            case 11: {
                if (date > 31)
                    throw new errors.ASN1Error(`Day > 31 encountered in ${dataType} with 31-day month.`);
                break;
            }
            case 3:
            case 5:
            case 8:
            case 10: {
                if (date > 30) {
                    throw new errors.ASN1Error(`Day > 31 encountered in ${dataType} with 30-day month.`);
                }
                break;
            }
            case 1: {
                const isLeapYear = ((year % 4 === 0) && (year % 100 !== 0)) || (year % 400 === 0);
                if (isLeapYear) {
                    if (date > 29) {
                        throw new errors.ASN1Error(`Day > 29 encountered in ${dataType} with month of February in leap year.`);
                    }
                }
                else if (date > 28) {
                    throw new errors.ASN1Error(`Day > 28 encountered in ${dataType} with month of February and non leap year.`);
                }
                break;
            }
            default:
                throw new errors.ASN1Error(`Month greater than 12 encountered in ${dataType}.`);
        }
        if (hours > 23)
            throw new errors.ASN1Error(`Hours > 23 encountered in ${dataType}.`);
        if (minutes > 59)
            throw new errors.ASN1Error(`Minutes > 60 encountered in ${dataType}.`);
        if (seconds > 59)
            throw new errors.ASN1Error(`Seconds > 60 encountered in ${dataType}.`);
    }
    static decodeUnsignedBigEndianInteger(value) {
        if (value.length === 0)
            return 0;
        if (value.length > 4)
            throw new errors.ASN1OverflowError("Number too long to decode.");
        const u8 = new Uint8Array(4);
        u8.set(value, (4 - value.length));
        return new Uint32Array(u8.reverse().buffer)[0];
    }
    static decodeSignedBigEndianInteger(value) {
        if (value.length === 0)
            return 0;
        if (value.length > 4)
            throw new errors.ASN1OverflowError("Number too long to decode.");
        const u8 = new Uint8Array(4);
        if (value[0] >= 0b10000000)
            u8.fill(0xFF);
        u8.set(value, (4 - value.length));
        return new Int32Array(u8.reverse().buffer)[0];
    }
}
exports.ASN1Element = ASN1Element;
ASN1Element.nestingRecursionLimit = 5;
//# sourceMappingURL=asn1.js.map