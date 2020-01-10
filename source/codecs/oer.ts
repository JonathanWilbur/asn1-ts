import ASN1Element from "../asn1";
import * as errors from "../errors";
import {
    ASN1Construction,
    ASN1TagClass,
    ASN1UniversalType,
} from "../values";
// import External from "../types/External";
// import EmbeddedPDV from "../types/EmbeddedPDV";
// import CharacterString from "../types/CharacterString";
import convertBytesToText from "../convertBytesToText";
import convertTextToBytes from "../convertTextToBytes";
import ObjectIdentifier from "../types/ObjectIdentifier";
import encodeBoolean from "./x690/encoders/encodeBoolean";
import decodeBoolean from "./ber/decoders/decodeBoolean";
import encodeBitString from "./x690/encoders/encodeBitString";
import decodeBitString from "./ber/decoders/decodeBitString";
import encodeObjectIdentifier from "./x690/encoders/encodeObjectIdentifier";
import decodeObjectIdentifier from "./x690/decoders/decodeObjectIdentifier";
import encodeReal from "./x690/encoders/encodeReal";
import decodeReal from "./der/decoders/decodeReal";
import encodeEnumerated from "./oer/encoders/encodeEnumerated";
import decodeEnumerated from "./oer/decoders/decodeEnumerated";
// import encodeSequence from "./x690/encoders/encodeSequence";
// import decodeSequence from "./ber/decoders/decodeSequence";
import encodeUTCTime from "./x690/encoders/encodeUTCTime";
import decodeUTCTime from "./ber/decoders/decodeUTCTime";
import encodeGeneralizedTime from "./x690/encoders/encodeGeneralizedTime";
import decodeGeneralizedTime from "./ber/decoders/decodeGeneralizedTime";
// import encodeExternal from "../codecs/x690/encoders/encodeExternal";
// import encodeEmbeddedPDV from "../codecs/x690/encoders/encodeEmbeddedPDV";
// import encodeCharacterString from "../codecs/x690/encoders/encodeCharacterString";
// import decodeExternal from "../codecs/x690/decoders/decodeExternal";
// import decodeEmbeddedPDV from "../codecs/x690/decoders/decodeEmbeddedPDV";
// import decodeCharacterString from "../codecs/x690/decoders/decodeCharacterString";
import encodeGraphicString from "../codecs/ber/encoders/encodeGraphicString";
import encodeNumericString from "../codecs/ber/encoders/encodeNumericString";
import encodeObjectDescriptor from "../codecs/ber/encoders/encodeObjectDescriptor";
import encodePrintableString from "../codecs/ber/encoders/encodePrintableString";
import encodeVisibleString from "../codecs/ber/encoders/encodeVisibleString";
import encodeGeneralString from "../codecs/ber/encoders/encodeGeneralString";
import decodeGraphicString from "../codecs/x690/decoders/decodeGraphicString";
import decodeNumericString from "../codecs/x690/decoders/decodeNumericString";
import decodeObjectDescriptor from "../codecs/x690/decoders/decodeObjectDescriptor";
import decodePrintableString from "../codecs/x690/decoders/decodePrintableString";
import decodeVisibleString from "../codecs/x690/decoders/decodeVisibleString";
import decodeGeneralString from "../codecs/x690/decoders/decodeGeneralString";
import decodeSignedBigEndianInteger from "../utils/decodeSignedBigEndianInteger";
import encodeSignedBigEndianInteger from "../utils/encodeSignedBigEndianInteger";
import encodeRelativeObjectIdentifier from "./x690/encoders/encodeRelativeObjectIdentifier";
import decodeRelativeObjectIdentifier from "./x690/decoders/decodeRelativeObjectIdentifier";
import encodeUnsignedBigEndianInteger from "../utils/encodeUnsignedBigEndianInteger";
import encodeBase128 from "../utils/encodeBase128";
import { TRUE_BIT, FALSE_BIT } from "../macros";
import packBits from "../utils/packBits";

export default
class OERElement extends ASN1Element {
    public tagRequired: boolean = false;
    public lengthDeterminantRequired: boolean = false;

