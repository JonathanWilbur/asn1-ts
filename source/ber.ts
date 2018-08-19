// TODO: Unused variable 'i' in BER.objectIdentifier getter in D library (line 898)
// TODO: Add warning about use of indefinite form encoding: there's nothing stopping you from supplying a value that contains two consecutive null octets.
// TODO: Would it be possible to underflow valueRecursionCount by triggering an exception when no recursion was performed?
// TODO: The D Library does not accept constructed UTCTime and GeneralizedTime
// REVIEW: Is it a problem that my ASN.1 D library supports length tags with leading zeros?
import { ASN1Element,ASN1TagClass,ASN1UniversalType,ASN1Construction,ASN1SpecialRealValue,ASN1Error,ASN1NotImplementedError,LengthEncodingPreference,MAX_SINT_32,MIN_SINT_32,printableStringCharacters } from "./asn1";
import { OID, ObjectIdentifier } from "./types/objectidentifier";

export
class BERElement extends ASN1Element {

    public static lengthEncodingPreference : LengthEncodingPreference =
        LengthEncodingPreference.definite;

    set boolean (value : boolean) {
        this.value = new Uint8Array(1);
        this.value[0] = (value ? 255 : 0);
    }

    get boolean () : boolean {
        if (this.value.length != 1)
            throw new ASN1Error("BER-encoded BOOLEAN not one byte");
        return (this.value[0] != 0);
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
            throw new ASN1Error("Number " + value.toString() + " too small to be converted.");
        if (value > MAX_SINT_32)
            throw new ASN1Error("Number " + value.toString() + " too big to be converted.");

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

    // FIXME: Make this throw an exception when padding bytes are encountered.
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
            if (BERElement.valueRecursionCount++ == BERElement.nestingRecursionLimit) {
                BERElement.valueRecursionCount--;
                throw new ASN1Error("Recursion was too deep!");
            }

            let appendy : boolean[] = [];
            let substrings : BERElement[] = this.sequence;
            if (substrings.length == 0) return [];
            // REVIEW: Why am I skipping the last substring? I don't think it is EOC...
            substrings.slice(0, (substrings.length - 1)).forEach(substring => {
                if (
                    substring.construction == ASN1Construction.primitive &&
                    substring.value.length > 0 &&
                    substring.value[0] != 0x00
                ) {
                    BERElement.valueRecursionCount--;
                    throw new ASN1Error
                    (
                        "This exception was thrown because you attempted to " +
                        "decode a constructed BIT STRING that contained a " +
                        "substring whose first byte indicated a non-zero " +
                        "number of padding bits, despite not being the " +
                        "last substring of the constructed BIT STRING. " +
                        "Only the last substring may have padding bits. "
                    );
                }
            });

            substrings.forEach(substring => {
                if (substring.tagClass != this.tagClass) {
                    BERElement.valueRecursionCount--;
                    throw new ASN1Error("Invalid tag class in recursively-encoded BIT STRING.");
                }

                if (substring.tagNumber != this.tagNumber) {
                    BERElement.valueRecursionCount--;
                    throw new ASN1Error("Invalid tag number in recursively-encoded BIT STRING.");
                }

                appendy = appendy.concat(substring.bitString);
            });

            BERElement.valueRecursionCount--;
            return appendy;
        }
    }

    set octetString (value : Uint8Array) {
        this.value = value.subarray(0); // Clones it.
    }

    get octetString () : Uint8Array {
        return this.deconstruct("OCTET STRING");
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
        this.graphicString = value;
    }

    get objectDescriptor () : string {
        return this.graphicString;
    }

    // TODO:
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
            throw new ASN1Error("Number " + value.toString() + " too small to be converted.");
        if (value > 2147483647)
            throw new ASN1Error("Number " + value.toString() + " too big to be converted.");

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

    // FIXME: Make this throw an exception when padding bytes are encountered.
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

    set utf8String (value : string) {
        if (typeof TextEncoder !== "undefined") { // Browser JavaScript
            this.value = (new TextEncoder()).encode(value);
        } else if (typeof Buffer !== "undefined") { // NodeJS
            this.value = Buffer.from(value, "utf-8");
        }
    }

    get utf8String () : string {
        let valueBytes : Uint8Array = this.deconstruct("UTF8String");
        let ret : string = "";
        if (typeof TextEncoder !== "undefined") { // Browser JavaScript
            ret = (new TextDecoder("utf-8")).decode(valueBytes.buffer);
        } else if (typeof Buffer !== "undefined") { // NodeJS
            ret = (new Buffer(this.value)).toString("utf-8");
        }
        return ret;
    }

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

    set sequence (value : BERElement[]) {
        let encodedElements : Uint8Array[] = [];
        value.forEach(element => {
            encodedElements.push(element.toBytes());
        });
        let totalLength : number = 0;
        encodedElements.forEach(element => {
            totalLength += element.length;
        });
        let newValue = new Uint8Array(totalLength);
        let currentIndex : number = 0;
        encodedElements.forEach(element => {
            newValue.set(element, currentIndex);
            currentIndex += element.length;
        });
        this.value = newValue;
        this.construction = ASN1Construction.constructed;
    }

    get sequence () : BERElement[] {
        let encodedElements : BERElement[] = [];
        if (this.value.length === 0) return [];
        let i : number = 0;
        while (i < this.value.length) {
            let next : BERElement = new BERElement();
            i += next.fromBytes(this.value.slice(i));
            encodedElements.push(next);
        }
        return encodedElements;
    }

    set set (value : BERElement[]) {
        let encodedElements : Uint8Array[] = [];
        value.forEach(element => {
            encodedElements.push(element.toBytes());
        });
        let totalLength : number = 0;
        encodedElements.forEach(element => {
            totalLength += element.length;
        });
        let newValue = new Uint8Array(totalLength);
        let currentIndex : number = 0;
        encodedElements.forEach(element => {
            newValue.set(element, currentIndex);
            currentIndex += element.length;
        });
        this.value = newValue;
        this.construction = ASN1Construction.constructed;
    }

    get set () : BERElement[] {
        let encodedElements : BERElement[] = [];
        if (this.value.length === 0) return [];
        let i : number = 0;
        while (i < this.value.length) {
            let next : BERElement = new BERElement();
            i += next.fromBytes(this.value.slice(i));
            encodedElements.push(next);
        }
        return encodedElements;
    }

    set numericString (value : string) {
        for (let i : number = 0; i < value.length; i++) {
            let characterCode : number = value.charCodeAt(i);
            if (!((characterCode >= 0x30 && characterCode <= 0x39) || characterCode === 0x20)) {
                throw new ASN1Error("NumericString can only contain characters 0 - 9 and space.");
            }
        }

        if (typeof TextEncoder !== "undefined") { // Browser JavaScript
            this.value = (new TextEncoder()).encode(value);
        } else if (typeof Buffer !== "undefined") { // NodeJS
            this.value = Buffer.from(value, "utf-8");
        }
    }

    get numericString () : string {
        let valueBytes : Uint8Array = this.deconstruct("NumericString");
        let ret : string = "";
        if (typeof TextEncoder !== "undefined") { // Browser JavaScript
            ret = (new TextDecoder("utf-8")).decode(valueBytes.buffer);
        } else if (typeof Buffer !== "undefined") { // NodeJS
            ret = (new Buffer(this.value)).toString("utf-8");
        }
        for (let i : number = 0; i < ret.length; i++) {
            let characterCode : number = ret.charCodeAt(i);
            if (!((characterCode >= 0x30 && characterCode <= 0x39) || characterCode === 0x20)) {
                throw new ASN1Error("NumericString can only contain characters 0 - 9 and space.");
            }
        }
        return ret;
    }

    set printableString (value : string) {
        for (let i : number = 0; i < value.length; i++) {
            if (printableStringCharacters.indexOf(value.charAt(i)) === -1) {
                throw new ASN1Error(`PrintableString can only contain these characters: ${printableStringCharacters}`);
            }
        }

        if (typeof TextEncoder !== "undefined") { // Browser JavaScript
            this.value = (new TextEncoder()).encode(value);
        } else if (typeof Buffer !== "undefined") { // NodeJS
            this.value = Buffer.from(value, "utf-8");
        }
    }

    get printableString () : string {
        let valueBytes : Uint8Array = this.deconstruct("PrintableString");
        let ret : string = "";
        if (typeof TextEncoder !== "undefined") { // Browser JavaScript
            ret = (new TextDecoder("utf-8")).decode(valueBytes.buffer);
        } else if (typeof Buffer !== "undefined") { // NodeJS
            ret = (new Buffer(this.value)).toString("utf-8");
        }
        for (let i : number = 0; i < ret.length; i++) {
            if (printableStringCharacters.indexOf(ret.charAt(i)) === -1) {
                throw new ASN1Error(`PrintableString can only contain these characters: ${printableStringCharacters}`);
            }
        }
        return ret;
    }

    set teletexString (value : Uint8Array) {
        this.value = value.subarray(0); // Clones it.
    }

    get teletexString () : Uint8Array {
        return this.deconstruct("TeletexString");
    }

    set videotexString (value : Uint8Array) {
        this.value = value.subarray(0); // Clones it.
    }

    get videotexString () : Uint8Array {
        return this.deconstruct("VideotexString");
    }

    set ia5String (value : string) {
        if (typeof TextEncoder !== "undefined") { // Browser JavaScript
            this.value = (new TextEncoder()).encode(value);
        } else if (typeof Buffer !== "undefined") { // NodeJS
            this.value = Buffer.from(value, "utf-8");
        }
    }

    get ia5String () : string {
        let valueBytes : Uint8Array = this.deconstruct("IA5String");
        let ret : string = "";
        if (typeof TextEncoder !== "undefined") { // Browser JavaScript
            ret = (new TextDecoder("utf-8")).decode(valueBytes.buffer);
        } else if (typeof Buffer !== "undefined") { // NodeJS
            ret = (new Buffer(this.value)).toString("utf-8");
        }
        return ret;
    }

    set utcTime (value : Date) {
        let year : string = value.getUTCFullYear().toString();
        year = (year.substring(year.length - 2, year.length)); // Will fail if you supply a <2 digit date.
        let month : string = (value.getUTCMonth() < 10 ? `0${value.getUTCMonth()}` : `${value.getUTCMonth()}`);
        let day : string = (value.getUTCDate() < 10 ? `0${value.getUTCDate()}` : `${value.getUTCDate()}`);
        let hour : string = (value.getUTCHours() < 10 ? `0${value.getUTCHours()}` : `${value.getUTCHours()}`);
        let minute : string = (value.getUTCMinutes() < 10 ? `0${value.getUTCMinutes()}` : `${value.getUTCMinutes()}`);
        let second : string = (value.getUTCSeconds() < 10 ? `0${value.getUTCSeconds()}` : `${value.getUTCSeconds()}`);
        let utcString = `${year}${month}${day}${hour}${minute}${second}Z`;

        if (typeof TextEncoder !== "undefined") { // Browser JavaScript
            this.value = (new TextEncoder()).encode(utcString);
        } else if (typeof Buffer !== "undefined") { // NodeJS
            this.value = Buffer.from(utcString, "utf-8");
        }
    }

    get utcTime () : Date {
        let valueBytes : Uint8Array = this.deconstruct("UTCTime");
        let dateString : string = "";
        if (typeof TextEncoder !== "undefined") { // Browser JavaScript
            dateString = (new TextDecoder("utf-8")).decode(valueBytes.buffer);
        } else if (typeof Buffer !== "undefined") { // NodeJS
            dateString = (new Buffer(this.value)).toString("utf-8");
        }
        if (dateString.length !== 13) {
            throw new ASN1Error("Malformed UTCTime string.");
        }

        let ret : Date = new Date();
        let year : number = Number(dateString.substring(0, 2));
        ret.setUTCFullYear(year < 70 ? (2000 + year) : (1900 + year));
        ret.setUTCMonth(Number(dateString.substring(2, 4)));
        ret.setUTCDate(Number(dateString.substring(4, 6)));
        ret.setUTCHours(Number(dateString.substring(6, 8)));
        ret.setUTCMinutes(Number(dateString.substring(8, 10)));
        ret.setUTCSeconds(Number(dateString.substring(10, 12)));
        return ret;
    }

    // TODO: Support milliseconds
    set generalizedTime (value : Date) {
        let year : string = value.getUTCFullYear().toString();
        let month : string = (value.getUTCMonth() < 10 ? `0${value.getUTCMonth()}` : `${value.getUTCMonth()}`);
        let day : string = (value.getUTCDate() < 10 ? `0${value.getUTCDate()}` : `${value.getUTCDate()}`);
        let hour : string = (value.getUTCHours() < 10 ? `0${value.getUTCHours()}` : `${value.getUTCHours()}`);
        let minute : string = (value.getUTCMinutes() < 10 ? `0${value.getUTCMinutes()}` : `${value.getUTCMinutes()}`);
        let second : string = (value.getUTCSeconds() < 10 ? `0${value.getUTCSeconds()}` : `${value.getUTCSeconds()}`);
        let timeString = `${year}${month}${day}${hour}${minute}${second}Z`;

        if (typeof TextEncoder !== "undefined") { // Browser JavaScript
            this.value = (new TextEncoder()).encode(timeString);
        } else if (typeof Buffer !== "undefined") { // NodeJS
            this.value = Buffer.from(timeString, "utf-8");
        }
    }

    get generalizedTime () : Date {
        let valueBytes : Uint8Array = this.deconstruct("GeneralizedTime");
        let dateString : string = "";
        if (typeof TextEncoder !== "undefined") { // Browser JavaScript
            dateString = (new TextDecoder("utf-8")).decode(valueBytes.buffer);
        } else if (typeof Buffer !== "undefined") { // NodeJS
            dateString = (new Buffer(this.value)).toString("utf-8");
        }
        if (dateString.length < 13) {
            throw new ASN1Error("Malformed GeneralizedTime string.");
        }
        let ret : Date = new Date();
        ret.setUTCFullYear(Number(dateString.substring(0, 4)));
        ret.setUTCMonth(Number(dateString.substring(4, 6)));
        ret.setUTCDate(Number(dateString.substring(6, 8)));
        ret.setUTCHours(Number(dateString.substring(8, 10)));
        ret.setUTCMinutes(Number(dateString.substring(10, 12)));
        ret.setUTCSeconds(Number(dateString.substring(12, 14)));
        return ret;
    }

    set graphicString (value : string) {
        for (let i : number = 0; i < value.length; i++) {
            let characterCode : number = value.charCodeAt(i);
            if (characterCode < 0x20 || characterCode > 0x7E) {
                throw new ASN1Error("GraphicString, VisibleString, or ObjectDescriptor can only contain characters between 0x20 and 0x7E.");
            }
        }

        if (typeof TextEncoder !== "undefined") { // Browser JavaScript
            this.value = (new TextEncoder()).encode(value);
        } else if (typeof Buffer !== "undefined") { // NodeJS
            this.value = Buffer.from(value, "utf-8");
        }
    }

    get graphicString () : string {
        let valueBytes : Uint8Array = this.deconstruct("GraphicString, VisibleString, or ObjectDescriptor");
        let ret : string = "";
        if (typeof TextEncoder !== "undefined") { // Browser JavaScript
            ret = (new TextDecoder("utf-8")).decode(valueBytes.buffer);
        } else if (typeof Buffer !== "undefined") { // NodeJS
            ret = (new Buffer(this.value)).toString("utf-8");
        }
        for (let i : number = 0; i < ret.length; i++) {
            let characterCode : number = ret.charCodeAt(i);
            if (characterCode < 0x20 || characterCode > 0x7E) {
                throw new ASN1Error("GraphicString, VisibleString, or ObjectDescriptor can only contain characters between 0x20 and 0x7E.");
            }
        }
        return ret;
    }

    set visibleString (value : string) {
        this.graphicString = value;
    }

    get visibleString () : string {
        return this.graphicString;
    }

    set generalString (value : string) {
        for (let i : number = 0; i < value.length; i++) {
            if (value.charCodeAt(i) > 0x7F) {
                throw new ASN1Error("GeneralString can only contain ASCII characters.");
            }
        }

        if (typeof TextEncoder !== "undefined") { // Browser JavaScript
            this.value = (new TextEncoder()).encode(value);
        } else if (typeof Buffer !== "undefined") { // NodeJS
            this.value = Buffer.from(value, "ascii");
        }
    }

    get generalString () : string {
        let valueBytes : Uint8Array = this.deconstruct("GeneralString");
        let ret : string = "";
        if (typeof TextEncoder !== "undefined") { // Browser JavaScript
            ret = (new TextDecoder("windows-1252")).decode(valueBytes.buffer);
        } else if (typeof Buffer !== "undefined") { // NodeJS
            ret = (new Buffer(this.value)).toString("ascii");
        }
        for (let i : number = 0; i < ret.length; i++) {
            let characterCode : number = ret.charCodeAt(i);
            if (characterCode > 0x7F) {
                throw new ASN1Error("GeneralString can only contain ASCII characters.");
            }
        }
        return ret;
    }

    set universalString (value : string) {
        let buf : Uint8Array = new Uint8Array(value.length << 2);
        if (buf.length % 4)
            throw new ASN1Error("UniversalString encoded on non-mulitple of four bytes.");
        for (let i : number = 0, strLen : number = value.length; i < strLen; i++) {
            buf[(i << 2)]      = value.charCodeAt(i) >>> 24;
            buf[(i << 2) + 1]  = value.charCodeAt(i) >>> 16;
            buf[(i << 2) + 2]  = value.charCodeAt(i) >>> 8;
            buf[(i << 2) + 3]  = value.charCodeAt(i);
        }
        this.value = buf;
    }

    /** NOTE:
     * This might not decode anything above 0xFFFF, because JavaScript
     * natively uses either UCS-2 or UTF-16. If it uses UTF-16 (which
     * most do), it might work, but UCS-2 will definitely not work.
     */
    get universalString () : string {
        let valueBytes : Uint8Array = this.deconstruct("UniversalString");
        let ret : string = "";
        for (let i : number = 0; i < valueBytes.length; i += 4) {
            ret += String.fromCharCode(
                (valueBytes[i + 0] << 24) +
                (valueBytes[i + 1] << 16) +
                (valueBytes[i + 2] << 8)  +
                (valueBytes[i + 3] << 0)
            );
        }
        return ret;
    }

    // TODO: CHARACTER STRING

    set bmpString (value : string) {
        let buf : Uint8Array = new Uint8Array(value.length << 1);
        for (let i : number = 0, strLen : number = value.length; i < strLen; i++) {
            buf[(i << 1)]      = value.charCodeAt(i) >>> 8;
            buf[(i << 1) + 1]  = value.charCodeAt(i);
        }
        this.value = buf;
    }

    get bmpString () : string {
        let valueBytes : Uint8Array = this.deconstruct("BMPString");
        if (valueBytes.length % 4)
            throw new ASN1Error("UniversalString encoded on non-mulitple of four bytes.");
        let ret : string = "";
        if (typeof TextEncoder !== "undefined") { // Browser JavaScript
            ret = (new TextDecoder("utf-16be")).decode(valueBytes.buffer);
        } else if (typeof Buffer !== "undefined") { // NodeJS
            let swappedEndianness : Uint8Array = new Uint8Array(valueBytes.length);
            for (let i : number = 0; i < valueBytes.length; i += 2) {
                swappedEndianness[i] = valueBytes[i + 1];
                swappedEndianness[i + 1] = valueBytes[i];
            }
            /** REVIEW:
             * Since NodeJS does not have a UTF-16-BE decoder, can we swap
             * every pair of bytes to make it little-endian, then decode
             * using NodeJS's utf-16-le decoder?
             */
            ret = (new Buffer(swappedEndianness)).toString("utf-16le");
        }
        return ret;
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

    // TODO: Convert number[] to Uint8Array
    public toBytes () : Uint8Array {
        let tagBytes : number[] = [ 0x00 ];
        tagBytes[0] |= this.tagClass;
        tagBytes[0] |= this.construction;

        if (this.tagNumber < 31) {
            tagBytes[0] |= this.tagNumber;
        } else {
            /*
                Per section 8.1.2.4 of X.690:
                The last five bits of the first byte being set indicate that
                the tag number is encoded in base-128 on the subsequent octets,
                using the first bit of each subsequent octet to indicate if the
                encoding continues on the next octet, just like how the
                individual numbers of OBJECT IDENTIFIER and RELATIVE OBJECT
                IDENTIFIER are encoded.
            */
            tagBytes[0] |= 0b00011111;
            let number : number = this.tagNumber; // We do not want to modify by reference.
            let encodedNumber : number[] = [];
            while (number != 0) {
                encodedNumber.unshift(number & 0x7F);
                number >>>= 7;
                encodedNumber[0] |= 0b10000000;
            }
            encodedNumber[encodedNumber.length - 1] &= 0b01111111;
            tagBytes = tagBytes.concat(encodedNumber);
        }

        let lengthOctets : number[] = [ 0x00 ];
        switch (BERElement.lengthEncodingPreference) {
            case (LengthEncodingPreference.definite): {
                if (this.value.length < 127) {
                    lengthOctets = [ this.value.length ];
                } else {
                    let length : number = this.value.length;
                    lengthOctets = [ 0, 0, 0, 0 ];
                    for (let i : number = 0; i < 4; i++) {
                        lengthOctets[i] = ((length >> ((3 - i) << 3)) & 0xFF);
                    }
                    let startOfNonPadding : number = 0;
                    for (let i : number = 0; i < (lengthOctets.length - 1); i++) {
                        if (lengthOctets[i] == 0x00) startOfNonPadding++;
                    }
                    lengthOctets = lengthOctets.slice(startOfNonPadding);
                    lengthOctets.unshift(0b10000000 | lengthOctets.length);
                }
                break;
            }
            case (LengthEncodingPreference.indefinite): {
                lengthOctets = [ 0x80 ];
                break;
            }
            default:
                throw new ASN1Error("Invalid LengthEncodingPreference encountered!");
        }

        let ret : Uint8Array = new Uint8Array(
            tagBytes.length +
            lengthOctets.length +
            this.value.length +
            (BERElement.lengthEncodingPreference == LengthEncodingPreference.indefinite ? 2 : 0)
        );
        ret.set(tagBytes, 0);
        ret.set(lengthOctets, tagBytes.length);
        ret.set(this.value, (tagBytes.length + lengthOctets.length));
        return ret;
    }

    private deconstruct (dataType : string) : Uint8Array {
        if (this.construction == ASN1Construction.primitive) {
            return this.value.subarray(0); // Clones it.
        } else {
            if (BERElement.valueRecursionCount++ == BERElement.nestingRecursionLimit) {
                BERElement.valueRecursionCount--;
                throw new ASN1Error("Recursion was too deep!");
            }

            let appendy : Uint8Array[] = [];
            let substrings : BERElement[] = this.sequence;
            substrings.forEach(substring => {
                if (substring.tagClass != this.tagClass) {
                    BERElement.valueRecursionCount--;
                    throw new ASN1Error(`Invalid tag class in recursively-encoded ${dataType}.`);
                }

                if (substring.tagNumber != this.tagNumber) {
                    BERElement.valueRecursionCount--;
                    throw new ASN1Error(`Invalid tag class in recursively-encoded ${dataType}.`);
                }

                appendy = appendy.concat(substring.deconstruct(dataType));
            });

            let totalLength : number = 0;
            appendy.forEach(substring => {
                totalLength += substring.length;
            });
            let whole = new Uint8Array(totalLength);
            let currentIndex : number = 0;
            appendy.forEach(substring => {
                whole.set(substring, currentIndex);
                currentIndex += substring.length;
            });
            BERElement.valueRecursionCount--;
            return whole;
        }
    }
}