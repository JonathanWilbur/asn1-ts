var asn1 =
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
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
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
/******/ 	return __webpack_require__(__webpack_require__.s = 10);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "c", function() { return ASN1Error; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "d", function() { return ASN1NotImplementedError; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "g", function() { return ASN1RecursionError; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "i", function() { return ASN1TruncationError; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "e", function() { return ASN1OverflowError; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "h", function() { return ASN1SizeError; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "f", function() { return ASN1PaddingError; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "j", function() { return ASN1UndefinedError; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return ASN1CharactersError; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "b", function() { return ASN1ConstructionError; });
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


/***/ }),
/* 1 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "j", function() { return MAX_UINT_32; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "l", function() { return MIN_UINT_32; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "i", function() { return MAX_SINT_32; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "k", function() { return MIN_SINT_32; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "e", function() { return ASN1TagClass; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return ASN1Construction; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "h", function() { return LengthEncodingPreference; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "d", function() { return ASN1SpecialRealValue; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "b", function() { return ASN1RealEncodingBase; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "c", function() { return ASN1RealEncodingScale; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "f", function() { return ASN1UniversalType; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "u", function() { return printableStringCharacters; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "v", function() { return utcTimeRegex; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "p", function() { return distinguishedUTCTimeRegex; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "q", function() { return generalizedTimeRegex; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "n", function() { return distinguishedGeneralizedTimeRegex; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "r", function() { return nr1Regex; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "s", function() { return nr2Regex; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "t", function() { return nr3Regex; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "m", function() { return canonicalNR3Regex; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "o", function() { return distinguishedNR3Regex; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "g", function() { return CANONICAL_TAG_CLASS_ORDERING; });
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


/***/ }),
/* 2 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return ASN1Element; });
/* harmony import */ var _errors__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(0);

class ASN1Element {
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
                    throw new _errors__WEBPACK_IMPORTED_MODULE_0__[/* ASN1Error */ "c"](`Day > 31 encountered in ${dataType} with 31-day month.`);
                break;
            case 3:
            case 5:
            case 8:
            case 10:
                if (date > 30)
                    throw new _errors__WEBPACK_IMPORTED_MODULE_0__[/* ASN1Error */ "c"](`Day > 31 encountered in ${dataType} with 30-day month.`);
                break;
            case 1:
                let isLeapYear = ((year % 4 === 0) && (year % 100 !== 0)) || (year % 400 === 0);
                if (isLeapYear) {
                    if (date > 29)
                        throw new _errors__WEBPACK_IMPORTED_MODULE_0__[/* ASN1Error */ "c"](`Day > 29 encountered in ${dataType} with month of February in leap year.`);
                }
                else {
                    if (date > 28)
                        throw new _errors__WEBPACK_IMPORTED_MODULE_0__[/* ASN1Error */ "c"](`Day > 28 encountered in ${dataType} with month of February and non leap year.`);
                }
                break;
            default:
                throw new _errors__WEBPACK_IMPORTED_MODULE_0__[/* ASN1Error */ "c"](`Month greater than 12 encountered in ${dataType}.`);
        }
        if (hours > 23)
            throw new _errors__WEBPACK_IMPORTED_MODULE_0__[/* ASN1Error */ "c"](`Hours > 23 encountered in ${dataType}.`);
        if (minutes > 59)
            throw new _errors__WEBPACK_IMPORTED_MODULE_0__[/* ASN1Error */ "c"](`Minutes > 60 encountered in ${dataType}.`);
        if (seconds > 59)
            throw new _errors__WEBPACK_IMPORTED_MODULE_0__[/* ASN1Error */ "c"](`Seconds > 60 encountered in ${dataType}.`);
    }
    static decodeUnsignedBigEndianInteger(value) {
        if (value.length === 0)
            return 0;
        if (value.length > 4)
            throw new _errors__WEBPACK_IMPORTED_MODULE_0__[/* ASN1OverflowError */ "e"]("Number too long to decode.");
        const u8 = new Uint8Array(4);
        u8.set(value, (4 - value.length));
        return new Uint32Array(u8.reverse().buffer)[0];
    }
    static decodeSignedBigEndianInteger(value) {
        if (value.length === 0)
            return 0;
        if (value.length > 4)
            throw new _errors__WEBPACK_IMPORTED_MODULE_0__[/* ASN1OverflowError */ "e"]("Number too long to decode.");
        const u8 = new Uint8Array(4);
        if (value[0] >= 0b10000000)
            u8.fill(0xFF);
        u8.set(value, (4 - value.length));
        return new Int32Array(u8.reverse().buffer)[0];
    }
}
ASN1Element.nestingRecursionLimit = 5;


/***/ }),
/* 3 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return ObjectIdentifier; });
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


/***/ }),
/* 4 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return X690Element; });
/* harmony import */ var _asn1__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(2);
/* harmony import */ var _errors__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(0);
/* harmony import */ var _types_objectidentifier__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(3);
/* harmony import */ var _values__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(1);
/* harmony import */ var util__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(5);
/* harmony import */ var util__WEBPACK_IMPORTED_MODULE_4___default = /*#__PURE__*/__webpack_require__.n(util__WEBPACK_IMPORTED_MODULE_4__);





