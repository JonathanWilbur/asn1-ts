import { ASN1Element } from "./asn1";
import * as errors from "./errors";
import { ObjectIdentifier as OID } from "./types/objectidentifier";
import { ASN1Construction, MAX_SINT_32, MIN_SINT_32, ASN1TagClass } from "./values";

export
abstract class X690Element extends ASN1Element {

    public validateTag (
        permittedClasses : ASN1TagClass[],
        permittedConstruction : ASN1Construction[],
        permittedNumbers : number[]
    ) {
        if (!permittedClasses.includes(this.tagClass)) return -1;
        if (!permittedConstruction.includes(this.construction)) return -2;
        if (!permittedNumbers.includes(this.tagNumber)) return -3;
        return 0;
    }

    /**
     * This only accepts integers between MIN_SINT_32 and MAX_SINT_32 because
     * JavaScript's bitshift operators treat all integers as though they were
     * 32-bit integers, even though they are stored in the 53 mantissa bits of
     * an IEEE double-precision floating point number. Accepting larger or
     * smaller numbers would rule out the use of a critical arithmetic operator
     * when lower-level binary operations are not available, as is the case in
     * JavaScript.
     */
    set integer (value : number) {
        if (value < MIN_SINT_32)
            throw new errors.ASN1OverflowError(`Number ${value} too small to be converted.`);
        if (value > MAX_SINT_32)
            throw new errors.ASN1OverflowError(`Number ${value} too big to be converted.`);

        if (value <= 127 && value >= -128) {
            this.value = new Uint8Array([
                (value & 255)
            ]);
            return;
        } else if (value <= 32767 && value >= -32768) {
            this.value = new Uint8Array([
                (value >> 8 & 255),
                (value & 255)
            ]);
            return;
        } else if (value <= 8388607 && value >= -8388608) {
            this.value = new Uint8Array([
                ((value >> 16) & 255),
                (value >> 8 & 255),
                (value & 255)
            ]);
            return;
        } else {
            this.value = new Uint8Array([
                ((value >> 24) & 255),
                ((value >> 16) & 255),
                (value >> 8 & 255),
                (value & 255)
            ]);
            return;
        }
    }

    get integer () : number {
        if (this.construction !== ASN1Construction.primitive)
            throw new errors.ASN1ConstructionError("INTEGER cannot be constructed.");
        if (this.value.length === 0)
            throw new errors.ASN1SizeError("Number encoded on zero bytes!");
        if (this.value.length > 4)
            throw new errors.ASN1OverflowError("Number too long to decode.");
        if (
            this.value.length > 2 &&
            (
                (this.value[0] === 0xFF && this.value[1] >= 0b10000000) ||
                (this.value[0] === 0x00 && this.value[1] < 0b10000000)
            )
        )
            throw new errors.ASN1PaddingError("Unnecessary padding bytes on INTEGER or ENUMERATED.");
        return ASN1Element.decodeSignedBigEndianInteger(this.value.subarray(0));
    }

    set objectIdentifier (value : OID) {
        const numbers : number[] = value.nodes;
        let pre : number[] = [ ((numbers[0] * 40) + numbers[1]) ];
        let post : number[] = X690Element.encodeObjectIdentifierNodes(numbers.slice(2));
        this.value = new Uint8Array(pre.concat(post));
    }

    get objectIdentifier () : OID {
        if (this.construction !== ASN1Construction.primitive)
            throw new errors.ASN1ConstructionError("OBJECT IDENTIFIER cannot be constructed.");

        if (this.value.length === 0)
            throw new errors.ASN1TruncationError
            ("Encoded value was too short to be an OBJECT IDENTIFIER!");

        let numbers : number[] = [ 0, 0 ];
        if (this.value[0] >= 0x50) {
            numbers[0] = 2;
            numbers[1] = (this.value[0] - 0x50);
        } else if (this.value[0] >= 0x28) {
            numbers[0] = 1;
            numbers[1] = (this.value[0] - 0x28);
        } else {
            numbers[0] = 0;
            numbers[1] = this.value[0];
        }

        if (this.value.length === 1)
            return new OID(numbers);

        numbers = numbers.concat(X690Element.decodeObjectIdentifierNodes(this.value.slice(1)));
        return new OID(numbers);
    }

    set enumerated (value : number) {
        this.integer = value;
    }

    get enumerated () : number {
        return this.integer;
    }

    set relativeObjectIdentifier (value : number[]) {
        this.value = new Uint8Array(X690Element.encodeObjectIdentifierNodes(value));
    }

    get relativeObjectIdentifier () : number[] {
        if (this.construction !== ASN1Construction.primitive)
            throw new errors.ASN1ConstructionError("Relative OID cannot be constructed.");
        return X690Element.decodeObjectIdentifierNodes(this.value.slice(0));
    }

    protected static decodeObjectIdentifierNodes (value : Uint8Array) : number[] {
        if (value.length === 0) return [];
        let numbers : number[] = [];
        if (value.length > 0 && (value[(value.length - 1)] & 0b10000000) === 0b10000000)
            throw new errors.ASN1TruncationError("OID truncated");
        let components : number = 0;
        value.forEach(b => { if (!(b & 0b10000000)) components++; });
        numbers.length = components;
        let currentNumber : number = 0;
        let bytesUsedInCurrentNumber : number = 0;
        value.forEach(b => {
            if (bytesUsedInCurrentNumber === 0 && b === 0b10000000)
                throw new errors.ASN1PaddingError("OID had invalid padding byte.");
            // NOTE: You must use the unsigned shift >>> or MAX_SAFE_INTEGER will become -1.
            if (numbers[currentNumber] > (Number.MAX_SAFE_INTEGER >>> 7))
                throw new errors.ASN1OverflowError("OID node too big");
            numbers[currentNumber] <<= 7;
            numbers[currentNumber] |= (b & 0x7F);
            if (!(b & 0b10000000)) {
                currentNumber++;
                bytesUsedInCurrentNumber = 0;
            } else {
                bytesUsedInCurrentNumber++;
            }
        });
        return numbers;
    }

    protected static encodeObjectIdentifierNodes (value : number[]) : number[] {
        let ret : number[] = [];
        for (let i : number = 0; i < value.length; i++) {
            let number : number = value[i];
            if (number < 128) {
                ret.push(number);
                continue;
            }
            let encodedOIDNode : number[] = [];
            while (number !== 0) {
                let numberBytes : number[] = [
                    (number & 255),
                    (number >>> 8 & 255),
                    ((number >>> 16) & 255),
                    ((number >>> 24) & 255),
                ];
                if ((numberBytes[0] & 0x80) === 0) numberBytes[0] |= 0x80;
                encodedOIDNode.unshift(numberBytes[0]);
                number >>= 7;
            }
            encodedOIDNode[encodedOIDNode.length - 1] &= 0x7F;
            ret = ret.concat(encodedOIDNode);
        }
        return ret;
    }

}