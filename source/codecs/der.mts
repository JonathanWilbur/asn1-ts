import ASN1Element from "../asn1.mjs";
import * as errors from "../errors.mjs";
import {
    ASN1Construction,
    ASN1TagClass,
    ASN1UniversalType,
} from "../values.mjs";
import CharacterString from "../types/CharacterString.mjs";
import convertBytesToText from "../utils/convertBytesToText.mjs";
import convertTextToBytes from "../utils/convertTextToBytes.mjs";
import sortCanonically from "../utils/sortCanonically.mjs";
import ObjectIdentifier from "../types/ObjectIdentifier.mjs";
import encodeBoolean from "./x690/encoders/encodeBoolean.mjs";
import decodeBoolean from "./der/decoders/decodeBoolean.mjs";
import encodeBitString from "./x690/encoders/encodeBitString.mjs";
import decodeBitString from "./der/decoders/decodeBitString.mjs";
import encodeReal from "./x690/encoders/encodeReal.mjs";
import decodeReal from "./der/decoders/decodeReal.mjs";
import encodeSequence from "./x690/encoders/encodeSequence.mjs";
import decodeSequence from "./der/decoders/decodeSequence.mjs";
import encodeUTCTime from "./x690/encoders/encodeUTCTime.mjs";
import decodeUTCTime from "./der/decoders/decodeUTCTime.mjs";
import encodeGeneralizedTime from "./x690/encoders/encodeGeneralizedTime.mjs";
import decodeGeneralizedTime from "./der/decoders/decodeGeneralizedTime.mjs";
import encodeExternal from "../codecs/x690/encoders/encodeExternal.mjs";
import encodeEmbeddedPDV from "../codecs/x690/encoders/encodeEmbeddedPDV.mjs";
import encodeCharacterString from "../codecs/x690/encoders/encodeCharacterString.mjs";
import decodeExternal from "../codecs/x690/decoders/decodeExternal.mjs";
import decodeEmbeddedPDV from "../codecs/x690/decoders/decodeEmbeddedPDV.mjs";
import decodeCharacterString from "../codecs/x690/decoders/decodeCharacterString.mjs";
import encodeGraphicString from "../codecs/ber/encoders/encodeGraphicString.mjs";
import encodeNumericString from "../codecs/ber/encoders/encodeNumericString.mjs";
import encodeObjectDescriptor from "../codecs/ber/encoders/encodeObjectDescriptor.mjs";
import encodePrintableString from "../codecs/ber/encoders/encodePrintableString.mjs";
import encodeVisibleString from "../codecs/ber/encoders/encodeVisibleString.mjs";
import encodeGeneralString from "../codecs/ber/encoders/encodeGeneralString.mjs";
import decodeGraphicString from "../codecs/x690/decoders/decodeGraphicString.mjs";
import decodeNumericString from "../codecs/x690/decoders/decodeNumericString.mjs";
import decodeObjectDescriptor from "../codecs/x690/decoders/decodeObjectDescriptor.mjs";
import decodePrintableString from "../codecs/x690/decoders/decodePrintableString.mjs";
import decodeVisibleString from "../codecs/x690/decoders/decodeVisibleString.mjs";
import decodeGeneralString from "../codecs/x690/decoders/decodeGeneralString.mjs";
import encodeDuration from "../codecs/x690/encoders/encodeDuration.mjs";
import decodeDuration from "../codecs/der/decoders/decodeDuration.mjs";
import X690Element from "../x690.mjs";
import type {
    BOOLEAN,
    BIT_STRING,
    OCTET_STRING,
    ObjectDescriptor,
    EXTERNAL,
    REAL,
    EMBEDDED_PDV,
    UTF8String,
    SEQUENCE,
    SET,
    GraphicString,
    NumericString,
    VisibleString,
    PrintableString,
    TeletexString,
    GeneralString,
    UniversalString,
    VideotexString,
    BMPString,
    IA5String,
    UTCTime,
    GeneralizedTime,
    DURATION,
} from "../macros.mjs";
import { isUniquelyTagged } from "../utils/index.mjs";
import { Buffer } from "node:buffer";

/**
 * @classdesc
 * A `DERElement` is a class that represents an ASN.1 element encoded in
 * Distinguished Encoding Rules (DER).
 *
 * It is used to encode and decode ASN.1 elements in DER format.
 */