class X690Element extends _asn1__WEBPACK_IMPORTED_MODULE_0__[/* ASN1Element */ "a"] {
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
        if (value < _values__WEBPACK_IMPORTED_MODULE_3__[/* MIN_SINT_32 */ "k"])
            throw new _errors__WEBPACK_IMPORTED_MODULE_1__[/* ASN1OverflowError */ "e"](`Number ${value} too small to be converted.`);
        if (value > _values__WEBPACK_IMPORTED_MODULE_3__[/* MAX_SINT_32 */ "i"])
            throw new _errors__WEBPACK_IMPORTED_MODULE_1__[/* ASN1OverflowError */ "e"](`Number ${value} too big to be converted.`);
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
            throw new _errors__WEBPACK_IMPORTED_MODULE_1__[/* ASN1ConstructionError */ "b"]("INTEGER cannot be constructed.");
        if (this.value.length === 0)
            throw new _errors__WEBPACK_IMPORTED_MODULE_1__[/* ASN1SizeError */ "h"]("Number encoded on zero bytes!");
        if (this.value.length > 4)
            throw new _errors__WEBPACK_IMPORTED_MODULE_1__[/* ASN1OverflowError */ "e"]("Number too long to decode.");
        if (this.value.length > 2 &&
            ((this.value[0] === 0xFF && this.value[1] >= 0b10000000) ||
                (this.value[0] === 0x00 && this.value[1] < 0b10000000)))
            throw new _errors__WEBPACK_IMPORTED_MODULE_1__[/* ASN1PaddingError */ "f"]("Unnecessary padding bytes on INTEGER or ENUMERATED.");
        return _asn1__WEBPACK_IMPORTED_MODULE_0__[/* ASN1Element */ "a"].decodeSignedBigEndianInteger(this.value.subarray(0));
    }
    set objectIdentifier(value) {
        const numbers = value.nodes;
        let pre = [((numbers[0] * 40) + numbers[1])];
        let post = X690Element.encodeObjectIdentifierNodes(numbers.slice(2));
        this.value = new Uint8Array(pre.concat(post));
    }
    get objectIdentifier() {
        if (this.construction !== 0)
            throw new _errors__WEBPACK_IMPORTED_MODULE_1__[/* ASN1ConstructionError */ "b"]("OBJECT IDENTIFIER cannot be constructed.");
        if (this.value.length === 0)
            throw new _errors__WEBPACK_IMPORTED_MODULE_1__[/* ASN1TruncationError */ "i"]("Encoded value was too short to be an OBJECT IDENTIFIER!");
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
            return new _types_objectidentifier__WEBPACK_IMPORTED_MODULE_2__[/* ObjectIdentifier */ "a"](numbers);
        numbers = numbers.concat(X690Element.decodeObjectIdentifierNodes(this.value.slice(1)));
        return new _types_objectidentifier__WEBPACK_IMPORTED_MODULE_2__[/* ObjectIdentifier */ "a"](numbers);
    }
    set enumerated(value) {
        this.integer = value;
    }
    get enumerated() {
        return this.integer;
    }
    set relativeObjectIdentifier(value) {
        this.value = new Uint8Array(X690Element.encodeObjectIdentifierNodes(value));
    }
    get relativeObjectIdentifier() {
        if (this.construction !== 0)
            throw new _errors__WEBPACK_IMPORTED_MODULE_1__[/* ASN1ConstructionError */ "b"]("Relative OID cannot be constructed.");
        return X690Element.decodeObjectIdentifierNodes(this.value.slice(0));
    }
    static decodeObjectIdentifierNodes(value) {
        if (value.length === 0)
            return [];
        let numbers = [];
        if (value.length > 0 && (value[(value.length - 1)] & 0b10000000) === 0b10000000)
            throw new _errors__WEBPACK_IMPORTED_MODULE_1__[/* ASN1TruncationError */ "i"]("OID truncated");
        let components = 0;
        value.forEach(b => { if (!(b & 0b10000000))
            components++; });
        numbers.length = components;
        let currentNumber = 0;
        let bytesUsedInCurrentNumber = 0;
        value.forEach(b => {
            if (bytesUsedInCurrentNumber === 0 && b === 0b10000000)
                throw new _errors__WEBPACK_IMPORTED_MODULE_1__[/* ASN1PaddingError */ "f"]("OID had invalid padding byte.");
            if (numbers[currentNumber] > (Number.MAX_SAFE_INTEGER >>> 7))
                throw new _errors__WEBPACK_IMPORTED_MODULE_1__[/* ASN1OverflowError */ "e"]("OID node too big");
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
            if (!Object(util__WEBPACK_IMPORTED_MODULE_4__["isNull"])(previousTagClass) &&
                element.tagClass !== previousTagClass &&
                _values__WEBPACK_IMPORTED_MODULE_3__[/* CANONICAL_TAG_CLASS_ORDERING */ "g"].indexOf(element.tagClass) <=
                    _values__WEBPACK_IMPORTED_MODULE_3__[/* CANONICAL_TAG_CLASS_ORDERING */ "g"].indexOf(previousTagClass))
                return false;
            if (element.tagClass !== previousTagClass)
                previousTagNumber = null;
            if (!Object(util__WEBPACK_IMPORTED_MODULE_4__["isNull"])(previousTagNumber) && element.tagNumber < previousTagNumber)
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


/***/ }),
/* 5 */
/***/ (function(module, exports, __webpack_require__) {

/* WEBPACK VAR INJECTION */(function(global, process) {// Copyright Joyent, Inc. and other Node contributors.
//
// Permission is hereby granted, free of charge, to any person obtaining a
// copy of this software and associated documentation files (the
// "Software"), to deal in the Software without restriction, including
// without limitation the rights to use, copy, modify, merge, publish,
// distribute, sublicense, and/or sell copies of the Software, and to permit
// persons to whom the Software is furnished to do so, subject to the
// following conditions:
//
// The above copyright notice and this permission notice shall be included
// in all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
// USE OR OTHER DEALINGS IN THE SOFTWARE.

var formatRegExp = /%[sdj%]/g;
exports.format = function(f) {
  if (!isString(f)) {
    var objects = [];
    for (var i = 0; i < arguments.length; i++) {
      objects.push(inspect(arguments[i]));
    }
    return objects.join(' ');
  }

  var i = 1;
  var args = arguments;
  var len = args.length;
  var str = String(f).replace(formatRegExp, function(x) {
    if (x === '%%') return '%';
    if (i >= len) return x;
    switch (x) {
      case '%s': return String(args[i++]);
      case '%d': return Number(args[i++]);
      case '%j':
        try {
          return JSON.stringify(args[i++]);
        } catch (_) {
          return '[Circular]';
        }
      default:
        return x;
    }
  });
  for (var x = args[i]; i < len; x = args[++i]) {
    if (isNull(x) || !isObject(x)) {
      str += ' ' + x;
    } else {
      str += ' ' + inspect(x);
    }
  }
  return str;
};


// Mark that a method should not be used.
// Returns a modified function which warns once by default.
// If --no-deprecation is set, then it is a no-op.
exports.deprecate = function(fn, msg) {
  // Allow for deprecating things in the process of starting up.
  if (isUndefined(global.process)) {
    return function() {
      return exports.deprecate(fn, msg).apply(this, arguments);
    };
  }

  if (process.noDeprecation === true) {
    return fn;
  }

  var warned = false;
  function deprecated() {
    if (!warned) {
      if (process.throwDeprecation) {
        throw new Error(msg);
      } else if (process.traceDeprecation) {
        console.trace(msg);
      } else {
        console.error(msg);
      }
      warned = true;
    }
    return fn.apply(this, arguments);
  }

  return deprecated;
};


var debugs = {};
var debugEnviron;
exports.debuglog = function(set) {
  if (isUndefined(debugEnviron))
    debugEnviron = process.env.NODE_DEBUG || '';
  set = set.toUpperCase();
  if (!debugs[set]) {
    if (new RegExp('\\b' + set + '\\b', 'i').test(debugEnviron)) {
      var pid = process.pid;
      debugs[set] = function() {
        var msg = exports.format.apply(exports, arguments);
        console.error('%s %d: %s', set, pid, msg);
      };
    } else {
      debugs[set] = function() {};
    }
  }
  return debugs[set];
};


/**
 * Echos the value of a value. Trys to print the value out
 * in the best way possible given the different types.
 *
 * @param {Object} obj The object to print out.
 * @param {Object} opts Optional options object that alters the output.
 */
/* legacy: obj, showHidden, depth, colors*/
function inspect(obj, opts) {
  // default options
  var ctx = {
    seen: [],
    stylize: stylizeNoColor
  };
  // legacy...
  if (arguments.length >= 3) ctx.depth = arguments[2];
  if (arguments.length >= 4) ctx.colors = arguments[3];
  if (isBoolean(opts)) {
    // legacy...
    ctx.showHidden = opts;
  } else if (opts) {
    // got an "options" object
    exports._extend(ctx, opts);
  }
  // set default options
  if (isUndefined(ctx.showHidden)) ctx.showHidden = false;
  if (isUndefined(ctx.depth)) ctx.depth = 2;
  if (isUndefined(ctx.colors)) ctx.colors = false;
  if (isUndefined(ctx.customInspect)) ctx.customInspect = true;
  if (ctx.colors) ctx.stylize = stylizeWithColor;
  return formatValue(ctx, obj, ctx.depth);
}
exports.inspect = inspect;


// http://en.wikipedia.org/wiki/ANSI_escape_code#graphics
inspect.colors = {
  'bold' : [1, 22],
  'italic' : [3, 23],
  'underline' : [4, 24],
  'inverse' : [7, 27],
  'white' : [37, 39],
  'grey' : [90, 39],
  'black' : [30, 39],
  'blue' : [34, 39],
  'cyan' : [36, 39],
  'green' : [32, 39],
  'magenta' : [35, 39],
  'red' : [31, 39],
  'yellow' : [33, 39]
};

// Don't use 'blue' not visible on cmd.exe
inspect.styles = {
  'special': 'cyan',
  'number': 'yellow',
  'boolean': 'yellow',
  'undefined': 'grey',
  'null': 'bold',
  'string': 'green',
  'date': 'magenta',
  // "name": intentionally not styling
  'regexp': 'red'
};


function stylizeWithColor(str, styleType) {
  var style = inspect.styles[styleType];

  if (style) {
    return '\u001b[' + inspect.colors[style][0] + 'm' + str +
           '\u001b[' + inspect.colors[style][1] + 'm';
  } else {
    return str;
  }
}


function stylizeNoColor(str, styleType) {
  return str;
}


function arrayToHash(array) {
  var hash = {};

  array.forEach(function(val, idx) {
    hash[val] = true;
  });

  return hash;
}


function formatValue(ctx, value, recurseTimes) {
  // Provide a hook for user-specified inspect functions.
  // Check that value is an object with an inspect function on it
  if (ctx.customInspect &&
      value &&
      isFunction(value.inspect) &&
      // Filter out the util module, it's inspect function is special
      value.inspect !== exports.inspect &&
      // Also filter out any prototype objects using the circular check.
      !(value.constructor && value.constructor.prototype === value)) {
    var ret = value.inspect(recurseTimes, ctx);
    if (!isString(ret)) {
      ret = formatValue(ctx, ret, recurseTimes);
    }
    return ret;
  }

  // Primitive types cannot have properties
  var primitive = formatPrimitive(ctx, value);
  if (primitive) {
    return primitive;
  }

  // Look up the keys of the object.
  var keys = Object.keys(value);
  var visibleKeys = arrayToHash(keys);

  if (ctx.showHidden) {
    keys = Object.getOwnPropertyNames(value);
  }

  // IE doesn't make error fields non-enumerable
  // http://msdn.microsoft.com/en-us/library/ie/dww52sbt(v=vs.94).aspx
  if (isError(value)
      && (keys.indexOf('message') >= 0 || keys.indexOf('description') >= 0)) {
    return formatError(value);
  }

  // Some type of object without properties can be shortcutted.
  if (keys.length === 0) {
    if (isFunction(value)) {
      var name = value.name ? ': ' + value.name : '';
      return ctx.stylize('[Function' + name + ']', 'special');
    }
    if (isRegExp(value)) {
      return ctx.stylize(RegExp.prototype.toString.call(value), 'regexp');
    }
    if (isDate(value)) {
      return ctx.stylize(Date.prototype.toString.call(value), 'date');
    }
    if (isError(value)) {
      return formatError(value);
    }
  }

  var base = '', array = false, braces = ['{', '}'];

  // Make Array say that they are Array
  if (isArray(value)) {
    array = true;
    braces = ['[', ']'];
  }

  // Make functions say that they are functions
  if (isFunction(value)) {
    var n = value.name ? ': ' + value.name : '';
    base = ' [Function' + n + ']';
  }

  // Make RegExps say that they are RegExps
  if (isRegExp(value)) {
    base = ' ' + RegExp.prototype.toString.call(value);
  }

  // Make dates with properties first say the date
  if (isDate(value)) {
    base = ' ' + Date.prototype.toUTCString.call(value);
  }

  // Make error with message first say the error
  if (isError(value)) {
    base = ' ' + formatError(value);
  }

  if (keys.length === 0 && (!array || value.length == 0)) {
    return braces[0] + base + braces[1];
  }

  if (recurseTimes < 0) {
    if (isRegExp(value)) {
      return ctx.stylize(RegExp.prototype.toString.call(value), 'regexp');
    } else {
      return ctx.stylize('[Object]', 'special');
    }
  }

  ctx.seen.push(value);

  var output;
  if (array) {
    output = formatArray(ctx, value, recurseTimes, visibleKeys, keys);
  } else {
    output = keys.map(function(key) {
      return formatProperty(ctx, value, recurseTimes, visibleKeys, key, array);
    });
  }

  ctx.seen.pop();

  return reduceToSingleString(output, base, braces);
}


function formatPrimitive(ctx, value) {
  if (isUndefined(value))
    return ctx.stylize('undefined', 'undefined');
  if (isString(value)) {
    var simple = '\'' + JSON.stringify(value).replace(/^"|"$/g, '')
                                             .replace(/'/g, "\\'")
                                             .replace(/\\"/g, '"') + '\'';
    return ctx.stylize(simple, 'string');
  }
  if (isNumber(value))
    return ctx.stylize('' + value, 'number');
  if (isBoolean(value))
    return ctx.stylize('' + value, 'boolean');
  // For some reason typeof null is "object", so special case here.
  if (isNull(value))
    return ctx.stylize('null', 'null');
}


function formatError(value) {
  return '[' + Error.prototype.toString.call(value) + ']';
}


function formatArray(ctx, value, recurseTimes, visibleKeys, keys) {
  var output = [];
  for (var i = 0, l = value.length; i < l; ++i) {
    if (hasOwnProperty(value, String(i))) {
      output.push(formatProperty(ctx, value, recurseTimes, visibleKeys,
          String(i), true));
    } else {
      output.push('');
    }
  }
  keys.forEach(function(key) {
    if (!key.match(/^\d+$/)) {
      output.push(formatProperty(ctx, value, recurseTimes, visibleKeys,
          key, true));
    }
  });
  return output;
}


function formatProperty(ctx, value, recurseTimes, visibleKeys, key, array) {
  var name, str, desc;
  desc = Object.getOwnPropertyDescriptor(value, key) || { value: value[key] };
  if (desc.get) {
    if (desc.set) {
      str = ctx.stylize('[Getter/Setter]', 'special');
    } else {
      str = ctx.stylize('[Getter]', 'special');
    }
  } else {
    if (desc.set) {
      str = ctx.stylize('[Setter]', 'special');
    }
  }
  if (!hasOwnProperty(visibleKeys, key)) {
    name = '[' + key + ']';
  }
  if (!str) {
    if (ctx.seen.indexOf(desc.value) < 0) {
      if (isNull(recurseTimes)) {
        str = formatValue(ctx, desc.value, null);
      } else {
        str = formatValue(ctx, desc.value, recurseTimes - 1);
      }
      if (str.indexOf('\n') > -1) {
        if (array) {
          str = str.split('\n').map(function(line) {
            return '  ' + line;
          }).join('\n').substr(2);
        } else {
          str = '\n' + str.split('\n').map(function(line) {
            return '   ' + line;
          }).join('\n');
        }
      }
    } else {
      str = ctx.stylize('[Circular]', 'special');
    }
  }
  if (isUndefined(name)) {
    if (array && key.match(/^\d+$/)) {
      return str;
    }
    name = JSON.stringify('' + key);
    if (name.match(/^"([a-zA-Z_][a-zA-Z_0-9]*)"$/)) {
      name = name.substr(1, name.length - 2);
      name = ctx.stylize(name, 'name');
    } else {
      name = name.replace(/'/g, "\\'")
                 .replace(/\\"/g, '"')
                 .replace(/(^"|"$)/g, "'");
      name = ctx.stylize(name, 'string');
    }
  }

  return name + ': ' + str;
}


function reduceToSingleString(output, base, braces) {
  var numLinesEst = 0;
  var length = output.reduce(function(prev, cur) {
    numLinesEst++;
    if (cur.indexOf('\n') >= 0) numLinesEst++;
    return prev + cur.replace(/\u001b\[\d\d?m/g, '').length + 1;
  }, 0);

  if (length > 60) {
    return braces[0] +
           (base === '' ? '' : base + '\n ') +
           ' ' +
           output.join(',\n  ') +
           ' ' +
           braces[1];
  }

  return braces[0] + base + ' ' + output.join(', ') + ' ' + braces[1];
}


// NOTE: These type checking functions intentionally don't use `instanceof`
// because it is fragile and can be easily faked with `Object.create()`.
function isArray(ar) {
  return Array.isArray(ar);
}
exports.isArray = isArray;

function isBoolean(arg) {
  return typeof arg === 'boolean';
}
exports.isBoolean = isBoolean;

function isNull(arg) {
  return arg === null;
}
exports.isNull = isNull;

function isNullOrUndefined(arg) {
  return arg == null;
}
exports.isNullOrUndefined = isNullOrUndefined;

function isNumber(arg) {
  return typeof arg === 'number';
}
exports.isNumber = isNumber;

function isString(arg) {
  return typeof arg === 'string';
}
exports.isString = isString;

function isSymbol(arg) {
  return typeof arg === 'symbol';
}
exports.isSymbol = isSymbol;

function isUndefined(arg) {
  return arg === void 0;
}
exports.isUndefined = isUndefined;

function isRegExp(re) {
  return isObject(re) && objectToString(re) === '[object RegExp]';
}
exports.isRegExp = isRegExp;

function isObject(arg) {
  return typeof arg === 'object' && arg !== null;
}
exports.isObject = isObject;

function isDate(d) {
  return isObject(d) && objectToString(d) === '[object Date]';
}
exports.isDate = isDate;

function isError(e) {
  return isObject(e) &&
      (objectToString(e) === '[object Error]' || e instanceof Error);
}
exports.isError = isError;

function isFunction(arg) {
  return typeof arg === 'function';
}
exports.isFunction = isFunction;

function isPrimitive(arg) {
  return arg === null ||
         typeof arg === 'boolean' ||
         typeof arg === 'number' ||
         typeof arg === 'string' ||
         typeof arg === 'symbol' ||  // ES6 symbol
         typeof arg === 'undefined';
}
exports.isPrimitive = isPrimitive;

exports.isBuffer = __webpack_require__(15);

function objectToString(o) {
  return Object.prototype.toString.call(o);
}


function pad(n) {
  return n < 10 ? '0' + n.toString(10) : n.toString(10);
}


var months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep',
              'Oct', 'Nov', 'Dec'];

// 26 Feb 16:19:34
function timestamp() {
  var d = new Date();
  var time = [pad(d.getHours()),
              pad(d.getMinutes()),
              pad(d.getSeconds())].join(':');
  return [d.getDate(), months[d.getMonth()], time].join(' ');
}


// log is just a thin wrapper to console.log that prepends a timestamp
exports.log = function() {
  console.log('%s - %s', timestamp(), exports.format.apply(exports, arguments));
};


/**
 * Inherit the prototype methods from one constructor into another.
 *
 * The Function.prototype.inherits from lang.js rewritten as a standalone
 * function (not on Function.prototype). NOTE: If this file is to be loaded
 * during bootstrapping this function needs to be rewritten using some native
 * functions as prototype setup using normal JavaScript does not work as
 * expected during bootstrapping (see mirror.js in r114903).
 *
 * @param {function} ctor Constructor function which needs to inherit the
 *     prototype.
 * @param {function} superCtor Constructor function to inherit prototype from.
 */
exports.inherits = __webpack_require__(16);

exports._extend = function(origin, add) {
  // Don't do anything if add isn't an object
  if (!add || !isObject(add)) return origin;

  var keys = Object.keys(add);
  var i = keys.length;
  while (i--) {
    origin[keys[i]] = add[keys[i]];
  }
  return origin;
};

function hasOwnProperty(obj, prop) {
  return Object.prototype.hasOwnProperty.call(obj, prop);
}

/* WEBPACK VAR INJECTION */}.call(this, __webpack_require__(8), __webpack_require__(14)))

/***/ }),
/* 6 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function(Buffer) {/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return BERElement; });
/* harmony import */ var _asn1__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(2);
/* harmony import */ var _errors__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(0);
/* harmony import */ var _values__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(1);
/* harmony import */ var _x690__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(4);




class BERElement extends _x690__WEBPACK_IMPORTED_MODULE_3__[/* X690Element */ "a"] {
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
            throw new _errors__WEBPACK_IMPORTED_MODULE_1__[/* ASN1ConstructionError */ "b"]("BOOLEAN cannot be constructed.");
        if (this.value.length !== 1)
            throw new _errors__WEBPACK_IMPORTED_MODULE_1__[/* ASN1SizeError */ "h"]("BOOLEAN not one byte");
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
                throw new _errors__WEBPACK_IMPORTED_MODULE_1__[/* ASN1Error */ "c"]("ASN.1 BIT STRING cannot be encoded on zero bytes!");
            if (this.value.length === 1 && this.value[0] !== 0)
                throw new _errors__WEBPACK_IMPORTED_MODULE_1__[/* ASN1Error */ "c"]("ASN.1 BIT STRING encoded with deceptive first byte!");
            if (this.value[0] > 7)
                throw new _errors__WEBPACK_IMPORTED_MODULE_1__[/* ASN1Error */ "c"]("First byte of an ASN.1 BIT STRING must be <= 7!");
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
            if ((this.recursionCount + 1) > BERElement.nestingRecursionLimit)
                throw new _errors__WEBPACK_IMPORTED_MODULE_1__[/* ASN1RecursionError */ "g"]();
            let appendy = [];
            const substrings = this.sequence;
            substrings.slice(0, (substrings.length - 1)).forEach(substring => {
                if (substring.construction === 0 &&
                    substring.value.length > 0 &&
                    substring.value[0] !== 0x00)
                    throw new _errors__WEBPACK_IMPORTED_MODULE_1__[/* ASN1Error */ "c"](`Only the last subelement of a constructed BIT STRING may have a non-zero first value byte.`);
            });
            substrings.forEach(substring => {
                if (substring.tagClass !== this.tagClass)
                    throw new _errors__WEBPACK_IMPORTED_MODULE_1__[/* ASN1ConstructionError */ "b"](`Invalid tag class in recursively-encoded BIT STRING.`);
                if (substring.tagNumber !== this.tagNumber)
                    throw new _errors__WEBPACK_IMPORTED_MODULE_1__[/* ASN1ConstructionError */ "b"](`Invalid tag class in recursively-encoded BIT STRING.`);
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
            throw new _errors__WEBPACK_IMPORTED_MODULE_1__[/* ASN1ConstructionError */ "b"]("REAL cannot be constructed.");
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
                throw new _errors__WEBPACK_IMPORTED_MODULE_1__[/* ASN1UndefinedError */ "j"]("Unrecognized special REAL value!");
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
                    throw new _errors__WEBPACK_IMPORTED_MODULE_1__[/* ASN1Error */ "c"]("No ability to decode bytes to string!");
                }
                switch (this.value[0] & 0b00111111) {
                    case 1: {
                        if (!_values__WEBPACK_IMPORTED_MODULE_2__[/* nr1Regex */ "r"].test(realString))
                            throw new _errors__WEBPACK_IMPORTED_MODULE_1__[/* ASN1Error */ "c"]("Malformed NR1 Base-10 REAL");
                        return parseFloat(realString);
                    }
                    case 2: {
                        if (!_values__WEBPACK_IMPORTED_MODULE_2__[/* nr2Regex */ "s"].test(realString))
                            throw new _errors__WEBPACK_IMPORTED_MODULE_1__[/* ASN1Error */ "c"]("Malformed NR2 Base-10 REAL");
                        return parseFloat(realString.replace(",", "."));
                    }
                    case 3: {
                        if (!_values__WEBPACK_IMPORTED_MODULE_2__[/* nr3Regex */ "t"].test(realString))
                            throw new _errors__WEBPACK_IMPORTED_MODULE_1__[/* ASN1Error */ "c"]("Malformed NR3 Base-10 REAL");
                        return parseFloat(realString.replace(",", "."));
                    }
                    default:
                        throw new _errors__WEBPACK_IMPORTED_MODULE_1__[/* ASN1UndefinedError */ "j"]("Undefined Base-10 REAL encoding.");
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
                            throw new _errors__WEBPACK_IMPORTED_MODULE_1__[/* ASN1Error */ "c"]("Impossible REAL encoding base encountered.");
                    }
                })(this.value[0] & 0b00110000);
                const scale = ((flag) => {
                    switch (flag) {
                        case (0): return 0;
                        case (4): return 1;
                        case (8): return 2;
                        case (12): return 3;
                        default:
                            throw new _errors__WEBPACK_IMPORTED_MODULE_1__[/* ASN1Error */ "c"]("Impossible REAL encoding scale encountered.");
                    }
                })(this.value[0] & 0b00001100);
                let exponent;
                let mantissa;
                switch (this.value[0] & 0b00000011) {
                    case (0b00000000): {
                        if (this.value.length < 3)
                            throw new _errors__WEBPACK_IMPORTED_MODULE_1__[/* ASN1TruncationError */ "i"]("Binary-encoded REAL truncated.");
                        exponent = _asn1__WEBPACK_IMPORTED_MODULE_0__[/* ASN1Element */ "a"].decodeSignedBigEndianInteger(this.value.subarray(1, 2));
                        mantissa = _asn1__WEBPACK_IMPORTED_MODULE_0__[/* ASN1Element */ "a"].decodeUnsignedBigEndianInteger(this.value.subarray(2));
                        break;
                    }
                    case (0b00000001): {
                        if (this.value.length < 4)
                            throw new _errors__WEBPACK_IMPORTED_MODULE_1__[/* ASN1TruncationError */ "i"]("Binary-encoded REAL truncated.");
                        exponent = _asn1__WEBPACK_IMPORTED_MODULE_0__[/* ASN1Element */ "a"].decodeSignedBigEndianInteger(this.value.subarray(1, 3));
                        mantissa = _asn1__WEBPACK_IMPORTED_MODULE_0__[/* ASN1Element */ "a"].decodeUnsignedBigEndianInteger(this.value.subarray(3));
                        break;
                    }
                    case (0b00000010): {
                        if (this.value.length < 5)
                            throw new _errors__WEBPACK_IMPORTED_MODULE_1__[/* ASN1TruncationError */ "i"]("Binary-encoded REAL truncated.");
                        exponent = _asn1__WEBPACK_IMPORTED_MODULE_0__[/* ASN1Element */ "a"].decodeSignedBigEndianInteger(this.value.subarray(1, 4));
                        mantissa = _asn1__WEBPACK_IMPORTED_MODULE_0__[/* ASN1Element */ "a"].decodeUnsignedBigEndianInteger(this.value.subarray(4));
                        break;
                    }
                    case (0b00000011): {
                        if (this.value.length < 3)
                            throw new _errors__WEBPACK_IMPORTED_MODULE_1__[/* ASN1TruncationError */ "i"]("Binary-encoded REAL truncated.");
                        let exponentLength = this.value[1];
                        if (this.value.length < (3 + exponentLength))
                            throw new _errors__WEBPACK_IMPORTED_MODULE_1__[/* ASN1TruncationError */ "i"]("Binary-encoded REAL truncated.");
                        exponent = _asn1__WEBPACK_IMPORTED_MODULE_0__[/* ASN1Element */ "a"].decodeSignedBigEndianInteger(this.value.subarray(2, (2 + exponentLength)));
                        mantissa = _asn1__WEBPACK_IMPORTED_MODULE_0__[/* ASN1Element */ "a"].decodeUnsignedBigEndianInteger(this.value.subarray((2 + exponentLength)));
                        break;
                    }
                    default:
                        throw new _errors__WEBPACK_IMPORTED_MODULE_1__[/* ASN1Error */ "c"]("Impossible binary REAL exponent encoding encountered.");
                }
                return (sign * mantissa * Math.pow(2, scale) * Math.pow(base, exponent));
            }
            default:
                throw new _errors__WEBPACK_IMPORTED_MODULE_1__[/* ASN1Error */ "c"]("Impossible REAL format encountered.");
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
            throw new _errors__WEBPACK_IMPORTED_MODULE_1__[/* ASN1ConstructionError */ "b"]("SET or SEQUENCE cannot be primitively constructed.");
        let encodedElements = [];
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
                throw new _errors__WEBPACK_IMPORTED_MODULE_1__[/* ASN1CharactersError */ "a"]("NumericString can only contain characters 0 - 9 and space.");
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
                throw new _errors__WEBPACK_IMPORTED_MODULE_1__[/* ASN1CharactersError */ "a"]("NumericString can only contain characters 0 - 9 and space.");
            }
        }
        return ret;
    }
    set printableString(value) {
        for (let i = 0; i < value.length; i++) {
            if (_values__WEBPACK_IMPORTED_MODULE_2__[/* printableStringCharacters */ "u"].indexOf(value.charAt(i)) === -1) {
                throw new _errors__WEBPACK_IMPORTED_MODULE_1__[/* ASN1CharactersError */ "a"](`PrintableString can only contain these characters: ${_values__WEBPACK_IMPORTED_MODULE_2__[/* printableStringCharacters */ "u"]}`);
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
            if (_values__WEBPACK_IMPORTED_MODULE_2__[/* printableStringCharacters */ "u"].indexOf(ret.charAt(i)) === -1) {
                throw new _errors__WEBPACK_IMPORTED_MODULE_1__[/* ASN1CharactersError */ "a"](`PrintableString can only contain these characters: ${_values__WEBPACK_IMPORTED_MODULE_2__[/* printableStringCharacters */ "u"]}`);
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
        const match = _values__WEBPACK_IMPORTED_MODULE_2__[/* utcTimeRegex */ "v"].exec(dateString);
        if (match === null)
            throw new _errors__WEBPACK_IMPORTED_MODULE_1__[/* ASN1Error */ "c"]("Malformed UTCTime string.");
        if (match.groups === undefined)
            throw new _errors__WEBPACK_IMPORTED_MODULE_1__[/* ASN1Error */ "c"]("Malformed UTCTime string.");
        const ret = new Date();
        let year = Number(match.groups.year);
        year = (year < 70 ? (2000 + year) : (1900 + year));
        const month = (Number(match.groups.month) - 1);
        const date = Number(match.groups.date);
        const hours = Number(match.groups.hour);
        const minutes = Number(match.groups.minute);
        const seconds = Number(match.groups.second);
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
            dateString = (new Buffer(this.value)).toString("utf-8");
        }
        const match = _values__WEBPACK_IMPORTED_MODULE_2__[/* generalizedTimeRegex */ "q"].exec(dateString);
        if (match === null)
            throw new _errors__WEBPACK_IMPORTED_MODULE_1__[/* ASN1Error */ "c"]("Malformed GeneralizedTime string.");
        if (match.groups === undefined)
            throw new _errors__WEBPACK_IMPORTED_MODULE_1__[/* ASN1Error */ "c"]("Malformed GeneralizedTime string.");
        const ret = new Date();
        const year = Number(match.groups.year);
        const month = (Number(match.groups.month) - 1);
        const date = Number(match.groups.date);
        const hours = Number(match.groups.hour);
        const minutes = Number(match.groups.minute);
        const seconds = Number(match.groups.second);
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
                throw new _errors__WEBPACK_IMPORTED_MODULE_1__[/* ASN1CharactersError */ "a"]("GraphicString, VisibleString, or ObjectDescriptor " +
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
                throw new _errors__WEBPACK_IMPORTED_MODULE_1__[/* ASN1CharactersError */ "a"]("GraphicString, VisibleString, or ObjectDescriptor " +
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
                throw new _errors__WEBPACK_IMPORTED_MODULE_1__[/* ASN1CharactersError */ "a"]("GeneralString can only contain ASCII characters.");
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
                throw new _errors__WEBPACK_IMPORTED_MODULE_1__[/* ASN1CharactersError */ "a"]("GeneralString can only contain ASCII characters.");
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
            throw new _errors__WEBPACK_IMPORTED_MODULE_1__[/* ASN1Error */ "c"]("UniversalString encoded on non-mulitple of four bytes.");
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
            throw new _errors__WEBPACK_IMPORTED_MODULE_1__[/* ASN1Error */ "c"]("BMPString encoded on non-mulitple of two bytes.");
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
            throw new _errors__WEBPACK_IMPORTED_MODULE_1__[/* ASN1TruncationError */ "i"]("Tried to decode a BER element that is less than two bytes.");
        if ((this.recursionCount + 1) > BERElement.nestingRecursionLimit)
            throw new _errors__WEBPACK_IMPORTED_MODULE_1__[/* ASN1RecursionError */ "g"]();
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
                throw new _errors__WEBPACK_IMPORTED_MODULE_1__[/* ASN1PaddingError */ "f"]("Leading padding byte on long tag number encoding.");
            this.tagNumber = 0;
            const limit = (((bytes.length - 1) >= 4) ? 4 : (bytes.length - 1));
            while (cursor < limit) {
                if (!(bytes[cursor++] & 0b10000000))
                    break;
            }
            if (bytes[cursor - 1] & 0b10000000) {
                if (limit === bytes.length - 1) {
                    throw new _errors__WEBPACK_IMPORTED_MODULE_1__[/* ASN1TruncationError */ "i"]("ASN.1 tag number appears to have been truncated.");
                }
                else
                    throw new _errors__WEBPACK_IMPORTED_MODULE_1__[/* ASN1OverflowError */ "e"]("ASN.1 tag number too large.");
            }
            for (let i = 1; i < cursor; i++) {
                this.tagNumber <<= 7;
                this.tagNumber |= (bytes[i] & 0x7F);
            }
            if (this.tagNumber <= 31)
                throw new _errors__WEBPACK_IMPORTED_MODULE_1__[/* ASN1Error */ "c"]("ASN.1 tag number could have been encoded in short form.");
        }
        if ((bytes[cursor] & 0b10000000) === 0b10000000) {
            const numberOfLengthOctets = (bytes[cursor] & 0x7F);
            if (numberOfLengthOctets) {
                if (numberOfLengthOctets === 0b01111111)
                    throw new _errors__WEBPACK_IMPORTED_MODULE_1__[/* ASN1UndefinedError */ "j"]("Length byte with undefined meaning encountered.");
                if (numberOfLengthOctets > 4)
                    throw new _errors__WEBPACK_IMPORTED_MODULE_1__[/* ASN1OverflowError */ "e"]("Element length too long to decode to an integer.");
                if (cursor + numberOfLengthOctets >= bytes.length)
                    throw new _errors__WEBPACK_IMPORTED_MODULE_1__[/* ASN1TruncationError */ "i"]("Element length bytes appear to have been truncated.");
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
                    throw new _errors__WEBPACK_IMPORTED_MODULE_1__[/* ASN1OverflowError */ "e"]("ASN.1 element too large.");
                cursor += (numberOfLengthOctets);
                if ((cursor + length) > bytes.length)
                    throw new _errors__WEBPACK_IMPORTED_MODULE_1__[/* ASN1TruncationError */ "i"]("ASN.1 element truncated.");
                this.value = bytes.slice(cursor, (cursor + length));
                return (cursor + length);
            }
            else {
                if (this.construction !== 1)
                    throw new _errors__WEBPACK_IMPORTED_MODULE_1__[/* ASN1ConstructionError */ "b"]("Indefinite length ASN.1 element was not of constructed construction.");
                const startOfValue = ++cursor;
                let sentinel = cursor;
                while (sentinel < bytes.length) {
                    const child = new BERElement();
                    child.recursionCount = (this.recursionCount + 1);
                    sentinel += child.fromBytes(bytes.slice(sentinel));
                    if (child.tagClass === 0 &&
                        child.construction === 0 &&
                        child.tagNumber === 0 &&
                        child.value.length === 0)
                        break;
                }
                if (sentinel === bytes.length && (bytes[sentinel - 1] !== 0x00 || bytes[sentinel - 2] !== 0x00))
                    throw new _errors__WEBPACK_IMPORTED_MODULE_1__[/* ASN1TruncationError */ "i"]("No END OF CONTENT element found at the end of indefinite length ASN.1 element.");
                this.value = bytes.slice(startOfValue, (sentinel - 2));
                return sentinel;
            }
        }
        else {
            const length = (bytes[cursor++] & 0x7F);
            if ((cursor + length) > bytes.length)
                throw new _errors__WEBPACK_IMPORTED_MODULE_1__[/* ASN1TruncationError */ "i"]("ASN.1 element was truncated.");
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
        switch (BERElement.lengthEncodingPreference) {
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
                throw new _errors__WEBPACK_IMPORTED_MODULE_1__[/* ASN1UndefinedError */ "j"]("Invalid LengthEncodingPreference encountered!");
        }
        const ret = new Uint8Array(tagBytes.length +
            lengthOctets.length +
            this.value.length +
            (BERElement.lengthEncodingPreference === 1 ? 2 : 0));
        ret.set(tagBytes, 0);
        ret.set(lengthOctets, tagBytes.length);
        ret.set(this.value, (tagBytes.length + lengthOctets.length));
        return ret;
    }
    deconstruct(dataType) {
        if (this.construction === 0) {
            return new Uint8Array(this.value);
        }
        else {
            if ((this.recursionCount + 1) > BERElement.nestingRecursionLimit)
                throw new _errors__WEBPACK_IMPORTED_MODULE_1__[/* ASN1RecursionError */ "g"]();
            let appendy = [];
            const substrings = this.sequence;
            substrings.forEach(substring => {
                if (substring.tagClass !== this.tagClass)
                    throw new _errors__WEBPACK_IMPORTED_MODULE_1__[/* ASN1ConstructionError */ "b"](`Invalid tag class in recursively-encoded ${dataType}.`);
                if (substring.tagNumber !== this.tagNumber)
                    throw new _errors__WEBPACK_IMPORTED_MODULE_1__[/* ASN1ConstructionError */ "b"](`Invalid tag class in recursively-encoded ${dataType}.`);
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
BERElement.lengthEncodingPreference = 0;

/* WEBPACK VAR INJECTION */}.call(this, __webpack_require__(7).Buffer))

/***/ }),
/* 7 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function(global) {/*!
 * The buffer module from node.js, for the browser.
 *
 * @author   Feross Aboukhadijeh <feross@feross.org> <http://feross.org>
 * @license  MIT
 */
/* eslint-disable no-proto */



var base64 = __webpack_require__(11)
var ieee754 = __webpack_require__(12)
var isArray = __webpack_require__(13)

exports.Buffer = Buffer
exports.SlowBuffer = SlowBuffer
exports.INSPECT_MAX_BYTES = 50

/**
 * If `Buffer.TYPED_ARRAY_SUPPORT`:
 *   === true    Use Uint8Array implementation (fastest)
 *   === false   Use Object implementation (most compatible, even IE6)
 *
 * Browsers that support typed arrays are IE 10+, Firefox 4+, Chrome 7+, Safari 5.1+,
 * Opera 11.6+, iOS 4.2+.
 *
 * Due to various browser bugs, sometimes the Object implementation will be used even
 * when the browser supports typed arrays.
 *
 * Note:
 *
 *   - Firefox 4-29 lacks support for adding new properties to `Uint8Array` instances,
 *     See: https://bugzilla.mozilla.org/show_bug.cgi?id=695438.
 *
 *   - Chrome 9-10 is missing the `TypedArray.prototype.subarray` function.
 *
 *   - IE10 has a broken `TypedArray.prototype.subarray` function which returns arrays of
 *     incorrect length in some situations.

 * We detect these buggy browsers and set `Buffer.TYPED_ARRAY_SUPPORT` to `false` so they
 * get the Object implementation, which is slower but behaves correctly.
 */
Buffer.TYPED_ARRAY_SUPPORT = global.TYPED_ARRAY_SUPPORT !== undefined
  ? global.TYPED_ARRAY_SUPPORT
  : typedArraySupport()

/*
 * Export kMaxLength after typed array support is determined.
 */
exports.kMaxLength = kMaxLength()

function typedArraySupport () {
  try {
    var arr = new Uint8Array(1)
    arr.__proto__ = {__proto__: Uint8Array.prototype, foo: function () { return 42 }}
    return arr.foo() === 42 && // typed array instances can be augmented
        typeof arr.subarray === 'function' && // chrome 9-10 lack `subarray`
        arr.subarray(1, 1).byteLength === 0 // ie10 has broken `subarray`
  } catch (e) {
    return false
  }
}

function kMaxLength () {
  return Buffer.TYPED_ARRAY_SUPPORT
    ? 0x7fffffff
    : 0x3fffffff
}

function createBuffer (that, length) {
  if (kMaxLength() < length) {
    throw new RangeError('Invalid typed array length')
  }
  if (Buffer.TYPED_ARRAY_SUPPORT) {
    // Return an augmented `Uint8Array` instance, for best performance
    that = new Uint8Array(length)
    that.__proto__ = Buffer.prototype
  } else {
    // Fallback: Return an object instance of the Buffer class
    if (that === null) {
      that = new Buffer(length)
    }
    that.length = length
  }

  return that
}

/**
 * The Buffer constructor returns instances of `Uint8Array` that have their
 * prototype changed to `Buffer.prototype`. Furthermore, `Buffer` is a subclass of
 * `Uint8Array`, so the returned instances will have all the node `Buffer` methods
 * and the `Uint8Array` methods. Square bracket notation works as expected -- it
 * returns a single octet.
 *
 * The `Uint8Array` prototype remains unmodified.
 */

function Buffer (arg, encodingOrOffset, length) {
  if (!Buffer.TYPED_ARRAY_SUPPORT && !(this instanceof Buffer)) {
    return new Buffer(arg, encodingOrOffset, length)
  }

  // Common case.
  if (typeof arg === 'number') {
    if (typeof encodingOrOffset === 'string') {
      throw new Error(
        'If encoding is specified then the first argument must be a string'
      )
    }
    return allocUnsafe(this, arg)
  }
  return from(this, arg, encodingOrOffset, length)
}

Buffer.poolSize = 8192 // not used by this implementation

// TODO: Legacy, not needed anymore. Remove in next major version.
Buffer._augment = function (arr) {
  arr.__proto__ = Buffer.prototype
  return arr
}

function from (that, value, encodingOrOffset, length) {
  if (typeof value === 'number') {
    throw new TypeError('"value" argument must not be a number')
  }

  if (typeof ArrayBuffer !== 'undefined' && value instanceof ArrayBuffer) {
    return fromArrayBuffer(that, value, encodingOrOffset, length)
  }

  if (typeof value === 'string') {
    return fromString(that, value, encodingOrOffset)
  }

  return fromObject(that, value)
}

/**
 * Functionally equivalent to Buffer(arg, encoding) but throws a TypeError
 * if value is a number.
 * Buffer.from(str[, encoding])
 * Buffer.from(array)
 * Buffer.from(buffer)
 * Buffer.from(arrayBuffer[, byteOffset[, length]])
 **/
Buffer.from = function (value, encodingOrOffset, length) {
  return from(null, value, encodingOrOffset, length)
}

if (Buffer.TYPED_ARRAY_SUPPORT) {
  Buffer.prototype.__proto__ = Uint8Array.prototype
  Buffer.__proto__ = Uint8Array
  if (typeof Symbol !== 'undefined' && Symbol.species &&
      Buffer[Symbol.species] === Buffer) {
    // Fix subarray() in ES2016. See: https://github.com/feross/buffer/pull/97
    Object.defineProperty(Buffer, Symbol.species, {
      value: null,
      configurable: true
    })
  }
}

function assertSize (size) {
  if (typeof size !== 'number') {
    throw new TypeError('"size" argument must be a number')
  } else if (size < 0) {
    throw new RangeError('"size" argument must not be negative')
  }
}

function alloc (that, size, fill, encoding) {
  assertSize(size)
  if (size <= 0) {
    return createBuffer(that, size)
  }
  if (fill !== undefined) {
    // Only pay attention to encoding if it's a string. This
    // prevents accidentally sending in a number that would
    // be interpretted as a start offset.
    return typeof encoding === 'string'
      ? createBuffer(that, size).fill(fill, encoding)
      : createBuffer(that, size).fill(fill)
  }
  return createBuffer(that, size)
}

/**
 * Creates a new filled Buffer instance.
 * alloc(size[, fill[, encoding]])
 **/
Buffer.alloc = function (size, fill, encoding) {
  return alloc(null, size, fill, encoding)
}

function allocUnsafe (that, size) {
  assertSize(size)
  that = createBuffer(that, size < 0 ? 0 : checked(size) | 0)
  if (!Buffer.TYPED_ARRAY_SUPPORT) {
    for (var i = 0; i < size; ++i) {
      that[i] = 0
    }
  }
  return that
}

/**
 * Equivalent to Buffer(num), by default creates a non-zero-filled Buffer instance.
 * */
Buffer.allocUnsafe = function (size) {
  return allocUnsafe(null, size)
}
/**
 * Equivalent to SlowBuffer(num), by default creates a non-zero-filled Buffer instance.
 */
Buffer.allocUnsafeSlow = function (size) {
  return allocUnsafe(null, size)
}

function fromString (that, string, encoding) {
  if (typeof encoding !== 'string' || encoding === '') {
    encoding = 'utf8'
  }

  if (!Buffer.isEncoding(encoding)) {
    throw new TypeError('"encoding" must be a valid string encoding')
  }

  var length = byteLength(string, encoding) | 0
  that = createBuffer(that, length)

  var actual = that.write(string, encoding)

  if (actual !== length) {
    // Writing a hex string, for example, that contains invalid characters will
    // cause everything after the first invalid character to be ignored. (e.g.
    // 'abxxcd' will be treated as 'ab')
    that = that.slice(0, actual)
  }

  return that
}

function fromArrayLike (that, array) {
  var length = array.length < 0 ? 0 : checked(array.length) | 0
  that = createBuffer(that, length)
  for (var i = 0; i < length; i += 1) {
    that[i] = array[i] & 255
  }
  return that
}

function fromArrayBuffer (that, array, byteOffset, length) {
  array.byteLength // this throws if `array` is not a valid ArrayBuffer

  if (byteOffset < 0 || array.byteLength < byteOffset) {
    throw new RangeError('\'offset\' is out of bounds')
  }

  if (array.byteLength < byteOffset + (length || 0)) {
    throw new RangeError('\'length\' is out of bounds')
  }

  if (byteOffset === undefined && length === undefined) {
    array = new Uint8Array(array)
  } else if (length === undefined) {
    array = new Uint8Array(array, byteOffset)
  } else {
    array = new Uint8Array(array, byteOffset, length)
  }

  if (Buffer.TYPED_ARRAY_SUPPORT) {
    // Return an augmented `Uint8Array` instance, for best performance
    that = array
    that.__proto__ = Buffer.prototype
  } else {
    // Fallback: Return an object instance of the Buffer class
    that = fromArrayLike(that, array)
  }
  return that
}

function fromObject (that, obj) {
  if (Buffer.isBuffer(obj)) {
    var len = checked(obj.length) | 0
    that = createBuffer(that, len)

    if (that.length === 0) {
      return that
    }

    obj.copy(that, 0, 0, len)
    return that
  }

  if (obj) {
    if ((typeof ArrayBuffer !== 'undefined' &&
        obj.buffer instanceof ArrayBuffer) || 'length' in obj) {
      if (typeof obj.length !== 'number' || isnan(obj.length)) {
        return createBuffer(that, 0)
      }
      return fromArrayLike(that, obj)
    }

    if (obj.type === 'Buffer' && isArray(obj.data)) {
      return fromArrayLike(that, obj.data)
    }
  }

  throw new TypeError('First argument must be a string, Buffer, ArrayBuffer, Array, or array-like object.')
}

function checked (length) {
  // Note: cannot use `length < kMaxLength()` here because that fails when
  // length is NaN (which is otherwise coerced to zero.)
  if (length >= kMaxLength()) {
    throw new RangeError('Attempt to allocate Buffer larger than maximum ' +
                         'size: 0x' + kMaxLength().toString(16) + ' bytes')
  }
  return length | 0
}

function SlowBuffer (length) {
  if (+length != length) { // eslint-disable-line eqeqeq
    length = 0
  }
  return Buffer.alloc(+length)
}

Buffer.isBuffer = function isBuffer (b) {
  return !!(b != null && b._isBuffer)
}

Buffer.compare = function compare (a, b) {
  if (!Buffer.isBuffer(a) || !Buffer.isBuffer(b)) {
    throw new TypeError('Arguments must be Buffers')
  }

  if (a === b) return 0

  var x = a.length
  var y = b.length

  for (var i = 0, len = Math.min(x, y); i < len; ++i) {
    if (a[i] !== b[i]) {
      x = a[i]
      y = b[i]
      break
    }
  }

  if (x < y) return -1
  if (y < x) return 1
  return 0
}

Buffer.isEncoding = function isEncoding (encoding) {
  switch (String(encoding).toLowerCase()) {
    case 'hex':
    case 'utf8':
    case 'utf-8':
    case 'ascii':
    case 'latin1':
    case 'binary':
    case 'base64':
    case 'ucs2':
    case 'ucs-2':
    case 'utf16le':
    case 'utf-16le':
      return true
    default:
      return false
  }
}

Buffer.concat = function concat (list, length) {
  if (!isArray(list)) {
    throw new TypeError('"list" argument must be an Array of Buffers')
  }

  if (list.length === 0) {
    return Buffer.alloc(0)
  }

  var i
  if (length === undefined) {
    length = 0
    for (i = 0; i < list.length; ++i) {
      length += list[i].length
    }
  }

  var buffer = Buffer.allocUnsafe(length)
  var pos = 0
  for (i = 0; i < list.length; ++i) {
    var buf = list[i]
    if (!Buffer.isBuffer(buf)) {
      throw new TypeError('"list" argument must be an Array of Buffers')
    }
    buf.copy(buffer, pos)
    pos += buf.length
  }
  return buffer
}

function byteLength (string, encoding) {
  if (Buffer.isBuffer(string)) {
    return string.length
  }
  if (typeof ArrayBuffer !== 'undefined' && typeof ArrayBuffer.isView === 'function' &&
      (ArrayBuffer.isView(string) || string instanceof ArrayBuffer)) {
    return string.byteLength
  }
  if (typeof string !== 'string') {
    string = '' + string
  }

  var len = string.length
  if (len === 0) return 0

  // Use a for loop to avoid recursion
  var loweredCase = false
  for (;;) {
    switch (encoding) {
      case 'ascii':
      case 'latin1':
      case 'binary':
        return len
      case 'utf8':
      case 'utf-8':
      case undefined:
        return utf8ToBytes(string).length
      case 'ucs2':
      case 'ucs-2':
      case 'utf16le':
      case 'utf-16le':
        return len * 2
      case 'hex':
        return len >>> 1
      case 'base64':
        return base64ToBytes(string).length
      default:
        if (loweredCase) return utf8ToBytes(string).length // assume utf8
        encoding = ('' + encoding).toLowerCase()
        loweredCase = true
    }
  }
}
Buffer.byteLength = byteLength

function slowToString (encoding, start, end) {
  var loweredCase = false

  // No need to verify that "this.length <= MAX_UINT32" since it's a read-only
  // property of a typed array.

  // This behaves neither like String nor Uint8Array in that we set start/end
  // to their upper/lower bounds if the value passed is out of range.
  // undefined is handled specially as per ECMA-262 6th Edition,
  // Section 13.3.3.7 Runtime Semantics: KeyedBindingInitialization.
  if (start === undefined || start < 0) {
    start = 0
  }
  // Return early if start > this.length. Done here to prevent potential uint32
  // coercion fail below.
  if (start > this.length) {
    return ''
  }

  if (end === undefined || end > this.length) {
    end = this.length
  }

  if (end <= 0) {
    return ''
  }

  // Force coersion to uint32. This will also coerce falsey/NaN values to 0.
  end >>>= 0
  start >>>= 0

  if (end <= start) {
    return ''
  }

  if (!encoding) encoding = 'utf8'

  while (true) {
    switch (encoding) {
      case 'hex':
        return hexSlice(this, start, end)

      case 'utf8':
      case 'utf-8':
        return utf8Slice(this, start, end)

      case 'ascii':
        return asciiSlice(this, start, end)

      case 'latin1':
      case 'binary':
        return latin1Slice(this, start, end)

      case 'base64':
        return base64Slice(this, start, end)

      case 'ucs2':
      case 'ucs-2':
      case 'utf16le':
      case 'utf-16le':
        return utf16leSlice(this, start, end)

      default:
        if (loweredCase) throw new TypeError('Unknown encoding: ' + encoding)
        encoding = (encoding + '').toLowerCase()
        loweredCase = true
    }
  }
}

// The property is used by `Buffer.isBuffer` and `is-buffer` (in Safari 5-7) to detect
// Buffer instances.
Buffer.prototype._isBuffer = true

function swap (b, n, m) {
  var i = b[n]
  b[n] = b[m]
  b[m] = i
}

Buffer.prototype.swap16 = function swap16 () {
  var len = this.length
  if (len % 2 !== 0) {
    throw new RangeError('Buffer size must be a multiple of 16-bits')
  }
  for (var i = 0; i < len; i += 2) {
    swap(this, i, i + 1)
  }
  return this
}

Buffer.prototype.swap32 = function swap32 () {
  var len = this.length
  if (len % 4 !== 0) {
    throw new RangeError('Buffer size must be a multiple of 32-bits')
  }
  for (var i = 0; i < len; i += 4) {
    swap(this, i, i + 3)
    swap(this, i + 1, i + 2)
  }
  return this
}

Buffer.prototype.swap64 = function swap64 () {
  var len = this.length
  if (len % 8 !== 0) {
    throw new RangeError('Buffer size must be a multiple of 64-bits')
  }
  for (var i = 0; i < len; i += 8) {
    swap(this, i, i + 7)
    swap(this, i + 1, i + 6)
    swap(this, i + 2, i + 5)
    swap(this, i + 3, i + 4)
  }
  return this
}

Buffer.prototype.toString = function toString () {
  var length = this.length | 0
  if (length === 0) return ''
  if (arguments.length === 0) return utf8Slice(this, 0, length)
  return slowToString.apply(this, arguments)
}

Buffer.prototype.equals = function equals (b) {
  if (!Buffer.isBuffer(b)) throw new TypeError('Argument must be a Buffer')
  if (this === b) return true
  return Buffer.compare(this, b) === 0
}

Buffer.prototype.inspect = function inspect () {
  var str = ''
  var max = exports.INSPECT_MAX_BYTES
  if (this.length > 0) {
    str = this.toString('hex', 0, max).match(/.{2}/g).join(' ')
    if (this.length > max) str += ' ... '
  }
  return '<Buffer ' + str + '>'
}

Buffer.prototype.compare = function compare (target, start, end, thisStart, thisEnd) {
  if (!Buffer.isBuffer(target)) {
    throw new TypeError('Argument must be a Buffer')
  }

  if (start === undefined) {
    start = 0
  }
  if (end === undefined) {
    end = target ? target.length : 0
  }
  if (thisStart === undefined) {
    thisStart = 0
  }
  if (thisEnd === undefined) {
    thisEnd = this.length
  }

  if (start < 0 || end > target.length || thisStart < 0 || thisEnd > this.length) {
    throw new RangeError('out of range index')
  }

  if (thisStart >= thisEnd && start >= end) {
    return 0
  }
  if (thisStart >= thisEnd) {
    return -1
  }
  if (start >= end) {
    return 1
  }

  start >>>= 0
  end >>>= 0
  thisStart >>>= 0
  thisEnd >>>= 0

  if (this === target) return 0

  var x = thisEnd - thisStart
  var y = end - start
  var len = Math.min(x, y)

  var thisCopy = this.slice(thisStart, thisEnd)
  var targetCopy = target.slice(start, end)

  for (var i = 0; i < len; ++i) {
    if (thisCopy[i] !== targetCopy[i]) {
      x = thisCopy[i]
      y = targetCopy[i]
      break
    }
  }

  if (x < y) return -1
  if (y < x) return 1
  return 0
}

// Finds either the first index of `val` in `buffer` at offset >= `byteOffset`,
// OR the last index of `val` in `buffer` at offset <= `byteOffset`.
//
// Arguments:
// - buffer - a Buffer to search
// - val - a string, Buffer, or number
// - byteOffset - an index into `buffer`; will be clamped to an int32
// - encoding - an optional encoding, relevant is val is a string
// - dir - true for indexOf, false for lastIndexOf
function bidirectionalIndexOf (buffer, val, byteOffset, encoding, dir) {
  // Empty buffer means no match
  if (buffer.length === 0) return -1

  // Normalize byteOffset
  if (typeof byteOffset === 'string') {
    encoding = byteOffset
    byteOffset = 0
  } else if (byteOffset > 0x7fffffff) {
    byteOffset = 0x7fffffff
  } else if (byteOffset < -0x80000000) {
    byteOffset = -0x80000000
  }
  byteOffset = +byteOffset  // Coerce to Number.
  if (isNaN(byteOffset)) {
    // byteOffset: it it's undefined, null, NaN, "foo", etc, search whole buffer
    byteOffset = dir ? 0 : (buffer.length - 1)
  }

  // Normalize byteOffset: negative offsets start from the end of the buffer
  if (byteOffset < 0) byteOffset = buffer.length + byteOffset
  if (byteOffset >= buffer.length) {
    if (dir) return -1
    else byteOffset = buffer.length - 1
  } else if (byteOffset < 0) {
    if (dir) byteOffset = 0
    else return -1
  }

  // Normalize val
  if (typeof val === 'string') {
    val = Buffer.from(val, encoding)
  }

  // Finally, search either indexOf (if dir is true) or lastIndexOf
  if (Buffer.isBuffer(val)) {
    // Special case: looking for empty string/buffer always fails
    if (val.length === 0) {
      return -1
    }
    return arrayIndexOf(buffer, val, byteOffset, encoding, dir)
  } else if (typeof val === 'number') {
    val = val & 0xFF // Search for a byte value [0-255]
    if (Buffer.TYPED_ARRAY_SUPPORT &&
        typeof Uint8Array.prototype.indexOf === 'function') {
      if (dir) {
        return Uint8Array.prototype.indexOf.call(buffer, val, byteOffset)
      } else {
        return Uint8Array.prototype.lastIndexOf.call(buffer, val, byteOffset)
      }
    }
    return arrayIndexOf(buffer, [ val ], byteOffset, encoding, dir)
  }

  throw new TypeError('val must be string, number or Buffer')
}

function arrayIndexOf (arr, val, byteOffset, encoding, dir) {
  var indexSize = 1
  var arrLength = arr.length
  var valLength = val.length

  if (encoding !== undefined) {
    encoding = String(encoding).toLowerCase()
    if (encoding === 'ucs2' || encoding === 'ucs-2' ||
        encoding === 'utf16le' || encoding === 'utf-16le') {
      if (arr.length < 2 || val.length < 2) {
        return -1
      }
      indexSize = 2
      arrLength /= 2
      valLength /= 2
      byteOffset /= 2
    }
  }

  function read (buf, i) {
    if (indexSize === 1) {
      return buf[i]
    } else {
      return buf.readUInt16BE(i * indexSize)
    }
  }

  var i
  if (dir) {
    var foundIndex = -1
    for (i = byteOffset; i < arrLength; i++) {
      if (read(arr, i) === read(val, foundIndex === -1 ? 0 : i - foundIndex)) {
        if (foundIndex === -1) foundIndex = i
        if (i - foundIndex + 1 === valLength) return foundIndex * indexSize
      } else {
        if (foundIndex !== -1) i -= i - foundIndex
        foundIndex = -1
      }
    }
  } else {
    if (byteOffset + valLength > arrLength) byteOffset = arrLength - valLength
    for (i = byteOffset; i >= 0; i--) {
      var found = true
      for (var j = 0; j < valLength; j++) {
        if (read(arr, i + j) !== read(val, j)) {
          found = false
          break
        }
      }
      if (found) return i
    }
  }

  return -1
}

Buffer.prototype.includes = function includes (val, byteOffset, encoding) {
  return this.indexOf(val, byteOffset, encoding) !== -1
}

Buffer.prototype.indexOf = function indexOf (val, byteOffset, encoding) {
  return bidirectionalIndexOf(this, val, byteOffset, encoding, true)
}

Buffer.prototype.lastIndexOf = function lastIndexOf (val, byteOffset, encoding) {
  return bidirectionalIndexOf(this, val, byteOffset, encoding, false)
}

function hexWrite (buf, string, offset, length) {
  offset = Number(offset) || 0
  var remaining = buf.length - offset
  if (!length) {
    length = remaining
  } else {
    length = Number(length)
    if (length > remaining) {
      length = remaining
    }
  }

  // must be an even number of digits
  var strLen = string.length
  if (strLen % 2 !== 0) throw new TypeError('Invalid hex string')

  if (length > strLen / 2) {
    length = strLen / 2
  }
  for (var i = 0; i < length; ++i) {
    var parsed = parseInt(string.substr(i * 2, 2), 16)
    if (isNaN(parsed)) return i
    buf[offset + i] = parsed
  }
  return i
}

function utf8Write (buf, string, offset, length) {
  return blitBuffer(utf8ToBytes(string, buf.length - offset), buf, offset, length)
}

function asciiWrite (buf, string, offset, length) {
  return blitBuffer(asciiToBytes(string), buf, offset, length)
}

function latin1Write (buf, string, offset, length) {
  return asciiWrite(buf, string, offset, length)
}

function base64Write (buf, string, offset, length) {
  return blitBuffer(base64ToBytes(string), buf, offset, length)
}

function ucs2Write (buf, string, offset, length) {
  return blitBuffer(utf16leToBytes(string, buf.length - offset), buf, offset, length)
}

Buffer.prototype.write = function write (string, offset, length, encoding) {
  // Buffer#write(string)
  if (offset === undefined) {
    encoding = 'utf8'
    length = this.length
    offset = 0
  // Buffer#write(string, encoding)
  } else if (length === undefined && typeof offset === 'string') {
    encoding = offset
    length = this.length
    offset = 0
  // Buffer#write(string, offset[, length][, encoding])
  } else if (isFinite(offset)) {
    offset = offset | 0
    if (isFinite(length)) {
      length = length | 0
      if (encoding === undefined) encoding = 'utf8'
    } else {
      encoding = length
      length = undefined
    }
  // legacy write(string, encoding, offset, length) - remove in v0.13
  } else {
    throw new Error(
      'Buffer.write(string, encoding, offset[, length]) is no longer supported'
    )
  }

  var remaining = this.length - offset
  if (length === undefined || length > remaining) length = remaining

  if ((string.length > 0 && (length < 0 || offset < 0)) || offset > this.length) {
    throw new RangeError('Attempt to write outside buffer bounds')
  }

  if (!encoding) encoding = 'utf8'

  var loweredCase = false
  for (;;) {
    switch (encoding) {
      case 'hex':
        return hexWrite(this, string, offset, length)

      case 'utf8':
      case 'utf-8':
        return utf8Write(this, string, offset, length)

      case 'ascii':
        return asciiWrite(this, string, offset, length)

      case 'latin1':
      case 'binary':
        return latin1Write(this, string, offset, length)

      case 'base64':
        // Warning: maxLength not taken into account in base64Write
        return base64Write(this, string, offset, length)

      case 'ucs2':
      case 'ucs-2':
      case 'utf16le':
      case 'utf-16le':
        return ucs2Write(this, string, offset, length)

      default:
        if (loweredCase) throw new TypeError('Unknown encoding: ' + encoding)
        encoding = ('' + encoding).toLowerCase()
        loweredCase = true
    }
  }
}

Buffer.prototype.toJSON = function toJSON () {
  return {
    type: 'Buffer',
    data: Array.prototype.slice.call(this._arr || this, 0)
  }
}

function base64Slice (buf, start, end) {
  if (start === 0 && end === buf.length) {
    return base64.fromByteArray(buf)
  } else {
    return base64.fromByteArray(buf.slice(start, end))
  }
}

function utf8Slice (buf, start, end) {
  end = Math.min(buf.length, end)
  var res = []

  var i = start
  while (i < end) {
    var firstByte = buf[i]
    var codePoint = null
    var bytesPerSequence = (firstByte > 0xEF) ? 4
      : (firstByte > 0xDF) ? 3
      : (firstByte > 0xBF) ? 2
      : 1

    if (i + bytesPerSequence <= end) {
      var secondByte, thirdByte, fourthByte, tempCodePoint

      switch (bytesPerSequence) {
        case 1:
          if (firstByte < 0x80) {
            codePoint = firstByte
          }
          break
        case 2:
          secondByte = buf[i + 1]
          if ((secondByte & 0xC0) === 0x80) {
            tempCodePoint = (firstByte & 0x1F) << 0x6 | (secondByte & 0x3F)
            if (tempCodePoint > 0x7F) {
              codePoint = tempCodePoint
            }
          }
          break
        case 3:
          secondByte = buf[i + 1]
          thirdByte = buf[i + 2]
          if ((secondByte & 0xC0) === 0x80 && (thirdByte & 0xC0) === 0x80) {
            tempCodePoint = (firstByte & 0xF) << 0xC | (secondByte & 0x3F) << 0x6 | (thirdByte & 0x3F)
            if (tempCodePoint > 0x7FF && (tempCodePoint < 0xD800 || tempCodePoint > 0xDFFF)) {
              codePoint = tempCodePoint
            }
          }
          break
        case 4:
          secondByte = buf[i + 1]
          thirdByte = buf[i + 2]
          fourthByte = buf[i + 3]
          if ((secondByte & 0xC0) === 0x80 && (thirdByte & 0xC0) === 0x80 && (fourthByte & 0xC0) === 0x80) {
            tempCodePoint = (firstByte & 0xF) << 0x12 | (secondByte & 0x3F) << 0xC | (thirdByte & 0x3F) << 0x6 | (fourthByte & 0x3F)
            if (tempCodePoint > 0xFFFF && tempCodePoint < 0x110000) {
              codePoint = tempCodePoint
            }
          }
      }
    }

    if (codePoint === null) {
      // we did not generate a valid codePoint so insert a
      // replacement char (U+FFFD) and advance only 1 byte
      codePoint = 0xFFFD
      bytesPerSequence = 1
    } else if (codePoint > 0xFFFF) {
      // encode to utf16 (surrogate pair dance)
      codePoint -= 0x10000
      res.push(codePoint >>> 10 & 0x3FF | 0xD800)
      codePoint = 0xDC00 | codePoint & 0x3FF
    }

    res.push(codePoint)
    i += bytesPerSequence
  }

  return decodeCodePointsArray(res)
}

// Based on http://stackoverflow.com/a/22747272/680742, the browser with
// the lowest limit is Chrome, with 0x10000 args.
// We go 1 magnitude less, for safety
var MAX_ARGUMENTS_LENGTH = 0x1000

function decodeCodePointsArray (codePoints) {
  var len = codePoints.length
  if (len <= MAX_ARGUMENTS_LENGTH) {
    return String.fromCharCode.apply(String, codePoints) // avoid extra slice()
  }

  // Decode in chunks to avoid "call stack size exceeded".
  var res = ''
  var i = 0
  while (i < len) {
    res += String.fromCharCode.apply(
      String,
      codePoints.slice(i, i += MAX_ARGUMENTS_LENGTH)
    )
  }
  return res
}

function asciiSlice (buf, start, end) {
  var ret = ''
  end = Math.min(buf.length, end)

  for (var i = start; i < end; ++i) {
    ret += String.fromCharCode(buf[i] & 0x7F)
  }
  return ret
}

function latin1Slice (buf, start, end) {
  var ret = ''
  end = Math.min(buf.length, end)

  for (var i = start; i < end; ++i) {
    ret += String.fromCharCode(buf[i])
  }
  return ret
}

function hexSlice (buf, start, end) {
  var len = buf.length

  if (!start || start < 0) start = 0
  if (!end || end < 0 || end > len) end = len

  var out = ''
  for (var i = start; i < end; ++i) {
    out += toHex(buf[i])
  }
  return out
}

function utf16leSlice (buf, start, end) {
  var bytes = buf.slice(start, end)
  var res = ''
  for (var i = 0; i < bytes.length; i += 2) {
    res += String.fromCharCode(bytes[i] + bytes[i + 1] * 256)
  }
  return res
}

Buffer.prototype.slice = function slice (start, end) {
  var len = this.length
  start = ~~start
  end = end === undefined ? len : ~~end

  if (start < 0) {
    start += len
    if (start < 0) start = 0
  } else if (start > len) {
    start = len
  }

  if (end < 0) {
    end += len
    if (end < 0) end = 0
  } else if (end > len) {
    end = len
  }

  if (end < start) end = start

  var newBuf
  if (Buffer.TYPED_ARRAY_SUPPORT) {
    newBuf = this.subarray(start, end)
    newBuf.__proto__ = Buffer.prototype
  } else {
    var sliceLen = end - start
    newBuf = new Buffer(sliceLen, undefined)
    for (var i = 0; i < sliceLen; ++i) {
      newBuf[i] = this[i + start]
    }
  }

  return newBuf
}

/*
 * Need to make sure that buffer isn't trying to write out of bounds.
 */
function checkOffset (offset, ext, length) {
  if ((offset % 1) !== 0 || offset < 0) throw new RangeError('offset is not uint')
  if (offset + ext > length) throw new RangeError('Trying to access beyond buffer length')
}

Buffer.prototype.readUIntLE = function readUIntLE (offset, byteLength, noAssert) {
  offset = offset | 0
  byteLength = byteLength | 0
  if (!noAssert) checkOffset(offset, byteLength, this.length)

  var val = this[offset]
  var mul = 1
  var i = 0
  while (++i < byteLength && (mul *= 0x100)) {
    val += this[offset + i] * mul
  }

  return val
}

Buffer.prototype.readUIntBE = function readUIntBE (offset, byteLength, noAssert) {
  offset = offset | 0
  byteLength = byteLength | 0
  if (!noAssert) {
    checkOffset(offset, byteLength, this.length)
  }

  var val = this[offset + --byteLength]
  var mul = 1
  while (byteLength > 0 && (mul *= 0x100)) {
    val += this[offset + --byteLength] * mul
  }

  return val
}

Buffer.prototype.readUInt8 = function readUInt8 (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 1, this.length)
  return this[offset]
}

Buffer.prototype.readUInt16LE = function readUInt16LE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 2, this.length)
  return this[offset] | (this[offset + 1] << 8)
}

Buffer.prototype.readUInt16BE = function readUInt16BE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 2, this.length)
  return (this[offset] << 8) | this[offset + 1]
}

