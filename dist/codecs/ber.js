"use strict";
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const asn1_1 = require("../asn1");
const errors = __importStar(require("../errors"));
const values_1 = require("../values");
const x690_1 = require("../x690");
class BERElement extends x690_1.X690Element {
    constructor(tagClass = values_1.ASN1TagClass.universal, construction = values_1.ASN1Construction.primitive, tagNumber = 0) {
        super();
        this.tagClass = tagClass;
        this.construction = construction;
        this.tagNumber = tagNumber;
        this.value = new Uint8Array(0);
    }
    set boolean(value) {
        this.value = new Uint8Array(1);
        this.value[0] = (value ? 0xFF : 0x00);
    }
    get boolean() {
        if (this.construction !== values_1.ASN1Construction.primitive) {
            throw new errors.ASN1ConstructionError("BOOLEAN cannot be constructed.");
        }
        if (this.value.length !== 1)
            throw new errors.ASN1SizeError("BOOLEAN not one byte");
        return (this.value[0] !== 0);
    }
    set bitString(value) {
        if (value.length === 0)
            this.value = new Uint8Array(0);
        const pre = [];
        pre.length = ((value.length >>> 3) + ((value.length % 8) ? 1 : 0)) + 1;
        for (let i = 0; i < value.length; i++) {
            if (value[i] === false)
                continue;
            pre[((i >>> 3) + 1)] |= (0b10000000 >>> (i % 8));
        }
        pre[0] = (8 - (value.length % 8));
        if (pre[0] === 8)
            pre[0] = 0;
        this.value = new Uint8Array(pre);
    }
    get bitString() {
        if (this.construction === values_1.ASN1Construction.primitive) {
            if (this.value.length === 0) {
                throw new errors.ASN1Error("ASN.1 BIT STRING cannot be encoded on zero bytes!");
            }
            if (this.value.length === 1 && this.value[0] !== 0) {
                throw new errors.ASN1Error("ASN.1 BIT STRING encoded with deceptive first byte!");
            }
            if (this.value[0] > 7) {
                throw new errors.ASN1Error("First byte of an ASN.1 BIT STRING must be <= 7!");
            }
            let ret = [];
            for (let i = 1; i < this.value.length; i++) {
                ret = ret.concat([
                    (Boolean(this.value[i] & 0b10000000)),
                    (Boolean(this.value[i] & 0b01000000)),
                    (Boolean(this.value[i] & 0b00100000)),
                    (Boolean(this.value[i] & 0b00010000)),
                    (Boolean(this.value[i] & 0b00001000)),
                    (Boolean(this.value[i] & 0b00000100)),
                    (Boolean(this.value[i] & 0b00000010)),
                    (Boolean(this.value[i] & 0b00000001)),
                ]);
            }
            ret.length -= this.value[0];
            return ret;
        }
        else {
            if ((this.recursionCount + 1) > BERElement.nestingRecursionLimit)
                throw new errors.ASN1RecursionError();
            let appendy = [];
            const substrings = this.sequence;
            substrings.slice(0, (substrings.length - 1)).forEach((substring) => {
                if (substring.construction === values_1.ASN1Construction.primitive
                    && substring.value.length > 0
                    && substring.value[0] !== 0x00) {
                    throw new errors.ASN1Error("Only the last subelement of a constructed BIT STRING may have a non-zero first value byte.");
                }
            });
            substrings.forEach((substring) => {
                if (substring.tagClass !== this.tagClass) {
                    throw new errors.ASN1ConstructionError("Invalid tag class in recursively-encoded BIT STRING.");
                }
                if (substring.tagNumber !== this.tagNumber) {
                    throw new errors.ASN1ConstructionError("Invalid tag class in recursively-encoded BIT STRING.");
                }
                substring.recursionCount = (this.recursionCount + 1);
                appendy = appendy.concat(substring.bitString);
            });
            return appendy;
        }
    }
    set octetString(value) {
        this.value = new Uint8Array(value);
    }
    get octetString() {
        return this.deconstruct("OCTET STRING");
    }
    set objectDescriptor(value) {
        this.graphicString = value;
    }
    get objectDescriptor() {
        return this.graphicString;
    }
    set real(value) {
        if (value === 0.0) {
            this.value = new Uint8Array(0);
            return;
        }
        else if (isNaN(value)) {
            this.value = new Uint8Array([values_1.ASN1SpecialRealValue.notANumber]);
            return;
        }
        else if (value === -0.0) {
            this.value = new Uint8Array([values_1.ASN1SpecialRealValue.minusZero]);
            return;
        }
        else if (value === Infinity) {
            this.value = new Uint8Array([values_1.ASN1SpecialRealValue.plusInfinity]);
            return;
        }
        else if (value === -Infinity) {
            this.value = new Uint8Array([values_1.ASN1SpecialRealValue.minusInfinity]);
            return;
        }
        let valueString = value.toFixed(7);
        valueString = (String.fromCharCode(0b00000011) + valueString);
        this.value = (new TextEncoder()).encode(valueString);
    }
    get real() {
        if (this.construction !== values_1.ASN1Construction.primitive) {
            throw new errors.ASN1ConstructionError("REAL cannot be constructed.");
        }
        if (this.value.length === 0)
            return 0.0;
        switch (this.value[0] & 0b11000000) {
            case (0b01000000): {
                if (this.value[0] === values_1.ASN1SpecialRealValue.notANumber)
                    return NaN;
                if (this.value[0] === values_1.ASN1SpecialRealValue.minusZero)
                    return -0.0;
                if (this.value[0] === values_1.ASN1SpecialRealValue.plusInfinity)
                    return Infinity;
                if (this.value[0] === values_1.ASN1SpecialRealValue.minusInfinity)
                    return -Infinity;
                throw new errors.ASN1UndefinedError("Unrecognized special REAL value!");
            }
            case (0b00000000): {
                let realString;
                if (typeof TextEncoder !== "undefined") {
                    realString = (new TextDecoder("utf-8")).decode(this.value.slice(1));
                }
                else if (typeof Buffer !== "undefined") {
                    realString = (Buffer.from(this.value.slice(1))).toString("utf-8");
                }
                else {
                    throw new errors.ASN1Error("No ability to decode bytes to string!");
                }
                switch (this.value[0] & 0b00111111) {
                    case 1: {
                        if (!values_1.nr1Regex.test(realString))
                            throw new errors.ASN1Error("Malformed NR1 Base-10 REAL");
                        return parseFloat(realString);
                    }
                    case 2: {
                        if (!values_1.nr2Regex.test(realString))
                            throw new errors.ASN1Error("Malformed NR2 Base-10 REAL");
                        return parseFloat(realString.replace(",", "."));
                    }
                    case 3: {
                        if (!values_1.nr3Regex.test(realString))
                            throw new errors.ASN1Error("Malformed NR3 Base-10 REAL");
                        return parseFloat(realString.replace(",", "."));
                    }
                    default:
                        throw new errors.ASN1UndefinedError("Undefined Base-10 REAL encoding.");
                }
            }
            case (0b10000000):
            case (0b11000000): {
                const sign = ((this.value[0] & 0b01000000) ? -1 : 1);
                const base = ((flag) => {
                    switch (flag) {
                        case (values_1.ASN1RealEncodingBase.base2): return 2;
                        case (values_1.ASN1RealEncodingBase.base8): return 8;
                        case (values_1.ASN1RealEncodingBase.base16): return 16;
                        default:
                            throw new errors.ASN1Error("Impossible REAL encoding base encountered.");
                    }
                })(this.value[0] & 0b00110000);
                const scale = ((flag) => {
                    switch (flag) {
                        case (values_1.ASN1RealEncodingScale.scale0): return 0;
                        case (values_1.ASN1RealEncodingScale.scale1): return 1;
                        case (values_1.ASN1RealEncodingScale.scale2): return 2;
                        case (values_1.ASN1RealEncodingScale.scale3): return 3;
                        default:
                            throw new errors.ASN1Error("Impossible REAL encoding scale encountered.");
                    }
                })(this.value[0] & 0b00001100);
                let exponent;
                let mantissa;
                switch (this.value[0] & 0b00000011) {
                    case (0b00000000): {
                        if (this.value.length < 3)
                            throw new errors.ASN1TruncationError("Binary-encoded REAL truncated.");
                        exponent = asn1_1.ASN1Element.decodeSignedBigEndianInteger(this.value.subarray(1, 2));
                        mantissa = asn1_1.ASN1Element.decodeUnsignedBigEndianInteger(this.value.subarray(2));
                        break;
                    }
                    case (0b00000001): {
                        if (this.value.length < 4)
                            throw new errors.ASN1TruncationError("Binary-encoded REAL truncated.");
                        exponent = asn1_1.ASN1Element.decodeSignedBigEndianInteger(this.value.subarray(1, 3));
                        mantissa = asn1_1.ASN1Element.decodeUnsignedBigEndianInteger(this.value.subarray(3));
                        break;
                    }
                    case (0b00000010): {
                        if (this.value.length < 5)
                            throw new errors.ASN1TruncationError("Binary-encoded REAL truncated.");
                        exponent = asn1_1.ASN1Element.decodeSignedBigEndianInteger(this.value.subarray(1, 4));
                        mantissa = asn1_1.ASN1Element.decodeUnsignedBigEndianInteger(this.value.subarray(4));
                        break;
                    }
                    case (0b00000011): {
                        if (this.value.length < 3)
                            throw new errors.ASN1TruncationError("Binary-encoded REAL truncated.");
                        const exponentLength = this.value[1];
                        if (this.value.length < (3 + exponentLength)) {
                            throw new errors.ASN1TruncationError("Binary-encoded REAL truncated.");
                        }
                        exponent = asn1_1.ASN1Element.decodeSignedBigEndianInteger(this.value.subarray(2, (2 + exponentLength)));
                        mantissa = asn1_1.ASN1Element.decodeUnsignedBigEndianInteger(this.value.subarray((2 + exponentLength)));
                        break;
                    }
                    default:
                        throw new errors.ASN1Error("Impossible binary REAL exponent encoding encountered.");
                }
                return (sign * mantissa * Math.pow(2, scale) * Math.pow(base, exponent));
            }
            default:
                throw new errors.ASN1Error("Impossible REAL format encountered.");
        }
    }
    set utf8String(value) {
        if (typeof TextEncoder !== "undefined") {
            this.value = (new TextEncoder()).encode(value);
        }
        else if (typeof Buffer !== "undefined") {
            this.value = Buffer.from(value, "utf-8");
        }
    }
    get utf8String() {
        const valueBytes = this.deconstruct("UTF8String");
        let ret = "";
        if (typeof TextEncoder !== "undefined") {
            ret = (new TextDecoder("utf-8")).decode(valueBytes.buffer);
        }
        else if (typeof Buffer !== "undefined") {
            ret = (Buffer.from(this.value)).toString("utf-8");
        }
        return ret;
    }
    set sequence(value) {
        const encodedElements = [];
        value.forEach((element) => {
            encodedElements.push(element.toBytes());
        });
        let totalLength = 0;
        encodedElements.forEach((element) => {
            totalLength += element.length;
        });
        const newValue = new Uint8Array(totalLength);
        let currentIndex = 0;
        encodedElements.forEach((element) => {
            newValue.set(element, currentIndex);
            currentIndex += element.length;
        });
        this.value = newValue;
        this.construction = values_1.ASN1Construction.constructed;
    }
    get sequence() {
        if (this.construction !== values_1.ASN1Construction.constructed) {
            throw new errors.ASN1ConstructionError("SET or SEQUENCE cannot be primitively constructed.");
        }
        const encodedElements = [];
        if (this.value.length === 0)
            return [];
        let i = 0;
        while (i < this.value.length) {
            const next = new BERElement();
            i += next.fromBytes(this.value.slice(i));
            encodedElements.push(next);
        }
        return encodedElements;
    }
    set set(value) {
        this.sequence = value;
    }
    get set() {
        return this.sequence;
    }
    set numericString(value) {
        for (let i = 0; i < value.length; i++) {
            const characterCode = value.charCodeAt(i);
            if (!((characterCode >= 0x30 && characterCode <= 0x39) || characterCode === 0x20)) {
                throw new errors.ASN1CharactersError("NumericString can only contain characters 0 - 9 and space.");
            }
        }
        if (typeof TextEncoder !== "undefined") {
            this.value = (new TextEncoder()).encode(value);
        }
        else if (typeof Buffer !== "undefined") {
            this.value = Buffer.from(value, "utf-8");
        }
    }
    get numericString() {
        const valueBytes = this.deconstruct("NumericString");
        let ret = "";
        if (typeof TextEncoder !== "undefined") {
            ret = (new TextDecoder("utf-8")).decode(valueBytes.buffer);
        }
        else if (typeof Buffer !== "undefined") {
            ret = (Buffer.from(this.value)).toString("utf-8");
        }
        for (let i = 0; i < ret.length; i++) {
            const characterCode = ret.charCodeAt(i);
            if (!((characterCode >= 0x30 && characterCode <= 0x39) || characterCode === 0x20)) {
                throw new errors.ASN1CharactersError("NumericString can only contain characters 0 - 9 and space.");
            }
        }
        return ret;
    }
    set printableString(value) {
        for (let i = 0; i < value.length; i++) {
            if (values_1.printableStringCharacters.indexOf(value.charAt(i)) === -1) {
                throw new errors.ASN1CharactersError(`PrintableString can only contain these characters: ${values_1.printableStringCharacters}`);
            }
        }
        if (typeof TextEncoder !== "undefined") {
            this.value = (new TextEncoder()).encode(value);
        }
        else if (typeof Buffer !== "undefined") {
            this.value = Buffer.from(value, "utf-8");
        }
    }
    get printableString() {
        const valueBytes = this.deconstruct("PrintableString");
        let ret = "";
        if (typeof TextEncoder !== "undefined") {
            ret = (new TextDecoder("utf-8")).decode(valueBytes.buffer);
        }
        else if (typeof Buffer !== "undefined") {
            ret = (Buffer.from(this.value)).toString("utf-8");
        }
        for (let i = 0; i < ret.length; i++) {
            if (values_1.printableStringCharacters.indexOf(ret.charAt(i)) === -1) {
                throw new errors.ASN1CharactersError(`PrintableString can only contain these characters: ${values_1.printableStringCharacters}`);
            }
        }
        return ret;
    }
    set teletexString(value) {
        this.value = new Uint8Array(value);
    }
    get teletexString() {
        return this.deconstruct("TeletexString");
    }
    set videotexString(value) {
        this.value = new Uint8Array(value);
    }
    get videotexString() {
        return this.deconstruct("VideotexString");
    }
    set ia5String(value) {
        if (typeof TextEncoder !== "undefined") {
            this.value = (new TextEncoder()).encode(value);
        }
        else if (typeof Buffer !== "undefined") {
            this.value = Buffer.from(value, "utf-8");
        }
    }
    get ia5String() {
        const valueBytes = this.deconstruct("IA5String");
        let ret = "";
        if (typeof TextEncoder !== "undefined") {
            ret = (new TextDecoder("utf-8")).decode(valueBytes.buffer);
        }
        else if (typeof Buffer !== "undefined") {
            ret = (Buffer.from(this.value)).toString("utf-8");
        }
        return ret;
    }
    set utcTime(value) {
        let year = value.getUTCFullYear().toString();
        year = (year.substring(year.length - 2, year.length));
        const month = (value.getUTCMonth() < 9 ? `0${value.getUTCMonth() + 1}` : `${value.getUTCMonth() + 1}`);
        const day = (value.getUTCDate() < 10 ? `0${value.getUTCDate()}` : `${value.getUTCDate()}`);
        const hour = (value.getUTCHours() < 10 ? `0${value.getUTCHours()}` : `${value.getUTCHours()}`);
        const minute = (value.getUTCMinutes() < 10 ? `0${value.getUTCMinutes()}` : `${value.getUTCMinutes()}`);
        const second = (value.getUTCSeconds() < 10 ? `0${value.getUTCSeconds()}` : `${value.getUTCSeconds()}`);
        const utcString = `${year}${month}${day}${hour}${minute}${second}Z`;
        if (typeof TextEncoder !== "undefined") {
            this.value = (new TextEncoder()).encode(utcString);
        }
        else if (typeof Buffer !== "undefined") {
            this.value = Buffer.from(utcString, "utf-8");
        }
    }
    get utcTime() {
        const valueBytes = this.deconstruct("UTCTime");
        let dateString = "";
        if (typeof TextEncoder !== "undefined") {
            dateString = (new TextDecoder("utf-8")).decode(valueBytes.buffer);
        }
        else if (typeof Buffer !== "undefined") {
            dateString = (Buffer.from(this.value)).toString("utf-8");
        }
        const match = values_1.utcTimeRegex.exec(dateString);
        if (match === null)
            throw new errors.ASN1Error("Malformed UTCTime string.");
        if (match.groups === undefined)
            throw new errors.ASN1Error("Malformed UTCTime string.");
        const ret = new Date();
        let year = Number(match[1]);
        year = (year < 70 ? (2000 + year) : (1900 + year));
        const month = (Number(match[2]) - 1);
        const date = Number(match[3]);
        const hours = Number(match[4]);
        const minutes = Number(match[5]);
        const seconds = Number(match[6]);
        BERElement.validateDateTime("UTCTime", year, month, date, hours, minutes, seconds);
        ret.setUTCFullYear(year);
        ret.setUTCMonth(month);
        ret.setUTCDate(date);
        ret.setUTCHours(hours);
        ret.setUTCMinutes(minutes);
        ret.setUTCSeconds(seconds);
        return ret;
    }
    set generalizedTime(value) {
        const year = value.getUTCFullYear().toString();
        const month = (value.getUTCMonth() < 9 ? `0${value.getUTCMonth() + 1}` : `${value.getUTCMonth() + 1}`);
        const day = (value.getUTCDate() < 10 ? `0${value.getUTCDate()}` : `${value.getUTCDate()}`);
        const hour = (value.getUTCHours() < 10 ? `0${value.getUTCHours()}` : `${value.getUTCHours()}`);
        const minute = (value.getUTCMinutes() < 10 ? `0${value.getUTCMinutes()}` : `${value.getUTCMinutes()}`);
        const second = (value.getUTCSeconds() < 10 ? `0${value.getUTCSeconds()}` : `${value.getUTCSeconds()}`);
        const timeString = `${year}${month}${day}${hour}${minute}${second}Z`;
        if (typeof TextEncoder !== "undefined") {
            this.value = (new TextEncoder()).encode(timeString);
        }
        else if (typeof Buffer !== "undefined") {
            this.value = Buffer.from(timeString, "utf-8");
        }
    }
    get generalizedTime() {
        const valueBytes = this.deconstruct("GeneralizedTime");
        let dateString = "";
        if (typeof TextEncoder !== "undefined") {
            dateString = (new TextDecoder("utf-8")).decode(valueBytes.buffer);
        }
        else if (typeof Buffer !== "undefined") {
            dateString = (Buffer.from(this.value)).toString("utf-8");
        }
        const match = values_1.generalizedTimeRegex.exec(dateString);
        if (match === null)
            throw new errors.ASN1Error("Malformed GeneralizedTime string.");
        if (match.groups === undefined)
            throw new errors.ASN1Error("Malformed GeneralizedTime string.");
        const ret = new Date();
        const year = Number(match[1]);
        const month = (Number(match[2]) - 1);
        const date = Number(match[3]);
        const hours = Number(match[4]);
        const minutes = Number(match[5]);
        const seconds = Number(match[6]);
        BERElement.validateDateTime("GeneralizedTime", year, month, date, hours, minutes, seconds);
        ret.setUTCFullYear(year);
        ret.setUTCMonth(month);
        ret.setUTCDate(date);
        ret.setUTCHours(hours);
        ret.setUTCMinutes(minutes);
        ret.setUTCSeconds(seconds);
        return ret;
    }
    set graphicString(value) {
        for (let i = 0; i < value.length; i++) {
            const characterCode = value.charCodeAt(i);
            if (characterCode < 0x20 || characterCode > 0x7E)
                throw new errors.ASN1CharactersError("GraphicString, VisibleString, or ObjectDescriptor "
                    + "can only contain characters between 0x20 and 0x7E.");
        }
        if (typeof TextEncoder !== "undefined") {
            this.value = (new TextEncoder()).encode(value);
        }
        else if (typeof Buffer !== "undefined") {
            this.value = Buffer.from(value, "utf-8");
        }
    }
    get graphicString() {
        const valueBytes = this.deconstruct("GraphicString, VisibleString, or ObjectDescriptor");
        let ret = "";
        if (typeof TextEncoder !== "undefined") {
            ret = (new TextDecoder("utf-8")).decode(valueBytes.buffer);
        }
        else if (typeof Buffer !== "undefined") {
            ret = (Buffer.from(this.value)).toString("utf-8");
        }
        for (let i = 0; i < ret.length; i++) {
            const characterCode = ret.charCodeAt(i);
            if (characterCode < 0x20 || characterCode > 0x7E) {
                throw new errors.ASN1CharactersError("GraphicString, VisibleString, or ObjectDescriptor "
                    + "can only contain characters between 0x20 and 0x7E.");
            }
        }
        return ret;
    }
    set visibleString(value) {
        this.graphicString = value;
    }
    get visibleString() {
        return this.graphicString;
    }
    set generalString(value) {
        for (let i = 0; i < value.length; i++) {
            if (value.charCodeAt(i) > 0x7F) {
                throw new errors.ASN1CharactersError("GeneralString can only contain ASCII characters.");
            }
        }
        if (typeof TextEncoder !== "undefined") {
            this.value = (new TextEncoder()).encode(value);
        }
        else if (typeof Buffer !== "undefined") {
            this.value = Buffer.from(value, "ascii");
        }
    }
    get generalString() {
        const valueBytes = this.deconstruct("GeneralString");
        let ret = "";
        if (typeof TextEncoder !== "undefined") {
            ret = (new TextDecoder("windows-1252")).decode(valueBytes.buffer);
        }
        else if (typeof Buffer !== "undefined") {
            ret = (Buffer.from(this.value)).toString("ascii");
        }
        for (let i = 0; i < ret.length; i++) {
            if (ret.charCodeAt(i) > 0x7F) {
                throw new errors.ASN1CharactersError("GeneralString can only contain ASCII characters.");
            }
        }
        return ret;
    }
    set universalString(value) {
        const buf = new Uint8Array(value.length << 2);
        for (let i = 0; i < value.length; i++) {
            buf[(i << 2)] = value.charCodeAt(i) >>> 24;
            buf[(i << 2) + 1] = value.charCodeAt(i) >>> 16;
            buf[(i << 2) + 2] = value.charCodeAt(i) >>> 8;
            buf[(i << 2) + 3] = value.charCodeAt(i);
        }
        this.value = buf;
    }
    get universalString() {
        const valueBytes = this.deconstruct("UniversalString");
        if (valueBytes.length % 4) {
            throw new errors.ASN1Error("UniversalString encoded on non-mulitple of four bytes.");
        }
        let ret = "";
        for (let i = 0; i < valueBytes.length; i += 4) {
            ret += String.fromCharCode((valueBytes[i + 0] << 24)
                + (valueBytes[i + 1] << 16)
                + (valueBytes[i + 2] << 8)
                + (valueBytes[i + 3] << 0));
        }
        return ret;
    }
    set bmpString(value) {
        const buf = new Uint8Array(value.length << 1);
        for (let i = 0, strLen = value.length; i < strLen; i++) {
            buf[(i << 1)] = value.charCodeAt(i) >>> 8;
            buf[(i << 1) + 1] = value.charCodeAt(i);
        }
        this.value = buf;
    }
    get bmpString() {
        const valueBytes = this.deconstruct("BMPString");
        if (valueBytes.length % 2)
            throw new errors.ASN1Error("BMPString encoded on non-mulitple of two bytes.");
        let ret = "";
        if (typeof TextEncoder !== "undefined") {
            ret = (new TextDecoder("utf-16be")).decode(valueBytes.buffer);
        }
        else if (typeof Buffer !== "undefined") {
            const swappedEndianness = new Uint8Array(valueBytes.length);
            for (let i = 0; i < valueBytes.length; i += 2) {
                swappedEndianness[i] = valueBytes[i + 1];
                swappedEndianness[i + 1] = valueBytes[i];
            }
            ret = (Buffer.from(swappedEndianness)).toString("utf-16le");
        }
        return ret;
    }
    fromBytes(bytes) {
        if (bytes.length < 2) {
            throw new errors.ASN1TruncationError("Tried to decode a BER element that is less than two bytes.");
        }
        if ((this.recursionCount + 1) > BERElement.nestingRecursionLimit)
            throw new errors.ASN1RecursionError();
        let cursor = 0;
        switch (bytes[cursor] & 0b11000000) {
            case (0b00000000):
                this.tagClass = values_1.ASN1TagClass.universal;
                break;
            case (0b01000000):
                this.tagClass = values_1.ASN1TagClass.application;
                break;
            case (0b10000000):
                this.tagClass = values_1.ASN1TagClass.context;
                break;
            case (0b11000000):
                this.tagClass = values_1.ASN1TagClass.private;
                break;
            default: this.tagClass = values_1.ASN1TagClass.universal;
        }
        this.construction = ((bytes[cursor] & 0b00100000)
            ? values_1.ASN1Construction.constructed : values_1.ASN1Construction.primitive);
        this.tagNumber = (bytes[cursor] & 0b00011111);
        cursor++;
        if (this.tagNumber >= 31) {
            if (bytes[cursor] === 0b10000000) {
                throw new errors.ASN1PaddingError("Leading padding byte on long tag number encoding.");
            }
            this.tagNumber = 0;
            const limit = (((bytes.length - 1) >= 4) ? 4 : (bytes.length - 1));
            while (cursor < limit) {
                if (!(bytes[cursor++] & 0b10000000))
                    break;
            }
            if (bytes[cursor - 1] & 0b10000000) {
                if (limit === (bytes.length - 1)) {
                    throw new errors.ASN1TruncationError("ASN.1 tag number appears to have been truncated.");
                }
                else {
                    throw new errors.ASN1OverflowError("ASN.1 tag number too large.");
                }
            }
            for (let i = 1; i < cursor; i++) {
                this.tagNumber <<= 7;
                this.tagNumber |= (bytes[i] & 0x7F);
            }
            if (this.tagNumber <= 31) {
                throw new errors.ASN1Error("ASN.1 tag number could have been encoded in short form.");
            }
        }
        if ((bytes[cursor] & 0b10000000) === 0b10000000) {
            const numberOfLengthOctets = (bytes[cursor] & 0x7F);
            if (numberOfLengthOctets) {
                if (numberOfLengthOctets === 0b01111111) {
                    throw new errors.ASN1UndefinedError("Length byte with undefined meaning encountered.");
                }
                if (numberOfLengthOctets > 4) {
                    throw new errors.ASN1OverflowError("Element length too long to decode to an integer.");
                }
                if (cursor + numberOfLengthOctets >= bytes.length) {
                    throw new errors.ASN1TruncationError("Element length bytes appear to have been truncated.");
                }
                cursor++;
                const lengthNumberOctets = new Uint8Array(4);
                for (let i = numberOfLengthOctets; i > 0; i--) {
                    lengthNumberOctets[(4 - i)] = bytes[(cursor + numberOfLengthOctets - i)];
                }
                let length = 0;
                lengthNumberOctets.forEach((octet) => {
                    length <<= 8;
                    length += octet;
                });
                if ((cursor + length) < cursor) {
                    throw new errors.ASN1OverflowError("ASN.1 element too large.");
                }
                cursor += (numberOfLengthOctets);
                if ((cursor + length) > bytes.length)
                    throw new errors.ASN1TruncationError("ASN.1 element truncated.");
                this.value = bytes.slice(cursor, (cursor + length));
                return (cursor + length);
            }
            else {
                if (this.construction !== values_1.ASN1Construction.constructed) {
                    throw new errors.ASN1ConstructionError("Indefinite length ASN.1 element was not of constructed construction.");
                }
                const startOfValue = ++cursor;
                let sentinel = cursor;
                while (sentinel < bytes.length) {
                    const child = new BERElement();
                    child.recursionCount = (this.recursionCount + 1);
                    sentinel += child.fromBytes(bytes.slice(sentinel));
                    if (child.tagClass === values_1.ASN1TagClass.universal
                        && child.construction === values_1.ASN1Construction.primitive
                        && child.tagNumber === values_1.ASN1UniversalType.endOfContent
                        && child.value.length === 0)
                        break;
                }
                if (sentinel === bytes.length && (bytes[sentinel - 1] !== 0x00 || bytes[sentinel - 2] !== 0x00)) {
                    throw new errors.ASN1TruncationError("No END OF CONTENT element found at the end of indefinite length ASN.1 element.");
                }
                this.value = bytes.slice(startOfValue, (sentinel - 2));
                return sentinel;
            }
        }
        else {
            const length = (bytes[cursor++] & 0x7F);
            if ((cursor + length) > bytes.length)
                throw new errors.ASN1TruncationError("ASN.1 element was truncated.");
            this.value = bytes.slice(cursor, (cursor + length));
            return (cursor + length);
        }
    }
    toBytes() {
        let tagBytes = [0x00];
        tagBytes[0] |= (this.tagClass << 6);
        tagBytes[0] |= (this.construction << 5);
        if (this.tagNumber < 31) {
            tagBytes[0] |= this.tagNumber;
        }
        else {
            tagBytes[0] |= 0b00011111;
            let number = this.tagNumber;
            const encodedNumber = [];
            while (number !== 0) {
                encodedNumber.unshift(number & 0x7F);
                number >>>= 7;
                encodedNumber[0] |= 0b10000000;
            }
            encodedNumber[encodedNumber.length - 1] &= 0b01111111;
            tagBytes = tagBytes.concat(encodedNumber);
        }
        let lengthOctets = [0x00];
        switch (BERElement.lengthEncodingPreference) {
            case (values_1.LengthEncodingPreference.definite): {
                if (this.value.length < 127) {
                    lengthOctets = [this.value.length];
                }
                else {
                    const length = this.value.length;
                    lengthOctets = [0, 0, 0, 0];
                    for (let i = 0; i < 4; i++) {
                        lengthOctets[i] = ((length >>> ((3 - i) << 3)) & 0xFF);
                    }
                    let startOfNonPadding = 0;
                    for (let i = 0; i < (lengthOctets.length - 1); i++) {
                        if (lengthOctets[i] === 0x00)
                            startOfNonPadding++;
                    }
                    lengthOctets = lengthOctets.slice(startOfNonPadding);
                    lengthOctets.unshift(0b10000000 | lengthOctets.length);
                }
                break;
            }
            case (values_1.LengthEncodingPreference.indefinite): {
                lengthOctets = [0b10000000];
                break;
            }
            default:
                throw new errors.ASN1UndefinedError("Invalid LengthEncodingPreference encountered!");
        }
        const ret = new Uint8Array(tagBytes.length
            + lengthOctets.length
            + this.value.length
            + (BERElement.lengthEncodingPreference === values_1.LengthEncodingPreference.indefinite ? 2 : 0));
        ret.set(tagBytes, 0);
        ret.set(lengthOctets, tagBytes.length);
        ret.set(this.value, (tagBytes.length + lengthOctets.length));
        return ret;
    }
    deconstruct(dataType) {
        if (this.construction === values_1.ASN1Construction.primitive) {
            return new Uint8Array(this.value);
        }
        else {
            if ((this.recursionCount + 1) > BERElement.nestingRecursionLimit)
                throw new errors.ASN1RecursionError();
            let appendy = [];
            const substrings = this.sequence;
            substrings.forEach((substring) => {
                if (substring.tagClass !== this.tagClass) {
                    throw new errors.ASN1ConstructionError(`Invalid tag class in recursively-encoded ${dataType}.`);
                }
                if (substring.tagNumber !== this.tagNumber) {
                    throw new errors.ASN1ConstructionError(`Invalid tag class in recursively-encoded ${dataType}.`);
                }
                substring.recursionCount = (this.recursionCount + 1);
                appendy = appendy.concat(substring.deconstruct(dataType));
            });
            let totalLength = 0;
            appendy.forEach((substring) => {
                totalLength += substring.length;
            });
            const whole = new Uint8Array(totalLength);
            let currentIndex = 0;
            appendy.forEach((substring) => {
                whole.set(substring, currentIndex);
                currentIndex += substring.length;
            });
            return whole;
        }
    }
}
exports.BERElement = BERElement;
BERElement.lengthEncodingPreference = values_1.LengthEncodingPreference.definite;
//# sourceMappingURL=ber.js.map