export default
class DERElement extends X690Element {
    private _value: Uint8Array | ASN1Element[] = new Uint8Array(0);
    private _currentValueLength: number | undefined;

    /** Get the value octets */
    get value (): Uint8Array {
        if (this._value instanceof Uint8Array) {
            return this._value;
        }
        const bytes = encodeSequence(this._value);
        this._value = bytes;
        return bytes;
    }

    /** Set the value octets */
    set value (v: Uint8Array) {
        this._currentValueLength = v.length;
        this._value = v;
    }

    /** Make this element constructed from other elements */
    public construct (els: ASN1Element[]): void {
        this._currentValueLength = undefined;
        this._value = els;
    }

    set boolean (value: BOOLEAN) {
        this.value = encodeBoolean(value);
    }

    get boolean (): BOOLEAN {
        if (this.construction !== ASN1Construction.primitive) {
            throw new errors.ASN1ConstructionError("BOOLEAN cannot be constructed.", this);
        }
        return decodeBoolean(this.value);
    }

    set bitString (value: BIT_STRING) {
        this.value = encodeBitString(value);
    }

    get bitString (): BIT_STRING {
        if (this.construction !== ASN1Construction.primitive) {
            throw new errors.ASN1ConstructionError("BIT STRING cannot be constructed.", this);
        }
        return decodeBitString(this.value);
    }

    set octetString (value: OCTET_STRING) {
        this.value = new Uint8Array(value); // Clones it.
    }

    get octetString (): OCTET_STRING {
        if (this.construction !== ASN1Construction.primitive) {
            throw new errors.ASN1ConstructionError("OCTET STRING cannot be constructed.", this);
        }
        return new Uint8Array(this.value);
    }

    set objectDescriptor (value: ObjectDescriptor) {
        this.value = encodeObjectDescriptor(value);
    }

    get objectDescriptor (): ObjectDescriptor {
        return decodeObjectDescriptor(this.value);
    }

    set external (value: EXTERNAL) {
        this.value = encodeExternal(value);
        this.construction = ASN1Construction.constructed;
    }

    get external (): EXTERNAL {
        if (this.construction !== ASN1Construction.constructed) {
            throw new errors.ASN1ConstructionError("EXTERNAL cannot be primitively-constructed.", this);
        }
        return decodeExternal(this.value);
    }

    set real (value: REAL) {
        this.value = encodeReal(value);
    }

    get real (): REAL {
        if (this.construction !== ASN1Construction.primitive) {
            throw new errors.ASN1ConstructionError("REAL cannot be constructed.", this);
        }
        return decodeReal(this.value);
    }

    set embeddedPDV (value: EMBEDDED_PDV) {
        this.value = encodeEmbeddedPDV(value);
        this.construction = ASN1Construction.constructed;
    }

    get embeddedPDV (): EMBEDDED_PDV {
        if (this.construction !== ASN1Construction.constructed) {
            throw new errors.ASN1ConstructionError("EMBEDDED PDV cannot be primitively-constructed.", this);
        }
        return decodeEmbeddedPDV(this.value);
    }

    set utf8String (value: UTF8String) {
        this.value = convertTextToBytes(value);
    }

    get utf8String (): UTF8String {
        if (this.construction !== ASN1Construction.primitive) {
            throw new errors.ASN1ConstructionError("UTF8String cannot be constructed.", this);
        }
        return convertBytesToText(this.value);
    }

    set sequence (value: SEQUENCE<ASN1Element>) {
        this.construct(value);
        this.construction = ASN1Construction.constructed;
    }

    get sequence (): SEQUENCE<ASN1Element> {
        if (this.construction !== ASN1Construction.constructed) {
            throw new errors.ASN1ConstructionError("SET or SEQUENCE cannot be primitively constructed.", this);
        }
        if (Array.isArray(this._value)) {
            return this._value;
        }
        return decodeSequence(this.value);
    }

    set set (value: SET<ASN1Element>) {
        sortCanonically(value);
        this.sequence = value;
    }

    get set (): SET<ASN1Element> {
        const ret = this.sequence;
        if (!isUniquelyTagged(ret)) {
            throw new errors.ASN1ConstructionError("Duplicate tag in SET.", this);
        }
        return ret;
    }