Buffer.prototype.readUInt32LE = function readUInt32LE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 4, this.length)

  return ((this[offset]) |
      (this[offset + 1] << 8) |
      (this[offset + 2] << 16)) +
      (this[offset + 3] * 0x1000000)
}

Buffer.prototype.readUInt32BE = function readUInt32BE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 4, this.length)

  return (this[offset] * 0x1000000) +
    ((this[offset + 1] << 16) |
    (this[offset + 2] << 8) |
    this[offset + 3])
}

Buffer.prototype.readIntLE = function readIntLE (offset, byteLength, noAssert) {
  offset = offset | 0
  byteLength = byteLength | 0
  if (!noAssert) checkOffset(offset, byteLength, this.length)

  var val = this[offset]
  var mul = 1
  var i = 0
  while (++i < byteLength && (mul *= 0x100)) {
    val += this[offset + i] * mul
  }
  mul *= 0x80

  if (val >= mul) val -= Math.pow(2, 8 * byteLength)

  return val
}

Buffer.prototype.readIntBE = function readIntBE (offset, byteLength, noAssert) {
  offset = offset | 0
  byteLength = byteLength | 0
  if (!noAssert) checkOffset(offset, byteLength, this.length)

  var i = byteLength
  var mul = 1
  var val = this[offset + --i]
  while (i > 0 && (mul *= 0x100)) {
    val += this[offset + --i] * mul
  }
  mul *= 0x80

  if (val >= mul) val -= Math.pow(2, 8 * byteLength)

  return val
}

