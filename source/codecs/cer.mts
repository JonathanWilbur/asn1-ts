import ASN1Element from "../asn1.mjs";
import * as errors from "../errors.mjs";
import {
    ASN1Construction,
    ASN1TagClass,
    ASN1UniversalType,
} from "../values.mjs";
import X690Element from "../x690.mjs";
import CharacterString from "../types/CharacterString.mjs";
import convertBytesToText from "../utils/convertBytesToText.mjs";
import convertTextToBytes from "../utils/convertTextToBytes.mjs";
import sortCanonically from "../utils/sortCanonically.mjs";
import encodeBoolean from "./x690/encoders/encodeBoolean.mjs";
import decodeBoolean from "./der/decoders/decodeBoolean.mjs";
import encodeBitString from "./x690/encoders/encodeBitString.mjs";
import decodeBitString from "./der/decoders/decodeBitString.mjs";
import encodeReal from "./x690/encoders/encodeReal.mjs";
import decodeReal from "./der/decoders/decodeReal.mjs";
import encodeSequence from "./x690/encoders/encodeSequence.mjs";
import decodeSequence from "./cer/decoders/decodeSequence.mjs";
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
import splitOctetsCanonically from "../utils/splitOctetsCanonically.mjs";
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
import writeTagAndLength, { definiteLengthLength, encodeX690Into } from "./x690/encoders/writeTagAndLength.mjs";
import type {
    SingleThreadUint8Array,
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
import ObjectIdentifier from "../types/ObjectIdentifier.mjs";
import {
    CER_ELEMENT_BRAND,
    isCERElementLike,
    stampBrand,
} from "../brands.mjs";

const CER_STRING_FRAGMENT_SIZE: number = 1000;

/**
 * Combine primitive BIT STRING encodings into one primitive encoding.
 * Each fragment's unused-bits octet is dropped; the last fragment's unused-bits
 * octet is used as the unused-bits count of the result.
 *
 * CER requires primitive fragments of 1000 contents octets (except the last,
 * which must have 1 to 1000 contents octets).
 */
function concatenateBitStringFragments (fragments: Uint8Array[], el: ASN1Element): SingleThreadUint8Array {
    if (fragments.length === 0) {
        throw new errors.ASN1Error("CER constructed BIT STRING must contain at least one fragment.", el);
    }
    const pieces: Uint8Array[] = new Array(fragments.length + 1);
    for (let i = 0; i < fragments.length; i++) {
        const fragment = fragments[i];
        const last: boolean = (i === fragments.length - 1);
        if (last) {
            if (fragment.length < 1 || fragment.length > CER_STRING_FRAGMENT_SIZE) {
                throw new errors.ASN1Error(
                    "The last fragment of a CER constructed BIT STRING must have between 1 and 1000 contents octets.",
                    el,
                );
            }
        } else if (fragment.length !== CER_STRING_FRAGMENT_SIZE) {
            throw new errors.ASN1Error(
                "Each non-last fragment of a CER constructed BIT STRING must have 1000 contents octets.",
                el,
            );
        } else if (fragment[0] !== 0x00) {
            throw new errors.ASN1Error(
                "Only the last subelement of a constructed BIT STRING may have a non-zero first value byte.",
                el,
            );
        }
        pieces[i + 1] = fragment.subarray(1);
    }
    pieces[0] = fragments[fragments.length - 1].subarray(0, 1);
    return Buffer.concat(pieces);
}

/**
 * @classdesc
 * A `CERElement` is a class that represents an ASN.1 element encoded in
 * Canonical Encoding Rules (CER).
 *
 * It is used to encode and decode ASN.1 elements in CER format.
 */
export default
class CERElement extends X690Element {
    /**
     * `true` if `value` is a `CERElement` from this copy or another copy of
     * the package. BER / CER / DER instances are not distinguishable by
     * structure, so older copies without a brand are not recognized here;
     * use {@link X690Element.isElement} for that.
     *
     * @param value The value to test
     */
    static override isElement (value: unknown): value is CERElement {
        return isCERElementLike(value);
    }

    private _value: SingleThreadUint8Array | ASN1Element[] = new Uint8Array(0);
    private _currentValueLength: number | undefined;
    get value (): SingleThreadUint8Array {
        if (this._value instanceof Uint8Array) {
            return this._value;
        }
        const bytes = encodeSequence(this._value);
        this._value = bytes;
        return bytes;
    }
    set value (v: SingleThreadUint8Array) {
        this._currentValueLength = v.length;
        this._value = v;
    }

    public construct (els: ASN1Element[]): void {
        this._currentValueLength = undefined;
        this._value = els;
    }

    get unfragmentedValue (): SingleThreadUint8Array {
        return this.deconstruct("");
    }

    set unfragmentedValue (value: SingleThreadUint8Array) {
        if (value.length <= CER_STRING_FRAGMENT_SIZE) {
            this.construction = ASN1Construction.primitive;
            this.value = value;
        } else {
            this.construction = ASN1Construction.constructed;
            this.value = encodeSequence(Array
                .from(splitOctetsCanonically(value))
                .map((fragment: Uint8Array) => new CERElement(
                    ASN1TagClass.universal,
                    ASN1Construction.primitive,
                    ASN1UniversalType.octetString,
                    new Uint8Array(fragment),
                )),
            );
        }
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
        const encoded: SingleThreadUint8Array = encodeBitString(value);
        if (encoded.length <= CER_STRING_FRAGMENT_SIZE) {
            this.construction = ASN1Construction.primitive;
            this.value = encoded;
            return;
        }
        // Non-last fragments have 1000 contents octets: unused-bits (0) + 999 data octets.
        const unusedBits: number = encoded[0];
        const data: Uint8Array = encoded.subarray(1);
        const nonLastDataLength: number = CER_STRING_FRAGMENT_SIZE - 1;
        const fragments: ASN1Element[] = [];
        let offset: number = 0;
        while (offset < data.length) {
            const remaining: number = data.length - offset;
            const last: boolean = (remaining <= nonLastDataLength);
            const dataLength: number = last ? remaining : nonLastDataLength;
            const contents: SingleThreadUint8Array = new Uint8Array(1 + dataLength);
            contents[0] = last ? unusedBits : 0x00;
            contents.set(data.subarray(offset, offset + dataLength), 1);
            const fragment: CERElement = new CERElement(
                ASN1TagClass.universal,
                ASN1Construction.primitive,
                ASN1UniversalType.bitString,
            );
            fragment.value = contents;
            fragments.push(fragment);
            offset += dataLength;
        }
        this.construct(fragments);
        this.construction = ASN1Construction.constructed;
    }

    get bitString (): BIT_STRING {
        return decodeBitString(this.deconstruct("BIT STRING", ASN1UniversalType.bitString));
    }

    set octetString (value: OCTET_STRING) {
        this.unfragmentedValue = new Uint8Array(value); // Clones it.
    }

    get octetString (): OCTET_STRING {
        return this.deconstruct("OCTET STRING");
    }

    set objectDescriptor (value: ObjectDescriptor) {
        this.unfragmentedValue = encodeObjectDescriptor(value);
    }

    get objectDescriptor (): ObjectDescriptor {
        return decodeObjectDescriptor(this.deconstruct("ObjectDescriptor"));
    }

    set external (value: EXTERNAL) {
        this.value = encodeExternal(value);
        this.construction = ASN1Construction.constructed;
    }

    get external (): EXTERNAL {
        return decodeExternal(this.value);
    }

    set real (value: REAL) {
        this.value = encodeReal(value);
    }

    get real (): REAL {
        if (this.construction !== ASN1Construction.primitive) {
            throw new errors.ASN1ConstructionError("REAL cannot be constructed.");
        }
        return decodeReal(this.value);
    }

    set embeddedPDV (value: EMBEDDED_PDV) {
        this.value = encodeEmbeddedPDV(value);
        this.construction = ASN1Construction.constructed;
    }

    get embeddedPDV (): EMBEDDED_PDV {
        return decodeEmbeddedPDV(this.value);
    }

    set utf8String (value: UTF8String) {
        this.unfragmentedValue = convertTextToBytes(value);
    }

    get utf8String (): UTF8String {
        return convertBytesToText(this.deconstruct("UTF8String"));
    }

    set sequence (value: SEQUENCE<ASN1Element>) {
        this.construct(value);
        this.construction = ASN1Construction.constructed;
    }

    get sequence (): SEQUENCE<ASN1Element> {
        return this.sequenceElements(false);
    }

    /**
     * Decode this element's constructed contents as a SEQUENCE of elements.
     * @param zeroCopy If true, child `value` buffers alias this element's value.
     */
    public sequenceElements (zeroCopy: boolean = false): SEQUENCE<ASN1Element> {
        if (this.construction !== ASN1Construction.constructed) {
            throw new errors.ASN1ConstructionError("SET or SEQUENCE cannot be primitively constructed.", this);
        }
        if (Array.isArray(this._value)) {
            return this._value;
        }
        return decodeSequence(this.value, zeroCopy);
    }

    set set (value: SET<ASN1Element>) {
        sortCanonically(value);
        this.sequence = value;
    }

    get set (): SET<ASN1Element> {
        return this.setElements(false);
    }

    /**
     * Decode this element's constructed contents as a SET of elements.
     * @param zeroCopy If true, child `value` buffers alias this element's value.
     */
    public setElements (zeroCopy: boolean = false): SET<ASN1Element> {
        const ret = this.sequenceElements(zeroCopy);
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
        return this.sequenceElements(false);
    }

    set setOf (value: SET<ASN1Element>) {
        this.sequence = value;
    }

    get setOf (): SET<ASN1Element> {
        return this.sequence;
    }

    set numericString (value: NumericString) {
        this.unfragmentedValue = encodeNumericString(value);
    }

    get numericString (): NumericString {
        return decodeNumericString(this.deconstruct("NumericString"));
    }

    set printableString (value: PrintableString) {
        this.unfragmentedValue = encodePrintableString(value);
    }

    get printableString (): PrintableString {
        return decodePrintableString(this.deconstruct("PrintableString"));
    }

    set teletexString (value: TeletexString) {
        this.unfragmentedValue = new Uint8Array(value); // Clones it.
    }

    get teletexString (): TeletexString {
        return this.deconstruct("TeletexString");
    }

    set videotexString (value: VideotexString) {
        this.unfragmentedValue = new Uint8Array(value); // Clones it.
    }

    get videotexString (): VideotexString {
        return this.deconstruct("VideotexString");
    }

    set ia5String (value: IA5String) {
        this.unfragmentedValue = convertTextToBytes(value);
    }

    get ia5String (): IA5String {
        return convertBytesToText(this.deconstruct("IA5String"));
    }

    set utcTime (value: UTCTime) {
        this.value = encodeUTCTime(value);
    }

    get utcTime (): UTCTime {
        return decodeUTCTime(this.value);
    }

    set generalizedTime (value: GeneralizedTime) {
        this.value = encodeGeneralizedTime(value);
    }

    get generalizedTime (): GeneralizedTime {
        return decodeGeneralizedTime(this.value);
    }

    set graphicString (value: GraphicString) {
        this.unfragmentedValue = encodeGraphicString(value);
    }

    get graphicString (): GraphicString {
        return decodeGraphicString(this.deconstruct("GraphicString"));
    }

    set visibleString (value: VisibleString) {
        this.unfragmentedValue = encodeVisibleString(value);
    }

    get visibleString (): VisibleString {
        return decodeVisibleString(this.deconstruct("VisibleString"));
    }

    set generalString (value: GeneralString) {
        this.unfragmentedValue = encodeGeneralString(value);
    }

    get generalString (): GeneralString {
        return decodeGeneralString(this.deconstruct("GeneralString"));
    }

    set characterString (value: CharacterString) {
        this.value = encodeCharacterString(value);
        this.construction = ASN1Construction.constructed;
    }

    get characterString (): CharacterString {
        return decodeCharacterString(this.value);
    }

    set universalString (value: UniversalString) {
        const buf = new Uint8Array(value.length << 2);
        for (let i: number = 0; i < value.length; i++) {
            buf[(i << 2)]      = value.charCodeAt(i) >>> 24;
            buf[(i << 2) + 1]  = value.charCodeAt(i) >>> 16;
            buf[(i << 2) + 2]  = value.charCodeAt(i) >>> 8;
            buf[(i << 2) + 3]  = value.charCodeAt(i);
        }
        this.unfragmentedValue = buf;
    }

    /** NOTE:
     * This might not decode anything above 0xFFFF, because JavaScript
     * natively uses either UCS-2 or UTF-16. If it uses UTF-16 (which
     * most do), it might work, but UCS-2 will definitely not work.
     */
    get universalString (): UniversalString {
        const valueBytes: Uint8Array = this.deconstruct("UniversalString");
        if (valueBytes.length % 4) {
            throw new errors.ASN1Error("UniversalString encoded on non-mulitple of four bytes.", this);
        }
        let ret: string = "";
        for (let i: number = 0; i < valueBytes.length; i += 4) {
            ret += String.fromCharCode(
                (valueBytes[i + 0] << 24)
                + (valueBytes[i + 1] << 16)
                + (valueBytes[i + 2] <<  8)
                + (valueBytes[i + 3] <<  0),
            );
        }
        return ret;
    }

    set bmpString (value: BMPString) {
        const buf = new Uint8Array(value.length << 1);
        for (let i: number = 0, strLen: number = value.length; i < strLen; i++) {
            buf[(i << 1)]      = value.charCodeAt(i) >>> 8;
            buf[(i << 1) + 1]  = value.charCodeAt(i);
        }
        this.unfragmentedValue = buf;
    }

    get bmpString (): BMPString {
        const valueBytes: Uint8Array = this.deconstruct("BMPString");
        if (valueBytes.length % 2) throw new errors.ASN1Error("BMPString encoded on non-mulitple of two bytes.", this);
        if (typeof Buffer !== "undefined") { // NodeJS
            const swappedEndianness = Buffer.allocUnsafe(valueBytes.length);
            for (let i: number = 0; i < valueBytes.length; i += 2) {
                swappedEndianness[i] = valueBytes[i + 1];
                swappedEndianness[i + 1] = valueBytes[i];
            }
            /** REVIEW:
             * Since NodeJS does not have a UTF-16-BE decoder, can we swap
             * every pair of bytes to make it little-endian, then decode
             * using NodeJS's utf-16-le decoder?
             */
            return swappedEndianness.toString("utf16le");
        } else if (typeof TextEncoder !== "undefined") {
            return (new TextDecoder("utf-16be")).decode(valueBytes);
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

    /**
     * Encode anything into an ASN.1 element.
     *
     * @deprecated Use type-specific methods, if possible. This can be buggy if used with bundlers.
     **/
    public encode (value: any): void { // eslint-disable-line
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
            } else if (ASN1Element.isElement(value)) {
                this.construction = ASN1Construction.constructed;
                this.sequence = [ value as CERElement ];
            } else if (value instanceof Set) {
                this.construction = ASN1Construction.constructed;
                this.set = Array.from(value).map((v: any) => {
                    if (typeof v === "object" && ASN1Element.isElement(v)) {
                        return v;
                    } else {
                        const e = new CERElement();
                        e.encode(v);
                        return e;
                    }
                });
            } else if (
                ObjectIdentifier.isOID(value)
                || (
                    (typeof value["fromParts"] === "function")
                    && (typeof value["toBytes"] === "function")
                )
            ) {
                this.tagNumber = ASN1UniversalType.objectIdentifier;
                this.objectIdentifier = value;
            } else if (Array.isArray(value)) {
                this.construction = ASN1Construction.constructed;
                this.tagNumber = ASN1UniversalType.sequence;
                this.sequence = value.map((sub: any): CERElement => {
                    const ret: CERElement = new CERElement();
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
    public static fromSequence (sequence: (ASN1Element | null | undefined)[]): CERElement {
        const ret: CERElement = new CERElement(
            ASN1TagClass.universal,
            ASN1Construction.constructed,
            ASN1UniversalType.sequence,
        );
        ret.sequence = sequence.filter((element) => Boolean(element)) as CERElement[];
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
    public static fromSet (set: (CERElement | null | undefined)[]): CERElement {
        const ret: CERElement = new CERElement(
            ASN1TagClass.universal,
            ASN1Construction.constructed,
            ASN1UniversalType.set,
        );
        ret.set = set.filter((element) => Boolean(element)) as CERElement[];
        return ret;
    }

    /**
     * A convenience method, created because `SET OF` is so common. `null`
     * and `undefined` elements may be supplied, and will simply be filtered
     * out.
     *
     * @param set The elements (or absence thereof) to encode.
     */
    public static fromSetOf (set: (CERElement | null | undefined)[]): CERElement {
        const ret: CERElement = new CERElement(
            ASN1TagClass.universal,
            ASN1Construction.constructed,
            ASN1UniversalType.set,
        );
        ret.setOf = set.filter((element) => Boolean(element)) as CERElement[];
        return ret;
    }

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
        const ret: CERElement = new CERElement();
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

    set inner (value: ASN1Element) {
        this.construction = ASN1Construction.constructed;
        this._currentValueLength = undefined;
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
     * Decode a CER element from a byte array.
     *
     * @param bytes - The byte array to decode.
     * @param zeroCopy - If true, `value` aliases `bytes` instead of copying.
     * @returns The number of bytes read.
     */
    public fromBytes (bytes: Uint8Array, zeroCopy: boolean = false): number {
        const bytesLen: number = bytes.length;
        if (bytesLen < 2) {
            throw new errors.ASN1TruncationError("Tried to decode a CER element that is less than two bytes.", this);
        }
        if ((this.recursionCount + 1) > CERElement.nestingRecursionLimit) {
            throw new errors.ASN1RecursionError();
        }
        const first: number = bytes[0];
        // ASN1TagClass / ASN1Construction enum values match these bit fields.
        this.tagClass = first >>> 6;
        this.construction = (first >>> 5) & 1;
        let cursor: number = 1;
        if ((first & 0x1F) !== 0x1F) {
            this.tagNumber = first & 0x1F;
        } else {
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
            if (bytes[cursor] === 0x80) {
                throw new errors.ASN1PaddingError("Leading padding byte on long tag number encoding.", this);
            }
            this.tagNumber = 0;
            // This loop looks for the end of the encoded tag number.
            const limit: number = (((bytesLen - 1) >= 4) ? 4 : (bytesLen - 1));
            while (cursor < limit) {
                if (!(bytes[cursor++] & 0x80)) break;
            }
            if (bytes[cursor - 1] & 0x80) {
                if (limit === (bytesLen - 1)) {
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
        const lengthByte: number = bytes[cursor];
        if ((lengthByte & 0x80) === 0) { // Definite Short (common case)
            const length: number = lengthByte;
            cursor++;
            const end: number = cursor + length;
            if (end > bytesLen) {
                throw new errors.ASN1TruncationError("ASN.1 element was truncated.", this);
            }
            this.value = (zeroCopy
                ? bytes.subarray(cursor, end)
                : bytes.slice(cursor, end)) as SingleThreadUint8Array;
            return end;
        }

        const numberOfLengthOctets: number = (lengthByte & 0x7F);
        if (numberOfLengthOctets === 0) { // Indefinite
            if (this.construction !== ASN1Construction.constructed) {
                throw new errors.ASN1ConstructionError(
                    "Indefinite length ASN.1 element was not of constructed construction.",
                    this,
                );
            }
            const startOfValue: number = ++cursor;
            let sentinel: number = cursor; // Used to track the length of the nested elements.
            while (sentinel < bytesLen) {
                const child: CERElement = new CERElement();
                child.recursionCount = (this.recursionCount + 1);
                sentinel += child.fromBytes(bytes.subarray(sentinel), zeroCopy);
                if (
                    child.tagClass === ASN1TagClass.universal
                    && child.construction === ASN1Construction.primitive
                    && child.tagNumber === ASN1UniversalType.endOfContent
                    && child.value.length === 0
                ) break;
                // Reset after decoding to prevent subsequent deconstructing of
                // constructed values from being counted against the recursion limit.
                child.recursionCount = 0;
            }
            if (sentinel === bytesLen && (bytes[sentinel - 1] !== 0x00 || bytes[sentinel - 2] !== 0x00)) {
                throw new errors.ASN1TruncationError(
                    "No END OF CONTENT element found at the end of indefinite length ASN.1 element.",
                    this,
                );
            }
            this.value = (zeroCopy
                ? bytes.subarray(startOfValue, (sentinel - 2))
                : bytes.slice(startOfValue, (sentinel - 2))) as SingleThreadUint8Array;
            return sentinel;
        }

        if (numberOfLengthOctets === 0x7F) { // Reserved
            throw new errors.ASN1UndefinedError("Length byte with undefined meaning encountered.", this);
        }
        // Definite Long
        if (numberOfLengthOctets > 4) {
            throw new errors.ASN1OverflowError("Element length too long to decode to an integer.", this);
        }
        if (cursor + numberOfLengthOctets >= bytesLen) {
            throw new errors.ASN1TruncationError("Element length bytes appear to have been truncated.", this);
        }
        cursor++;
        let length: number = 0;
        for (let i: number = 0; i < numberOfLengthOctets; i++) {
            length = (length << 8) | bytes[cursor++];
        }
        const end: number = cursor + length;
        if (end < cursor) { // This catches an overflow.
            throw new errors.ASN1OverflowError("ASN.1 element too large.", this);
        }
        if (end > bytesLen) {
            throw new errors.ASN1TruncationError("ASN.1 element truncated.", this);
        }
        this.value = (zeroCopy
            ? bytes.subarray(cursor, end)
            : bytes.slice(cursor, end)) as SingleThreadUint8Array;
        return end;
    }

    public tagAndLengthBytes (): SingleThreadUint8Array {
        const constructed: boolean = this.construction === ASN1Construction.constructed;
        const valueLen: number = this.valueLength();
        const ret = new Uint8Array(this.tagLength() + this.lengthLength(valueLen));
        writeTagAndLength(
            ret,
            0,
            this.tagClass,
            constructed,
            this.tagNumber,
            valueLen,
            constructed,
        );
        return ret;
    }

    /**
     * Write this element's CER encoding into `destination` starting at `offset`.
     *
     * @returns The offset immediately after the last written octet.
     */
    public encodeInto (destination: Uint8Array, offset: number = 0): number {
        const constructed: boolean = this.construction === ASN1Construction.constructed;
        return encodeX690Into(
            destination,
            offset,
            this.tagClass,
            constructed,
            this.tagNumber,
            this._value,
            this.valueLength(),
            constructed,
        );
    }

    /**
     * Append this element's CER encoding as buffer fragments to `into`.
     * Concatenating the fragments yields the same encoding as {@link toBytes}.
     */
    public appendBuffers (into: Uint8Array[]): void {
        into.push(this.tagAndLengthBytes());
        if (Array.isArray(this._value)) {
            const children: ASN1Element[] = this._value;
            for (let i: number = 0; i < children.length; i++) {
                children[i].appendBuffers(into);
            }
        } else {
            into.push(this._value);
        }
        if (this.construction === ASN1Construction.constructed) {
            into.push(new Uint8Array(2));
        }
    }

    /**
     * Deconstruct an ASN.1 value that is constructed over several elements
     * into a single buffer representing the content octets.
     *
     * For `BIT STRING`, each primitive fragment begins with an unused-bits
     * count. Those octets are discarded except for the last fragment's, which
     * becomes the unused-bits count of the combined primitive encoding.
     *
     * CER requires each fragment to be primitive, with 1000 contents octets
     * except possibly the last (1 to 1000 contents octets).
     *
     * @param {string} dataType - The name of the type of the element, used for an error message.
     * @param {number} fragmentTagNumber - Universal tag number expected on each fragment.
     * @returns {Uint8Array<ArrayBuffer>} The element as a single buffer.
     */
    public deconstruct (
        dataType: string,
        fragmentTagNumber: number = ASN1UniversalType.octetString,
    ): SingleThreadUint8Array {
        if (this.construction === ASN1Construction.primitive) {
            return new Uint8Array(this.value); // Clones it.
        } else {
            if ((this.recursionCount + 1) > CERElement.nestingRecursionLimit) throw new errors.ASN1RecursionError();
            const substrings: ASN1Element[] = this.sequence;
            const appendy: Uint8Array[] = new Array(substrings.length);
            const isBitString: boolean = (fragmentTagNumber === ASN1UniversalType.bitString);
            for (let i: number = 0; i < substrings.length; i++) {
                const substring = substrings[i];
                if (substring.tagClass !== ASN1TagClass.universal) {
                    throw new errors.ASN1ConstructionError(
                        `Invalid tag class in constructed ${dataType}. Must be UNIVERSAL`, this);
                }
                if (substring.tagNumber !== fragmentTagNumber) {
                    throw new errors.ASN1ConstructionError(
                        isBitString
                            ? `Invalid tag number in constructed ${dataType}. Must be 3 (BIT STRING).`
                            : `Invalid tag number in constructed ${dataType}. Must be 4 (OCTET STRING).`,
                        this);
                }
                if (isBitString) {
                    if (substring.construction !== ASN1Construction.primitive) {
                        throw new errors.ASN1ConstructionError(
                            "CER constructed BIT STRING fragments must be primitively encoded.", this);
                    }
                    appendy[i] = substring.value;
                } else {
                    substring.recursionCount = (this.recursionCount + 1);
                    appendy[i] = substring.deconstruct(dataType, fragmentTagNumber);
                }
            }
            if (isBitString) {
                return concatenateBitStringFragments(appendy, this);
            }
            return Buffer.concat(appendy);
        }
    }

    public get components (): ASN1Element[] {
        if (Array.isArray(this._value)) {
            return this._value;
        }
        const encodedElements: CERElement[] = [];
        let i: number = 0;
        while (i < this._value.length) {
            const next: CERElement = new CERElement();
            i += next.fromBytes(this.value.subarray(i));
            encodedElements.push(next);
        }
        return encodedElements;
    }

    public lengthLength(valueLength?: number): number {
        if (this.construction === ASN1Construction.constructed) {
            return 1;
        }
        return definiteLengthLength(valueLength ?? this.valueLength());
    }

    public valueLength(): number {
        if (this._currentValueLength !== undefined) {
            return this._currentValueLength;
        }
        if (!Array.isArray(this._value)) {
            return this._value.length;
        }
        let len = 0;
        // For loop because it is most performant.
        for (let i = 0; i < this._value.length; i++) {
            len += this._value[i].tlvLength();
        }
        this._currentValueLength = len;
        return len;
    }

    public tlvLength(): number {
        const eoc_bytes = (this.construction === ASN1Construction.constructed)
            ? 2
            : 0;
        const value_len = this.valueLength();
        return (
            this.tagLength()
            + this.lengthLength(value_len)
            + value_len
            + eoc_bytes
        )
    }
}

stampBrand(CERElement.prototype, CER_ELEMENT_BRAND);