    set sequenceOf (value: SEQUENCE<ASN1Element>) {
        this.construct(value);
        this.construction = ASN1Construction.constructed;
    }

    get sequenceOf (): SEQUENCE<ASN1Element> {
        if (this.construction !== ASN1Construction.constructed) {
            throw new errors.ASN1ConstructionError("SET or SEQUENCE cannot be primitively constructed.", this);
        }
        if (Array.isArray(this._value)) {
            return this._value;
        }
        return decodeSequence(this.value);
    }

    set setOf (value: SET<ASN1Element>) {
        this.sequence = value;
    }

    get setOf (): SET<ASN1Element> {
        return this.sequence;
    }

    set numericString (value: NumericString) {
        this.value = encodeNumericString(value);
    }

    get numericString (): NumericString {
        if (this.construction !== ASN1Construction.primitive) {
            throw new errors.ASN1ConstructionError("NumericString cannot be constructed.", this);
        }
        return decodeNumericString(this.value);
    }

    set printableString (value: PrintableString) {
        this.value = encodePrintableString(value);
    }

    get printableString (): PrintableString {
        if (this.construction !== ASN1Construction.primitive) {
            throw new errors.ASN1ConstructionError("PrintableString cannot be constructed.", this);
        }
        return decodePrintableString(this.value);
    }

    set teletexString (value: TeletexString) {
        this.value = new Uint8Array(value); // Clones it.
    }

    get teletexString (): TeletexString {
        return this.octetString;
    }

    set videotexString (value: VideotexString) {
        this.value = new Uint8Array(value); // Clones it.
    }

    get videotexString (): VideotexString {
        return this.octetString;
    }

    set ia5String (value: IA5String) {
        this.value = convertTextToBytes(value);
    }

    get ia5String (): IA5String {
        if (this.construction !== ASN1Construction.primitive) {
            throw new errors.ASN1ConstructionError("IA5String cannot be constructed.", this);
        }
        return convertBytesToText(this.value);
    }

    set utcTime (value: UTCTime) {
        this.value = encodeUTCTime(value);
    }

    get utcTime (): UTCTime {
        if (this.construction !== ASN1Construction.primitive) {
            throw new errors.ASN1ConstructionError("UTCTime cannot be constructed.", this);
        }
        return decodeUTCTime(this.value);
    }

    set generalizedTime (value: GeneralizedTime) {
        this.value = encodeGeneralizedTime(value);
    }

    get generalizedTime (): GeneralizedTime {
        if (this.construction !== ASN1Construction.primitive) {
            throw new errors.ASN1ConstructionError("GeneralizedTime cannot be constructed.", this);
        }
        return decodeGeneralizedTime(this.value);
    }

    set graphicString (value: GraphicString) {
        this.value = encodeGraphicString(value);
    }

    get graphicString (): GraphicString {
        if (this.construction !== ASN1Construction.primitive) {
            throw new errors.ASN1ConstructionError("GraphicString cannot be constructed.", this);
        }
        return decodeGraphicString(this.value);
    }

    set visibleString (value: VisibleString) {
        this.value = encodeVisibleString(value);
    }

    get visibleString (): VisibleString {
        return decodeVisibleString(this.value);
    }

    set generalString (value: GeneralString) {
        this.value = encodeGeneralString(value);
    }

    get generalString (): GeneralString {
        if (this.construction !== ASN1Construction.primitive) {
            throw new errors.ASN1ConstructionError("GeneralString cannot be constructed.", this);
        }
        return decodeGeneralString(this.value);
    }

    set characterString (value: CharacterString) {
        this.value = encodeCharacterString(value);
        this.construction = ASN1Construction.constructed;
    }

    get characterString (): CharacterString {
        if (this.construction !== ASN1Construction.constructed) {
            throw new errors.ASN1ConstructionError("CHARACTER STRING cannot be primitively-constructed.", this);
        }
        return decodeCharacterString(this.value);
    }