Buffer.prototype.readInt8 = function readInt8 (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 1, this.length)
  if (!(this[offset] & 0x80)) return (this[offset])
  return ((0xff - this[offset] + 1) * -1)
}

Buffer.prototype.readInt16LE = function readInt16LE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 2, this.length)
  var val = this[offset] | (this[offset + 1] << 8)
  return (val & 0x8000) ? val | 0xFFFF0000 : val
}

Buffer.prototype.readInt16BE = function readInt16BE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 2, this.length)
  var val = this[offset + 1] | (this[offset] << 8)
  return (val & 0x8000) ? val | 0xFFFF0000 : val
}

Buffer.prototype.readInt32LE = function readInt32LE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 4, this.length)

  return (this[offset]) |
    (this[offset + 1] << 8) |
    (this[offset + 2] << 16) |
    (this[offset + 3] << 24)
}

Buffer.prototype.readInt32BE = function readInt32BE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 4, this.length)

  return (this[offset] << 24) |
    (this[offset + 1] << 16) |
    (this[offset + 2] << 8) |
    (this[offset + 3])
}

Buffer.prototype.readFloatLE = function readFloatLE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 4, this.length)
  return ieee754.read(this, offset, true, 23, 4)
}

Buffer.prototype.readFloatBE = function readFloatBE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 4, this.length)
  return ieee754.read(this, offset, false, 23, 4)
}

