// TODO: Unused variable 'i' in BER.objectIdentifier getter in D library (line 898)
import { ASN1Element,ASN1TagClass,ASN1Construction,ASN1SpecialRealValue,ASN1Error,ASN1NotImplementedError } from "./asn1";
import { OID, ObjectIdentifier } from "./types/objectidentifier";

export
class BERElement extends ASN1Element {

    set boolean (value : boolean) {
        this.value = new Uint8Array(1);
        this.value[0] = (value ? 255 : 0);
    }

    get boolean () : boolean {
        if (this.value.length != 1)
            throw new ASN1Error("BER-encoded BOOLEAN not one byte");
        return (this.value[0] != 0);
    }

    set integer (value : number) {
        if (value < -2147483647)
            throw new ASN1Error("Number " + value.toString + " too small to be converted.");
        if (value > 2147483647)
            throw new ASN1Error("Number " + value.toString + " too big to be converted.");

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
        if (this.value.length == 0)
            throw new ASN1Error("Number encoded on zero bytes!");
        if (this.value.length > 4)
            throw new ASN1Error("Number too long to decode.");

        let ret : number = (this.value[0] >= 128 ? Number.MAX_SAFE_INTEGER : 0);
        this.value.forEach(byte => {
            ret <<= 8;
            // ret += (byte << 24 >> 24);
            ret += byte;
        });
        return ret;
    }

    set bitString (value : boolean[]) {
        if (value.length == 0)
            this.value = new Uint8Array(0);
        let pre : number[] = [];
        pre.length = ((Math.trunc(value.length / 8)) + ((value.length % 8) ? 1 : 0)) + 1;
        for (let i = 0; i < value.length; i++) {
            if (value[i] == false) continue;
            pre[((Math.trunc(i / 8)) + 1)] |= (0b10000000 >> (i % 8));
        }
        pre[0] = (8 - (value.length % 8));
        if (pre[0] == 8) pre[0] = 0;
        this.value = new Uint8Array(pre);
    }

    // Blocked until you get the constructor fully working.
    get bitString () : boolean[] {
        if (this.construction == ASN1Construction.primitive) {
            if (this.value.length == 0)
                throw new ASN1Error("ASN.1 BIT STRING cannot be encoded on zero bytes!");
            if (this.value.length == 1 && this.value[0] != 0)
                throw new ASN1Error("ASN.1 BIT STRING encoded with deceptive first byte!");
            if (this.value[0] > 7)
                throw new ASN1Error("First byte of an ASN.1 BIT STRING must be <= 7!");

            let ret : boolean[] = [];
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
        } else {
            // Blocked on sequence implementation.
            throw new ASN1NotImplementedError();
            // if (BERElement.valueRecursionCount++ == BERElement.nestingRecursionLimit)
            //     throw new ASN1Error("Recursion was too deep!");

            // let ret : boolean[] = [];
        }
    }

    set octetString (value : Uint8Array) {
        this.value = value.subarray(0); // Clones it.
    }

    get octetString () : Uint8Array {
        if (this.construction == ASN1Construction.primitive) {
            return this.value.subarray(0); // Clones it.
        } else {
            throw new ASN1NotImplementedError();
        }
    }

    set objectIdentifier (value : OID) {
        let numbers : number[] = value.nodes;
        let pre : number[] = [ ((numbers[0] * 40) + numbers[1]) ];
        if (numbers.length > 2)
        {
            for (let i : number = 2; i < numbers.length; i++)
            {
                let number : number = numbers[i];
                if (number < 128)
                {
                    pre.push(number);
                    continue;
                }

                let encodedOIDNode : number[] = [];
                while (number != 0)
                {
                    let numberBytes : number[] =
                    [
                        (number & 255),
                        (number >> 8 & 255),
                        ((number >> 16) & 255),
                        ((number >> 24) & 255),
                    ];
                    if ((numberBytes[0] & 0x80) == 0) numberBytes[0] |= 0x80;
                    encodedOIDNode.unshift(numberBytes[0]);
                    number >>= 7;
                }

                encodedOIDNode[encodedOIDNode.length - 1] &= 0x7F;
                pre = pre.concat(encodedOIDNode);
            }
        }
        this.value = new Uint8Array(pre);
    }

