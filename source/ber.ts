// TODO: Unused variable 'i' in BER.objectIdentifier getter in D library (line 898)
import { ASN1Element,ASN1TagClass,ASN1UniversalType,ASN1Construction,ASN1SpecialRealValue,ASN1Error,ASN1NotImplementedError } from "./asn1";
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
        if (numbers.length > 2) {
            for (let i : number = 2; i < numbers.length; i++) {
                let number : number = numbers[i];
                if (number < 128) {
                    pre.push(number);
                    continue;
                }

                let encodedOIDNode : number[] = [];
                while (number != 0) {
                    let numberBytes : number[] = [
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
        let valueString : string = value.toFixed(7);
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

    set enumerated (value : number) {
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

    get enumerated () : number {
        if (this.value.length == 0)
            throw new ASN1Error("Number encoded on zero bytes!");
        if (this.value.length > 4)
            throw new ASN1Error("Number too long to decode.");

        let ret : number = (this.value[0] >= 128 ? Number.MAX_SAFE_INTEGER : 0);
        this.value.forEach(byte => {
            ret <<= 8;
            ret += byte;
        });
        return ret;
    }

    // TODO: EmbeddedPDV
    // TODO: UTF8String

    set relativeObjectIdentifier (value : number[]) {
        let numbers : number[] = value;
        let pre : number[] = [];
        if (numbers.length > 0) {
            for (let i : number = 0; i < numbers.length; i++) {
                let number : number = numbers[i];
                if (number < 128) {
                    pre.push(number);
                    continue;
                }

                let encodedOIDNode : number[] = [];
                while (number != 0) {
                    let numberBytes : number[] = [
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

    get relativeObjectIdentifier () : number[] {

        if (this.construction != ASN1Construction.primitive)
            throw new ASN1Error
            ("Construction cannot be constructed for an OBJECT IDENTIFIER!");

        let numbers : number[] = [];

        if (this.value.length == 1)
            return numbers;

        if ((this.value[(this.value.length - 1)] & 0x80) == 0x80)
            throw new ASN1Error("OID truncated");

        let components : number = 0;
        this.value.forEach(b => {
            if (!(b & 0x80)) components++;
        });
        numbers.length = components;

        let currentNumber : number = 0;
        let bytesUsedInCurrentNumber : number = 0;
        this.value.forEach(b => {
            if (bytesUsedInCurrentNumber == 0 && b == 0x80)
                throw new ASN1Error("OID had invalid padding byte.");

            // NOTE: You must use the unsigned shift >>> or MAX_SAFE_INTEGER will become -1.
            if (numbers[currentNumber] > (Number.MAX_SAFE_INTEGER >>> 7))
                throw new ASN1Error("OID node too big");

            numbers[currentNumber] <<= 7;
            numbers[currentNumber] |= (b & 0x7F);

            if (!(b & 0x80)) {
                currentNumber++;
                bytesUsedInCurrentNumber = 0;
            } else {
                bytesUsedInCurrentNumber++;
            }
        });

        return numbers;
    }

    constructor
    (
        tagClass : ASN1TagClass = ASN1TagClass.universal,
        construction : ASN1Construction = ASN1Construction.primitive,
        tagNumber : number = 0
    )
    {
        super();
        this.tagClass = tagClass;
        this.construction = construction;
        this.tagNumber = tagNumber;
        this.value = new Uint8Array(0);
    }

    // Returns the number of bytes read
    public fromBytes (bytes : Uint8Array) : number {
        if (bytes.length < 2)
            throw new ASN1Error("Tried to decode a BER element that is less than two bytes.");

        let cursor : number = 0;
        switch (bytes[cursor] & 0b11000000) {
            case (0b00000000): this.tagClass = ASN1TagClass.universal; break;
            case (0b01000000): this.tagClass = ASN1TagClass.application; break;
            case (0b10000000): this.tagClass = ASN1TagClass.context; break;
            case (0b11000000): this.tagClass = ASN1TagClass.private; break;
            default: this.tagClass = ASN1TagClass.universal;
        }

        this.construction = ((bytes[cursor] & 0b00100000) ?
            ASN1Construction.constructed : ASN1Construction.primitive);

        this.tagNumber = (bytes[cursor] & 0b00011111);
        cursor++;
        if (this.tagNumber >= 31) {
            /* NOTE:
                Section 8.1.2.4.2, point C of the International
                Telecommunications Union's X.690 specification says:
                "bits 7 to 1 of the first subsequent octet shall not all be zero."
                in reference to the bytes used to encode the tag number in long
                form, which happens when the least significant five bits of the
                first byte are all set.
                This essentially means that the long-form tag number must be
                encoded on the fewest possible octets. If the first byte is
                0x80, then it is not encoded on the fewest possible octets.
            */
            if (bytes[cursor] == 0b10000000)
                throw new ASN1Error("Leading padding byte on long tag number encoding.");

            this.tagNumber = 0;

            // This loop looks for the end of the encoded tag number.
            const limit : number = (((bytes.length - 1) >= 4) ? 4 : (bytes.length - 1));
            while (cursor < limit) {
                if (!(bytes[cursor++] & 0x80)) break;
            }

            if (bytes[cursor-1] & 0x80) {
                if (limit == bytes.length-1) {
                    throw new ASN1Error("ASN.1 tag number appears to have been truncated.");
                } else throw new ASN1Error("ASN.1 tag number too large.");
            }

            for (let i : number = 1; i < cursor; i++) {
                this.tagNumber <<= 7;
                this.tagNumber |= (bytes[i] & 0x7F);
            }
        }

        // Length
        if ((bytes[cursor] & 0x80) == 0x80) {
            const numberOfLengthOctets : number = (bytes[cursor] & 0x7F);
            if (numberOfLengthOctets) { // Definite Long or Reserved
                if (numberOfLengthOctets == 0b01111111) // Reserved
                    throw new ASN1Error("Length byte with undefined meaning encountered.");

                // Definite Long, if it has made it this far

                if (numberOfLengthOctets > 4)
                    throw new ASN1Error("Element length too long to decode to an integer.");

                if (cursor + numberOfLengthOctets >= bytes.length)
                    throw new ASN1Error("Element length bytes appear to have been truncated.");

                cursor++;
                let lengthNumberOctets : Uint8Array = new Uint8Array(4);
                for (let i : number = numberOfLengthOctets; i > 0; i--) {
                    lengthNumberOctets[(4 - i)] = bytes[(cursor + numberOfLengthOctets - i)];
                }

                let length : number = 0;
                lengthNumberOctets.forEach(octet => {
                    length <<= 8;
                    length += octet;
                });

                if ((cursor + length) < cursor) // This catches an overflow.
                    throw new ASN1Error("ASN.1 element too large.");

                cursor += (numberOfLengthOctets);

                if ((cursor + length) > bytes.length)
                    throw new ASN1Error("ASN.1 element truncated.");

                this.value = bytes.slice(cursor, (cursor + length));
                return (cursor + length);
            } else { // Indefinite
                if (this.construction != ASN1Construction.constructed)
                    throw new ASN1Error("Indefinite length ASN.1 element was not of constructed construction.");

                if (++(BERElement.lengthRecursionCount) > BERElement.nestingRecursionLimit) {
                    BERElement.lengthRecursionCount = 0;
                    throw new ASN1Error("ASN.1 indefinite length encoded element recursed too deeply.");
                }

                const startOfValue : number = ++cursor;
                let sentinel : number = cursor; // Used to track the length of the nested elements.
                while (sentinel < bytes.length) {
                    const child : BERElement = new BERElement();
                    sentinel += child.fromBytes(bytes.slice(sentinel));
                    if (
                        child.tagClass == ASN1TagClass.universal &&
                        child.construction == ASN1Construction.primitive &&
                        child.tagNumber == ASN1UniversalType.endOfContent &&
                        child.value.length == 0
                    ) break;
                }

                if (sentinel == bytes.length && (bytes[sentinel - 1] != 0x00 || bytes[sentinel - 2] != 0x00))
                    throw new ASN1Error("No END OF CONTENT element found at the end of indefinite length ASN.1 element.");

                BERElement.lengthRecursionCount--;
                this.value = bytes.slice(startOfValue, (sentinel - 2));
                return sentinel;
            }
        } else { // Definite Short
            let length : number = (bytes[cursor++] & 0x7F);

            if ((cursor + length) > bytes.length)
                throw new ASN1Error("ASN.1 element was truncated.");

            this.value = bytes.slice(cursor, (cursor + length));
            return (cursor + length);
        }
    }
}