Buffer.prototype.readDoubleLE = function readDoubleLE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 8, this.length)
  return ieee754.read(this, offset, true, 52, 8)
}

Buffer.prototype.readDoubleBE = function readDoubleBE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 8, this.length)
  return ieee754.read(this, offset, false, 52, 8)
}

function checkInt (buf, value, offset, ext, max, min) {
  if (!Buffer.isBuffer(buf)) throw new TypeError('"buffer" argument must be a Buffer instance')
  if (value > max || value < min) throw new RangeError('"value" argument is out of bounds')
  if (offset + ext > buf.length) throw new RangeError('Index out of range')
}

Buffer.prototype.writeUIntLE = function writeUIntLE (value, offset, byteLength, noAssert) {
  value = +value
  offset = offset | 0
  byteLength = byteLength | 0
  if (!noAssert) {
    var maxBytes = Math.pow(2, 8 * byteLength) - 1
    checkInt(this, value, offset, byteLength, maxBytes, 0)
  }

  var mul = 1
  var i = 0
  this[offset] = value & 0xFF
  while (++i < byteLength && (mul *= 0x100)) {
    this[offset + i] = (value / mul) & 0xFF
  }

  return offset + byteLength
}

Buffer.prototype.writeUIntBE = function writeUIntBE (value, offset, byteLength, noAssert) {
  value = +value
  offset = offset | 0
  byteLength = byteLength | 0
  if (!noAssert) {
    var maxBytes = Math.pow(2, 8 * byteLength) - 1
    checkInt(this, value, offset, byteLength, maxBytes, 0)
  }

  var i = byteLength - 1
  var mul = 1
  this[offset + i] = value & 0xFF
  while (--i >= 0 && (mul *= 0x100)) {
    this[offset + i] = (value / mul) & 0xFF
  }

  return offset + byteLength
}

Buffer.prototype.writeUInt8 = function writeUInt8 (value, offset, noAssert) {
  value = +value
  offset = offset | 0
  if (!noAssert) checkInt(this, value, offset, 1, 0xff, 0)
  if (!Buffer.TYPED_ARRAY_SUPPORT) value = Math.floor(value)
  this[offset] = (value & 0xff)
  return offset + 1
}

function objectWriteUInt16 (buf, value, offset, littleEndian) {
  if (value < 0) value = 0xffff + value + 1
  for (var i = 0, j = Math.min(buf.length - offset, 2); i < j; ++i) {
    buf[offset + i] = (value & (0xff << (8 * (littleEndian ? i : 1 - i)))) >>>
      (littleEndian ? i : 1 - i) * 8
  }
}

Buffer.prototype.writeUInt16LE = function writeUInt16LE (value, offset, noAssert) {
  value = +value
  offset = offset | 0
  if (!noAssert) checkInt(this, value, offset, 2, 0xffff, 0)
  if (Buffer.TYPED_ARRAY_SUPPORT) {
    this[offset] = (value & 0xff)
    this[offset + 1] = (value >>> 8)
  } else {
    objectWriteUInt16(this, value, offset, true)
  }
  return offset + 2
}

Buffer.prototype.writeUInt16BE = function writeUInt16BE (value, offset, noAssert) {
  value = +value
  offset = offset | 0
  if (!noAssert) checkInt(this, value, offset, 2, 0xffff, 0)
  if (Buffer.TYPED_ARRAY_SUPPORT) {
    this[offset] = (value >>> 8)
    this[offset + 1] = (value & 0xff)
  } else {
    objectWriteUInt16(this, value, offset, false)
  }
  return offset + 2
}

function objectWriteUInt32 (buf, value, offset, littleEndian) {
  if (value < 0) value = 0xffffffff + value + 1
  for (var i = 0, j = Math.min(buf.length - offset, 4); i < j; ++i) {
    buf[offset + i] = (value >>> (littleEndian ? i : 3 - i) * 8) & 0xff
  }
}

Buffer.prototype.writeUInt32LE = function writeUInt32LE (value, offset, noAssert) {
  value = +value
  offset = offset | 0
  if (!noAssert) checkInt(this, value, offset, 4, 0xffffffff, 0)
  if (Buffer.TYPED_ARRAY_SUPPORT) {
    this[offset + 3] = (value >>> 24)
    this[offset + 2] = (value >>> 16)
    this[offset + 1] = (value >>> 8)
    this[offset] = (value & 0xff)
  } else {
    objectWriteUInt32(this, value, offset, true)
  }
  return offset + 4
}

Buffer.prototype.writeUInt32BE = function writeUInt32BE (value, offset, noAssert) {
  value = +value
  offset = offset | 0
  if (!noAssert) checkInt(this, value, offset, 4, 0xffffffff, 0)
  if (Buffer.TYPED_ARRAY_SUPPORT) {
    this[offset] = (value >>> 24)
    this[offset + 1] = (value >>> 16)
    this[offset + 2] = (value >>> 8)
    this[offset + 3] = (value & 0xff)
  } else {
    objectWriteUInt32(this, value, offset, false)
  }
  return offset + 4
}

Buffer.prototype.writeIntLE = function writeIntLE (value, offset, byteLength, noAssert) {
  value = +value
  offset = offset | 0
  if (!noAssert) {
    var limit = Math.pow(2, 8 * byteLength - 1)

    checkInt(this, value, offset, byteLength, limit - 1, -limit)
  }

  var i = 0
  var mul = 1
  var sub = 0
  this[offset] = value & 0xFF
  while (++i < byteLength && (mul *= 0x100)) {
    if (value < 0 && sub === 0 && this[offset + i - 1] !== 0) {
      sub = 1
    }
    this[offset + i] = ((value / mul) >> 0) - sub & 0xFF
  }

  return offset + byteLength
}

Buffer.prototype.writeIntBE = function writeIntBE (value, offset, byteLength, noAssert) {
  value = +value
  offset = offset | 0
  if (!noAssert) {
    var limit = Math.pow(2, 8 * byteLength - 1)

    checkInt(this, value, offset, byteLength, limit - 1, -limit)
  }

  var i = byteLength - 1
  var mul = 1
  var sub = 0
  this[offset + i] = value & 0xFF
  while (--i >= 0 && (mul *= 0x100)) {
    if (value < 0 && sub === 0 && this[offset + i + 1] !== 0) {
      sub = 1
    }
    this[offset + i] = ((value / mul) >> 0) - sub & 0xFF
  }

  return offset + byteLength
}

Buffer.prototype.writeInt8 = function writeInt8 (value, offset, noAssert) {
  value = +value
  offset = offset | 0
  if (!noAssert) checkInt(this, value, offset, 1, 0x7f, -0x80)
  if (!Buffer.TYPED_ARRAY_SUPPORT) value = Math.floor(value)
  if (value < 0) value = 0xff + value + 1
  this[offset] = (value & 0xff)
  return offset + 1
}

