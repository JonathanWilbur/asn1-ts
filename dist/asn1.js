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
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
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
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);

// CONCATENATED MODULE: ./source/asn1.ts
const MAX_UINT_32 = 0x00FFFFFFFF;
const MIN_UINT_32 = 0x0000000000;
const MAX_SINT_32 = 0x7FFFFFFF;
const MIN_SINT_32 = -0x7FFFFFFF;
var ASN1TagClass;
(function (ASN1TagClass) {
    ASN1TagClass[ASN1TagClass["universal"] = 0] = "universal";
    ASN1TagClass[ASN1TagClass["application"] = 1] = "application";
    ASN1TagClass[ASN1TagClass["context"] = 3] = "context";
    ASN1TagClass[ASN1TagClass["private"] = 4] = "private";
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
var ASN1SpecialRealValue;
(function (ASN1SpecialRealValue) {
    ASN1SpecialRealValue[ASN1SpecialRealValue["plusInfinity"] = 64] = "plusInfinity";
    ASN1SpecialRealValue[ASN1SpecialRealValue["minusInfinity"] = 65] = "minusInfinity";
    ASN1SpecialRealValue[ASN1SpecialRealValue["notANumber"] = 66] = "notANumber";
    ASN1SpecialRealValue[ASN1SpecialRealValue["minusZero"] = 67] = "minusZero";
})(ASN1SpecialRealValue || (ASN1SpecialRealValue = {}));
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
class ASN1Element {
    constructor() {
        this.tagClass = ASN1TagClass.universal;
        this.construction = ASN1Construction.primitive;
        this.tagNumber = 0;
        this.value = new Uint8Array(0);
    }
    length() {
        return this.value.length;
    }
}
ASN1Element.lengthRecursionCount = 0;
ASN1Element.valueRecursionCount = 0;
ASN1Element.nestingRecursionLimit = 5;

// CONCATENATED MODULE: ./source/types/objectidentifier.ts
class ObjectIdentifier {
    constructor(nodes) {
        if (nodes.length < 2)
            throw new Error("Cannot construct an OID with less than two nodes!");
        if (nodes.length >= 1 && !(nodes[0] in [0, 1, 2]))
            throw new Error("OIDs first node must be 0, 1, or 2!");
        if (((nodes[0] == 0 || nodes[0] == 1) && nodes[2] > 39) ||
            (nodes[0] == 2 && nodes[0] > 175))
            throw new Error("OID Node #2 cannot exceed 39 if node #1 is 0 or 1, and 175 if node #1 is 2!");
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

// CONCATENATED MODULE: ./source/ber.ts


class ber_BERElement extends ASN1Element {
    constructor(tagClass = ASN1TagClass.universal, construction = ASN1Construction.primitive, tagNumber = 0) {
        super();
        this.tagClass = tagClass;
        this.construction = construction;
        this.tagNumber = tagNumber;
        this.value = new Uint8Array(0);
    }
    set boolean(value) {
        this.value = new Uint8Array(1);
        this.value[0] = (value ? 255 : 0);
    }
    get boolean() {
        if (this.value.length != 1)
            throw new ASN1Error("BER-encoded BOOLEAN not one byte");
        return (this.value[0] != 0);
    }
    set integer(value) {
        if (value < MIN_SINT_32)
            throw new ASN1Error("Number " + value.toString() + " too small to be converted.");
        if (value > MAX_SINT_32)
            throw new ASN1Error("Number " + value.toString() + " too big to be converted.");
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
        if (this.value.length == 0)
            throw new ASN1Error("Number encoded on zero bytes!");
        if (this.value.length > 4)
            throw new ASN1Error("Number too long to decode.");
        let ret = (this.value[0] >= 128 ? Number.MAX_SAFE_INTEGER : 0);
        this.value.forEach(byte => {
            ret <<= 8;
            ret += byte;
        });
        return ret;
    }
    set bitString(value) {
        if (value.length == 0)
            this.value = new Uint8Array(0);
        let pre = [];
        pre.length = ((Math.trunc(value.length / 8)) + ((value.length % 8) ? 1 : 0)) + 1;
        for (let i = 0; i < value.length; i++) {
            if (value[i] == false)
                continue;
            pre[((Math.trunc(i / 8)) + 1)] |= (0b10000000 >> (i % 8));
        }
        pre[0] = (8 - (value.length % 8));
        if (pre[0] == 8)
            pre[0] = 0;
        this.value = new Uint8Array(pre);
    }
    get bitString() {
        if (this.construction == ASN1Construction.primitive) {
            if (this.value.length == 0)
                throw new ASN1Error("ASN.1 BIT STRING cannot be encoded on zero bytes!");
            if (this.value.length == 1 && this.value[0] != 0)
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
            throw new ASN1NotImplementedError();
        }
    }
    set octetString(value) {
        this.value = value.subarray(0);
    }
    get octetString() {
        if (this.construction == ASN1Construction.primitive) {
            return this.value.subarray(0);
        }
        else {
            throw new ASN1NotImplementedError();
        }
    }
    set objectIdentifier(value) {
        let numbers = value.nodes;
        let pre = [((numbers[0] * 40) + numbers[1])];
        if (numbers.length > 2) {
            for (let i = 2; i < numbers.length; i++) {
                let number = numbers[i];
                if (number < 128) {
                    pre.push(number);
                    continue;
                }
                let encodedOIDNode = [];
                while (number != 0) {
                    let numberBytes = [
                        (number & 255),
                        (number >> 8 & 255),
                        ((number >> 16) & 255),
                        ((number >> 24) & 255),
                    ];
                    if ((numberBytes[0] & 0x80) == 0)
                        numberBytes[0] |= 0x80;
                    encodedOIDNode.unshift(numberBytes[0]);
                    number >>= 7;
                }
                encodedOIDNode[encodedOIDNode.length - 1] &= 0x7F;
                pre = pre.concat(encodedOIDNode);
            }
        }
        this.value = new Uint8Array(pre);
    }
    get objectIdentifier() {
        if (this.construction != ASN1Construction.primitive)
            throw new ASN1Error("Construction cannot be constructed for an OBJECT IDENTIFIER!");
        if (this.value.length == 0)
            throw new ASN1Error("Encoded value was too short to be an OBJECT IDENTIFIER!");
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
        if (this.value.length == 1)
            return new ObjectIdentifier(numbers);
        if ((this.value[(this.value.length - 1)] & 0x80) == 0x80)
            throw new ASN1Error("OID truncated");
        let components = 2;
        const allButTheFirstByte = this.value.slice(1);
        allButTheFirstByte.forEach(b => {
            if (!(b & 0x80))
                components++;
        });
        numbers.length = components;
        let currentNumber = 2;
        let bytesUsedInCurrentNumber = 0;
        allButTheFirstByte.forEach(b => {
            if (bytesUsedInCurrentNumber == 0 && b == 0x80)
                throw new ASN1Error("OID had invalid padding byte.");
            if (numbers[currentNumber] > (Number.MAX_SAFE_INTEGER >>> 7))
                throw new ASN1Error("OID node too big");
            numbers[currentNumber] <<= 7;
            numbers[currentNumber] |= (b & 0x7F);
            if (!(b & 0x80)) {
                currentNumber++;
                bytesUsedInCurrentNumber = 0;
            }
            else {
                bytesUsedInCurrentNumber++;
            }
        });
        return new ObjectIdentifier(numbers);
    }
    set objectDescriptor(value) {
        for (let i = 0; i < value.length; i++) {
            let characterCode = value.charCodeAt(i);
            if (characterCode < 0x20 || characterCode > 0x7E) {
                throw new ASN1Error("ObjectDescriptor can only contain characters between 0x20 and 0x7E.");
            }
        }
        this.value = (new TextEncoder()).encode(value);
    }
    set real(value) {
        if (value == 0.0) {
            this.value = new Uint8Array(0);
        }
        else if (isNaN(value)) {
            this.value = new Uint8Array([ASN1SpecialRealValue.notANumber]);
        }
        else if (value == -0.0) {
            this.value = new Uint8Array([ASN1SpecialRealValue.minusZero]);
        }
        else if (value == Infinity) {
            this.value = new Uint8Array([ASN1SpecialRealValue.plusInfinity]);
        }
        else if (value == -Infinity) {
            this.value = new Uint8Array([ASN1SpecialRealValue.minusInfinity]);
        }
        let valueString = value.toFixed(7);
        valueString = (String.fromCharCode(0b00000011) + valueString);
        this.value = (new TextEncoder()).encode(valueString);
    }
    get real() {
        if (this.value.length == 0)
            return 0.0;
        switch (this.value[0] & 0b11000000) {
            case (0b01000000): {
                if (this.value[0] == ASN1SpecialRealValue.notANumber)
                    return NaN;
                if (this.value[0] == ASN1SpecialRealValue.minusZero)
                    return -0.0;
                if (this.value[0] == ASN1SpecialRealValue.plusInfinity)
                    return Infinity;
                if (this.value[0] == ASN1SpecialRealValue.minusInfinity)
                    return -Infinity;
                throw new ASN1Error("Unrecognized special REAL value!");
            }
            case (0b00000000): {
                let encodedString = (new TextDecoder()).decode(this.value.slice(1));
                return parseFloat(encodedString);
            }
            case (0b10000000):
            case (0b11000000): {
                throw new ASN1NotImplementedError();
            }
        }
    }
    set enumerated(value) {
        if (value < -2147483647)
            throw new ASN1Error("Number " + value.toString() + " too small to be converted.");
        if (value > 2147483647)
            throw new ASN1Error("Number " + value.toString() + " too big to be converted.");
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
    get enumerated() {
        if (this.value.length == 0)
            throw new ASN1Error("Number encoded on zero bytes!");
        if (this.value.length > 4)
            throw new ASN1Error("Number too long to decode.");
        let ret = (this.value[0] >= 128 ? Number.MAX_SAFE_INTEGER : 0);
        this.value.forEach(byte => {
            ret <<= 8;
            ret += byte;
        });
        return ret;
    }
    set relativeObjectIdentifier(value) {
        let numbers = value;
        let pre = [];
        if (numbers.length > 0) {
            for (let i = 0; i < numbers.length; i++) {
                let number = numbers[i];
                if (number < 128) {
                    pre.push(number);
                    continue;
                }
                let encodedOIDNode = [];
                while (number != 0) {
                    let numberBytes = [
                        (number & 255),
                        (number >> 8 & 255),
                        ((number >> 16) & 255),
                        ((number >> 24) & 255),
                    ];
                    if ((numberBytes[0] & 0x80) == 0)
                        numberBytes[0] |= 0x80;
                    encodedOIDNode.unshift(numberBytes[0]);
                    number >>= 7;
                }
                encodedOIDNode[encodedOIDNode.length - 1] &= 0x7F;
                pre = pre.concat(encodedOIDNode);
            }
        }
        this.value = new Uint8Array(pre);
    }
    get relativeObjectIdentifier() {
        if (this.construction != ASN1Construction.primitive)
            throw new ASN1Error("Construction cannot be constructed for an OBJECT IDENTIFIER!");
        let numbers = [];
        if (this.value.length == 1)
            return numbers;
        if ((this.value[(this.value.length - 1)] & 0x80) == 0x80)
            throw new ASN1Error("OID truncated");
        let components = 0;
        this.value.forEach(b => {
            if (!(b & 0x80))
                components++;
        });
        numbers.length = components;
        let currentNumber = 0;
        let bytesUsedInCurrentNumber = 0;
        this.value.forEach(b => {
            if (bytesUsedInCurrentNumber == 0 && b == 0x80)
                throw new ASN1Error("OID had invalid padding byte.");
            if (numbers[currentNumber] > (Number.MAX_SAFE_INTEGER >>> 7))
                throw new ASN1Error("OID node too big");
            numbers[currentNumber] <<= 7;
            numbers[currentNumber] |= (b & 0x7F);
            if (!(b & 0x80)) {
                currentNumber++;
                bytesUsedInCurrentNumber = 0;
            }
            else {
                bytesUsedInCurrentNumber++;
            }
        });
        return numbers;
    }
    fromBytes(bytes) {
        if (bytes.length < 2)
            throw new ASN1Error("Tried to decode a BER element that is less than two bytes.");
        let cursor = 0;
        switch (bytes[cursor] & 0b11000000) {
            case (0b00000000):
                this.tagClass = ASN1TagClass.universal;
                break;
            case (0b01000000):
                this.tagClass = ASN1TagClass.application;
                break;
            case (0b10000000):
                this.tagClass = ASN1TagClass.context;
                break;
            case (0b11000000):
                this.tagClass = ASN1TagClass.private;
                break;
            default: this.tagClass = ASN1TagClass.universal;
        }
        this.construction = ((bytes[cursor] & 0b00100000) ?
            ASN1Construction.constructed : ASN1Construction.primitive);
        this.tagNumber = (bytes[cursor] & 0b00011111);
        cursor++;
        if (this.tagNumber >= 31) {
            if (bytes[cursor] == 0b10000000)
                throw new ASN1Error("Leading padding byte on long tag number encoding.");
            this.tagNumber = 0;
            const limit = (((bytes.length - 1) >= 4) ? 4 : (bytes.length - 1));
            while (cursor < limit) {
                if (!(bytes[cursor++] & 0x80))
                    break;
            }
            if (bytes[cursor - 1] & 0x80) {
                if (limit == bytes.length - 1) {
                    throw new ASN1Error("ASN.1 tag number appears to have been truncated.");
                }
                else
                    throw new ASN1Error("ASN.1 tag number too large.");
            }
            for (let i = 1; i < cursor; i++) {
                this.tagNumber <<= 7;
                this.tagNumber |= (bytes[i] & 0x7F);
            }
        }
        if ((bytes[cursor] & 0x80) == 0x80) {
            const numberOfLengthOctets = (bytes[cursor] & 0x7F);
            if (numberOfLengthOctets) {
                if (numberOfLengthOctets == 0b01111111)
                    throw new ASN1Error("Length byte with undefined meaning encountered.");
                if (numberOfLengthOctets > 4)
                    throw new ASN1Error("Element length too long to decode to an integer.");
                if (cursor + numberOfLengthOctets >= bytes.length)
                    throw new ASN1Error("Element length bytes appear to have been truncated.");
                cursor++;
                let lengthNumberOctets = new Uint8Array(4);
                for (let i = numberOfLengthOctets; i > 0; i--) {
                    lengthNumberOctets[(4 - i)] = bytes[(cursor + numberOfLengthOctets - i)];
                }
                let length = 0;
                lengthNumberOctets.forEach(octet => {
                    length <<= 8;
                    length += octet;
                });
                if ((cursor + length) < cursor)
                    throw new ASN1Error("ASN.1 element too large.");
                cursor += (numberOfLengthOctets);
                if ((cursor + length) > bytes.length)
                    throw new ASN1Error("ASN.1 element truncated.");
                this.value = bytes.slice(cursor, (cursor + length));
                return (cursor + length);
            }
            else {
                if (this.construction != ASN1Construction.constructed)
                    throw new ASN1Error("Indefinite length ASN.1 element was not of constructed construction.");
                if (++(ber_BERElement.lengthRecursionCount) > ber_BERElement.nestingRecursionLimit) {
                    ber_BERElement.lengthRecursionCount = 0;
                    throw new ASN1Error("ASN.1 indefinite length encoded element recursed too deeply.");
                }
                const startOfValue = ++cursor;
                let sentinel = cursor;
                while (sentinel < bytes.length) {
                    const child = new ber_BERElement();
                    sentinel += child.fromBytes(bytes.slice(sentinel));
                    if (child.tagClass == ASN1TagClass.universal &&
                        child.construction == ASN1Construction.primitive &&
                        child.tagNumber == ASN1UniversalType.endOfContent &&
                        child.value.length == 0)
                        break;
                }
                if (sentinel == bytes.length && (bytes[sentinel - 1] != 0x00 || bytes[sentinel - 2] != 0x00))
                    throw new ASN1Error("No END OF CONTENT element found at the end of indefinite length ASN.1 element.");
                ber_BERElement.lengthRecursionCount--;
                this.value = bytes.slice(startOfValue, (sentinel - 2));
                return sentinel;
            }
        }
        else {
            let length = (bytes[cursor++] & 0x7F);
            if ((cursor + length) > bytes.length)
                throw new ASN1Error("ASN.1 element was truncated.");
            this.value = bytes.slice(cursor, (cursor + length));
            return (cursor + length);
        }
    }
    toBytes() {
        let tagBytes = [0x00];
        tagBytes[0] |= this.tagClass;
        tagBytes[0] |= this.construction;
        if (this.tagNumber < 31) {
            tagBytes[0] |= this.tagNumber;
        }
        else {
            tagBytes[0] |= 0b00011111;
            let number = this.tagNumber;
            let encodedNumber = [];
            while (number != 0) {
                encodedNumber.unshift(number & 0x7F);
                number >>>= 7;
                encodedNumber[0] |= 0b10000000;
            }
            encodedNumber[encodedNumber.length - 1] &= 0b01111111;
            tagBytes = tagBytes.concat(encodedNumber);
        }
        let lengthOctets = [0x00];
        switch (ber_BERElement.lengthEncodingPreference) {
            case (LengthEncodingPreference.definite): {
                if (this.value.length < 127) {
                    lengthOctets = [this.value.length];
                }
                else {
                    let length = this.value.length;
                    lengthOctets = [0, 0, 0, 0];
                    for (let i = 0; i < 4; i++) {
                        lengthOctets[i] = ((length >> ((3 - i) << 3)) & 0xFF);
                    }
                    let startOfNonPadding = 0;
                    for (let i = 0; i < (lengthOctets.length - 1); i++) {
                        if (lengthOctets[i] == 0x00)
                            startOfNonPadding++;
                    }
                    lengthOctets = lengthOctets.slice(startOfNonPadding);
                    lengthOctets.unshift(0b10000000 | lengthOctets.length);
                }
                break;
            }
            case (LengthEncodingPreference.indefinite): {
                lengthOctets = [0x80];
                break;
            }
            default:
                throw new ASN1Error("Invalid LengthEncodingPreference encountered!");
        }
        let ret = new Uint8Array(tagBytes.length +
            lengthOctets.length +
            this.value.length +
            (ber_BERElement.lengthEncodingPreference == LengthEncodingPreference.indefinite ? 2 : 0));
        ret.set(tagBytes, 0);
        ret.set(lengthOctets, tagBytes.length);
        ret.set(this.value, (tagBytes.length + lengthOctets.length));
        return ret;
    }
}
ber_BERElement.lengthEncodingPreference = LengthEncodingPreference.definite;

// CONCATENATED MODULE: ./source/index.ts
/* concated harmony reexport */__webpack_require__.d(__webpack_exports__, "MAX_UINT_32", function() { return MAX_UINT_32; });
/* concated harmony reexport */__webpack_require__.d(__webpack_exports__, "MIN_UINT_32", function() { return MIN_UINT_32; });
/* concated harmony reexport */__webpack_require__.d(__webpack_exports__, "MAX_SINT_32", function() { return MAX_SINT_32; });
/* concated harmony reexport */__webpack_require__.d(__webpack_exports__, "MIN_SINT_32", function() { return MIN_SINT_32; });
/* concated harmony reexport */__webpack_require__.d(__webpack_exports__, "ASN1TagClass", function() { return ASN1TagClass; });
/* concated harmony reexport */__webpack_require__.d(__webpack_exports__, "ASN1Construction", function() { return ASN1Construction; });
/* concated harmony reexport */__webpack_require__.d(__webpack_exports__, "LengthEncodingPreference", function() { return LengthEncodingPreference; });
/* concated harmony reexport */__webpack_require__.d(__webpack_exports__, "ASN1Error", function() { return ASN1Error; });
/* concated harmony reexport */__webpack_require__.d(__webpack_exports__, "ASN1NotImplementedError", function() { return ASN1NotImplementedError; });
/* concated harmony reexport */__webpack_require__.d(__webpack_exports__, "ASN1SpecialRealValue", function() { return ASN1SpecialRealValue; });
/* concated harmony reexport */__webpack_require__.d(__webpack_exports__, "ASN1UniversalType", function() { return ASN1UniversalType; });
/* concated harmony reexport */__webpack_require__.d(__webpack_exports__, "ASN1Element", function() { return ASN1Element; });
/* concated harmony reexport */__webpack_require__.d(__webpack_exports__, "BERElement", function() { return ber_BERElement; });
/* concated harmony reexport */__webpack_require__.d(__webpack_exports__, "ObjectIdentifier", function() { return ObjectIdentifier; });





/***/ }),
/* 1 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__(0);


/***/ })
/******/ ]);