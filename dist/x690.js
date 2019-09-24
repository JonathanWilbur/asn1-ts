"use strict";
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const asn1_1 = require("./asn1");
const errors = __importStar(require("./errors"));
const objectidentifier_1 = require("./types/objectidentifier");
const values_1 = require("./values");
class X690Element extends asn1_1.ASN1Element {
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
        if (value < values_1.MIN_SINT_32) {
            throw new errors.ASN1OverflowError(`Number ${value} too small to be converted.`);
        }
        if (value > values_1.MAX_SINT_32) {
            throw new errors.ASN1OverflowError(`Number ${value} too big to be converted.`);
        }
        if (value <= 127 && value >= -128) {
            this.value = new Uint8Array([
                (value & 255),
            ]);
            return;
        }
        else if (value <= 32767 && value >= -32768) {
            this.value = new Uint8Array([
                ((value >> 8) & 255),
                (value & 255),
            ]);
            return;
        }
        else if (value <= 8388607 && value >= -8388608) {
            this.value = new Uint8Array([
                ((value >> 16) & 255),
                ((value >> 8) & 255),
                (value & 255),
            ]);
            return;
        }
        else {
            this.value = new Uint8Array([
                ((value >> 24) & 255),
                ((value >> 16) & 255),
                ((value >> 8) & 255),
                (value & 255),
            ]);
            return;
        }
    }
    get integer() {
        if (this.construction !== values_1.ASN1Construction.primitive) {
            throw new errors.ASN1ConstructionError("INTEGER cannot be constructed.");
        }
        if (this.value.length === 0) {
            throw new errors.ASN1SizeError("Number encoded on zero bytes!");
        }
        if (this.value.length > 4) {
            throw new errors.ASN1OverflowError("Number too long to decode.");
        }
        if (this.value.length > 2
            && ((this.value[0] === 0xFF && this.value[1] >= 0b10000000)
                || (this.value[0] === 0x00 && this.value[1] < 0b10000000))) {
            throw new errors.ASN1PaddingError("Unnecessary padding bytes on INTEGER or ENUMERATED.");
        }
        return asn1_1.ASN1Element.decodeSignedBigEndianInteger(this.value.subarray(0));
    }
    set objectIdentifier(value) {
        const numbers = value.nodes;
        const pre = [((numbers[0] * 40) + numbers[1])];
        const post = X690Element.encodeObjectIdentifierNodes(numbers.slice(2));
        this.value = new Uint8Array(pre.concat(post));
    }
    get objectIdentifier() {
        if (this.construction !== values_1.ASN1Construction.primitive) {
            throw new errors.ASN1ConstructionError("OBJECT IDENTIFIER cannot be constructed.");
        }
        if (this.value.length === 0) {
            throw new errors.ASN1TruncationError("Encoded value was too short to be an OBJECT IDENTIFIER!");
        }
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
            return new objectidentifier_1.ObjectIdentifier(numbers);
        numbers = numbers.concat(X690Element.decodeObjectIdentifierNodes(this.value.slice(1)));
        return new objectidentifier_1.ObjectIdentifier(numbers);
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
        if (this.construction !== values_1.ASN1Construction.primitive) {
            throw new errors.ASN1ConstructionError("Relative OID cannot be constructed.");
        }
        return X690Element.decodeObjectIdentifierNodes(this.value.slice(0));
    }
    static decodeObjectIdentifierNodes(value) {
        if (value.length === 0)
            return [];
        const numbers = [];
        if (value.length > 0 && (value[(value.length - 1)] & 0b10000000) === 0b10000000) {
            throw new errors.ASN1TruncationError("OID truncated");
        }
        let components = 0;
        value.forEach((b) => {
            if (!(b & 0b10000000))
                components++;
        });
        numbers.length = components;
        let currentNumber = 0;
        let bytesUsedInCurrentNumber = 0;
        value.forEach((b) => {
            if (bytesUsedInCurrentNumber === 0 && b === 0b10000000) {
                throw new errors.ASN1PaddingError("OID had invalid padding byte.");
            }
            if (numbers[currentNumber] > (Number.MAX_SAFE_INTEGER >>> 7)) {
                throw new errors.ASN1OverflowError("OID node too big");
            }
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
            const encodedOIDNode = [];
            while (number !== 0) {
                const numberBytes = [
                    (number & 255),
                    ((number >>> 8) & 255),
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
            if (previousTagClass !== null
                && element.tagClass !== previousTagClass
                && values_1.CANONICAL_TAG_CLASS_ORDERING.indexOf(element.tagClass)
                    <= values_1.CANONICAL_TAG_CLASS_ORDERING.indexOf(previousTagClass))
                return false;
            if (element.tagClass !== previousTagClass)
                previousTagNumber = null;
            if (previousTagNumber !== null && element.tagNumber < previousTagNumber)
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
exports.X690Element = X690Element;
//# sourceMappingURL=x690.js.map