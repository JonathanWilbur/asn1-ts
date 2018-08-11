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
        if (value < -2147483647)
            throw new ASN1Error("Number " + value.toString + " too small to be converted.");
        if (value > 2147483647)
            throw new ASN1Error("Number " + value.toString + " too big to be converted.");
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
        if (this.value.length >= 2) {
            (this.value.slice(1)).forEach(octet => {
                if (octet == 0x80)
                    throw new ASN1Error("Padding bytes on encoded OID nodes not permitted!");
            });
            if ((this.value[this.value.length - 1] & 0x80) == 0x80)
                throw new ASN1Error("Truncated OID!");
        }
        let numbers = [];
        if (this.value[0] >= 0x50) {
            numbers = [2, (this.value[0] - 0x50)];
        }
        else if (this.value[0] >= 0x28) {
            numbers = [1, (this.value[0] - 0x28)];
        }
        else {
            numbers = [0, this.value[0]];
        }
        let byteGroups = [];
        let lastTerminator = 1;
        for (let i = 1; i < this.value.length; i++) {
            if (!(this.value[i] & 0x80)) {
                byteGroups.push(Array.from(this.value).slice(lastTerminator, (i + 1)));
                lastTerminator = (i + 1);
            }
        }
        byteGroups.forEach(byteGroup => {
            if (byteGroup.length > 4)
                throw new ASN1Error("Encoded OID node number was too big!");
            numbers.push(0);
            for (let i = 0; i < byteGroup.length; i++) {
                numbers[numbers.length - 1] <<= 7;
                numbers[numbers.length - 1] |= (byteGroup[i] & 0x7F);
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
        let valueString = value.toFixed(2);
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
    constructor(data) {
        super();
        if (data == undefined)
            return;
        if (data.length > 2)
            throw new ASN1Error("BER-encoded data too short");
        this.tagClass = (data[0] >>> 6);
        this.construction = ((data[0] & 64) >>> 5);
        this.tagNumber = (data[0] & 31);
        if (this.tagNumber == 31) {
            throw new ASN1NotImplementedError();
        }
        let lengthOctet0 = (data[1] & 127);
        if (data[1] & 128) {
            if (lengthOctet0 == 0) {
                throw new ASN1NotImplementedError();
            }
            else if (lengthOctet0 == 127) {
                throw new ASN1Error("BER-encoding Reserved length");
            }
            else {
                throw new ASN1NotImplementedError();
            }
        }
        else {
            if (data.length < (lengthOctet0 + 2))
                throw new ASN1Error("BER-encoded data terminated prematurely");
            this.value = data.slice(2, (lengthOctet0 + 2));
            data = data.slice(lengthOctet0 + 2);
        }
    }
}

// CONCATENATED MODULE: ./source/index.ts
/* concated harmony reexport */__webpack_require__.d(__webpack_exports__, "ASN1TagClass", function() { return ASN1TagClass; });
/* concated harmony reexport */__webpack_require__.d(__webpack_exports__, "ASN1Construction", function() { return ASN1Construction; });
/* concated harmony reexport */__webpack_require__.d(__webpack_exports__, "ASN1Error", function() { return ASN1Error; });
/* concated harmony reexport */__webpack_require__.d(__webpack_exports__, "ASN1NotImplementedError", function() { return ASN1NotImplementedError; });
/* concated harmony reexport */__webpack_require__.d(__webpack_exports__, "ASN1SpecialRealValue", function() { return ASN1SpecialRealValue; });
/* concated harmony reexport */__webpack_require__.d(__webpack_exports__, "ASN1Element", function() { return ASN1Element; });
/* concated harmony reexport */__webpack_require__.d(__webpack_exports__, "BERElement", function() { return ber_BERElement; });
/* concated harmony reexport */__webpack_require__.d(__webpack_exports__, "ObjectIdentifier", function() { return ObjectIdentifier; });





/***/ }),
/* 1 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__(0);


/***/ })
/******/ ]);