Buffer.prototype.writeInt16LE = function writeInt16LE (value, offset, noAssert) {
  value = +value
  offset = offset | 0
  if (!noAssert) checkInt(this, value, offset, 2, 0x7fff, -0x8000)
  if (Buffer.TYPED_ARRAY_SUPPORT) {
    this[offset] = (value & 0xff)
    this[offset + 1] = (value >>> 8)
  } else {
    objectWriteUInt16(this, value, offset, true)
  }
  return offset + 2
}

Buffer.prototype.writeInt16BE = function writeInt16BE (value, offset, noAssert) {
  value = +value
  offset = offset | 0
  if (!noAssert) checkInt(this, value, offset, 2, 0x7fff, -0x8000)
  if (Buffer.TYPED_ARRAY_SUPPORT) {
    this[offset] = (value >>> 8)
    this[offset + 1] = (value & 0xff)
  } else {
    objectWriteUInt16(this, value, offset, false)
  }
  return offset + 2
}

Buffer.prototype.writeInt32LE = function writeInt32LE (value, offset, noAssert) {
  value = +value
  offset = offset | 0
  if (!noAssert) checkInt(this, value, offset, 4, 0x7fffffff, -0x80000000)
  if (Buffer.TYPED_ARRAY_SUPPORT) {
    this[offset] = (value & 0xff)
    this[offset + 1] = (value >>> 8)
    this[offset + 2] = (value >>> 16)
    this[offset + 3] = (value >>> 24)
  } else {
    objectWriteUInt32(this, value, offset, true)
  }
  return offset + 4
}

Buffer.prototype.writeInt32BE = function writeInt32BE (value, offset, noAssert) {
  value = +value
  offset = offset | 0
  if (!noAssert) checkInt(this, value, offset, 4, 0x7fffffff, -0x80000000)
  if (value < 0) value = 0xffffffff + value + 1
  if (Buffer.TYPED_ARRAY_SUPPORT) {
    this[offset] = (value >>> 24)
    this[offset + 1] = (value >>> 16)
    this[offset + 2] = (value >>> 8)
    this[offset + 3] = (value & 0xff)
  } else {
    objectWriteUInt32(this, value, offset, false)
  }
  return offset + 4
}

function checkIEEE754 (buf, value, offset, ext, max, min) {
  if (offset + ext > buf.length) throw new RangeError('Index out of range')
  if (offset < 0) throw new RangeError('Index out of range')
}

function writeFloat (buf, value, offset, littleEndian, noAssert) {
  if (!noAssert) {
    checkIEEE754(buf, value, offset, 4, 3.4028234663852886e+38, -3.4028234663852886e+38)
  }
  ieee754.write(buf, value, offset, littleEndian, 23, 4)
  return offset + 4
}

Buffer.prototype.writeFloatLE = function writeFloatLE (value, offset, noAssert) {
  return writeFloat(this, value, offset, true, noAssert)
}

Buffer.prototype.writeFloatBE = function writeFloatBE (value, offset, noAssert) {
  return writeFloat(this, value, offset, false, noAssert)
}

function writeDouble (buf, value, offset, littleEndian, noAssert) {
  if (!noAssert) {
    checkIEEE754(buf, value, offset, 8, 1.7976931348623157E+308, -1.7976931348623157E+308)
  }
  ieee754.write(buf, value, offset, littleEndian, 52, 8)
  return offset + 8
}

Buffer.prototype.writeDoubleLE = function writeDoubleLE (value, offset, noAssert) {
  return writeDouble(this, value, offset, true, noAssert)
}

Buffer.prototype.writeDoubleBE = function writeDoubleBE (value, offset, noAssert) {
  return writeDouble(this, value, offset, false, noAssert)
}

// copy(targetBuffer, targetStart=0, sourceStart=0, sourceEnd=buffer.length)
Buffer.prototype.copy = function copy (target, targetStart, start, end) {
  if (!start) start = 0
  if (!end && end !== 0) end = this.length
  if (targetStart >= target.length) targetStart = target.length
  if (!targetStart) targetStart = 0
  if (end > 0 && end < start) end = start

  // Copy 0 bytes; we're done
  if (end === start) return 0
  if (target.length === 0 || this.length === 0) return 0

  // Fatal error conditions
  if (targetStart < 0) {
    throw new RangeError('targetStart out of bounds')
  }
  if (start < 0 || start >= this.length) throw new RangeError('sourceStart out of bounds')
  if (end < 0) throw new RangeError('sourceEnd out of bounds')

  // Are we oob?
  if (end > this.length) end = this.length
  if (target.length - targetStart < end - start) {
    end = target.length - targetStart + start
  }

  var len = end - start
  var i

  if (this === target && start < targetStart && targetStart < end) {
    // descending copy from end
    for (i = len - 1; i >= 0; --i) {
      target[i + targetStart] = this[i + start]
    }
  } else if (len < 1000 || !Buffer.TYPED_ARRAY_SUPPORT) {
    // ascending copy from start
    for (i = 0; i < len; ++i) {
      target[i + targetStart] = this[i + start]
    }
  } else {
    Uint8Array.prototype.set.call(
      target,
      this.subarray(start, start + len),
      targetStart
    )
  }

  return len
}

// Usage:
//    buffer.fill(number[, offset[, end]])
//    buffer.fill(buffer[, offset[, end]])
//    buffer.fill(string[, offset[, end]][, encoding])
Buffer.prototype.fill = function fill (val, start, end, encoding) {
  // Handle string cases:
  if (typeof val === 'string') {
    if (typeof start === 'string') {
      encoding = start
      start = 0
      end = this.length
    } else if (typeof end === 'string') {
      encoding = end
      end = this.length
    }
    if (val.length === 1) {
      var code = val.charCodeAt(0)
      if (code < 256) {
        val = code
      }
    }
    if (encoding !== undefined && typeof encoding !== 'string') {
      throw new TypeError('encoding must be a string')
    }
    if (typeof encoding === 'string' && !Buffer.isEncoding(encoding)) {
      throw new TypeError('Unknown encoding: ' + encoding)
    }
  } else if (typeof val === 'number') {
    val = val & 255
  }

  // Invalid ranges are not set to a default, so can range check early.
  if (start < 0 || this.length < start || this.length < end) {
    throw new RangeError('Out of range index')
  }

  if (end <= start) {
    return this
  }

  start = start >>> 0
  end = end === undefined ? this.length : end >>> 0

  if (!val) val = 0

  var i
  if (typeof val === 'number') {
    for (i = start; i < end; ++i) {
      this[i] = val
    }
  } else {
    var bytes = Buffer.isBuffer(val)
      ? val
      : utf8ToBytes(new Buffer(val, encoding).toString())
    var len = bytes.length
    for (i = 0; i < end - start; ++i) {
      this[i + start] = bytes[i % len]
    }
  }

  return this
}

// HELPER FUNCTIONS
// ================

var INVALID_BASE64_RE = /[^+\/0-9A-Za-z-_]/g

function base64clean (str) {
  // Node strips out invalid characters like \n and \t from the string, base64-js does not
  str = stringtrim(str).replace(INVALID_BASE64_RE, '')
  // Node converts strings with length < 2 to ''
  if (str.length < 2) return ''
  // Node allows for non-padded base64 strings (missing trailing ===), base64-js does not
  while (str.length % 4 !== 0) {
    str = str + '='
  }
  return str
}

function stringtrim (str) {
  if (str.trim) return str.trim()
  return str.replace(/^\s+|\s+$/g, '')
}

function toHex (n) {
  if (n < 16) return '0' + n.toString(16)
  return n.toString(16)
}

function utf8ToBytes (string, units) {
  units = units || Infinity
  var codePoint
  var length = string.length
  var leadSurrogate = null
  var bytes = []

  for (var i = 0; i < length; ++i) {
    codePoint = string.charCodeAt(i)

    // is surrogate component
    if (codePoint > 0xD7FF && codePoint < 0xE000) {
      // last char was a lead
      if (!leadSurrogate) {
        // no lead yet
        if (codePoint > 0xDBFF) {
          // unexpected trail
          if ((units -= 3) > -1) bytes.push(0xEF, 0xBF, 0xBD)
          continue
        } else if (i + 1 === length) {
          // unpaired lead
          if ((units -= 3) > -1) bytes.push(0xEF, 0xBF, 0xBD)
          continue
        }

        // valid lead
        leadSurrogate = codePoint

        continue
      }

      // 2 leads in a row
      if (codePoint < 0xDC00) {
        if ((units -= 3) > -1) bytes.push(0xEF, 0xBF, 0xBD)
        leadSurrogate = codePoint
        continue
      }

      // valid surrogate pair
      codePoint = (leadSurrogate - 0xD800 << 10 | codePoint - 0xDC00) + 0x10000
    } else if (leadSurrogate) {
      // valid bmp char, but last char was a lead
      if ((units -= 3) > -1) bytes.push(0xEF, 0xBF, 0xBD)
    }

    leadSurrogate = null

    // encode utf8
    if (codePoint < 0x80) {
      if ((units -= 1) < 0) break
      bytes.push(codePoint)
    } else if (codePoint < 0x800) {
      if ((units -= 2) < 0) break
      bytes.push(
        codePoint >> 0x6 | 0xC0,
        codePoint & 0x3F | 0x80
      )
    } else if (codePoint < 0x10000) {
      if ((units -= 3) < 0) break
      bytes.push(
        codePoint >> 0xC | 0xE0,
        codePoint >> 0x6 & 0x3F | 0x80,
        codePoint & 0x3F | 0x80
      )
    } else if (codePoint < 0x110000) {
      if ((units -= 4) < 0) break
      bytes.push(
        codePoint >> 0x12 | 0xF0,
        codePoint >> 0xC & 0x3F | 0x80,
        codePoint >> 0x6 & 0x3F | 0x80,
        codePoint & 0x3F | 0x80
      )
    } else {
      throw new Error('Invalid code point')
    }
  }

  return bytes
}

function asciiToBytes (str) {
  var byteArray = []
  for (var i = 0; i < str.length; ++i) {
    // Node's code seems to be doing this and not & 0x7F..
    byteArray.push(str.charCodeAt(i) & 0xFF)
  }
  return byteArray
}

function utf16leToBytes (str, units) {
  var c, hi, lo
  var byteArray = []
  for (var i = 0; i < str.length; ++i) {
    if ((units -= 2) < 0) break

    c = str.charCodeAt(i)
    hi = c >> 8
    lo = c % 256
    byteArray.push(lo)
    byteArray.push(hi)
  }

  return byteArray
}

function base64ToBytes (str) {
  return base64.toByteArray(base64clean(str))
}

function blitBuffer (src, dst, offset, length) {
  for (var i = 0; i < length; ++i) {
    if ((i + offset >= dst.length) || (i >= src.length)) break
    dst[i + offset] = src[i]
  }
  return i
}

function isnan (val) {
  return val !== val // eslint-disable-line no-self-compare
}

/* WEBPACK VAR INJECTION */}.call(this, __webpack_require__(8)))

/***/ }),
/* 8 */
/***/ (function(module, exports) {

var g;

// This works in non-strict mode
g = (function() {
	return this;
})();

try {
	// This works if eval is allowed (see CSP)
	g = g || Function("return this")() || (1, eval)("this");
} catch (e) {
	// This works if the window reference is available
	if (typeof window === "object") g = window;
}

// g can still be undefined, but nothing to do about it...
// We return undefined, instead of nothing here, so it's
// easier to handle this case. if(!global) { ...}

module.exports = g;


/***/ }),
/* 9 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function(Buffer) {/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return DERElement; });
/* harmony import */ var _asn1__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(2);
/* harmony import */ var _errors__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(0);
/* harmony import */ var _values__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(1);
/* harmony import */ var _x690__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(4);