    // These are used in SEQUENCE.
    public extended: boolean | undefined = undefined;
    public rootComponentPresenceBitmap: Int8Array | undefined;
    public extensionIndex: number = 0; // Where the extension addition bitmap goes.
    public extensionAdditionPresenceBitmap: Int8Array | undefined;
    // Defined in Section 16.2.
    get preamble (): Uint8Array {
        if (typeof this.extended === "undefined" && !this.rootComponentPresenceBitmap) {
            return new Uint8Array(0);
        }
        const extensionBit: Int8Array = typeof this.extended !== "undefined"
            ? new Int8Array([ this.extended ? TRUE_BIT : FALSE_BIT ])
            : new Int8Array(0);
        if (this.rootComponentPresenceBitmap) {
            const bits: Int8Array = new Int8Array(extensionBit.length + this.rootComponentPresenceBitmap.length);
            bits[0] = this.extended ? TRUE_BIT : FALSE_BIT;
            bits.set(this.rootComponentPresenceBitmap, 1);
            return packBits(bits);
        } else {
            return packBits(new Int8Array([ this.extended ? TRUE_BIT : FALSE_BIT ]));
        }
    }

    get boolean (): boolean {
        return decodeBoolean(this.value);
    }

    set boolean (value: boolean) {
        this.value = encodeBoolean(value);
    }

    // TODO: Create separate methods for encoding constrained integers.
    get integer (): number {
        return decodeSignedBigEndianInteger(this.value);
    }

    // TODO: Create separate methods for encoding constrained integers.
    set integer (value: number) {
        this.value = encodeSignedBigEndianInteger(value);
    }

    get bitString (): boolean[] {
        return decodeBitString(this.value);
    }

    set bitString (value: boolean[]) {
        this.value = encodeBitString(value);
    }

    get octetString (): Uint8Array {
        return new Uint8Array(this.value);
    }

    set octetString (value: Uint8Array) {
        this.value = new Uint8Array(value);
    }

    get objectIdentifier (): ObjectIdentifier {
        return decodeObjectIdentifier(this.value);
    }

    set objectIdentifier (value: ObjectIdentifier) {
        this.value = encodeObjectIdentifier(value);
    }

    set objectDescriptor (value: string) {
        this.value = encodeObjectDescriptor(value);
    }

    get objectDescriptor (): string {
        return decodeObjectDescriptor(this.value);
    }

    // Encoded using PER encoding
    // TODO: External

    // TODO: Handle constrained REAL
    set real (value: number) {
        this.value = encodeReal(value);
    }

    // TODO: Handle constrained REAL
    get real (): number {
        return decodeReal(this.value);
    }

    get enumerated (): number {
        return decodeEnumerated(this.value);
    }

    set enumerated (value: number) {
        this.value = encodeEnumerated(value);
    }

    // TODO: Embedded PDV

    set utf8String (value: string) {
        this.value = convertTextToBytes(value);
    }

    get utf8String (): string {
        return convertBytesToText(this.value);
    }

    set relativeObjectIdentifier (value: number[]) {
        this.value = encodeRelativeObjectIdentifier(value);
    }

    get relativeObjectIdentifier (): number[] {
        return decodeRelativeObjectIdentifier(this.value);
    }

    // NOTE: You cannot decode SEQUENCE or SET, because there is no way to know what it encodes.
    // Use packBits() for this.
    // TODO: Sequence
    // TODO: Set
    // TODO: SequenceOf
    // TODO: SetOf

    set numericString (value: string) {
        this.value = encodeNumericString(value);
    }

    get numericString (): string {
        if (this.construction !== ASN1Construction.primitive) {
            throw new errors.ASN1ConstructionError("NumericString cannot be constructed.");
        }
        return decodeNumericString(this.value);
    }

    set printableString (value: string) {
        this.value = encodePrintableString(value);
    }

    get printableString (): string {
        if (this.construction !== ASN1Construction.primitive) {
            throw new errors.ASN1ConstructionError("PrintableString cannot be constructed.");
        }
        return decodePrintableString(this.value);
    }

    set teletexString (value: Uint8Array) {
        this.value = new Uint8Array(value); // Clones it.
    }

    get teletexString (): Uint8Array {
        return this.octetString;
    }

    set videotexString (value: Uint8Array) {
        this.value = new Uint8Array(value); // Clones it.
    }

    get videotexString (): Uint8Array {
        return this.octetString;
    }

    set ia5String (value: string) {
        this.value = convertTextToBytes(value);
    }

    get ia5String (): string {
        if (this.construction !== ASN1Construction.primitive) {
            throw new errors.ASN1ConstructionError("IA5String cannot be constructed.");
        }
        return convertBytesToText(this.value);
    }

    set utcTime (value: Date) {
        this.value = encodeUTCTime(value);
    }

    get utcTime (): Date {
        return decodeUTCTime(this.value);
    }

    set generalizedTime (value: Date) {
        this.value = encodeGeneralizedTime(value);
    }