    get objectIdentifier () : OID {
        if (this.construction != ASN1Construction.primitive)
            throw new ASN1Error
            ("Construction cannot be constructed for an OBJECT IDENTIFIER!");

        if (this.value.length == 0)
            throw new ASN1Error
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

        if (this.value.length == 1)
            return new ObjectIdentifier(numbers);

        if ((this.value[(this.value.length - 1)] & 0x80) == 0x80)
            throw new ASN1Error("OID truncated");

        let components : number = 2;
        const allButTheFirstByte : Uint8Array = this.value.slice(1);
        allButTheFirstByte.forEach(b => {
            if (!(b & 0x80)) components++;
        });
        numbers.length = components;

        let currentNumber : number = 2;
        let bytesUsedInCurrentNumber : number = 0;
        allButTheFirstByte.forEach(b => {
            if (bytesUsedInCurrentNumber == 0 && b == 0x80)
                throw new ASN1Error("OID had invalid padding byte.");

            // NOTE: You must use the unsigned shift >>> or MAX_SAFE_INTEGER will become -1.
            if (numbers[currentNumber] > (Number.MAX_SAFE_INTEGER >>> 7))
                throw new ASN1Error("OID node too big");

            numbers[currentNumber] <<= 7;
            // numbers[currentNumber] |= cast(size_t) (b & 0x7F);
            numbers[currentNumber] |= (b & 0x7F);

            if (!(b & 0x80)) {
                currentNumber++;
                bytesUsedInCurrentNumber = 0;
            } else {
                bytesUsedInCurrentNumber++;
            }
        });

        return new ObjectIdentifier(numbers);
    }

    set objectDescriptor (value : string) {
        for (let i : number = 0; i < value.length; i++) {
            let characterCode : number = value.charCodeAt(i);
            if (characterCode < 0x20 || characterCode > 0x7E) {
                throw new ASN1Error("ObjectDescriptor can only contain characters between 0x20 and 0x7E.");
            }
        }

        // if (typeof TextEncoder != "undefined") { // Browser JavaScript
            this.value = (new TextEncoder()).encode(value);
        // } else if (typeof NodeBuffer != "undefined") { // NodeJS
        //     this.value = (new NodeBuffer()).from(value, "utf-8");
        // }
    }

    // get objectDescriptor () : string {

    // }

    // set external (value : External) {

    // }

    // get external () : External {

    // }

    // Only encodes with two digits of precision.
    set real (value : number) {
        if (value == 0.0) {
            this.value = new Uint8Array(0);
        } else if (isNaN(value)) {
            this.value = new Uint8Array([ ASN1SpecialRealValue.notANumber ]);
        } else if (value == -0.0) {
            this.value = new Uint8Array([ ASN1SpecialRealValue.minusZero ]);
        } else if (value == Infinity) {
            this.value = new Uint8Array([ ASN1SpecialRealValue.plusInfinity ]);
        } else if (value == -Infinity) {
            this.value = new Uint8Array([ ASN1SpecialRealValue.minusInfinity ]);
        }
        let valueString : string = value.toFixed(2);
        valueString = (String.fromCharCode(0b00000011) + valueString);
        this.value = (new TextEncoder()).encode(valueString);
    }

    get real () : number {
        if (this.value.length == 0) return 0.0;
        switch (this.value[0] & 0b11000000) {
            case (0b01000000): {
                if (this.value[0] == ASN1SpecialRealValue.notANumber) return NaN;
                if (this.value[0] == ASN1SpecialRealValue.minusZero) return -0.0;
                if (this.value[0] == ASN1SpecialRealValue.plusInfinity) return Infinity;
                if (this.value[0] == ASN1SpecialRealValue.minusInfinity) return -Infinity;
                throw new ASN1Error("Unrecognized special REAL value!");
            }
            case (0b00000000): {
                let encodedString : string = (new TextDecoder()).decode(this.value.slice(1));
                return parseFloat(encodedString);
            }
            case (0b10000000):
            case (0b11000000): {
                throw new ASN1NotImplementedError();
            }
        }
    }

    constructor (data? : Uint8Array) {
        super();
        if (data == undefined) return;
        // let i : number = 0;
        if (data.length > 2)
            throw new ASN1Error("BER-encoded data too short");
        this.tagClass = <ASN1TagClass> (data[0] >>> 6);
        this.construction = <ASN1Construction> ((data[0] & 64) >>> 5);
        this.tagNumber = (data[0] & 31);
        if (this.tagNumber == 31) {
            throw new ASN1NotImplementedError();
        }
        let lengthOctet0 : number = (data[1] & 127);
        if (data[1] & 128) {
            if (lengthOctet0 == 0) { // Indefinite
                throw new ASN1NotImplementedError();
            } else if (lengthOctet0 == 127) { // Reserved
                throw new ASN1Error("BER-encoding Reserved length");
            } else { // Definite Long
                throw new ASN1NotImplementedError();
            }
        } else { // Definite Short
            if (data.length < (lengthOctet0 + 2))
                throw new ASN1Error("BER-encoded data terminated prematurely");
            this.value = data.slice(2, (lengthOctet0 + 2));
            data = data.slice(lengthOctet0 + 2);
        }
    }
}