    set universalString (value: UniversalString) {
        const buf: Uint8Array = new Uint8Array(value.length << 2);
        for (let i: number = 0; i < value.length; i++) {
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
    get universalString (): UniversalString {
        if (this.construction !== ASN1Construction.primitive) {
            throw new errors.ASN1ConstructionError("UniversalString cannot be constructed.", this);
        }
        if (this.value.length % 4) {
            throw new errors.ASN1Error("UniversalString encoded on non-mulitple of four bytes.", this);
        }
        let ret: string = "";
        for (let i: number = 0; i < this.value.length; i += 4) {
            ret += String.fromCharCode(
                (this.value[i + 0] << 24)
                + (this.value[i + 1] << 16)
                + (this.value[i + 2] <<  8)
                + (this.value[i + 3] <<  0),
            );
        }
        return ret;
    }

    set bmpString (value: BMPString) {
        const buf: Uint8Array = new Uint8Array(value.length << 1);
        for (let i: number = 0, strLen: number = value.length; i < strLen; i++) {
            buf[(i << 1)]      = value.charCodeAt(i) >>> 8;
            buf[(i << 1) + 1]  = value.charCodeAt(i);
        }
        this.value = buf;
    }

    get bmpString (): BMPString {
        if (this.construction !== ASN1Construction.primitive) {
            throw new errors.ASN1ConstructionError("BMPString cannot be constructed.", this);
        }
        if (this.value.length % 2) throw new errors.ASN1Error("BMPString encoded on non-mulitple of two bytes.", this);
        if (typeof Buffer !== "undefined") { // NodeJS
            const swappedEndianness: Buffer = Buffer.allocUnsafe(this.value.length);
            for (let i: number = 0; i < this.value.length; i += 2) {
                swappedEndianness[i] = this.value[i + 1];
                swappedEndianness[i + 1] = this.value[i];
            }
            /** REVIEW:
             * Since NodeJS does not have a UTF-16-BE decoder, can we swap
             * every pair of bytes to make it little-endian, then decode
             * using NodeJS's utf-16-le decoder?
             */
            return swappedEndianness.toString("utf16le");
        } else if (typeof TextEncoder !== "undefined") {
            return (new TextDecoder("utf-16be")).decode(new Uint8Array(this.value));
        } else {
            throw new errors.ASN1Error("Neither TextDecoder nor Buffer are defined to decode bytes into text.", this);
        }
    }

    set duration (value: DURATION) {
        this.value = encodeDuration(value);
    }

    get duration (): DURATION {
        return decodeDuration(this.value);
    }

    /** Encode anything into an ASN.1 element. */
    public encode (value: any): void {
        switch (typeof value) {
        case ("undefined"): {
            this.value = new Uint8Array(0);
            break;
        }
        case ("boolean"): {
            this.tagNumber = ASN1UniversalType.boolean;
            this.boolean = value;
            break;
        }
        case ("number"): {
            if (Number.isInteger(value)) {
                this.tagNumber = ASN1UniversalType.integer;
                this.integer = value;
            } else {
                this.tagNumber = ASN1UniversalType.realNumber;
                this.real = value;
            }
            break;
        }
        case ("bigint"): {
            this.tagNumber = ASN1UniversalType.integer;
            this.integer = value;
            break;
        }
        case ("string"): {
            this.tagNumber = ASN1UniversalType.utf8String;
            this.utf8String = value;
            break;
        }
        case ("object"): {
            if (!value) {
                this.tagNumber = ASN1UniversalType.nill;
                this.value = new Uint8Array(0);
            } else if (value instanceof Uint8Array) {
                this.tagNumber = ASN1UniversalType.octetString;
                this.octetString = value;
            } else if (value instanceof Uint8ClampedArray) {
                this.tagNumber = ASN1UniversalType.bitString;
                this.bitString = value;
            } else if (value instanceof ASN1Element) {
                this.construction = ASN1Construction.constructed;
                this.sequence = [ value as DERElement ];
            } else if (value instanceof Set) {
                this.construction = ASN1Construction.constructed;
                this.set = Array.from(value).map((v: any) => {
                    if (typeof v === "object" && v instanceof ASN1Element) {
                        return v;
                    } else {
                        const e = new DERElement();
                        e.encode(v);
                        return e;
                    }
                });
            } else if ((value instanceof ObjectIdentifier) || (value.constructor?.name === "ObjectIdentifier")) {
                this.tagNumber = ASN1UniversalType.objectIdentifier;
                this.objectIdentifier = value;
            } else if (Array.isArray(value)) {
                this.construction = ASN1Construction.constructed;
                this.tagNumber = ASN1UniversalType.sequence;
                this.sequence = value.map((sub: any): DERElement => {
                    const ret: DERElement = new DERElement();
                    ret.encode(sub);
                    return ret;
                });
            } else if (value instanceof Date) {
                this.generalizedTime = value;
            } else {
                throw new errors.ASN1Error(`Cannot encode value of type ${value.constructor.name}.`, this);
            }
            break;
        }
        default: {
            throw new errors.ASN1Error(`Cannot encode value of type ${typeof value}.`, this);
        }
        }
    }

    /**
     * A convenience method, created because `SEQUENCE` is so common. `null`
     * and `undefined` elements may be supplied, and will simply be filtered
     * out, which is particularly handy for encoding optional elements in a
     * `SEQUENCE`.
     *
     * @param sequence The elements (or absence thereof) to encode.
     */
    public static fromSequence (sequence: (ASN1Element | null | undefined)[]): DERElement {
        const ret: DERElement = new DERElement(
            ASN1TagClass.universal,
            ASN1Construction.constructed,
            ASN1UniversalType.sequence,
        );
        ret.sequence = sequence.filter((element) => Boolean(element)) as SEQUENCE<ASN1Element>;
        return ret;
    }

    /**
     * A convenience method, created because `SET` is so common. `null`
     * and `undefined` elements may be supplied, and will simply be filtered
     * out, which is particularly handy for encoding optional elements in a
     * `SET`.
     *
     * @param set The elements (or absence thereof) to encode.
     */
    public static fromSet (set: (ASN1Element | null | undefined)[]): DERElement {
        const ret: DERElement = new DERElement(
            ASN1TagClass.universal,
            ASN1Construction.constructed,
            ASN1UniversalType.set,
        );
        ret.set = set.filter((element) => Boolean(element)) as SET<ASN1Element>;
        return ret;
    }


    /**
     * A convenience method, created because `SET OF` is so common. `null`
     * and `undefined` elements may be supplied, and will simply be filtered
     * out.
     *
     * @param set The elements (or absence thereof) to encode.
     */
    public static fromSetOf (set: (DERElement | null | undefined)[]): DERElement {
        const ret: DERElement = new DERElement(
            ASN1TagClass.universal,
            ASN1Construction.constructed,
            ASN1UniversalType.set,
        );
        ret.setOf = set.filter((element) => Boolean(element)) as DERElement[];
        return ret;
    }

    /**
     * Get the inner element, if constructed. This is a convenience method
     * for when `EXPLICIT` tags are used.
     */
    get inner (): ASN1Element {
        if (this.construction !== ASN1Construction.constructed) {
            throw new errors.ASN1ConstructionError(
                "An explicitly-encoded element cannot be encoded using "
                + "primitive construction.",
                this,
            );
        }
        if (Array.isArray(this._value)) {
            if (this._value.length !== 1) {
                throw new errors.ASN1ConstructionError(
                    `An explicitly-encoding element contained ${this._value.length} encoded elements.`,
                    this,
                );
            }
            return this._value[0];
        }
        const ret: DERElement = new DERElement();
        const readBytes: number = ret.fromBytes(this._value);
        if (readBytes !== this._value.length) {
            throw new errors.ASN1ConstructionError(
                "An explicitly-encoding element contained more than one single "
                + "encoded element. The tag number of the first decoded "
                + `element was ${ret.tagNumber}, and it was encoded on `
                + `${readBytes} bytes.`,
                this,
            );
        }
        return ret;
    }

    /**
     * Set the inner element, and make this element constructed. This is a
     * convenience method for when `EXPLICIT` tags are used.
     */
    set inner (value: ASN1Element) {
        this.construction = ASN1Construction.constructed;
        this._value = [ value ];
    }

    constructor (
        tagClass: ASN1TagClass = ASN1TagClass.universal,
        construction: ASN1Construction = ASN1Construction.primitive,
        tagNumber: number = ASN1UniversalType.endOfContent,
        value: any = undefined,
    ) {
        super();
        this.encode(value);
        this.tagClass = tagClass;
        this.construction = construction;
        this.tagNumber = tagNumber;
    }

    /**
     * Decode a DER element from a byte array.
     *
     * @param bytes - The byte array to decode.
     * @returns The number of bytes read.
     */
    public fromBytes (bytes: Uint8Array): number {
        if (bytes.length < 2) {
            throw new errors.ASN1TruncationError("Tried to decode a DER element that is less than two bytes.", this);
        }
        let cursor: number = 0;
        switch (bytes[cursor] & 0b11000000) {
        case (0b00000000): this.tagClass = ASN1TagClass.universal; break;
        case (0b01000000): this.tagClass = ASN1TagClass.application; break;
        case (0b10000000): this.tagClass = ASN1TagClass.context; break;
        case (0b11000000): this.tagClass = ASN1TagClass.private; break;
        default: this.tagClass = ASN1TagClass.universal;
        }
        this.construction = ((bytes[cursor] & 0b00100000)
            ? ASN1Construction.constructed : ASN1Construction.primitive);
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
                0b10000000, then it is not encoded on the fewest possible octets.
            */
            if (bytes[cursor] === 0b10000000) {
                throw new errors.ASN1PaddingError("Leading padding byte on long tag number encoding.", this);
            }
            this.tagNumber = 0;
            // This loop looks for the end of the encoded tag number.
            const limit: number = (((bytes.length - 1) >= 4) ? 4 : (bytes.length - 1));
            while (cursor < limit) {
                if (!(bytes[cursor++] & 0b10000000)) break;
            }
            if (bytes[cursor-1] & 0b10000000) {
                if (limit === (bytes.length - 1)) {
                    throw new errors.ASN1TruncationError("ASN.1 tag number appears to have been truncated.", this);
                } else {
                    throw new errors.ASN1OverflowError("ASN.1 tag number too large.", this);
                }
            }
            for (let i: number = 1; i < cursor; i++) {
                this.tagNumber <<= 7;
                this.tagNumber |= (bytes[i] & 0x7F);
            }
            if (this.tagNumber < 31) {
                throw new errors.ASN1Error("ASN.1 tag number could have been encoded in short form.", this);
            }
        }

        // Length
        if ((bytes[cursor] & 0b10000000) === 0b10000000) {
            const numberOfLengthOctets: number = (bytes[cursor] & 0x7F);
            if (numberOfLengthOctets === 0b01111111) { // Reserved
                throw new errors.ASN1UndefinedError("Length byte with undefined meaning encountered.", this);
            }
            // Definite Long, if it has made it this far
            if (numberOfLengthOctets > 4) {
                throw new errors.ASN1OverflowError("Element length too long to decode to an integer.", this);
            }
            if (cursor + numberOfLengthOctets >= bytes.length) {
                throw new errors.ASN1TruncationError("Element length bytes appear to have been truncated.", this);
            }
            cursor++;
            const lengthNumberOctets: Uint8Array = new Uint8Array(4);
            for (let i: number = numberOfLengthOctets; i > 0; i--) {
                lengthNumberOctets[(4 - i)] = bytes[(cursor + numberOfLengthOctets - i)];
            }
            let length: number = 0;
            for (const octet of lengthNumberOctets) {
                length <<= 8;
                length += octet;
            }
            if ((cursor + length) < cursor) { // This catches an overflow.
                throw new errors.ASN1OverflowError("ASN.1 element too large.", this);
            }
            cursor += (numberOfLengthOctets);
            if ((cursor + length) > bytes.length) {
                throw new errors.ASN1TruncationError("ASN.1 element truncated.", this);
            }

            if (
                ((length <= 127 && length >= -128) && numberOfLengthOctets > 1)
                || ((length <= 32767 && length >= -32768) && numberOfLengthOctets > 2)
                || ((length <= 8388607 && length >= -8388608) && numberOfLengthOctets > 3)
            ) {
                throw new errors.ASN1PaddingError(
                    "DER-encoded long-form length encoded on more octets than necessary",
                    this,
                );
            }

            this.value = bytes.slice(cursor, (cursor + length));
            return (cursor + length);
        } else { // Definite Short
            const length: number = (bytes[cursor++] & 0x7F);
            if ((cursor + length) > bytes.length) {
                throw new errors.ASN1TruncationError("ASN.1 element was truncated.", this);
            }
            this.value = bytes.slice(cursor, (cursor + length));
            return (cursor + length);
        }
    }

    /** Get the tag and length bytes of the element. */
    public tagAndLengthBytes (): Uint8Array {
        const tagBytes: number[] = [ 0x00 ];
        tagBytes[0] |= (this.tagClass << 6);
        tagBytes[0] |= (this.construction << 5);
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
            let number: number = this.tagNumber; // We do not want to modify by reference.
            const encodedNumber: number[] = [];
            while (number !== 0) {
                encodedNumber.unshift(number & 0x7F);
                number >>>= 7;
                encodedNumber[0] |= 0b10000000;
            }
            encodedNumber[encodedNumber.length - 1] &= 0b01111111;
            tagBytes.push(...encodedNumber);
        }

        let lengthOctets: number[] = [ 0x00 ];
        if (this.value.length < 127) {
            lengthOctets[0] = this.value.length;
        } else {
            const length: number = this.value.length;
            lengthOctets = [ 0, 0, 0, 0 ];
            for (let i: number = 0; i < 4; i++) {
                lengthOctets[i] = ((length >>> ((3 - i) << 3)) & 0xFF);
            }
            let startOfNonPadding: number = 0;
            for (let i: number = 0; i < (lengthOctets.length - 1); i++) {
                if (lengthOctets[i] === 0x00) startOfNonPadding++;
            }
            lengthOctets = lengthOctets.slice(startOfNonPadding);
            lengthOctets.unshift(0b10000000 | lengthOctets.length);
        }

        const ret: Uint8Array = new Uint8Array(tagBytes.length + lengthOctets.length);
        ret.set(tagBytes, 0);
        ret.set(lengthOctets, tagBytes.length);
        return ret;
    }