    get generalizedTime (): Date {
        return decodeGeneralizedTime(this.value);
    }

    set graphicString (value: string) {
        this.value = encodeGraphicString(value);
    }

    get graphicString (): string {
        if (this.construction !== ASN1Construction.primitive) {
            throw new errors.ASN1ConstructionError("GraphicString cannot be constructed.");
        }
        return decodeGraphicString(this.value);
    }

    set visibleString (value: string) {
        this.value = encodeVisibleString(value);
    }

    get visibleString (): string {
        return decodeVisibleString(this.value);
    }

    set generalString (value: string) {
        this.value = encodeGeneralString(value);
    }

    get generalString (): string {
        if (this.construction !== ASN1Construction.primitive) {
            throw new errors.ASN1ConstructionError("GeneralString cannot be constructed.");
        }
        return decodeGeneralString(this.value);
    }

    // TODO: CharacterString

    set universalString (value: string) {
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
    get universalString (): string {
        if (this.construction !== ASN1Construction.primitive) {
            throw new errors.ASN1ConstructionError("UniversalString cannot be constructed.");
        }
        if (this.value.length % 4) {
            throw new errors.ASN1Error("UniversalString encoded on non-mulitple of four bytes.");
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

    set bmpString (value: string) {
        const buf: Uint8Array = new Uint8Array(value.length << 1);
        for (let i: number = 0, strLen: number = value.length; i < strLen; i++) {
            buf[(i << 1)]      = value.charCodeAt(i) >>> 8;
            buf[(i << 1) + 1]  = value.charCodeAt(i);
        }
        this.value = buf;
    }

    get bmpString (): string {
        if (this.construction !== ASN1Construction.primitive) {
            throw new errors.ASN1ConstructionError("BMPString cannot be constructed.");
        }
        if (this.value.length % 2) throw new errors.ASN1Error("BMPString encoded on non-mulitple of two bytes.");
        if (typeof TextEncoder !== "undefined") { // Browser JavaScript
            return (new TextDecoder("utf-16be")).decode(new Uint8Array(this.value));
        } else if (typeof Buffer !== "undefined") { // NodeJS
            const swappedEndianness: Uint8Array = new Uint8Array(this.value.length);
            for (let i: number = 0; i < this.value.length; i += 2) {
                swappedEndianness[i] = this.value[i + 1];
                swappedEndianness[i + 1] = this.value[i];
            }
            /** REVIEW:
             * Since NodeJS does not have a UTF-16-BE decoder, can we swap
             * every pair of bytes to make it little-endian, then decode
             * using NodeJS's utf-16-le decoder?
             */
            return (Buffer.from(swappedEndianness)).toString("utf-16le");
        } else {
            throw new errors.ASN1Error("Neither TextDecoder nor Buffer are defined to decode bytes into text.");
        }
    }

    // public encode (value: any): void {
    //     switch (typeof value) {
    //     case ("undefined"): {
    //         this.value = new Uint8Array(0);
    //         break;
    //     }
    //     case ("boolean"): {
    //         this.tagNumber = ASN1UniversalType.boolean;
    //         this.boolean = value;
    //         break;
    //     }
    //     case ("number"): {
    //         if (Number.isInteger(value)) {
    //             this.tagNumber = ASN1UniversalType.integer;
    //             this.integer = value;
    //         } else {
    //             this.tagNumber = ASN1UniversalType.realNumber;
    //             this.real = value;
    //         }
    //         break;
    //     }
    //     case ("string"): {
    //         this.tagNumber = ASN1UniversalType.utf8String;
    //         this.utf8String = value;
    //         break;
    //     }
    //     case ("object"): {
    //         if (!value) {
    //             this.tagNumber = ASN1UniversalType.nill;
    //             this.value = new Uint8Array(0);
    //         } else if (value instanceof Uint8Array) {
    //             this.tagNumber = ASN1UniversalType.octetString;
    //             this.octetString = value;
    //         } else if (value instanceof ASN1Element) {
    //             this.construction = ASN1Construction.constructed;
    //             this.sequence = [ value as OERElement ];
    //         } else if (value instanceof Set) {
    //             this.construction = ASN1Construction.constructed;
    //             this.set = Array.from(value).map((v: any) => {
    //                 if (typeof v === "object" && v instanceof ASN1Element) {
    //                     return v;
    //                 } else {
    //                     const e = new OERElement();
    //                     e.encode(v);
    //                     return e;
    //                 }
    //             });
    //         } else if (value instanceof ObjectIdentifier) {
    //             this.tagNumber = ASN1UniversalType.objectIdentifier;
    //             this.objectIdentifier = value;
    //         } else if (Array.isArray(value)) {
    //             this.construction = ASN1Construction.constructed;
    //             this.tagNumber = ASN1UniversalType.sequence;
    //             this.sequence = value.map((sub: any): OERElement => {
    //                 const ret: OERElement = new OERElement();
    //                 ret.encode(sub);
    //                 return ret;
    //             });
    //         } else if (value instanceof Date) {
    //             this.generalizedTime = value;
    //         } else {
    //             throw new errors.ASN1Error(`Cannot encode value of type ${value.constructor.name}.`);
    //         }
    //         break;
    //     }
    //     default: {
    //         throw new errors.ASN1Error(`Cannot encode value of type ${typeof value}.`);
    //     }
    //     }
    // }

    /**
     * A convenience method, created because `SEQUENCE` is so common. `null`
     * and `undefined` elements may be supplied, and will simply be filtered
     * out, which is particularly handy for encoding optional elements in a
     * `SEQUENCE`.
     *
     * @param sequence The elements (or absence thereof) to encode.
     */
    public static fromSequence (sequence: (OERElement | null | undefined)[]): OERElement {
        const ret: OERElement = new OERElement(
            ASN1TagClass.universal,
            ASN1Construction.constructed,
            ASN1UniversalType.sequence,
        );
        ret.sequence = sequence.filter((element) => Boolean(element)) as OERElement[];
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
    public static fromSet (set: (OERElement | null | undefined)[]): OERElement {
        const ret: OERElement = new OERElement(
            ASN1TagClass.universal,
            ASN1Construction.constructed,
            ASN1UniversalType.set,
        );
        ret.set = set.filter((element) => Boolean(element)) as OERElement[];
        return ret;
    }

    set inner (value: OERElement) {
        this.construction = ASN1Construction.constructed;
        this.value = value.toBytes();
    }

    constructor (
        tagClass: ASN1TagClass = ASN1TagClass.universal,
        construction: ASN1Construction = ASN1Construction.primitive,
        tagNumber: number = ASN1UniversalType.endOfContent,
    ) {
        super();
        this.tagClass = tagClass;
        this.construction = construction;
        this.tagNumber = tagNumber;
    }

    // TODO: Use lengthDeterminantRequired and tagRequired to decode.
    /**
     * There is no way to decode Octet Encoding Rules-encoded elements
     * without knowing in advance what type it is and whether it
     * is encoded with a length determinant.
     */
    public fromBytes (): number {
        throw new errors.ASN1NotImplementedError();
    }

    get lengthDeterminantBytes (): Uint8Array {
        if (this.length <= 127) {
            return new Uint8Array([ this.length ]);
        } else {
            const lengthBytes: Uint8Array = encodeUnsignedBigEndianInteger(this.length);
            const ret: Uint8Array = new Uint8Array(1 + lengthBytes.length);
            ret[0] = (lengthBytes.length | 0b10000000);
            ret.set(lengthBytes, 1);
            return ret;
        }
    }

    get tagBytes (): Uint8Array {
        let firstByte: number = (this.tagClass << 6);
        if (this.tagNumber < 63) {
            firstByte |= this.tagNumber;
            return new Uint8Array([ firstByte ]);
        } else {
            firstByte |= 0b00111111;
            const subsequentTagBytes: Uint8Array = encodeBase128(encodeUnsignedBigEndianInteger(this.tagNumber));
            const ret: Uint8Array = new Uint8Array(1 + subsequentTagBytes.length);
            ret[0] = firstByte;
            ret.set(subsequentTagBytes, 1);
            return ret;
        }
    }

    public toBytes (): Uint8Array {
        const tagBytes: Uint8Array = this.tagRequired
            ? this.tagBytes
            : new Uint8Array(0);
        const lengthDeterminantBytes: Uint8Array = this.lengthDeterminantBytes
            ? this.lengthDeterminantBytes
            : new Uint8Array(0);

        const ret: Uint8Array = new Uint8Array(
            tagBytes.length
            + lengthDeterminantBytes.length
            + this.value.length,
        );
        ret.set(tagBytes, 0);
        ret.set(lengthDeterminantBytes, tagBytes.length);
        ret.set(this.value, (tagBytes.length + lengthDeterminantBytes.length));
        return ret;
    }

    /**
     * There is no way to deconstruct OER elements.
     */
    public deconstruct (): Uint8Array {
        throw new errors.ASN1NotImplementedError();
    }
}