class DERElement extends _x690__WEBPACK_IMPORTED_MODULE_3__[/* X690Element */ "a"] {
    set boolean(value) {
        this.value = new Uint8Array(1);
        this.value[0] = (value ? 0xFF : 0x00);
    }
    get boolean() {
        if (this.construction !== 0)
            throw new _errors__WEBPACK_IMPORTED_MODULE_1__[/* ASN1ConstructionError */ "b"]("BOOLEAN cannot be constructed.");
        if (this.value.length !== 1)
            throw new _errors__WEBPACK_IMPORTED_MODULE_1__[/* ASN1SizeError */ "h"]("BOOLEAN not one byte");
        if ((this.value[0] !== 0x00) && (this.value[0] !== 0xFF))
            throw new _errors__WEBPACK_IMPORTED_MODULE_1__[/* ASN1Error */ "c"]("BOOLEAN must be encoded as 0xFF or 0x00.");
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
            throw new _errors__WEBPACK_IMPORTED_MODULE_1__[/* ASN1ConstructionError */ "b"]("BIT STRING cannot be constructed.");
        if (this.value.length === 0)
            throw new _errors__WEBPACK_IMPORTED_MODULE_1__[/* ASN1Error */ "c"]("ASN.1 BIT STRING cannot be encoded on zero bytes!");
        if (this.value.length === 1 && this.value[0] !== 0)
            throw new _errors__WEBPACK_IMPORTED_MODULE_1__[/* ASN1Error */ "c"]("ASN.1 BIT STRING encoded with deceptive first byte!");
        if (this.value[0] > 7)
            throw new _errors__WEBPACK_IMPORTED_MODULE_1__[/* ASN1Error */ "c"]("First byte of an ASN.1 BIT STRING must be <= 7!");
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
                throw new _errors__WEBPACK_IMPORTED_MODULE_1__[/* ASN1Error */ "c"]("BIT STRING had a trailing set bit.");
        });
        ret.length -= this.value[0];
        return ret;
    }
    set octetString(value) {
        this.value = new Uint8Array(value);
    }
    get octetString() {
        if (this.construction !== 0)
            throw new _errors__WEBPACK_IMPORTED_MODULE_1__[/* ASN1ConstructionError */ "b"]("OCTET STRING cannot be constructed.");
        return new Uint8Array(this.value);
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
            throw new _errors__WEBPACK_IMPORTED_MODULE_1__[/* ASN1ConstructionError */ "b"]("REAL cannot be constructed.");
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
                throw new _errors__WEBPACK_IMPORTED_MODULE_1__[/* ASN1UndefinedError */ "j"]("Unrecognized special REAL value!");
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
                    throw new _errors__WEBPACK_IMPORTED_MODULE_1__[/* ASN1Error */ "c"]("No ability to decode bytes to string!");
                }
                switch (this.value[0] & 0b00111111) {
                    case 1:
                    case 2:
                        throw new _errors__WEBPACK_IMPORTED_MODULE_1__[/* ASN1Error */ "c"]("DER prohibits NR1 and NR2 Base-10 REAL");
                    case 3: {
                        if (!_values__WEBPACK_IMPORTED_MODULE_2__[/* nr3Regex */ "t"].test(realString))
                            throw new _errors__WEBPACK_IMPORTED_MODULE_1__[/* ASN1Error */ "c"]("Malformed NR3 Base-10 REAL");
                        return parseFloat(realString.replace(",", "."));
                    }
                    default:
                        throw new _errors__WEBPACK_IMPORTED_MODULE_1__[/* ASN1UndefinedError */ "j"]("Undefined Base-10 REAL encoding.");
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
                            throw new _errors__WEBPACK_IMPORTED_MODULE_1__[/* ASN1Error */ "c"]("Impossible REAL encoding base encountered.");
                    }
                })(this.value[0] & 0b00110000);
                const scale = ((flag) => {
                    switch (flag) {
                        case (0): return 0;
                        case (4): return 1;
                        case (8): return 2;
                        case (12): return 3;
                        default:
                            throw new _errors__WEBPACK_IMPORTED_MODULE_1__[/* ASN1Error */ "c"]("Impossible REAL encoding scale encountered.");
                    }
                })(this.value[0] & 0b00001100);
                let exponent;
                let mantissa;
                switch (this.value[0] & 0b00000011) {
                    case (0b00000000): {
                        if (this.value.length < 3)
                            throw new _errors__WEBPACK_IMPORTED_MODULE_1__[/* ASN1TruncationError */ "i"]("Binary-encoded REAL truncated.");
                        exponent = _asn1__WEBPACK_IMPORTED_MODULE_0__[/* ASN1Element */ "a"].decodeSignedBigEndianInteger(this.value.subarray(1, 2));
                        mantissa = _asn1__WEBPACK_IMPORTED_MODULE_0__[/* ASN1Element */ "a"].decodeUnsignedBigEndianInteger(this.value.subarray(2));
                        break;
                    }
                    case (0b00000001): {
                        if (this.value.length < 4)
                            throw new _errors__WEBPACK_IMPORTED_MODULE_1__[/* ASN1TruncationError */ "i"]("Binary-encoded REAL truncated.");
                        exponent = _asn1__WEBPACK_IMPORTED_MODULE_0__[/* ASN1Element */ "a"].decodeSignedBigEndianInteger(this.value.subarray(1, 3));
                        mantissa = _asn1__WEBPACK_IMPORTED_MODULE_0__[/* ASN1Element */ "a"].decodeUnsignedBigEndianInteger(this.value.subarray(3));
                        if (exponent <= 127 && exponent >= -128)
                            throw new _errors__WEBPACK_IMPORTED_MODULE_1__[/* ASN1Error */ "c"]("DER-encoded binary-encoded REAL could have encoded exponent on fewer octets.");
                        break;
                    }
                    case (0b00000010):
                    case (0b00000011): {
                        throw new _errors__WEBPACK_IMPORTED_MODULE_1__[/* ASN1Error */ "c"]("DER-encoded binary REAL encoded in a way that would either overflow or encode on too many octets.");
                    }
                    default:
                        throw new _errors__WEBPACK_IMPORTED_MODULE_1__[/* ASN1Error */ "c"]("Impossible binary REAL exponent encoding encountered.");
                }
                if (mantissa !== 0 && !(mantissa % 2))
                    throw new _errors__WEBPACK_IMPORTED_MODULE_1__[/* ASN1Error */ "c"]("DER-encoded REAL may not have an even non-zero mantissa.");
                return (sign * mantissa * Math.pow(2, scale) * Math.pow(base, exponent));
            }
            default:
                throw new _errors__WEBPACK_IMPORTED_MODULE_1__[/* ASN1Error */ "c"]("Impossible REAL format encountered.");
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
            throw new _errors__WEBPACK_IMPORTED_MODULE_1__[/* ASN1ConstructionError */ "b"]("UTF8String cannot be constructed.");
        let ret = "";
        if (typeof TextEncoder !== "undefined") {
            ret = (new TextDecoder("utf-8")).decode(new Uint8Array(this.value));
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
            throw new _errors__WEBPACK_IMPORTED_MODULE_1__[/* ASN1ConstructionError */ "b"]("SET or SEQUENCE cannot be primitively constructed.");
        let encodedElements = [];
        if (this.value.length === 0)
            return [];
        let i = 0;
        while (i < this.value.length) {
            const next = new DERElement();
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
                throw new _errors__WEBPACK_IMPORTED_MODULE_1__[/* ASN1CharactersError */ "a"]("NumericString can only contain characters 0 - 9 and space.");
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
            throw new _errors__WEBPACK_IMPORTED_MODULE_1__[/* ASN1ConstructionError */ "b"]("NumericString cannot be constructed.");
        let ret = "";
        if (typeof TextEncoder !== "undefined") {
            ret = (new TextDecoder("utf-8")).decode(new Uint8Array(this.value));
        }
        else if (typeof Buffer !== "undefined") {
            ret = (new Buffer(this.value)).toString("utf-8");
        }
        for (let i = 0; i < ret.length; i++) {
            const characterCode = ret.charCodeAt(i);
            if (!((characterCode >= 0x30 && characterCode <= 0x39) || characterCode === 0x20)) {
                throw new _errors__WEBPACK_IMPORTED_MODULE_1__[/* ASN1CharactersError */ "a"]("NumericString can only contain characters 0 - 9 and space.");
            }
        }
        return ret;
    }
    set printableString(value) {
        for (let i = 0; i < value.length; i++) {
            if (_values__WEBPACK_IMPORTED_MODULE_2__[/* printableStringCharacters */ "u"].indexOf(value.charAt(i)) === -1) {
                throw new _errors__WEBPACK_IMPORTED_MODULE_1__[/* ASN1CharactersError */ "a"](`PrintableString can only contain these characters: ${_values__WEBPACK_IMPORTED_MODULE_2__[/* printableStringCharacters */ "u"]}`);
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
            throw new _errors__WEBPACK_IMPORTED_MODULE_1__[/* ASN1ConstructionError */ "b"]("PrintableString cannot be constructed.");
        let ret = "";
        if (typeof TextEncoder !== "undefined") {
            ret = (new TextDecoder("utf-8")).decode(new Uint8Array(this.value));
        }
        else if (typeof Buffer !== "undefined") {
            ret = (new Buffer(this.value)).toString("utf-8");
        }
        for (let i = 0; i < ret.length; i++) {
            if (_values__WEBPACK_IMPORTED_MODULE_2__[/* printableStringCharacters */ "u"].indexOf(ret.charAt(i)) === -1) {
                throw new _errors__WEBPACK_IMPORTED_MODULE_1__[/* ASN1CharactersError */ "a"](`PrintableString can only contain these characters: ${_values__WEBPACK_IMPORTED_MODULE_2__[/* printableStringCharacters */ "u"]}`);
            }
        }
        return ret;
    }
    set teletexString(value) {
        this.value = new Uint8Array(value);
    }
    get teletexString() {
        return this.octetString;
    }
    set videotexString(value) {
        this.value = new Uint8Array(value);
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
            throw new _errors__WEBPACK_IMPORTED_MODULE_1__[/* ASN1ConstructionError */ "b"]("IA5String cannot be constructed.");
        let ret = "";
        if (typeof TextEncoder !== "undefined") {
            ret = (new TextDecoder("utf-8")).decode(new Uint8Array(this.value));
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
            throw new _errors__WEBPACK_IMPORTED_MODULE_1__[/* ASN1ConstructionError */ "b"]("UTCTime cannot be constructed.");
        let dateString = "";
        if (typeof TextEncoder !== "undefined") {
            dateString = (new TextDecoder("utf-8")).decode(new Uint8Array(this.value));
        }
        else if (typeof Buffer !== "undefined") {
            dateString = (new Buffer(this.value)).toString("utf-8");
        }
        const match = _values__WEBPACK_IMPORTED_MODULE_2__[/* utcTimeRegex */ "v"].exec(dateString);
        if (match === null)
            throw new _errors__WEBPACK_IMPORTED_MODULE_1__[/* ASN1Error */ "c"]("Malformed UTCTime string.");
        if (match.groups === undefined)
            throw new _errors__WEBPACK_IMPORTED_MODULE_1__[/* ASN1Error */ "c"]("Malformed UTCTime string.");
        const ret = new Date();
        let year = Number(match.groups.year);
        year = (year < 70 ? (2000 + year) : (1900 + year));
        const month = (Number(match.groups.month) - 1);
        const date = Number(match.groups.date);
        const hours = Number(match.groups.hour);
        const minutes = Number(match.groups.minute);
        const seconds = Number(match.groups.second);
        DERElement.validateDateTime("UTCTime", year, month, date, hours, minutes, seconds);
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
            throw new _errors__WEBPACK_IMPORTED_MODULE_1__[/* ASN1ConstructionError */ "b"]("GeneralizedTime cannot be constructed.");
        let dateString = "";
        if (typeof TextEncoder !== "undefined") {
            dateString = (new TextDecoder("utf-8")).decode(new Uint8Array(this.value));
        }
        else if (typeof Buffer !== "undefined") {
            dateString = (new Buffer(this.value)).toString("utf-8");
        }
        const match = _values__WEBPACK_IMPORTED_MODULE_2__[/* generalizedTimeRegex */ "q"].exec(dateString);
        if (match === null)
            throw new _errors__WEBPACK_IMPORTED_MODULE_1__[/* ASN1Error */ "c"]("Malformed GeneralizedTime string.");
        if (match.groups === undefined)
            throw new _errors__WEBPACK_IMPORTED_MODULE_1__[/* ASN1Error */ "c"]("Malformed GeneralizedTime string.");
        const ret = new Date();
        const year = Number(match.groups.year);
        const month = (Number(match.groups.month) - 1);
        const date = Number(match.groups.date);
        const hours = Number(match.groups.hour);
        const minutes = Number(match.groups.minute);
        const seconds = Number(match.groups.second);
        DERElement.validateDateTime("GeneralizedTime", year, month, date, hours, minutes, seconds);
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
                throw new _errors__WEBPACK_IMPORTED_MODULE_1__[/* ASN1CharactersError */ "a"]("GraphicString, VisibleString, or ObjectDescriptor " +
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
            throw new _errors__WEBPACK_IMPORTED_MODULE_1__[/* ASN1ConstructionError */ "b"]("GraphicString cannot be constructed.");
        let ret = "";
        if (typeof TextEncoder !== "undefined") {
            ret = (new TextDecoder("utf-8")).decode(new Uint8Array(this.value));
        }
        else if (typeof Buffer !== "undefined") {
            ret = (new Buffer(this.value)).toString("utf-8");
        }
        for (let i = 0; i < ret.length; i++) {
            const characterCode = ret.charCodeAt(i);
            if (characterCode < 0x20 || characterCode > 0x7E) {
                throw new _errors__WEBPACK_IMPORTED_MODULE_1__[/* ASN1CharactersError */ "a"]("GraphicString, VisibleString, or ObjectDescriptor " +
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
                throw new _errors__WEBPACK_IMPORTED_MODULE_1__[/* ASN1CharactersError */ "a"]("GeneralString can only contain ASCII characters.");
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
            throw new _errors__WEBPACK_IMPORTED_MODULE_1__[/* ASN1ConstructionError */ "b"]("GeneralString cannot be constructed.");
        let ret = "";
        if (typeof TextEncoder !== "undefined") {
            ret = (new TextDecoder("windows-1252")).decode(new Uint8Array(this.value));
        }
        else if (typeof Buffer !== "undefined") {
            ret = (new Buffer(this.value)).toString("ascii");
        }
        for (let i = 0; i < ret.length; i++) {
            if (ret.charCodeAt(i) > 0x7F)
                throw new _errors__WEBPACK_IMPORTED_MODULE_1__[/* ASN1CharactersError */ "a"]("GeneralString can only contain ASCII characters.");
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
            throw new _errors__WEBPACK_IMPORTED_MODULE_1__[/* ASN1ConstructionError */ "b"]("UniversalString cannot be constructed.");
        if (this.value.length % 4)
            throw new _errors__WEBPACK_IMPORTED_MODULE_1__[/* ASN1Error */ "c"]("UniversalString encoded on non-mulitple of four bytes.");
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
            throw new _errors__WEBPACK_IMPORTED_MODULE_1__[/* ASN1ConstructionError */ "b"]("BMPString cannot be constructed.");
        if (this.value.length % 2)
            throw new _errors__WEBPACK_IMPORTED_MODULE_1__[/* ASN1Error */ "c"]("BMPString encoded on non-mulitple of two bytes.");
        let ret = "";
        if (typeof TextEncoder !== "undefined") {
            ret = (new TextDecoder("utf-16be")).decode(new Uint8Array(this.value));
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
            throw new _errors__WEBPACK_IMPORTED_MODULE_1__[/* ASN1TruncationError */ "i"]("Tried to decode a DER element that is less than two bytes.");
        if ((this.recursionCount + 1) > DERElement.nestingRecursionLimit)
            throw new _errors__WEBPACK_IMPORTED_MODULE_1__[/* ASN1RecursionError */ "g"]();
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
                throw new _errors__WEBPACK_IMPORTED_MODULE_1__[/* ASN1PaddingError */ "f"]("Leading padding byte on long tag number encoding.");
            this.tagNumber = 0;
            const limit = (((bytes.length - 1) >= 4) ? 4 : (bytes.length - 1));
            while (cursor < limit) {
                if (!(bytes[cursor++] & 0b10000000))
                    break;
            }
            if (bytes[cursor - 1] & 0b10000000) {
                if (limit === bytes.length - 1) {
                    throw new _errors__WEBPACK_IMPORTED_MODULE_1__[/* ASN1TruncationError */ "i"]("ASN.1 tag number appears to have been truncated.");
                }
                else
                    throw new _errors__WEBPACK_IMPORTED_MODULE_1__[/* ASN1OverflowError */ "e"]("ASN.1 tag number too large.");
            }
            for (let i = 1; i < cursor; i++) {
                this.tagNumber <<= 7;
                this.tagNumber |= (bytes[i] & 0x7F);
            }
            if (this.tagNumber <= 31)
                throw new _errors__WEBPACK_IMPORTED_MODULE_1__[/* ASN1Error */ "c"]("ASN.1 tag number could have been encoded in short form.");
        }
        if ((bytes[cursor] & 0b10000000) === 0b10000000) {
            const numberOfLengthOctets = (bytes[cursor] & 0x7F);
            if (numberOfLengthOctets === 0b01111111)
                throw new _errors__WEBPACK_IMPORTED_MODULE_1__[/* ASN1UndefinedError */ "j"]("Length byte with undefined meaning encountered.");
            if (numberOfLengthOctets > 4)
                throw new _errors__WEBPACK_IMPORTED_MODULE_1__[/* ASN1OverflowError */ "e"]("Element length too long to decode to an integer.");
            if (cursor + numberOfLengthOctets >= bytes.length)
                throw new _errors__WEBPACK_IMPORTED_MODULE_1__[/* ASN1TruncationError */ "i"]("Element length bytes appear to have been truncated.");
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
                throw new _errors__WEBPACK_IMPORTED_MODULE_1__[/* ASN1OverflowError */ "e"]("ASN.1 element too large.");
            cursor += (numberOfLengthOctets);
            if ((cursor + length) > bytes.length)
                throw new _errors__WEBPACK_IMPORTED_MODULE_1__[/* ASN1TruncationError */ "i"]("ASN.1 element truncated.");
            if (((length <= 127 && length >= -128) && numberOfLengthOctets > 1) ||
                ((length <= 32767 && length >= -32768) && numberOfLengthOctets > 2) ||
                ((length <= 8388607 && length >= -8388608) && numberOfLengthOctets > 3))
                throw new _errors__WEBPACK_IMPORTED_MODULE_1__[/* ASN1PaddingError */ "f"]("DER-encoded long-form length encoded on more octets than necessary");
            this.value = bytes.slice(cursor, (cursor + length));
            return (cursor + length);
        }
        else {
            const length = (bytes[cursor++] & 0x7F);
            if ((cursor + length) > bytes.length)
                throw new _errors__WEBPACK_IMPORTED_MODULE_1__[/* ASN1TruncationError */ "i"]("ASN.1 element was truncated.");
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

/* WEBPACK VAR INJECTION */}.call(this, __webpack_require__(7).Buffer))

/***/ }),
/* 10 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__(17);


/***/ }),
/* 11 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


exports.byteLength = byteLength
exports.toByteArray = toByteArray
exports.fromByteArray = fromByteArray

var lookup = []
var revLookup = []
var Arr = typeof Uint8Array !== 'undefined' ? Uint8Array : Array

var code = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/'
for (var i = 0, len = code.length; i < len; ++i) {
  lookup[i] = code[i]
  revLookup[code.charCodeAt(i)] = i
}

// Support decoding URL-safe base64 strings, as Node.js does.
// See: https://en.wikipedia.org/wiki/Base64#URL_applications
revLookup['-'.charCodeAt(0)] = 62
revLookup['_'.charCodeAt(0)] = 63

function getLens (b64) {
  var len = b64.length

  if (len % 4 > 0) {
    throw new Error('Invalid string. Length must be a multiple of 4')
  }

  // Trim off extra bytes after placeholder bytes are found
  // See: https://github.com/beatgammit/base64-js/issues/42
  var validLen = b64.indexOf('=')
  if (validLen === -1) validLen = len

  var placeHoldersLen = validLen === len
    ? 0
    : 4 - (validLen % 4)

  return [validLen, placeHoldersLen]
}

// base64 is 4/3 + up to two characters of the original data
function byteLength (b64) {
  var lens = getLens(b64)
  var validLen = lens[0]
  var placeHoldersLen = lens[1]
  return ((validLen + placeHoldersLen) * 3 / 4) - placeHoldersLen
}

function _byteLength (b64, validLen, placeHoldersLen) {
  return ((validLen + placeHoldersLen) * 3 / 4) - placeHoldersLen
}

function toByteArray (b64) {
  var tmp
  var lens = getLens(b64)
  var validLen = lens[0]
  var placeHoldersLen = lens[1]

  var arr = new Arr(_byteLength(b64, validLen, placeHoldersLen))

  var curByte = 0

  // if there are placeholders, only get up to the last complete 4 chars
  var len = placeHoldersLen > 0
    ? validLen - 4
    : validLen

  for (var i = 0; i < len; i += 4) {
    tmp =
      (revLookup[b64.charCodeAt(i)] << 18) |
      (revLookup[b64.charCodeAt(i + 1)] << 12) |
      (revLookup[b64.charCodeAt(i + 2)] << 6) |
      revLookup[b64.charCodeAt(i + 3)]
    arr[curByte++] = (tmp >> 16) & 0xFF
    arr[curByte++] = (tmp >> 8) & 0xFF
    arr[curByte++] = tmp & 0xFF
  }

  if (placeHoldersLen === 2) {
    tmp =
      (revLookup[b64.charCodeAt(i)] << 2) |
      (revLookup[b64.charCodeAt(i + 1)] >> 4)
    arr[curByte++] = tmp & 0xFF
  }

  if (placeHoldersLen === 1) {
    tmp =
      (revLookup[b64.charCodeAt(i)] << 10) |
      (revLookup[b64.charCodeAt(i + 1)] << 4) |
      (revLookup[b64.charCodeAt(i + 2)] >> 2)
    arr[curByte++] = (tmp >> 8) & 0xFF
    arr[curByte++] = tmp & 0xFF
  }

  return arr
}

function tripletToBase64 (num) {
  return lookup[num >> 18 & 0x3F] +
    lookup[num >> 12 & 0x3F] +
    lookup[num >> 6 & 0x3F] +
    lookup[num & 0x3F]
}

function encodeChunk (uint8, start, end) {
  var tmp
  var output = []
  for (var i = start; i < end; i += 3) {
    tmp =
      ((uint8[i] << 16) & 0xFF0000) +
      ((uint8[i + 1] << 8) & 0xFF00) +
      (uint8[i + 2] & 0xFF)
    output.push(tripletToBase64(tmp))
  }
  return output.join('')
}

function fromByteArray (uint8) {
  var tmp
  var len = uint8.length
  var extraBytes = len % 3 // if we have 1 byte left, pad 2 bytes
  var parts = []
  var maxChunkLength = 16383 // must be multiple of 3

  // go through the array every three bytes, we'll deal with trailing stuff later
  for (var i = 0, len2 = len - extraBytes; i < len2; i += maxChunkLength) {
    parts.push(encodeChunk(
      uint8, i, (i + maxChunkLength) > len2 ? len2 : (i + maxChunkLength)
    ))
  }

  // pad the end with zeros, but make sure to not forget the extra bytes
  if (extraBytes === 1) {
    tmp = uint8[len - 1]
    parts.push(
      lookup[tmp >> 2] +
      lookup[(tmp << 4) & 0x3F] +
      '=='
    )
  } else if (extraBytes === 2) {
    tmp = (uint8[len - 2] << 8) + uint8[len - 1]
    parts.push(
      lookup[tmp >> 10] +
      lookup[(tmp >> 4) & 0x3F] +
      lookup[(tmp << 2) & 0x3F] +
      '='
    )
  }

  return parts.join('')
}


/***/ }),
/* 12 */
/***/ (function(module, exports) {

exports.read = function (buffer, offset, isLE, mLen, nBytes) {
  var e, m
  var eLen = (nBytes * 8) - mLen - 1
  var eMax = (1 << eLen) - 1
  var eBias = eMax >> 1
  var nBits = -7
  var i = isLE ? (nBytes - 1) : 0
  var d = isLE ? -1 : 1
  var s = buffer[offset + i]

  i += d

  e = s & ((1 << (-nBits)) - 1)
  s >>= (-nBits)
  nBits += eLen
  for (; nBits > 0; e = (e * 256) + buffer[offset + i], i += d, nBits -= 8) {}

  m = e & ((1 << (-nBits)) - 1)
  e >>= (-nBits)
  nBits += mLen
  for (; nBits > 0; m = (m * 256) + buffer[offset + i], i += d, nBits -= 8) {}

  if (e === 0) {
    e = 1 - eBias
  } else if (e === eMax) {
    return m ? NaN : ((s ? -1 : 1) * Infinity)
  } else {
    m = m + Math.pow(2, mLen)
    e = e - eBias
  }
  return (s ? -1 : 1) * m * Math.pow(2, e - mLen)
}

exports.write = function (buffer, value, offset, isLE, mLen, nBytes) {
  var e, m, c
  var eLen = (nBytes * 8) - mLen - 1
  var eMax = (1 << eLen) - 1
  var eBias = eMax >> 1
  var rt = (mLen === 23 ? Math.pow(2, -24) - Math.pow(2, -77) : 0)
  var i = isLE ? 0 : (nBytes - 1)
  var d = isLE ? 1 : -1
  var s = value < 0 || (value === 0 && 1 / value < 0) ? 1 : 0

  value = Math.abs(value)

  if (isNaN(value) || value === Infinity) {
    m = isNaN(value) ? 1 : 0
    e = eMax
  } else {
    e = Math.floor(Math.log(value) / Math.LN2)
    if (value * (c = Math.pow(2, -e)) < 1) {
      e--
      c *= 2
    }
    if (e + eBias >= 1) {
      value += rt / c
    } else {
      value += rt * Math.pow(2, 1 - eBias)
    }
    if (value * c >= 2) {
      e++
      c /= 2
    }

    if (e + eBias >= eMax) {
      m = 0
      e = eMax
    } else if (e + eBias >= 1) {
      m = ((value * c) - 1) * Math.pow(2, mLen)
      e = e + eBias
    } else {
      m = value * Math.pow(2, eBias - 1) * Math.pow(2, mLen)
      e = 0
    }
  }

  for (; mLen >= 8; buffer[offset + i] = m & 0xff, i += d, m /= 256, mLen -= 8) {}

  e = (e << mLen) | m
  eLen += mLen
  for (; eLen > 0; buffer[offset + i] = e & 0xff, i += d, e /= 256, eLen -= 8) {}

  buffer[offset + i - d] |= s * 128
}


/***/ }),
/* 13 */
/***/ (function(module, exports) {

var toString = {}.toString;

module.exports = Array.isArray || function (arr) {
  return toString.call(arr) == '[object Array]';
};


/***/ }),
/* 14 */
/***/ (function(module, exports) {

// shim for using process in browser
var process = module.exports = {};

// cached from whatever global is present so that test runners that stub it
// don't break things.  But we need to wrap it in a try catch in case it is
// wrapped in strict mode code which doesn't define any globals.  It's inside a
// function because try/catches deoptimize in certain engines.

var cachedSetTimeout;
var cachedClearTimeout;

function defaultSetTimout() {
    throw new Error('setTimeout has not been defined');
}
function defaultClearTimeout () {
    throw new Error('clearTimeout has not been defined');
}
(function () {
    try {
        if (typeof setTimeout === 'function') {
            cachedSetTimeout = setTimeout;
        } else {
            cachedSetTimeout = defaultSetTimout;
        }
    } catch (e) {
        cachedSetTimeout = defaultSetTimout;
    }
    try {
        if (typeof clearTimeout === 'function') {
            cachedClearTimeout = clearTimeout;
        } else {
            cachedClearTimeout = defaultClearTimeout;
        }
    } catch (e) {
        cachedClearTimeout = defaultClearTimeout;
    }
} ())
function runTimeout(fun) {
    if (cachedSetTimeout === setTimeout) {
        //normal enviroments in sane situations
        return setTimeout(fun, 0);
    }
    // if setTimeout wasn't available but was latter defined
    if ((cachedSetTimeout === defaultSetTimout || !cachedSetTimeout) && setTimeout) {
        cachedSetTimeout = setTimeout;
        return setTimeout(fun, 0);
    }
    try {
        // when when somebody has screwed with setTimeout but no I.E. maddness
        return cachedSetTimeout(fun, 0);
    } catch(e){
        try {
            // When we are in I.E. but the script has been evaled so I.E. doesn't trust the global object when called normally
            return cachedSetTimeout.call(null, fun, 0);
        } catch(e){
            // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error
            return cachedSetTimeout.call(this, fun, 0);
        }
    }


}
function runClearTimeout(marker) {
    if (cachedClearTimeout === clearTimeout) {
        //normal enviroments in sane situations
        return clearTimeout(marker);
    }
    // if clearTimeout wasn't available but was latter defined
    if ((cachedClearTimeout === defaultClearTimeout || !cachedClearTimeout) && clearTimeout) {
        cachedClearTimeout = clearTimeout;
        return clearTimeout(marker);
    }
    try {
        // when when somebody has screwed with setTimeout but no I.E. maddness
        return cachedClearTimeout(marker);
    } catch (e){
        try {
            // When we are in I.E. but the script has been evaled so I.E. doesn't  trust the global object when called normally
            return cachedClearTimeout.call(null, marker);
        } catch (e){
            // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error.
            // Some versions of I.E. have different rules for clearTimeout vs setTimeout
            return cachedClearTimeout.call(this, marker);
        }
    }



}
var queue = [];
var draining = false;
var currentQueue;
var queueIndex = -1;

function cleanUpNextTick() {
    if (!draining || !currentQueue) {
        return;
    }
    draining = false;
    if (currentQueue.length) {
        queue = currentQueue.concat(queue);
    } else {
        queueIndex = -1;
    }
    if (queue.length) {
        drainQueue();
    }
}

function drainQueue() {
    if (draining) {
        return;
    }
    var timeout = runTimeout(cleanUpNextTick);
    draining = true;

    var len = queue.length;
    while(len) {
        currentQueue = queue;
        queue = [];
        while (++queueIndex < len) {
            if (currentQueue) {
                currentQueue[queueIndex].run();
            }
        }
        queueIndex = -1;
        len = queue.length;
    }
    currentQueue = null;
    draining = false;
    runClearTimeout(timeout);
}

process.nextTick = function (fun) {
    var args = new Array(arguments.length - 1);
    if (arguments.length > 1) {
        for (var i = 1; i < arguments.length; i++) {
            args[i - 1] = arguments[i];
        }
    }
    queue.push(new Item(fun, args));
    if (queue.length === 1 && !draining) {
        runTimeout(drainQueue);
    }
};

// v8 likes predictible objects
function Item(fun, array) {
    this.fun = fun;
    this.array = array;
}
Item.prototype.run = function () {
    this.fun.apply(null, this.array);
};
process.title = 'browser';
process.browser = true;
process.env = {};
process.argv = [];
process.version = ''; // empty string to avoid regexp issues
process.versions = {};

function noop() {}

process.on = noop;
process.addListener = noop;
process.once = noop;
process.off = noop;
process.removeListener = noop;
process.removeAllListeners = noop;
process.emit = noop;
process.prependListener = noop;
process.prependOnceListener = noop;

process.listeners = function (name) { return [] }

process.binding = function (name) {
    throw new Error('process.binding is not supported');
};

process.cwd = function () { return '/' };
process.chdir = function (dir) {
    throw new Error('process.chdir is not supported');
};
process.umask = function() { return 0; };


/***/ }),
/* 15 */
/***/ (function(module, exports) {

module.exports = function isBuffer(arg) {
  return arg && typeof arg === 'object'
    && typeof arg.copy === 'function'
    && typeof arg.fill === 'function'
    && typeof arg.readUInt8 === 'function';
}

/***/ }),
/* 16 */
/***/ (function(module, exports) {

if (typeof Object.create === 'function') {
  // implementation from standard node.js 'util' module
  module.exports = function inherits(ctor, superCtor) {
    ctor.super_ = superCtor
    ctor.prototype = Object.create(superCtor.prototype, {
      constructor: {
        value: ctor,
        enumerable: false,
        writable: true,
        configurable: true
      }
    });
  };
} else {
  // old school shim for old browsers
  module.exports = function inherits(ctor, superCtor) {
    ctor.super_ = superCtor
    var TempCtor = function () {}
    TempCtor.prototype = superCtor.prototype
    ctor.prototype = new TempCtor()
    ctor.prototype.constructor = ctor
  }
}


/***/ }),
/* 17 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);

// EXTERNAL MODULE: ./source/asn1.ts
var asn1 = __webpack_require__(2);

// EXTERNAL MODULE: ./source/codecs/ber.ts
var ber = __webpack_require__(6);

// EXTERNAL MODULE: ./source/codecs/der.ts
var der = __webpack_require__(9);

// EXTERNAL MODULE: ./source/errors.ts
var errors = __webpack_require__(0);

// EXTERNAL MODULE: ./source/types/objectidentifier.ts
var objectidentifier = __webpack_require__(3);

// CONCATENATED MODULE: ./source/types/typeidentifier.ts
class TypeIdentifier {
    constructor(id, type) {
        this.id = id;
        this.type = type;
    }
}

// EXTERNAL MODULE: ./source/values.ts
var values = __webpack_require__(1);

// CONCATENATED MODULE: ./source/index.ts
/* concated harmony reexport ASN1Element */__webpack_require__.d(__webpack_exports__, "ASN1Element", function() { return asn1["a" /* ASN1Element */]; });
/* concated harmony reexport BERElement */__webpack_require__.d(__webpack_exports__, "BERElement", function() { return ber["a" /* BERElement */]; });
/* concated harmony reexport DERElement */__webpack_require__.d(__webpack_exports__, "DERElement", function() { return der["a" /* DERElement */]; });
/* concated harmony reexport ASN1Error */__webpack_require__.d(__webpack_exports__, "ASN1Error", function() { return errors["c" /* ASN1Error */]; });
/* concated harmony reexport ASN1NotImplementedError */__webpack_require__.d(__webpack_exports__, "ASN1NotImplementedError", function() { return errors["d" /* ASN1NotImplementedError */]; });
/* concated harmony reexport ASN1RecursionError */__webpack_require__.d(__webpack_exports__, "ASN1RecursionError", function() { return errors["g" /* ASN1RecursionError */]; });
/* concated harmony reexport ASN1TruncationError */__webpack_require__.d(__webpack_exports__, "ASN1TruncationError", function() { return errors["i" /* ASN1TruncationError */]; });
/* concated harmony reexport ASN1OverflowError */__webpack_require__.d(__webpack_exports__, "ASN1OverflowError", function() { return errors["e" /* ASN1OverflowError */]; });
/* concated harmony reexport ASN1SizeError */__webpack_require__.d(__webpack_exports__, "ASN1SizeError", function() { return errors["h" /* ASN1SizeError */]; });
/* concated harmony reexport ASN1PaddingError */__webpack_require__.d(__webpack_exports__, "ASN1PaddingError", function() { return errors["f" /* ASN1PaddingError */]; });
/* concated harmony reexport ASN1UndefinedError */__webpack_require__.d(__webpack_exports__, "ASN1UndefinedError", function() { return errors["j" /* ASN1UndefinedError */]; });
/* concated harmony reexport ASN1CharactersError */__webpack_require__.d(__webpack_exports__, "ASN1CharactersError", function() { return errors["a" /* ASN1CharactersError */]; });
/* concated harmony reexport ASN1ConstructionError */__webpack_require__.d(__webpack_exports__, "ASN1ConstructionError", function() { return errors["b" /* ASN1ConstructionError */]; });
/* concated harmony reexport ObjectIdentifier */__webpack_require__.d(__webpack_exports__, "ObjectIdentifier", function() { return objectidentifier["a" /* ObjectIdentifier */]; });
/* concated harmony reexport MAX_UINT_32 */__webpack_require__.d(__webpack_exports__, "MAX_UINT_32", function() { return values["j" /* MAX_UINT_32 */]; });
/* concated harmony reexport MIN_UINT_32 */__webpack_require__.d(__webpack_exports__, "MIN_UINT_32", function() { return values["l" /* MIN_UINT_32 */]; });
/* concated harmony reexport MAX_SINT_32 */__webpack_require__.d(__webpack_exports__, "MAX_SINT_32", function() { return values["i" /* MAX_SINT_32 */]; });
/* concated harmony reexport MIN_SINT_32 */__webpack_require__.d(__webpack_exports__, "MIN_SINT_32", function() { return values["k" /* MIN_SINT_32 */]; });
/* concated harmony reexport ASN1TagClass */__webpack_require__.d(__webpack_exports__, "ASN1TagClass", function() { return values["e" /* ASN1TagClass */]; });
/* concated harmony reexport ASN1Construction */__webpack_require__.d(__webpack_exports__, "ASN1Construction", function() { return values["a" /* ASN1Construction */]; });
/* concated harmony reexport LengthEncodingPreference */__webpack_require__.d(__webpack_exports__, "LengthEncodingPreference", function() { return values["h" /* LengthEncodingPreference */]; });
/* concated harmony reexport ASN1SpecialRealValue */__webpack_require__.d(__webpack_exports__, "ASN1SpecialRealValue", function() { return values["d" /* ASN1SpecialRealValue */]; });
/* concated harmony reexport ASN1RealEncodingBase */__webpack_require__.d(__webpack_exports__, "ASN1RealEncodingBase", function() { return values["b" /* ASN1RealEncodingBase */]; });
/* concated harmony reexport ASN1RealEncodingScale */__webpack_require__.d(__webpack_exports__, "ASN1RealEncodingScale", function() { return values["c" /* ASN1RealEncodingScale */]; });
/* concated harmony reexport ASN1UniversalType */__webpack_require__.d(__webpack_exports__, "ASN1UniversalType", function() { return values["f" /* ASN1UniversalType */]; });
/* concated harmony reexport printableStringCharacters */__webpack_require__.d(__webpack_exports__, "printableStringCharacters", function() { return values["u" /* printableStringCharacters */]; });
/* concated harmony reexport utcTimeRegex */__webpack_require__.d(__webpack_exports__, "utcTimeRegex", function() { return values["v" /* utcTimeRegex */]; });
/* concated harmony reexport distinguishedUTCTimeRegex */__webpack_require__.d(__webpack_exports__, "distinguishedUTCTimeRegex", function() { return values["p" /* distinguishedUTCTimeRegex */]; });
/* concated harmony reexport generalizedTimeRegex */__webpack_require__.d(__webpack_exports__, "generalizedTimeRegex", function() { return values["q" /* generalizedTimeRegex */]; });
/* concated harmony reexport distinguishedGeneralizedTimeRegex */__webpack_require__.d(__webpack_exports__, "distinguishedGeneralizedTimeRegex", function() { return values["n" /* distinguishedGeneralizedTimeRegex */]; });
/* concated harmony reexport nr1Regex */__webpack_require__.d(__webpack_exports__, "nr1Regex", function() { return values["r" /* nr1Regex */]; });
/* concated harmony reexport nr2Regex */__webpack_require__.d(__webpack_exports__, "nr2Regex", function() { return values["s" /* nr2Regex */]; });
/* concated harmony reexport nr3Regex */__webpack_require__.d(__webpack_exports__, "nr3Regex", function() { return values["t" /* nr3Regex */]; });
/* concated harmony reexport canonicalNR3Regex */__webpack_require__.d(__webpack_exports__, "canonicalNR3Regex", function() { return values["m" /* canonicalNR3Regex */]; });
/* concated harmony reexport distinguishedNR3Regex */__webpack_require__.d(__webpack_exports__, "distinguishedNR3Regex", function() { return values["o" /* distinguishedNR3Regex */]; });
/* concated harmony reexport CANONICAL_TAG_CLASS_ORDERING */__webpack_require__.d(__webpack_exports__, "CANONICAL_TAG_CLASS_ORDERING", function() { return values["g" /* CANONICAL_TAG_CLASS_ORDERING */]; });









/***/ })
/******/ ]);