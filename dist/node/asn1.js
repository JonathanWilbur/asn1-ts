module.exports =
/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		var threw = true;
/******/ 		try {
/******/ 			modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/ 			threw = false;
/******/ 		} finally {
/******/ 			if(threw) delete installedModules[moduleId];
/******/ 		}
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, { enumerable: true, get: getter });
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// create a fake namespace object
/******/ 	// mode & 1: value is a module id, require it
/******/ 	// mode & 2: merge all properties of value into the ns
/******/ 	// mode & 4: return value when already ns object
/******/ 	// mode & 8|1: behave like require
/******/ 	__webpack_require__.t = function(value, mode) {
/******/ 		if(mode & 1) value = __webpack_require__(value);
/******/ 		if(mode & 8) return value;
/******/ 		if((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
/******/ 		var ns = Object.create(null);
/******/ 		__webpack_require__.r(ns);
/******/ 		Object.defineProperty(ns, 'default', { enumerable: true, value: value });
/******/ 		if(mode & 2 && typeof value != 'string') for(var key in value) __webpack_require__.d(ns, key, function(key) { return value[key]; }.bind(null, key));
/******/ 		return ns;
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 1);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports) {

module.exports = require("util");

/***/ }),
/* 1 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__(2);


/***/ }),
/* 2 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);

// CONCATENATED MODULE: ./source/errors.ts
class ASN1Error extends Error {
    constructor(m) {
        super(m);
        Object.setPrototypeOf(this, ASN1Error.prototype);
    }
}
class ASN1NotImplementedError extends ASN1Error {
    constructor() {
        super("Not yet implemented.");
        Object.setPrototypeOf(this, ASN1Error.prototype);
    }
}
class ASN1RecursionError extends ASN1Error {
    constructor() {
        super("Recursion was too deep.");
        Object.setPrototypeOf(this, ASN1Error.prototype);
    }
}
class ASN1TruncationError extends ASN1Error {
    constructor(m) {
        super(m);
        Object.setPrototypeOf(this, ASN1Error.prototype);
    }
}
class ASN1OverflowError extends ASN1Error {
    constructor(m) {
        super(m);
        Object.setPrototypeOf(this, ASN1Error.prototype);
    }
}
class ASN1SizeError extends ASN1Error {
    constructor(m) {
        super(m);
        Object.setPrototypeOf(this, ASN1Error.prototype);
    }
}
class ASN1PaddingError extends ASN1Error {
    constructor(m) {
        super(m);
        Object.setPrototypeOf(this, ASN1Error.prototype);
    }
}
class ASN1UndefinedError extends ASN1Error {
    constructor(m) {
        super(m);
        Object.setPrototypeOf(this, ASN1Error.prototype);
    }
}
class ASN1CharactersError extends ASN1Error {
    constructor(m) {
        super(m);
        Object.setPrototypeOf(this, ASN1Error.prototype);
    }
}
class ASN1ConstructionError extends ASN1Error {
    constructor(m) {
        super(m);
        Object.setPrototypeOf(this, ASN1Error.prototype);
    }
}

// CONCATENATED MODULE: ./source/asn1.ts

class asn1_ASN1Element {
    constructor() {
        this.recursionCount = 0;
        this.tagClass = 0;
        this.construction = 0;
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
            case 11:
                if (date > 31)
                    throw new ASN1Error(`Day > 31 encountered in ${dataType} with 31-day month.`);
                break;
            case 3:
            case 5:
            case 8:
            case 10:
                if (date > 30)
                    throw new ASN1Error(`Day > 31 encountered in ${dataType} with 30-day month.`);
                break;
            case 1:
                let isLeapYear = ((year % 4 === 0) && (year % 100 !== 0)) || (year % 400 === 0);
                if (isLeapYear) {
                    if (date > 29)
                        throw new ASN1Error(`Day > 29 encountered in ${dataType} with month of February in leap year.`);
                }
                else {
                    if (date > 28)
                        throw new ASN1Error(`Day > 28 encountered in ${dataType} with month of February and non leap year.`);
                }
                break;
            default:
                throw new ASN1Error(`Month greater than 12 encountered in ${dataType}.`);
        }
        if (hours > 23)
            throw new ASN1Error(`Hours > 23 encountered in ${dataType}.`);
        if (minutes > 59)
            throw new ASN1Error(`Minutes > 60 encountered in ${dataType}.`);
        if (seconds > 59)
            throw new ASN1Error(`Seconds > 60 encountered in ${dataType}.`);
    }
    static decodeUnsignedBigEndianInteger(value) {
        if (value.length === 0)
            return 0;
        if (value.length > 4)
            throw new ASN1OverflowError("Number too long to decode.");
        const u8 = new Uint8Array(4);
        u8.set(value, (4 - value.length));
        return new Uint32Array(u8.reverse().buffer)[0];
    }
    static decodeSignedBigEndianInteger(value) {
        if (value.length === 0)
            return 0;
        if (value.length > 4)
            throw new ASN1OverflowError("Number too long to decode.");
        const u8 = new Uint8Array(4);
        if (value[0] >= 0b10000000)
            u8.fill(0xFF);
        u8.set(value, (4 - value.length));
        return new Int32Array(u8.reverse().buffer)[0];
    }
}
asn1_ASN1Element.nestingRecursionLimit = 5;

// CONCATENATED MODULE: ./source/values.ts
const MAX_UINT_32 = 0x00FFFFFFFF;
const MIN_UINT_32 = 0x0000000000;
const MAX_SINT_32 = 0x7FFFFFFF;
const MIN_SINT_32 = -0x80000000;
var ASN1TagClass;
(function (ASN1TagClass) {
    ASN1TagClass[ASN1TagClass["universal"] = 0] = "universal";
    ASN1TagClass[ASN1TagClass["application"] = 1] = "application";
    ASN1TagClass[ASN1TagClass["context"] = 2] = "context";
    ASN1TagClass[ASN1TagClass["private"] = 3] = "private";
})(ASN1TagClass || (ASN1TagClass = {}));
var ASN1Construction;
(function (ASN1Construction) {
    ASN1Construction[ASN1Construction["primitive"] = 0] = "primitive";
    ASN1Construction[ASN1Construction["constructed"] = 1] = "constructed";
})(ASN1Construction || (ASN1Construction = {}));
var LengthEncodingPreference;
(function (LengthEncodingPreference) {
    LengthEncodingPreference[LengthEncodingPreference["definite"] = 0] = "definite";
    LengthEncodingPreference[LengthEncodingPreference["indefinite"] = 1] = "indefinite";
})(LengthEncodingPreference || (LengthEncodingPreference = {}));
var ASN1SpecialRealValue;
(function (ASN1SpecialRealValue) {
    ASN1SpecialRealValue[ASN1SpecialRealValue["plusInfinity"] = 64] = "plusInfinity";
    ASN1SpecialRealValue[ASN1SpecialRealValue["minusInfinity"] = 65] = "minusInfinity";
    ASN1SpecialRealValue[ASN1SpecialRealValue["notANumber"] = 66] = "notANumber";
    ASN1SpecialRealValue[ASN1SpecialRealValue["minusZero"] = 67] = "minusZero";
})(ASN1SpecialRealValue || (ASN1SpecialRealValue = {}));
var ASN1RealEncodingBase;
(function (ASN1RealEncodingBase) {
    ASN1RealEncodingBase[ASN1RealEncodingBase["base2"] = 0] = "base2";
    ASN1RealEncodingBase[ASN1RealEncodingBase["base8"] = 16] = "base8";
    ASN1RealEncodingBase[ASN1RealEncodingBase["base16"] = 32] = "base16";
})(ASN1RealEncodingBase || (ASN1RealEncodingBase = {}));
var ASN1RealEncodingScale;
(function (ASN1RealEncodingScale) {
    ASN1RealEncodingScale[ASN1RealEncodingScale["scale0"] = 0] = "scale0";
    ASN1RealEncodingScale[ASN1RealEncodingScale["scale1"] = 4] = "scale1";
    ASN1RealEncodingScale[ASN1RealEncodingScale["scale2"] = 8] = "scale2";
    ASN1RealEncodingScale[ASN1RealEncodingScale["scale3"] = 12] = "scale3";
})(ASN1RealEncodingScale || (ASN1RealEncodingScale = {}));
var ASN1UniversalType;
(function (ASN1UniversalType) {
    ASN1UniversalType[ASN1UniversalType["endOfContent"] = 0] = "endOfContent";
    ASN1UniversalType[ASN1UniversalType["boolean"] = 1] = "boolean";
    ASN1UniversalType[ASN1UniversalType["integer"] = 2] = "integer";
    ASN1UniversalType[ASN1UniversalType["bitString"] = 3] = "bitString";
    ASN1UniversalType[ASN1UniversalType["octetString"] = 4] = "octetString";
    ASN1UniversalType[ASN1UniversalType["nill"] = 5] = "nill";
    ASN1UniversalType[ASN1UniversalType["objectIdentifier"] = 6] = "objectIdentifier";
    ASN1UniversalType[ASN1UniversalType["objectDescriptor"] = 7] = "objectDescriptor";
    ASN1UniversalType[ASN1UniversalType["external"] = 8] = "external";
    ASN1UniversalType[ASN1UniversalType["realNumber"] = 9] = "realNumber";
    ASN1UniversalType[ASN1UniversalType["enumerated"] = 10] = "enumerated";
    ASN1UniversalType[ASN1UniversalType["embeddedPDV"] = 11] = "embeddedPDV";
    ASN1UniversalType[ASN1UniversalType["utf8String"] = 12] = "utf8String";
    ASN1UniversalType[ASN1UniversalType["relativeOID"] = 13] = "relativeOID";
    ASN1UniversalType[ASN1UniversalType["reserved14"] = 14] = "reserved14";
    ASN1UniversalType[ASN1UniversalType["reserved15"] = 15] = "reserved15";
    ASN1UniversalType[ASN1UniversalType["sequence"] = 16] = "sequence";
    ASN1UniversalType[ASN1UniversalType["set"] = 17] = "set";
    ASN1UniversalType[ASN1UniversalType["numericString"] = 18] = "numericString";
    ASN1UniversalType[ASN1UniversalType["printableString"] = 19] = "printableString";
    ASN1UniversalType[ASN1UniversalType["teletexString"] = 20] = "teletexString";
    ASN1UniversalType[ASN1UniversalType["videotexString"] = 21] = "videotexString";
    ASN1UniversalType[ASN1UniversalType["ia5String"] = 22] = "ia5String";
    ASN1UniversalType[ASN1UniversalType["utcTime"] = 23] = "utcTime";
    ASN1UniversalType[ASN1UniversalType["generalizedTime"] = 24] = "generalizedTime";
    ASN1UniversalType[ASN1UniversalType["graphicString"] = 25] = "graphicString";
    ASN1UniversalType[ASN1UniversalType["visibleString"] = 26] = "visibleString";
    ASN1UniversalType[ASN1UniversalType["generalString"] = 27] = "generalString";
    ASN1UniversalType[ASN1UniversalType["universalString"] = 28] = "universalString";
    ASN1UniversalType[ASN1UniversalType["characterString"] = 29] = "characterString";
    ASN1UniversalType[ASN1UniversalType["bmpString"] = 30] = "bmpString";
})(ASN1UniversalType || (ASN1UniversalType = {}));
const printableStringCharacters = "etaoinsrhdlucmfywgpbvkxqjzETAOINSRHDLUCMFYWGPBVKXQJZ0123456789 '()+,-./:=?";
const utcTimeRegex = /^(?<year>\d{2})(?<month>(?:1[0-2])|(?:0\d))(?<date>(?:3[01])|(?:[0-2]\d))(?<hour>(?:2[0-3])|(?:[01]\d))(?<minute>[0-5]\d)(?<second>[0-5]\d)?(?<offset>(?:(\+|\-)((?:2[0-3])|(?:[01]\d))[0-5]\d)|Z)$/;
const distinguishedUTCTimeRegex = /^(?<year>\d{2})(?<month>(?:1[0-2])|(?:0\d))(?<date>(?:3[01])|(?:[0-2]\d))(?<hour>(?:2[0-3])|(?:[01]\d))(?<minute>[0-5]\d)(?<second>[0-5]\d)?Z$/;
const generalizedTimeRegex = /^(?<year>\d{4})(?<month>(?:1[0-2])|(?:0\d))(?<date>(?:3[01])|(?:[0-2]\d))(?<hour>(?:2[0-3])|(?:[01]\d))(?<minute>[0-5]\d)?(?<second>[0-5]\d)?(?:(\.|,)(?<fraction>\d+))?(?<offset>(?:(\+|\-)((?:2[0-3])|(?:[01]\d))[0-5]\d)|Z)?$/;
const distinguishedGeneralizedTimeRegex = /^(?<year>\d{4})(?<month>(?:1[0-2])|(?:0\d))(?<date>(?:3[01])|(?:[0-2]\d))(?<hour>(?:2[0-3])|(?:[01]\d))(?<minute>[0-5]\d)(?<second>[0-5]\d)(?:(\.|,)(?<fraction>\d*[1-9]))?Z$/;
const nr1Regex = /^\ *(\+|\-)?\d+$/;
const nr2Regex = /^\ *(\+|\-)?(?:\d+(\.|,)\d*)|(?:\d*(\.|,)\d+)$/;
const nr3Regex = /^\ *(\+|\-)?(?:\d+(\.|,)\d*)|(?:\d*(\.|,)\d+)(e|E)(\+|\-)?\d+$/;
const canonicalNR3Regex = /^\ *\-?(?:[1-9]\d*)?[1-9]\.E(?:\+0)|(?:\-?[1-9]\d*)$/;
const distinguishedNR3Regex = /^\ *\-?(?:[1-9]\d*)?[1-9]\.E(?:\+0)|(?:\-?[1-9]\d*)$/;
const CANONICAL_TAG_CLASS_ORDERING = [
    0,
    1,
    3,
    2
];

// CONCATENATED MODULE: ./source/types/objectidentifier.ts
class ObjectIdentifier {
    constructor(nodes) {
        if (nodes.length < 2)
            throw new Error("Cannot construct an OID with less than two nodes!");
        if (nodes.length >= 1 && !(nodes[0] in [0, 1, 2]))
            throw new Error("OIDs first node must be 0, 1, or 2!");
        if (((nodes[0] < 2) && nodes[1] > 39) ||
            (nodes[0] === 2 && nodes[1] > 175))
            throw new Error(`OID Node #2 cannot exceed 39 if node #1 is 0 or 1, and 175 if node #1 is 2. Received these nodes: ${nodes}.`);
        nodes.forEach(node => {
            if (node < 0)
                throw new Error("OID node numbers cannot be negative!");
            if (node > Number.MAX_SAFE_INTEGER)
                throw new Error("OID number was too big!");
        });
        this._nodes = nodes.slice(0);
    }
    get nodes() {
        return this._nodes.slice(0);
    }
    get dotDelimitedNotation() {
        return this._nodes.join(".");
    }
    toString() {
        return this.dotDelimitedNotation;
    }
}

// EXTERNAL MODULE: external "util"
var external_util_ = __webpack_require__(0);

// CONCATENATED MODULE: ./source/x690.ts





class x690_X690Element extends asn1_ASN1Element {
    validateTag(permittedClasses, permittedConstruction, permittedNumbers) {
        if (!permittedClasses.includes(this.tagClass))
            return -1;
        if (!permittedConstruction.includes(this.construction))
            return -2;
        if (!permittedNumbers.includes(this.tagNumber))
            return -3;
        return 0;
    }
    set integer(value) {
        if (value < MIN_SINT_32)
            throw new ASN1OverflowError(`Number ${value} too small to be converted.`);
        if (value > MAX_SINT_32)
            throw new ASN1OverflowError(`Number ${value} too big to be converted.`);
        if (value <= 127 && value >= -128) {
            this.value = new Uint8Array([
                (value & 255)
            ]);
            return;
        }
        else if (value <= 32767 && value >= -32768) {
            this.value = new Uint8Array([
                (value >> 8 & 255),
                (value & 255)
            ]);
            return;
        }
        else if (value <= 8388607 && value >= -8388608) {
            this.value = new Uint8Array([
                ((value >> 16) & 255),
                (value >> 8 & 255),
                (value & 255)
            ]);
            return;
        }
        else {
            this.value = new Uint8Array([
                ((value >> 24) & 255),
                ((value >> 16) & 255),
                (value >> 8 & 255),
                (value & 255)
            ]);
            return;
        }
    }
    get integer() {
        if (this.construction !== 0)
            throw new ASN1ConstructionError("INTEGER cannot be constructed.");
        if (this.value.length === 0)
            throw new ASN1SizeError("Number encoded on zero bytes!");
        if (this.value.length > 4)
            throw new ASN1OverflowError("Number too long to decode.");
        if (this.value.length > 2 &&
            ((this.value[0] === 0xFF && this.value[1] >= 0b10000000) ||
                (this.value[0] === 0x00 && this.value[1] < 0b10000000)))
            throw new ASN1PaddingError("Unnecessary padding bytes on INTEGER or ENUMERATED.");
        return asn1_ASN1Element.decodeSignedBigEndianInteger(this.value.subarray(0));
    }
    set objectIdentifier(value) {
        const numbers = value.nodes;
        let pre = [((numbers[0] * 40) + numbers[1])];
        let post = x690_X690Element.encodeObjectIdentifierNodes(numbers.slice(2));
        this.value = new Uint8Array(pre.concat(post));
    }
    get objectIdentifier() {
        if (this.construction !== 0)
            throw new ASN1ConstructionError("OBJECT IDENTIFIER cannot be constructed.");
        if (this.value.length === 0)
            throw new ASN1TruncationError("Encoded value was too short to be an OBJECT IDENTIFIER!");
        let numbers = [0, 0];
        if (this.value[0] >= 0x50) {
            numbers[0] = 2;
            numbers[1] = (this.value[0] - 0x50);
        }
        else if (this.value[0] >= 0x28) {
            numbers[0] = 1;
            numbers[1] = (this.value[0] - 0x28);
        }
        else {
            numbers[0] = 0;
            numbers[1] = this.value[0];
        }
        if (this.value.length === 1)
            return new ObjectIdentifier(numbers);
        numbers = numbers.concat(x690_X690Element.decodeObjectIdentifierNodes(this.value.slice(1)));
        return new ObjectIdentifier(numbers);
    }
    set enumerated(value) {
        this.integer = value;
    }
    get enumerated() {
        return this.integer;
    }
    set relativeObjectIdentifier(value) {
        this.value = new Uint8Array(x690_X690Element.encodeObjectIdentifierNodes(value));
    }
    get relativeObjectIdentifier() {
        if (this.construction !== 0)
            throw new ASN1ConstructionError("Relative OID cannot be constructed.");
        return x690_X690Element.decodeObjectIdentifierNodes(this.value.slice(0));
    }
    static decodeObjectIdentifierNodes(value) {
        if (value.length === 0)
            return [];
        let numbers = [];
        if (value.length > 0 && (value[(value.length - 1)] & 0b10000000) === 0b10000000)
            throw new ASN1TruncationError("OID truncated");
        let components = 0;
        value.forEach(b => { if (!(b & 0b10000000))
            components++; });
        numbers.length = components;
        let currentNumber = 0;
        let bytesUsedInCurrentNumber = 0;
        value.forEach(b => {
            if (bytesUsedInCurrentNumber === 0 && b === 0b10000000)
                throw new ASN1PaddingError("OID had invalid padding byte.");
            if (numbers[currentNumber] > (Number.MAX_SAFE_INTEGER >>> 7))
                throw new ASN1OverflowError("OID node too big");
            numbers[currentNumber] <<= 7;
            numbers[currentNumber] |= (b & 0x7F);
            if (!(b & 0b10000000)) {
                currentNumber++;
                bytesUsedInCurrentNumber = 0;
            }
            else {
                bytesUsedInCurrentNumber++;
            }
        });
        return numbers;
    }
    static encodeObjectIdentifierNodes(value) {
        let ret = [];
        for (let i = 0; i < value.length; i++) {
            let number = value[i];
            if (number < 128) {
                ret.push(number);
                continue;
            }
            let encodedOIDNode = [];
            while (number !== 0) {
                let numberBytes = [
                    (number & 255),
                    (number >>> 8 & 255),
                    ((number >>> 16) & 255),
                    ((number >>> 24) & 255),
                ];
                if ((numberBytes[0] & 0x80) === 0)
                    numberBytes[0] |= 0x80;
                encodedOIDNode.unshift(numberBytes[0]);
                number >>= 7;
            }
            encodedOIDNode[encodedOIDNode.length - 1] &= 0x7F;
            ret = ret.concat(encodedOIDNode);
        }
        return ret;
    }
    static isInCanonicalOrder(elements) {
        let previousTagClass = null;
        let previousTagNumber = null;
        if (!elements.every((element) => {
            if (!Object(external_util_["isNull"])(previousTagClass) &&
                element.tagClass !== previousTagClass &&
                CANONICAL_TAG_CLASS_ORDERING.indexOf(element.tagClass) <=
                    CANONICAL_TAG_CLASS_ORDERING.indexOf(previousTagClass))
                return false;
            if (element.tagClass !== previousTagClass)
                previousTagNumber = null;
            if (!Object(external_util_["isNull"])(previousTagNumber) && element.tagNumber < previousTagNumber)
                return false;
            previousTagClass = element.tagClass;
            previousTagNumber = element.tagNumber;
            return true;
        }))
            return false;
        return true;
    }
    static isUniquelyTagged(elements) {
        const finds = {};
        for (let i = 0; i < elements.length; i++) {
            const key = `${elements[i].tagClass}.${elements[i].tagNumber}`;
            if (key in finds)
                return false;
            finds[key] = null;
        }
        return true;
    }
}

// CONCATENATED MODULE: ./source/codecs/ber.ts




class ber_BERElement extends x690_X690Element {
    constructor(tagClass = 0, construction = 0, tagNumber = 0) {
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
        if (this.construction !== 0)
            throw new ASN1ConstructionError("BOOLEAN cannot be constructed.");
        if (this.value.length !== 1)
            throw new ASN1SizeError("BOOLEAN not one byte");
        return (this.value[0] !== 0);
    }
    set bitString(value) {
        if (value.length === 0)
            this.value = new Uint8Array(0);
        let pre = [];
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
        if (this.construction === 0) {
            if (this.value.length === 0)
                throw new ASN1Error("ASN.1 BIT STRING cannot be encoded on zero bytes!");
            if (this.value.length === 1 && this.value[0] !== 0)
                throw new ASN1Error("ASN.1 BIT STRING encoded with deceptive first byte!");
            if (this.value[0] > 7)
                throw new ASN1Error("First byte of an ASN.1 BIT STRING must be <= 7!");
            let ret = [];
            for (let i = 1; i < this.value.length; i++) {
                ret = ret.concat([
                    (this.value[i] & 0b10000000 ? true : false),
                    (this.value[i] & 0b01000000 ? true : false),
                    (this.value[i] & 0b00100000 ? true : false),
                    (this.value[i] & 0b00010000 ? true : false),
                    (this.value[i] & 0b00001000 ? true : false),
                    (this.value[i] & 0b00000100 ? true : false),
                    (this.value[i] & 0b00000010 ? true : false),
                    (this.value[i] & 0b00000001 ? true : false)
                ]);
            }
            ret.length -= this.value[0];
            return ret;
        }
        else {
            if ((this.recursionCount + 1) > ber_BERElement.nestingRecursionLimit)
                throw new ASN1RecursionError();
            let appendy = [];
            const substrings = this.sequence;
            substrings.slice(0, (substrings.length - 1)).forEach(substring => {
                if (substring.construction === 0 &&
                    substring.value.length > 0 &&
                    substring.value[0] !== 0x00)
                    throw new ASN1Error(`Only the last subelement of a constructed BIT STRING may have a non-zero first value byte.`);
            });
            substrings.forEach(substring => {
                if (substring.tagClass !== this.tagClass)
                    throw new ASN1ConstructionError(`Invalid tag class in recursively-encoded BIT STRING.`);
                if (substring.tagNumber !== this.tagNumber)
                    throw new ASN1ConstructionError(`Invalid tag class in recursively-encoded BIT STRING.`);
                substring.recursionCount = (this.recursionCount + 1);
                appendy = appendy.concat(substring.bitString);
            });
            return appendy;
        }
    }
    set octetString(value) {
        this.value = value.subarray(0);
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
            this.value = new Uint8Array([66]);
            return;
        }
        else if (value === -0.0) {
            this.value = new Uint8Array([67]);
            return;
        }
        else if (value === Infinity) {
            this.value = new Uint8Array([64]);
            return;
        }
        else if (value === -Infinity) {
            this.value = new Uint8Array([65]);
            return;
        }
        let valueString = value.toFixed(7);
        valueString = (String.fromCharCode(0b00000011) + valueString);
        this.value = (new TextEncoder()).encode(valueString);
    }
    get real() {
        if (this.construction !== 0)
            throw new ASN1ConstructionError("REAL cannot be constructed.");
        if (this.value.length === 0)
            return 0.0;
        switch (this.value[0] & 0b11000000) {
            case (0b01000000): {
                if (this.value[0] === 66)
                    return NaN;
                if (this.value[0] === 67)
                    return -0.0;
                if (this.value[0] === 64)
                    return Infinity;
                if (this.value[0] === 65)
                    return -Infinity;
                throw new ASN1UndefinedError("Unrecognized special REAL value!");
            }
            case (0b00000000): {
                let realString;
                if (typeof TextEncoder !== "undefined") {
                    realString = (new TextDecoder("utf-8")).decode(this.value.slice(1));
                }
                else if (typeof Buffer !== "undefined") {
                    realString = (new Buffer(this.value.slice(1))).toString("utf-8");
                }
                else {
                    throw new ASN1Error("No ability to decode bytes to string!");
                }
                switch (this.value[0] & 0b00111111) {
                    case 1: {
                        if (!nr1Regex.test(realString))
                            throw new ASN1Error("Malformed NR1 Base-10 REAL");
                        return parseFloat(realString);
                    }
                    case 2: {
                        if (!nr2Regex.test(realString))
                            throw new ASN1Error("Malformed NR2 Base-10 REAL");
                        return parseFloat(realString.replace(",", "."));
                    }
                    case 3: {
                        if (!nr3Regex.test(realString))
                            throw new ASN1Error("Malformed NR3 Base-10 REAL");
                        return parseFloat(realString.replace(",", "."));
                    }
                    default:
                        throw new ASN1UndefinedError("Undefined Base-10 REAL encoding.");
                }
            }
            case (0b10000000):
            case (0b11000000): {
                const sign = ((this.value[0] & 0b01000000) ? -1 : 1);
                const base = ((flag) => {
                    switch (flag) {
                        case (0): return 2;
                        case (16): return 8;
                        case (32): return 16;
                        default:
                            throw new ASN1Error("Impossible REAL encoding base encountered.");
                    }
                })(this.value[0] & 0b00110000);
                const scale = ((flag) => {
                    switch (flag) {
                        case (0): return 0;
                        case (4): return 1;
                        case (8): return 2;
                        case (12): return 3;
                        default:
                            throw new ASN1Error("Impossible REAL encoding scale encountered.");
                    }
                })(this.value[0] & 0b00001100);
                let exponent;
                let mantissa;
                switch (this.value[0] & 0b00000011) {
                    case (0b00000000): {
                        if (this.value.length < 3)
                            throw new ASN1TruncationError("Binary-encoded REAL truncated.");
                        exponent = asn1_ASN1Element.decodeSignedBigEndianInteger(this.value.subarray(1, 2));
                        mantissa = asn1_ASN1Element.decodeUnsignedBigEndianInteger(this.value.subarray(2));
                        break;
                    }
                    case (0b00000001): {
                        if (this.value.length < 4)
                            throw new ASN1TruncationError("Binary-encoded REAL truncated.");
                        exponent = asn1_ASN1Element.decodeSignedBigEndianInteger(this.value.subarray(1, 3));
                        mantissa = asn1_ASN1Element.decodeUnsignedBigEndianInteger(this.value.subarray(3));
                        break;
                    }
                    case (0b00000010): {
                        if (this.value.length < 5)
                            throw new ASN1TruncationError("Binary-encoded REAL truncated.");
                        exponent = asn1_ASN1Element.decodeSignedBigEndianInteger(this.value.subarray(1, 4));
                        mantissa = asn1_ASN1Element.decodeUnsignedBigEndianInteger(this.value.subarray(4));
                        break;
                    }
                    case (0b00000011): {
                        if (this.value.length < 3)
                            throw new ASN1TruncationError("Binary-encoded REAL truncated.");
                        let exponentLength = this.value[1];
                        if (this.value.length < (3 + exponentLength))
                            throw new ASN1TruncationError("Binary-encoded REAL truncated.");
                        exponent = asn1_ASN1Element.decodeSignedBigEndianInteger(this.value.subarray(2, (2 + exponentLength)));
                        mantissa = asn1_ASN1Element.decodeUnsignedBigEndianInteger(this.value.subarray((2 + exponentLength)));
                        break;
                    }
                    default:
                        throw new ASN1Error("Impossible binary REAL exponent encoding encountered.");
                }
                return (sign * mantissa * Math.pow(2, scale) * Math.pow(base, exponent));
            }
            default:
                throw new ASN1Error("Impossible REAL format encountered.");
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
            ret = (new Buffer(this.value)).toString("utf-8");
        }
        return ret;
    }
    set sequence(value) {
        let encodedElements = [];
        value.forEach(element => {
            encodedElements.push(element.toBytes());
        });
        let totalLength = 0;
        encodedElements.forEach(element => {
            totalLength += element.length;
        });
        const newValue = new Uint8Array(totalLength);
        let currentIndex = 0;
        encodedElements.forEach(element => {
            newValue.set(element, currentIndex);
            currentIndex += element.length;
        });
        this.value = newValue;
        this.construction = 1;
    }
    get sequence() {
        if (this.construction !== 1)
            throw new ASN1ConstructionError("SET or SEQUENCE cannot be primitively constructed.");
        let encodedElements = [];
        if (this.value.length === 0)
            return [];
        let i = 0;
        while (i < this.value.length) {
            const next = new ber_BERElement();
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
                throw new ASN1CharactersError("NumericString can only contain characters 0 - 9 and space.");
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
            ret = (new Buffer(this.value)).toString("utf-8");
        }
        for (let i = 0; i < ret.length; i++) {
            const characterCode = ret.charCodeAt(i);
            if (!((characterCode >= 0x30 && characterCode <= 0x39) || characterCode === 0x20)) {
                throw new ASN1CharactersError("NumericString can only contain characters 0 - 9 and space.");
            }
        }
        return ret;
    }
    set printableString(value) {
        for (let i = 0; i < value.length; i++) {
            if (printableStringCharacters.indexOf(value.charAt(i)) === -1) {
                throw new ASN1CharactersError(`PrintableString can only contain these characters: ${printableStringCharacters}`);
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
            ret = (new Buffer(this.value)).toString("utf-8");
        }
        for (let i = 0; i < ret.length; i++) {
            if (printableStringCharacters.indexOf(ret.charAt(i)) === -1) {
                throw new ASN1CharactersError(`PrintableString can only contain these characters: ${printableStringCharacters}`);
            }
        }
        return ret;
    }
    set teletexString(value) {
        this.value = value.subarray(0);
    }
    get teletexString() {
        return this.deconstruct("TeletexString");
    }
    set videotexString(value) {
        this.value = value.subarray(0);
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
            ret = (new Buffer(this.value)).toString("utf-8");
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
            dateString = (new Buffer(this.value)).toString("utf-8");
        }
        const match = utcTimeRegex.exec(dateString);
        if (match === null)
            throw new ASN1Error("Malformed UTCTime string.");
        if (match.groups === undefined)
            throw new ASN1Error("Malformed UTCTime string.");
        const ret = new Date();
        let year = Number(match.groups.year);
        year = (year < 70 ? (2000 + year) : (1900 + year));
        const month = (Number(match.groups.month) - 1);
        const date = Number(match.groups.date);
        const hours = Number(match.groups.hour);
        const minutes = Number(match.groups.minute);
        const seconds = Number(match.groups.second);
        ber_BERElement.validateDateTime("UTCTime", year, month, date, hours, minutes, seconds);
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
            dateString = (new Buffer(this.value)).toString("utf-8");
        }
        const match = generalizedTimeRegex.exec(dateString);
        if (match === null)
            throw new ASN1Error("Malformed GeneralizedTime string.");
        if (match.groups === undefined)
            throw new ASN1Error("Malformed GeneralizedTime string.");
        const ret = new Date();
        const year = Number(match.groups.year);
        const month = (Number(match.groups.month) - 1);
        const date = Number(match.groups.date);
        const hours = Number(match.groups.hour);
        const minutes = Number(match.groups.minute);
        const seconds = Number(match.groups.second);
        ber_BERElement.validateDateTime("GeneralizedTime", year, month, date, hours, minutes, seconds);
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
                throw new ASN1CharactersError("GraphicString, VisibleString, or ObjectDescriptor " +
                    "can only contain characters between 0x20 and 0x7E.");
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
            ret = (new Buffer(this.value)).toString("utf-8");
        }
        for (let i = 0; i < ret.length; i++) {
            const characterCode = ret.charCodeAt(i);
            if (characterCode < 0x20 || characterCode > 0x7E) {
                throw new ASN1CharactersError("GraphicString, VisibleString, or ObjectDescriptor " +
                    "can only contain characters between 0x20 and 0x7E.");
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
            if (value.charCodeAt(i) > 0x7F)
                throw new ASN1CharactersError("GeneralString can only contain ASCII characters.");
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
            ret = (new Buffer(this.value)).toString("ascii");
        }
        for (let i = 0; i < ret.length; i++) {
            if (ret.charCodeAt(i) > 0x7F)
                throw new ASN1CharactersError("GeneralString can only contain ASCII characters.");
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
        if (valueBytes.length % 4)
            throw new ASN1Error("UniversalString encoded on non-mulitple of four bytes.");
        let ret = "";
        for (let i = 0; i < valueBytes.length; i += 4) {
            ret += String.fromCharCode((valueBytes[i + 0] << 24) +
                (valueBytes[i + 1] << 16) +
                (valueBytes[i + 2] << 8) +
                (valueBytes[i + 3] << 0));
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
            throw new ASN1Error("BMPString encoded on non-mulitple of two bytes.");
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
            ret = (new Buffer(swappedEndianness)).toString("utf-16le");
        }
        return ret;
    }
    fromBytes(bytes) {
        if (bytes.length < 2)
            throw new ASN1TruncationError("Tried to decode a BER element that is less than two bytes.");
        if ((this.recursionCount + 1) > ber_BERElement.nestingRecursionLimit)
            throw new ASN1RecursionError();
        let cursor = 0;
        switch (bytes[cursor] & 0b11000000) {
            case (0b00000000):
                this.tagClass = 0;
                break;
            case (0b01000000):
                this.tagClass = 1;
                break;
            case (0b10000000):
                this.tagClass = 2;
                break;
            case (0b11000000):
                this.tagClass = 3;
                break;
            default: this.tagClass = 0;
        }
        this.construction = ((bytes[cursor] & 0b00100000) ?
            1 : 0);
        this.tagNumber = (bytes[cursor] & 0b00011111);
        cursor++;
        if (this.tagNumber >= 31) {
            if (bytes[cursor] === 0b10000000)
                throw new ASN1PaddingError("Leading padding byte on long tag number encoding.");
            this.tagNumber = 0;
            const limit = (((bytes.length - 1) >= 4) ? 4 : (bytes.length - 1));
            while (cursor < limit) {
                if (!(bytes[cursor++] & 0b10000000))
                    break;
            }
            if (bytes[cursor - 1] & 0b10000000) {
                if (limit === bytes.length - 1) {
                    throw new ASN1TruncationError("ASN.1 tag number appears to have been truncated.");
                }
                else
                    throw new ASN1OverflowError("ASN.1 tag number too large.");
            }
            for (let i = 1; i < cursor; i++) {
                this.tagNumber <<= 7;
                this.tagNumber |= (bytes[i] & 0x7F);
            }
            if (this.tagNumber <= 31)
                throw new ASN1Error("ASN.1 tag number could have been encoded in short form.");
        }
        if ((bytes[cursor] & 0b10000000) === 0b10000000) {
            const numberOfLengthOctets = (bytes[cursor] & 0x7F);
            if (numberOfLengthOctets) {
                if (numberOfLengthOctets === 0b01111111)
                    throw new ASN1UndefinedError("Length byte with undefined meaning encountered.");
                if (numberOfLengthOctets > 4)
                    throw new ASN1OverflowError("Element length too long to decode to an integer.");
                if (cursor + numberOfLengthOctets >= bytes.length)
                    throw new ASN1TruncationError("Element length bytes appear to have been truncated.");
                cursor++;
                const lengthNumberOctets = new Uint8Array(4);
                for (let i = numberOfLengthOctets; i > 0; i--) {
                    lengthNumberOctets[(4 - i)] = bytes[(cursor + numberOfLengthOctets - i)];
                }
                let length = 0;
                lengthNumberOctets.forEach(octet => {
                    length <<= 8;
                    length += octet;
                });
                if ((cursor + length) < cursor)
                    throw new ASN1OverflowError("ASN.1 element too large.");
                cursor += (numberOfLengthOctets);
                if ((cursor + length) > bytes.length)
                    throw new ASN1TruncationError("ASN.1 element truncated.");
                this.value = bytes.slice(cursor, (cursor + length));
                return (cursor + length);
            }
            else {
                if (this.construction !== 1)
                    throw new ASN1ConstructionError("Indefinite length ASN.1 element was not of constructed construction.");
                const startOfValue = ++cursor;
                let sentinel = cursor;
                while (sentinel < bytes.length) {
                    const child = new ber_BERElement();
                    child.recursionCount = (this.recursionCount + 1);
                    sentinel += child.fromBytes(bytes.slice(sentinel));
                    if (child.tagClass === 0 &&
                        child.construction === 0 &&
                        child.tagNumber === 0 &&
                        child.value.length === 0)
                        break;
                }
                if (sentinel === bytes.length && (bytes[sentinel - 1] !== 0x00 || bytes[sentinel - 2] !== 0x00))
                    throw new ASN1TruncationError("No END OF CONTENT element found at the end of indefinite length ASN.1 element.");
                this.value = bytes.slice(startOfValue, (sentinel - 2));
                return sentinel;
            }
        }
        else {
            const length = (bytes[cursor++] & 0x7F);
            if ((cursor + length) > bytes.length)
                throw new ASN1TruncationError("ASN.1 element was truncated.");
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
            let encodedNumber = [];
            while (number !== 0) {
                encodedNumber.unshift(number & 0x7F);
                number >>>= 7;
                encodedNumber[0] |= 0b10000000;
            }
            encodedNumber[encodedNumber.length - 1] &= 0b01111111;
            tagBytes = tagBytes.concat(encodedNumber);
        }
        let lengthOctets = [0x00];
        switch (ber_BERElement.lengthEncodingPreference) {
            case (0): {
                if (this.value.length < 127) {
                    lengthOctets = [this.value.length];
                }
                else {
                    let length = this.value.length;
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
            case (1): {
                lengthOctets = [0b10000000];
                break;
            }
            default:
                throw new ASN1UndefinedError("Invalid LengthEncodingPreference encountered!");
        }
        const ret = new Uint8Array(tagBytes.length +
            lengthOctets.length +
            this.value.length +
            (ber_BERElement.lengthEncodingPreference === 1 ? 2 : 0));
        ret.set(tagBytes, 0);
        ret.set(lengthOctets, tagBytes.length);
        ret.set(this.value, (tagBytes.length + lengthOctets.length));
        return ret;
    }
    deconstruct(dataType) {
        if (this.construction === 0) {
            return this.value.subarray(0);
        }
        else {
            if ((this.recursionCount + 1) > ber_BERElement.nestingRecursionLimit)
                throw new ASN1RecursionError();
            let appendy = [];
            const substrings = this.sequence;
            substrings.forEach(substring => {
                if (substring.tagClass !== this.tagClass)
                    throw new ASN1ConstructionError(`Invalid tag class in recursively-encoded ${dataType}.`);
                if (substring.tagNumber !== this.tagNumber)
                    throw new ASN1ConstructionError(`Invalid tag class in recursively-encoded ${dataType}.`);
                substring.recursionCount = (this.recursionCount + 1);
                appendy = appendy.concat(substring.deconstruct(dataType));
            });
            let totalLength = 0;
            appendy.forEach(substring => {
                totalLength += substring.length;
            });
            const whole = new Uint8Array(totalLength);
            let currentIndex = 0;
            appendy.forEach(substring => {
                whole.set(substring, currentIndex);
                currentIndex += substring.length;
            });
            return whole;
        }
    }
}
ber_BERElement.lengthEncodingPreference = 0;

// CONCATENATED MODULE: ./source/codecs/der.ts




class der_DERElement extends x690_X690Element {
    set boolean(value) {
        this.value = new Uint8Array(1);
        this.value[0] = (value ? 0xFF : 0x00);
    }
    get boolean() {
        if (this.construction !== 0)
            throw new ASN1ConstructionError("BOOLEAN cannot be constructed.");
        if (this.value.length !== 1)
            throw new ASN1SizeError("BOOLEAN not one byte");
        if ((this.value[0] !== 0x00) && (this.value[0] !== 0xFF))
            throw new ASN1Error("BOOLEAN must be encoded as 0xFF or 0x00.");
        return (this.value[0] !== 0);
    }
    set bitString(value) {
        if (value.length === 0)
            this.value = new Uint8Array(0);
        let pre = [];
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
        if (this.construction !== 0)
            throw new ASN1ConstructionError("BIT STRING cannot be constructed.");
        if (this.value.length === 0)
            throw new ASN1Error("ASN.1 BIT STRING cannot be encoded on zero bytes!");
        if (this.value.length === 1 && this.value[0] !== 0)
            throw new ASN1Error("ASN.1 BIT STRING encoded with deceptive first byte!");
        if (this.value[0] > 7)
            throw new ASN1Error("First byte of an ASN.1 BIT STRING must be <= 7!");
        let ret = [];
        for (let i = 1; i < this.value.length; i++) {
            ret = ret.concat([
                (this.value[i] & 0b10000000 ? true : false),
                (this.value[i] & 0b01000000 ? true : false),
                (this.value[i] & 0b00100000 ? true : false),
                (this.value[i] & 0b00010000 ? true : false),
                (this.value[i] & 0b00001000 ? true : false),
                (this.value[i] & 0b00000100 ? true : false),
                (this.value[i] & 0b00000010 ? true : false),
                (this.value[i] & 0b00000001 ? true : false)
            ]);
        }
        ret.slice((ret.length - this.value[0])).forEach(bit => {
            if (bit)
                throw new ASN1Error("BIT STRING had a trailing set bit.");
        });
        ret.length -= this.value[0];
        return ret;
    }
    set octetString(value) {
        this.value = value.subarray(0);
    }
    get octetString() {
        if (this.construction !== 0)
            throw new ASN1ConstructionError("OCTET STRING cannot be constructed.");
        return this.value.subarray(0);
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
            this.value = new Uint8Array([66]);
            return;
        }
        else if (value === -0.0) {
            this.value = new Uint8Array([67]);
            return;
        }
        else if (value === Infinity) {
            this.value = new Uint8Array([64]);
            return;
        }
        else if (value === -Infinity) {
            this.value = new Uint8Array([65]);
            return;
        }
        let valueString = value.toFixed(7);
        valueString = (String.fromCharCode(0b00000011) + valueString);
        this.value = (new TextEncoder()).encode(valueString);
    }
    get real() {
        if (this.construction !== 0)
            throw new ASN1ConstructionError("REAL cannot be constructed.");
        if (this.value.length === 0)
            return 0.0;
        switch (this.value[0] & 0b11000000) {
            case (0b01000000): {
                if (this.value[0] === 66)
                    return NaN;
                if (this.value[0] === 67)
                    return -0.0;
                if (this.value[0] === 64)
                    return Infinity;
                if (this.value[0] === 65)
                    return -Infinity;
                throw new ASN1UndefinedError("Unrecognized special REAL value!");
            }
            case (0b00000000): {
                let realString;
                if (typeof TextEncoder !== "undefined") {
                    realString = (new TextDecoder("utf-8")).decode(this.value.slice(1));
                }
                else if (typeof Buffer !== "undefined") {
                    realString = (new Buffer(this.value.slice(1))).toString("utf-8");
                }
                else {
                    throw new ASN1Error("No ability to decode bytes to string!");
                }
                switch (this.value[0] & 0b00111111) {
                    case 1:
                    case 2:
                        throw new ASN1Error("DER prohibits NR1 and NR2 Base-10 REAL");
                    case 3: {
                        if (!nr3Regex.test(realString))
                            throw new ASN1Error("Malformed NR3 Base-10 REAL");
                        return parseFloat(realString.replace(",", "."));
                    }
                    default:
                        throw new ASN1UndefinedError("Undefined Base-10 REAL encoding.");
                }
            }
            case (0b10000000):
            case (0b11000000): {
                const sign = ((this.value[0] & 0b01000000) ? -1 : 1);
                const base = ((flag) => {
                    switch (flag) {
                        case (0): return 2;
                        case (16): return 8;
                        case (32): return 16;
                        default:
                            throw new ASN1Error("Impossible REAL encoding base encountered.");
                    }
                })(this.value[0] & 0b00110000);
                const scale = ((flag) => {
                    switch (flag) {
                        case (0): return 0;
                        case (4): return 1;
                        case (8): return 2;
                        case (12): return 3;
                        default:
                            throw new ASN1Error("Impossible REAL encoding scale encountered.");
                    }
                })(this.value[0] & 0b00001100);
                let exponent;
                let mantissa;
                switch (this.value[0] & 0b00000011) {
                    case (0b00000000): {
                        if (this.value.length < 3)
                            throw new ASN1TruncationError("Binary-encoded REAL truncated.");
                        exponent = asn1_ASN1Element.decodeSignedBigEndianInteger(this.value.subarray(1, 2));
                        mantissa = asn1_ASN1Element.decodeUnsignedBigEndianInteger(this.value.subarray(2));
                        break;
                    }
                    case (0b00000001): {
                        if (this.value.length < 4)
                            throw new ASN1TruncationError("Binary-encoded REAL truncated.");
                        exponent = asn1_ASN1Element.decodeSignedBigEndianInteger(this.value.subarray(1, 3));
                        mantissa = asn1_ASN1Element.decodeUnsignedBigEndianInteger(this.value.subarray(3));
                        if (exponent <= 127 && exponent >= -128)
                            throw new ASN1Error("DER-encoded binary-encoded REAL could have encoded exponent on fewer octets.");
                        break;
                    }
                    case (0b00000010):
                    case (0b00000011): {
                        throw new ASN1Error("DER-encoded binary REAL encoded in a way that would either overflow or encode on too many octets.");
                    }
                    default:
                        throw new ASN1Error("Impossible binary REAL exponent encoding encountered.");
                }
                if (mantissa !== 0 && !(mantissa % 2))
                    throw new ASN1Error("DER-encoded REAL may not have an even non-zero mantissa.");
                return (sign * mantissa * Math.pow(2, scale) * Math.pow(base, exponent));
            }
            default:
                throw new ASN1Error("Impossible REAL format encountered.");
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
        if (this.construction !== 0)
            throw new ASN1ConstructionError("UTF8String cannot be constructed.");
        let ret = "";
        if (typeof TextEncoder !== "undefined") {
            ret = (new TextDecoder("utf-8")).decode(this.value.subarray(0).buffer);
        }
        else if (typeof Buffer !== "undefined") {
            ret = (new Buffer(this.value)).toString("utf-8");
        }
        return ret;
    }
    set sequence(value) {
        let encodedElements = [];
        value.forEach(element => {
            encodedElements.push(element.toBytes());
        });
        let totalLength = 0;
        encodedElements.forEach(element => {
            totalLength += element.length;
        });
        const newValue = new Uint8Array(totalLength);
        let currentIndex = 0;
        encodedElements.forEach(element => {
            newValue.set(element, currentIndex);
            currentIndex += element.length;
        });
        this.value = newValue;
        this.construction = 1;
    }
    get sequence() {
        if (this.construction !== 1)
            throw new ASN1ConstructionError("SET or SEQUENCE cannot be primitively constructed.");
        let encodedElements = [];
        if (this.value.length === 0)
            return [];
        let i = 0;
        while (i < this.value.length) {
            const next = new der_DERElement();
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
                throw new ASN1CharactersError("NumericString can only contain characters 0 - 9 and space.");
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
        if (this.construction !== 0)
            throw new ASN1ConstructionError("NumericString cannot be constructed.");
        let ret = "";
        if (typeof TextEncoder !== "undefined") {
            ret = (new TextDecoder("utf-8")).decode(this.value.subarray(0).buffer);
        }
        else if (typeof Buffer !== "undefined") {
            ret = (new Buffer(this.value)).toString("utf-8");
        }
        for (let i = 0; i < ret.length; i++) {
            const characterCode = ret.charCodeAt(i);
            if (!((characterCode >= 0x30 && characterCode <= 0x39) || characterCode === 0x20)) {
                throw new ASN1CharactersError("NumericString can only contain characters 0 - 9 and space.");
            }
        }
        return ret;
    }
    set printableString(value) {
        for (let i = 0; i < value.length; i++) {
            if (printableStringCharacters.indexOf(value.charAt(i)) === -1) {
                throw new ASN1CharactersError(`PrintableString can only contain these characters: ${printableStringCharacters}`);
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
        if (this.construction !== 0)
            throw new ASN1ConstructionError("PrintableString cannot be constructed.");
        let ret = "";
        if (typeof TextEncoder !== "undefined") {
            ret = (new TextDecoder("utf-8")).decode(this.value.subarray(0).buffer);
        }
        else if (typeof Buffer !== "undefined") {
            ret = (new Buffer(this.value)).toString("utf-8");
        }
        for (let i = 0; i < ret.length; i++) {
            if (printableStringCharacters.indexOf(ret.charAt(i)) === -1) {
                throw new ASN1CharactersError(`PrintableString can only contain these characters: ${printableStringCharacters}`);
            }
        }
        return ret;
    }
    set teletexString(value) {
        this.value = value.subarray(0);
    }
    get teletexString() {
        return this.octetString;
    }
    set videotexString(value) {
        this.value = value.subarray(0);
    }
    get videotexString() {
        return this.octetString;
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
        if (this.construction !== 0)
            throw new ASN1ConstructionError("IA5String cannot be constructed.");
        let ret = "";
        if (typeof TextEncoder !== "undefined") {
            ret = (new TextDecoder("utf-8")).decode(this.value.subarray(0).buffer);
        }
        else if (typeof Buffer !== "undefined") {
            ret = (new Buffer(this.value)).toString("utf-8");
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
        if (this.construction !== 0)
            throw new ASN1ConstructionError("UTCTime cannot be constructed.");
        let dateString = "";
        if (typeof TextEncoder !== "undefined") {
            dateString = (new TextDecoder("utf-8")).decode(this.value.subarray(0).buffer);
        }
        else if (typeof Buffer !== "undefined") {
            dateString = (new Buffer(this.value)).toString("utf-8");
        }
        const match = utcTimeRegex.exec(dateString);
        if (match === null)
            throw new ASN1Error("Malformed UTCTime string.");
        if (match.groups === undefined)
            throw new ASN1Error("Malformed UTCTime string.");
        const ret = new Date();
        let year = Number(match.groups.year);
        year = (year < 70 ? (2000 + year) : (1900 + year));
        const month = (Number(match.groups.month) - 1);
        const date = Number(match.groups.date);
        const hours = Number(match.groups.hour);
        const minutes = Number(match.groups.minute);
        const seconds = Number(match.groups.second);
        der_DERElement.validateDateTime("UTCTime", year, month, date, hours, minutes, seconds);
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
        if (this.construction !== 0)
            throw new ASN1ConstructionError("GeneralizedTime cannot be constructed.");
        let dateString = "";
        if (typeof TextEncoder !== "undefined") {
            dateString = (new TextDecoder("utf-8")).decode(this.value.subarray(0).buffer);
        }
        else if (typeof Buffer !== "undefined") {
            dateString = (new Buffer(this.value)).toString("utf-8");
        }
        const match = generalizedTimeRegex.exec(dateString);
        if (match === null)
            throw new ASN1Error("Malformed GeneralizedTime string.");
        if (match.groups === undefined)
            throw new ASN1Error("Malformed GeneralizedTime string.");
        const ret = new Date();
        const year = Number(match.groups.year);
        const month = (Number(match.groups.month) - 1);
        const date = Number(match.groups.date);
        const hours = Number(match.groups.hour);
        const minutes = Number(match.groups.minute);
        const seconds = Number(match.groups.second);
        der_DERElement.validateDateTime("GeneralizedTime", year, month, date, hours, minutes, seconds);
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
                throw new ASN1CharactersError("GraphicString, VisibleString, or ObjectDescriptor " +
                    "can only contain characters between 0x20 and 0x7E.");
        }
        if (typeof TextEncoder !== "undefined") {
            this.value = (new TextEncoder()).encode(value);
        }
        else if (typeof Buffer !== "undefined") {
            this.value = Buffer.from(value, "utf-8");
        }
    }
    get graphicString() {
        if (this.construction !== 0)
            throw new ASN1ConstructionError("GraphicString cannot be constructed.");
        let ret = "";
        if (typeof TextEncoder !== "undefined") {
            ret = (new TextDecoder("utf-8")).decode(this.value.subarray(0).buffer);
        }
        else if (typeof Buffer !== "undefined") {
            ret = (new Buffer(this.value)).toString("utf-8");
        }
        for (let i = 0; i < ret.length; i++) {
            const characterCode = ret.charCodeAt(i);
            if (characterCode < 0x20 || characterCode > 0x7E) {
                throw new ASN1CharactersError("GraphicString, VisibleString, or ObjectDescriptor " +
                    "can only contain characters between 0x20 and 0x7E.");
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
            if (value.charCodeAt(i) > 0x7F)
                throw new ASN1CharactersError("GeneralString can only contain ASCII characters.");
        }
        if (typeof TextEncoder !== "undefined") {
            this.value = (new TextEncoder()).encode(value);
        }
        else if (typeof Buffer !== "undefined") {
            this.value = Buffer.from(value, "ascii");
        }
    }
    get generalString() {
        if (this.construction !== 0)
            throw new ASN1ConstructionError("GeneralString cannot be constructed.");
        let ret = "";
        if (typeof TextEncoder !== "undefined") {
            ret = (new TextDecoder("windows-1252")).decode(this.value.subarray(0).buffer);
        }
        else if (typeof Buffer !== "undefined") {
            ret = (new Buffer(this.value)).toString("ascii");
        }
        for (let i = 0; i < ret.length; i++) {
            if (ret.charCodeAt(i) > 0x7F)
                throw new ASN1CharactersError("GeneralString can only contain ASCII characters.");
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
        if (this.construction !== 0)
            throw new ASN1ConstructionError("UniversalString cannot be constructed.");
        if (this.value.length % 4)
            throw new ASN1Error("UniversalString encoded on non-mulitple of four bytes.");
        let ret = "";
        for (let i = 0; i < this.value.length; i += 4) {
            ret += String.fromCharCode((this.value[i + 0] << 24) +
                (this.value[i + 1] << 16) +
                (this.value[i + 2] << 8) +
                (this.value[i + 3] << 0));
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
        if (this.construction !== 0)
            throw new ASN1ConstructionError("BMPString cannot be constructed.");
        if (this.value.length % 2)
            throw new ASN1Error("BMPString encoded on non-mulitple of two bytes.");
        let ret = "";
        if (typeof TextEncoder !== "undefined") {
            ret = (new TextDecoder("utf-16be")).decode(this.value.subarray(0).buffer);
        }
        else if (typeof Buffer !== "undefined") {
            const swappedEndianness = new Uint8Array(this.value.length);
            for (let i = 0; i < this.value.length; i += 2) {
                swappedEndianness[i] = this.value[i + 1];
                swappedEndianness[i + 1] = this.value[i];
            }
            ret = (new Buffer(swappedEndianness)).toString("utf-16le");
        }
        return ret;
    }
    constructor(tagClass = 0, construction = 0, tagNumber = 0) {
        super();
        this.tagClass = tagClass;
        this.construction = construction;
        this.tagNumber = tagNumber;
        this.value = new Uint8Array(0);
    }
    fromBytes(bytes) {
        if (bytes.length < 2)
            throw new ASN1TruncationError("Tried to decode a DER element that is less than two bytes.");
        if ((this.recursionCount + 1) > der_DERElement.nestingRecursionLimit)
            throw new ASN1RecursionError();
        let cursor = 0;
        switch (bytes[cursor] & 0b11000000) {
            case (0b00000000):
                this.tagClass = 0;
                break;
            case (0b01000000):
                this.tagClass = 1;
                break;
            case (0b10000000):
                this.tagClass = 2;
                break;
            case (0b11000000):
                this.tagClass = 3;
                break;
            default: this.tagClass = 0;
        }
        this.construction = ((bytes[cursor] & 0b00100000) ?
            1 : 0);
        this.tagNumber = (bytes[cursor] & 0b00011111);
        cursor++;
        if (this.tagNumber >= 31) {
            if (bytes[cursor] === 0b10000000)
                throw new ASN1PaddingError("Leading padding byte on long tag number encoding.");
            this.tagNumber = 0;
            const limit = (((bytes.length - 1) >= 4) ? 4 : (bytes.length - 1));
            while (cursor < limit) {
                if (!(bytes[cursor++] & 0b10000000))
                    break;
            }
            if (bytes[cursor - 1] & 0b10000000) {
                if (limit === bytes.length - 1) {
                    throw new ASN1TruncationError("ASN.1 tag number appears to have been truncated.");
                }
                else
                    throw new ASN1OverflowError("ASN.1 tag number too large.");
            }
            for (let i = 1; i < cursor; i++) {
                this.tagNumber <<= 7;
                this.tagNumber |= (bytes[i] & 0x7F);
            }
            if (this.tagNumber <= 31)
                throw new ASN1Error("ASN.1 tag number could have been encoded in short form.");
        }
        if ((bytes[cursor] & 0b10000000) === 0b10000000) {
            const numberOfLengthOctets = (bytes[cursor] & 0x7F);
            if (numberOfLengthOctets === 0b01111111)
                throw new ASN1UndefinedError("Length byte with undefined meaning encountered.");
            if (numberOfLengthOctets > 4)
                throw new ASN1OverflowError("Element length too long to decode to an integer.");
            if (cursor + numberOfLengthOctets >= bytes.length)
                throw new ASN1TruncationError("Element length bytes appear to have been truncated.");
            cursor++;
            const lengthNumberOctets = new Uint8Array(4);
            for (let i = numberOfLengthOctets; i > 0; i--) {
                lengthNumberOctets[(4 - i)] = bytes[(cursor + numberOfLengthOctets - i)];
            }
            let length = 0;
            lengthNumberOctets.forEach(octet => {
                length <<= 8;
                length += octet;
            });
            if ((cursor + length) < cursor)
                throw new ASN1OverflowError("ASN.1 element too large.");
            cursor += (numberOfLengthOctets);
            if ((cursor + length) > bytes.length)
                throw new ASN1TruncationError("ASN.1 element truncated.");
            if (((length <= 127 && length >= -128) && numberOfLengthOctets > 1) ||
                ((length <= 32767 && length >= -32768) && numberOfLengthOctets > 2) ||
                ((length <= 8388607 && length >= -8388608) && numberOfLengthOctets > 3))
                throw new ASN1PaddingError("DER-encoded long-form length encoded on more octets than necessary");
            this.value = bytes.slice(cursor, (cursor + length));
            return (cursor + length);
        }
        else {
            const length = (bytes[cursor++] & 0x7F);
            if ((cursor + length) > bytes.length)
                throw new ASN1TruncationError("ASN.1 element was truncated.");
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
            let encodedNumber = [];
            while (number !== 0) {
                encodedNumber.unshift(number & 0x7F);
                number >>>= 7;
                encodedNumber[0] |= 0b10000000;
            }
            encodedNumber[encodedNumber.length - 1] &= 0b01111111;
            tagBytes = tagBytes.concat(encodedNumber);
        }
        let lengthOctets = [0x00];
        if (this.value.length < 127) {
            lengthOctets = [this.value.length];
        }
        else {
            let length = this.value.length;
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
        const ret = new Uint8Array(tagBytes.length +
            lengthOctets.length +
            this.value.length);
        ret.set(tagBytes, 0);
        ret.set(lengthOctets, tagBytes.length);
        ret.set(this.value, (tagBytes.length + lengthOctets.length));
        return ret;
    }
}

// CONCATENATED MODULE: ./source/index.ts
/* concated harmony reexport ASN1Element */__webpack_require__.d(__webpack_exports__, "ASN1Element", function() { return asn1_ASN1Element; });
/* concated harmony reexport BERElement */__webpack_require__.d(__webpack_exports__, "BERElement", function() { return ber_BERElement; });
/* concated harmony reexport DERElement */__webpack_require__.d(__webpack_exports__, "DERElement", function() { return der_DERElement; });
/* concated harmony reexport ASN1Error */__webpack_require__.d(__webpack_exports__, "ASN1Error", function() { return ASN1Error; });
/* concated harmony reexport ASN1NotImplementedError */__webpack_require__.d(__webpack_exports__, "ASN1NotImplementedError", function() { return ASN1NotImplementedError; });
/* concated harmony reexport ASN1RecursionError */__webpack_require__.d(__webpack_exports__, "ASN1RecursionError", function() { return ASN1RecursionError; });
/* concated harmony reexport ASN1TruncationError */__webpack_require__.d(__webpack_exports__, "ASN1TruncationError", function() { return ASN1TruncationError; });
/* concated harmony reexport ASN1OverflowError */__webpack_require__.d(__webpack_exports__, "ASN1OverflowError", function() { return ASN1OverflowError; });
/* concated harmony reexport ASN1SizeError */__webpack_require__.d(__webpack_exports__, "ASN1SizeError", function() { return ASN1SizeError; });
/* concated harmony reexport ASN1PaddingError */__webpack_require__.d(__webpack_exports__, "ASN1PaddingError", function() { return ASN1PaddingError; });
/* concated harmony reexport ASN1UndefinedError */__webpack_require__.d(__webpack_exports__, "ASN1UndefinedError", function() { return ASN1UndefinedError; });
/* concated harmony reexport ASN1CharactersError */__webpack_require__.d(__webpack_exports__, "ASN1CharactersError", function() { return ASN1CharactersError; });
/* concated harmony reexport ASN1ConstructionError */__webpack_require__.d(__webpack_exports__, "ASN1ConstructionError", function() { return ASN1ConstructionError; });
/* concated harmony reexport ObjectIdentifier */__webpack_require__.d(__webpack_exports__, "ObjectIdentifier", function() { return ObjectIdentifier; });
/* concated harmony reexport MAX_UINT_32 */__webpack_require__.d(__webpack_exports__, "MAX_UINT_32", function() { return MAX_UINT_32; });
/* concated harmony reexport MIN_UINT_32 */__webpack_require__.d(__webpack_exports__, "MIN_UINT_32", function() { return MIN_UINT_32; });
/* concated harmony reexport MAX_SINT_32 */__webpack_require__.d(__webpack_exports__, "MAX_SINT_32", function() { return MAX_SINT_32; });
/* concated harmony reexport MIN_SINT_32 */__webpack_require__.d(__webpack_exports__, "MIN_SINT_32", function() { return MIN_SINT_32; });
/* concated harmony reexport ASN1TagClass */__webpack_require__.d(__webpack_exports__, "ASN1TagClass", function() { return ASN1TagClass; });
/* concated harmony reexport ASN1Construction */__webpack_require__.d(__webpack_exports__, "ASN1Construction", function() { return ASN1Construction; });
/* concated harmony reexport LengthEncodingPreference */__webpack_require__.d(__webpack_exports__, "LengthEncodingPreference", function() { return LengthEncodingPreference; });
/* concated harmony reexport ASN1SpecialRealValue */__webpack_require__.d(__webpack_exports__, "ASN1SpecialRealValue", function() { return ASN1SpecialRealValue; });
/* concated harmony reexport ASN1RealEncodingBase */__webpack_require__.d(__webpack_exports__, "ASN1RealEncodingBase", function() { return ASN1RealEncodingBase; });
/* concated harmony reexport ASN1RealEncodingScale */__webpack_require__.d(__webpack_exports__, "ASN1RealEncodingScale", function() { return ASN1RealEncodingScale; });
/* concated harmony reexport ASN1UniversalType */__webpack_require__.d(__webpack_exports__, "ASN1UniversalType", function() { return ASN1UniversalType; });
/* concated harmony reexport printableStringCharacters */__webpack_require__.d(__webpack_exports__, "printableStringCharacters", function() { return printableStringCharacters; });
/* concated harmony reexport utcTimeRegex */__webpack_require__.d(__webpack_exports__, "utcTimeRegex", function() { return utcTimeRegex; });
/* concated harmony reexport distinguishedUTCTimeRegex */__webpack_require__.d(__webpack_exports__, "distinguishedUTCTimeRegex", function() { return distinguishedUTCTimeRegex; });
/* concated harmony reexport generalizedTimeRegex */__webpack_require__.d(__webpack_exports__, "generalizedTimeRegex", function() { return generalizedTimeRegex; });
/* concated harmony reexport distinguishedGeneralizedTimeRegex */__webpack_require__.d(__webpack_exports__, "distinguishedGeneralizedTimeRegex", function() { return distinguishedGeneralizedTimeRegex; });
/* concated harmony reexport nr1Regex */__webpack_require__.d(__webpack_exports__, "nr1Regex", function() { return nr1Regex; });
/* concated harmony reexport nr2Regex */__webpack_require__.d(__webpack_exports__, "nr2Regex", function() { return nr2Regex; });
/* concated harmony reexport nr3Regex */__webpack_require__.d(__webpack_exports__, "nr3Regex", function() { return nr3Regex; });
/* concated harmony reexport canonicalNR3Regex */__webpack_require__.d(__webpack_exports__, "canonicalNR3Regex", function() { return canonicalNR3Regex; });
/* concated harmony reexport distinguishedNR3Regex */__webpack_require__.d(__webpack_exports__, "distinguishedNR3Regex", function() { return distinguishedNR3Regex; });
/* concated harmony reexport CANONICAL_TAG_CLASS_ORDERING */__webpack_require__.d(__webpack_exports__, "CANONICAL_TAG_CLASS_ORDERING", function() { return CANONICAL_TAG_CLASS_ORDERING; });








/***/ })
/******/ ]);