    /**
     * Instead of serializing the element, returns the encoded element in fragments that
     * are not yet concatenated together. This is for performance optimizations, since
     * a large number of buffers could be concatenated together in a single pass / allocation,
     * rather than doing this for every element separately.
     *
     * Basically, just concatenate all of the returned buffers to obtain the serialized element.
     */
    public toBuffers (): Uint8Array[] {
        return [
            this.tagAndLengthBytes(),
            ...(Array.isArray(this._value)
                ? this._value.flatMap((el) => el.toBuffers())
                : [ this._value ]),
        ];
    }

    public deconstruct (): Uint8Array {
        return new Uint8Array(this.value);
    }

    /**
     * Get the components of the element, if constructed.
     * The content octets are interpreted as DER elements, regardless of
     * the primitive / constructed status of the element.
     */
    public get components (): ASN1Element[] {
        if (Array.isArray(this._value)) {
            return this._value;
        }
        const encodedElements: DERElement[] = [];
        let i: number = 0;
        while (i < this._value.length) {
            const next: DERElement = new DERElement();
            i += next.fromBytes(this.value.subarray(i));
            encodedElements.push(next);
        }
        return encodedElements;
    }

    /** Get the length of the length octets. */
    public lengthLength(valueLength?: number): number {
        const len = valueLength ?? this.valueLength();
        if (len < 127) {
            return 1;
        }
        let lengthOctets = [ 0, 0, 0, 0 ];
        for (let i: number = 0; i < 4; i++) {
            lengthOctets[i] = ((len >>> ((3 - i) << 3)) & 0xFF);
        }
        let startOfNonPadding: number = 0;
        for (let i: number = 0; i < (lengthOctets.length - 1); i++) {
            if (lengthOctets[i] === 0x00) startOfNonPadding++;
        }
        return 5 - startOfNonPadding;
    }

    /** Get the length of the value octets. */
    public valueLength(): number {
        if (this._currentValueLength !== undefined) {
            return this._currentValueLength;
        }
        if (!Array.isArray(this._value)) {
            return this._value.length;
        }
        let len = 0;
        // For loop because it is most performant.
        for (const el of this._value) {
            len += el.tlvLength();
        }
        this._currentValueLength = len;
        return len;
    }

    /** Get the total length of the element when fully serialized. */
    public tlvLength(): number {
        const value_len = this.valueLength();
        return (
            this.tagLength()
            + this.lengthLength(value_len)
            + value_len
        )
    }
}
