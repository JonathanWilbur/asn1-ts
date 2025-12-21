import * as errors from "./errors.mjs";
import { ASN1Construction, ASN1TagClass, ASN1UniversalType } from "./values.mjs";
import type Byteable from "./interfaces/Byteable.mjs";
import type Named from "./interfaces/Named.mjs";
import type Long from "./interfaces/Long.mjs";
import type CharacterString from "./types/CharacterString.mjs";
import type Elementable from "./interfaces/Elementable.mjs";
import type {
    SingleThreadBuffer,
    BOOLEAN,
    INTEGER,
    BIT_STRING,
    OCTET_STRING,
    OBJECT_IDENTIFIER,
    ObjectDescriptor,
    EXTERNAL,
    REAL,
    ENUMERATED,
    EMBEDDED_PDV,
    UTF8String,
    RELATIVE_OID,
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
    TIME,
    DATE,
    TIME_OF_DAY,
    DATE_TIME,
    DURATION,
    OID_IRI,
    RELATIVE_OID_IRI,
} from "./macros.mjs";
import packBits from "./utils/packBits.mjs";
import { Buffer } from "node:buffer";

/**
 * @module asn1
 * @description
 * This module provides the abstract base class {@link ASN1Element} for representing ASN.1 elements.
 * ASN.1 (Abstract Syntax Notation One) is a standard interface description language for defining data structures
 * that can be serialized and deserialized in a cross-platform way. This class is intended to be subclassed by
 * specific ASN.1 codecs for encoding and decoding various ASN.1 types.
 */
/**
 * Abstract base class for ASN.1 elements.
 *
 * This class defines the interface and common logic for all ASN.1 element representations.
 * Subclasses should implement the abstract methods and properties to handle specific ASN.1 types.
 *
 * @abstract
 * @implements {Byteable}
 * @implements {Elementable}
 * @implements {Named}
 * @implements {Long}
 *
 * @property {string} name - The name of the ASN.1 element (optional, for debugging or schema purposes).
 * @property {ASN1TagClass} tagClass - The tag class of the ASN.1 element (universal, application, context, or private).
 * @property {ASN1Construction} construction - The construction type (primitive or constructed).
 * @property {number} tagNumber - The tag number for the ASN.1 element.
 * @property {number} recursionCount - Used to prevent excessive recursion in nested structures.
 * @property {number} [nestingRecursionLimit=5] - Maximum allowed recursion depth for nesting.
 *
 * @remarks
 * This class is not meant to be instantiated directly. Instead, extend it to implement concrete ASN.1 types.
 */
export default
abstract class ASN1Element implements Byteable, Elementable, Named, Long {
    /**
     * Used to track recursion depth for nested ASN.1 elements.
     * @type {number}
     */
    public recursionCount: number = 0;
    /**
     * Maximum allowed recursion depth for ASN.1 element nesting.
     * @type {number}
     * @readonly
     */
    protected static readonly nestingRecursionLimit: number = 5;

    /**
     * The name of the ASN.1 element (optional, for debugging or schema purposes).
     * @type {string}
     */
    public name: string = "";
    /**
     * The tag class of the ASN.1 element.
     * @type {ASN1TagClass}
     */
    public tagClass: ASN1TagClass = ASN1TagClass.universal;
    /**
     * The construction type (primitive or constructed).
     * @type {ASN1Construction}
     */
    public construction: ASN1Construction = ASN1Construction.primitive;
    private _tagNumber: number = 0;
    /**
     * The tag number for the ASN.1 element.
     * @type {number}
     */
    get tagNumber (): number {
        return this._tagNumber;
    }
    set tagNumber (value: number) {
        if (!Number.isSafeInteger(value) || (value < 0)) {
            throw new errors.ASN1Error(`Tag ${value} was not a non-negative integer.`);
        }
        this._tagNumber = value;
    }

    /**
     * The value of the ASN.1 element as a Uint8Array.
     * @type {Uint8Array}
     * @abstract
     */
    abstract get value (): Uint8Array;
    abstract set value (v: Uint8Array);
    /**
     * Construct this element from an array of ASN1Element children.
     * @param {ASN1Element[]} els - The child elements.
     * @abstract
     */
    abstract construct (els: ASN1Element[]): void;
    /**
     * Get the tag and length bytes for this element.
     * @returns {Uint8Array}
     * @abstract
     */
    public abstract tagAndLengthBytes (): Uint8Array;
    /**
     * Get the encoded buffers for this element.
     * @returns {Uint8Array[]}
     * @abstract
     */
    public abstract toBuffers (): Uint8Array[];

    /**
     * Get the number of bytes required to encode the tag.
     * @returns {number}
     */
    public tagLength(): number {
        if (this.tagNumber < 31) {
            return 1;
        }
        let n = this.tagNumber;
        let i = 0;
        while (n !== 0) {
            n >>>= 7;
            i++;
        }
        return i;
    }

    /**
     * Get the number of bytes required to encode the length field.
     * @param {number} [valueLength] - The length of the value, if known.
     * @returns {number}
     * @abstract
     */
    public abstract lengthLength (valueLength?: number): number;
    /**
     * Get the length of the value in bytes.
     * @returns {number}
     * @abstract
     */
    public abstract valueLength (): number;
    /**
     * Get the total length of the TLV (Tag-Length-Value) encoding.
     * @returns {number}
     * @abstract
     */
    public abstract tlvLength (): number;

    /**
     * Get the full encoding of this element as a Node.js Buffer.
     * @returns {Buffer}
     */
    public toBytes (): SingleThreadBuffer {
        return Buffer.concat(this.toBuffers());
    }

    /**
     * Get the length of the value in bytes.
     * @type {number}
     */
    get length (): number {
        return this.value.length;
    }

    /**
     * Parse this element from a byte array.
     * @param {Uint8Array} bytes - The bytes to parse from.
     * @returns {number} The number of bytes consumed.
     * @abstract
     */
    abstract fromBytes (bytes: Uint8Array): number;

    abstract set boolean (value: BOOLEAN);
    abstract get boolean (): BOOLEAN;
    abstract set integer (value: INTEGER);
    abstract get integer (): INTEGER;
    abstract set bitString (value: BIT_STRING);
    abstract get bitString (): BIT_STRING;
    abstract set octetString (value: OCTET_STRING);
    abstract get octetString (): OCTET_STRING;
    abstract set objectIdentifier (value: OBJECT_IDENTIFIER);
    abstract get objectIdentifier (): OBJECT_IDENTIFIER;
    abstract set objectDescriptor (value: ObjectDescriptor);
    abstract get objectDescriptor (): ObjectDescriptor;
    abstract set external (value: EXTERNAL);
    abstract get external (): EXTERNAL;
    abstract set real (value: REAL);
    abstract get real (): REAL;
    abstract set enumerated (value: ENUMERATED);
    abstract get enumerated (): ENUMERATED;
    abstract set embeddedPDV (value: EMBEDDED_PDV);
    abstract get embeddedPDV (): EMBEDDED_PDV;
    abstract set utf8String (value: UTF8String);
    abstract get utf8String (): UTF8String;
    abstract set relativeObjectIdentifier (value: RELATIVE_OID);
    abstract get relativeObjectIdentifier (): RELATIVE_OID;
    abstract set time (value: TIME);
    abstract get time (): TIME;
    abstract set sequence (value: SEQUENCE<ASN1Element>);
    abstract get sequence (): SEQUENCE<ASN1Element>;
    abstract set set (value: SET<ASN1Element>);
    abstract get set (): SET<ASN1Element>;
    abstract set sequenceOf (value: SEQUENCE<ASN1Element>);
    abstract get sequenceOf (): SEQUENCE<ASN1Element>;
    abstract set setOf (value: SET<ASN1Element>);
    abstract get setOf (): SET<ASN1Element>;
    abstract set numericString (value: NumericString);
    abstract get numericString (): NumericString;
    abstract set printableString (value: PrintableString);
    abstract get printableString (): PrintableString;
    abstract set teletexString (value: TeletexString);
    abstract get teletexString (): TeletexString;
    abstract set videotexString (value: VideotexString);
    abstract get videotexString (): VideotexString;
    abstract set ia5String (value: IA5String);
    abstract get ia5String (): IA5String;
    abstract set utcTime (value: UTCTime);
    abstract get utcTime (): UTCTime;
    abstract set generalizedTime (value: GeneralizedTime);
    abstract get generalizedTime (): GeneralizedTime;
    abstract set graphicString (value: GraphicString);
    abstract get graphicString (): GraphicString;
    abstract set visibleString (value: VisibleString);
    abstract get visibleString (): VisibleString;
    abstract set generalString (value: GeneralString);
    abstract get generalString (): GeneralString;
    abstract set universalString (value: UniversalString);
    abstract get universalString (): UniversalString;
    abstract set characterString (value: CharacterString);
    abstract get characterString (): CharacterString;
    abstract set bmpString (value: BMPString);
    abstract get bmpString (): BMPString;
    abstract set date (value: DATE);
    abstract get date (): DATE;
    abstract set timeOfDay (value: TIME_OF_DAY);
    abstract get timeOfDay (): TIME_OF_DAY;
    abstract set dateTime (value: DATE_TIME);
    abstract get dateTime (): DATE_TIME;
    abstract set duration (value: DURATION);
    abstract get duration (): DURATION;
    abstract set oidIRI (value: OID_IRI);
    abstract get oidIRI (): OID_IRI;
    abstract set relativeOIDIRI (value: RELATIVE_OID_IRI);
    abstract get relativeOIDIRI (): RELATIVE_OID_IRI;

    private validateSize (name: string, units: string, actualSize: number, min: number, max?: number): void {
        const effectiveMax: number = (typeof max === "undefined" ? Infinity : max);
        if (actualSize < min) {
            throw new errors.ASN1SizeError(
                `${name} encoded ${actualSize} ${units} when the `
                + `minimum permissible is ${min} ${units}.`,
            );
        }
        if (actualSize > effectiveMax) {
            throw new errors.ASN1SizeError(
                `${name} encoded ${actualSize} ${units} when the `
                + `maximum permissible is ${effectiveMax} ${units}.`,
            );
        }
    }

    private validateRange (name: string, actualValue: bigint | number, min: bigint, max?: bigint): void {
        if (actualValue < min) {
            throw new errors.ASN1OverflowError(
                `${name} was ${actualValue} when the `
                + `minimum permissible is ${min}.`,
            );
        }
        if (max === undefined) {
            return;
        }
        if (actualValue > max) {
            throw new errors.ASN1OverflowError(
                `${name} was ${actualValue} when the `
                + `maximum permissible is ${max}.`,
            );
        }
    }

    public sizeConstrainedBitString (min: number, max?: number): BIT_STRING {
        const ret: BIT_STRING = this.bitString;
        this.validateSize(this.name || "BIT STRING", "bits", ret.length, min, max);
        return ret;
    }

    public sizeConstrainedOctetString (min: number, max?: number): OCTET_STRING {
        const ret: OCTET_STRING = this.octetString;
        this.validateSize(this.name || "OCTET STRING", "octets", ret.length, min, max);
        return ret;
    }

    public sizeConstrainedObjectDescriptor (min: number, max?: number): ObjectDescriptor {
        const ret: ObjectDescriptor = this.objectDescriptor;
        this.validateSize(this.name || "ObjectDescriptor", "characters", ret.length, min, max);
        return ret;
    }

    public sizeConstrainedUTF8String (min: number, max?: number): UTF8String {
        const ret: UTF8String = this.utf8String;
        this.validateSize(this.name || "UTF8String", "characters", ret.length, min, max);
        return ret;
    }

    public sizeConstrainedSequenceOf (min: number, max?: number): SEQUENCE<ASN1Element> {
        const ret: SEQUENCE<ASN1Element> = this.sequenceOf;
        this.validateSize(this.name || "SEQUENCE OF", "elements", ret.length, min, max);
        return ret;
    }

    public sizeConstrainedSetOf (min: number, max?: number): SET<ASN1Element> {
        const ret: ASN1Element[] = this.setOf;
        this.validateSize(this.name || "SET OF", "elements", ret.length, min, max);
        return ret;
    }

    public sizeConstrainedNumericString (min: number, max?: number): NumericString {
        const ret: NumericString = this.numericString;
        this.validateSize(this.name || "NumericString", "characters", ret.length, min, max);
        return ret;
    }

    public sizeConstrainedPrintableString (min: number, max?: number): PrintableString {
        const ret: PrintableString = this.printableString;
        this.validateSize(this.name || "PrintableString", "characters", ret.length, min, max);
        return ret;
    }

    public sizeConstrainedTeletexString (min: number, max?: number): TeletexString {
        const ret: TeletexString = this.teletexString;
        this.validateSize(this.name || "TeletexString", "characters", ret.length, min, max);
        return ret;
    }

    public sizeConstrainedVideotexString (min: number, max?: number): VideotexString {
        const ret: VideotexString = this.videotexString;
        this.validateSize(this.name || "VideotexString", "characters", ret.length, min, max);
        return ret;
    }

    public sizeConstrainedIA5String (min: number, max?: number): IA5String {
        const ret: IA5String = this.ia5String;
        this.validateSize(this.name || "IA5String", "characters", ret.length, min, max);
        return ret;
    }

    public sizeConstrainedGraphicString (min: number, max?: number): GraphicString {
        const ret: GraphicString = this.graphicString;
        this.validateSize(this.name || "GraphicString", "characters", ret.length, min, max);
        return ret;
    }

    public sizeConstrainedVisibleString (min: number, max?: number): VisibleString {
        const ret: VisibleString = this.visibleString;
        this.validateSize(this.name || "VisibleString", "characters", ret.length, min, max);
        return ret;
    }

    public sizeConstrainedGeneralString (min: number, max?: number): GeneralString {
        const ret: GeneralString = this.generalString;
        this.validateSize(this.name || "GeneralString", "characters", ret.length, min, max);
        return ret;
    }

    public sizeConstrainedUniversalString (min: number, max?: number): UniversalString {
        const ret: UniversalString = this.universalString;
        this.validateSize(this.name || "UniversalString", "characters", ret.length, min, max);
        return ret;
    }

    public sizeConstrainedBMPString (min: number, max?: number): BMPString {
        const ret: BMPString = this.bmpString;
        this.validateSize(this.name || "BMPString", "characters", ret.length, min, max);
        return ret;
    }

    public rangeConstrainedInteger (min: bigint, max?: bigint): INTEGER {
        const ret: INTEGER = this.integer;
        this.validateRange(this.name || "INTEGER", ret, min, max);
        return ret;
    }

    public rangeConstrainedReal (min: bigint, max?: bigint): REAL {
        const ret: REAL = this.real;
        this.validateRange(this.name || "REAL", ret, min, max);
        return ret;
    }

    abstract deconstruct (dataType: string): Uint8Array;

    /**
     * Validate the tag of this element against permitted classes, construction, and tag numbers.
     * @param {ASN1TagClass[]} permittedClasses - Allowed tag classes.
     * @param {ASN1Construction[]} permittedConstruction - Allowed construction types.
     * @param {number[]} permittedNumbers - Allowed tag numbers.
     * @returns {number} 0 if valid, negative error code otherwise.
     */
    public validateTag (
        permittedClasses: ASN1TagClass[],
        permittedConstruction: ASN1Construction[],
        permittedNumbers: number[],
    ): number {
        if (!permittedClasses.includes(this.tagClass)) return -1;
        if (!permittedConstruction.includes(this.construction)) return -2;
        if (!permittedNumbers.includes(this.tagNumber)) return -3;
        return 0;
    }

    /**
     * The inner ASN.1 element (for constructed types).
     * @type {ASN1Element}
     * @abstract
     */
    abstract get inner (): ASN1Element;
    /**
     * The component elements (for constructed types).
     * @type {ASN1Element[]}
     * @abstract
     */
    abstract get components (): ASN1Element[];

    /**
     * Convert this element to an ASN1Element (identity function).
     * @returns {ASN1Element}
     */
    public toElement (): ASN1Element {
        return this;
    }

    /**
     * Copy the tag, construction, tag number, and value from another ASN1Element.
     * @param {ASN1Element} el - The element to copy from.
     */
    public fromElement (el: ASN1Element): void {
        this.tagClass = el.tagClass;
        this.construction = el.construction;
        this.tagNumber = el.tagNumber;
        this.value = new Uint8Array(el.value);
    }

    /**
     * Get a string representation of this ASN.1 element.
     * @returns {string}
     */
    public toString (): string {
        if (this.tagClass === ASN1TagClass.universal) {
            switch (this.tagNumber) {
            case (ASN1UniversalType.endOfContent): return "END-OF-CONTENT";
            case (ASN1UniversalType.boolean): return (this.boolean ? "TRUE" : "FALSE");
            case (ASN1UniversalType.integer): return this.integer.toString();
            case (ASN1UniversalType.bitString):
                return `'${Array
                    .from(this.bitString)
                    .map((num) => num.toString())
                    .join("")
                }'B`;
            case (ASN1UniversalType.octetString):
                return `'${Array
                    .from(this.octetString)
                    .map((byte) => byte.toString(16).padStart(2, "0"))
                    .join("")
                }'H`;
            case (ASN1UniversalType.nill): return "NULL";
            case (ASN1UniversalType.objectIdentifier): return this.objectIdentifier.asn1Notation;
            case (ASN1UniversalType.objectDescriptor): return `"${this.objectDescriptor}"`;
            case (ASN1UniversalType.external): return "EXTERNAL";
            case (ASN1UniversalType.realNumber): return this.real.toString();
            case (ASN1UniversalType.enumerated): return this.enumerated.toString();
            case (ASN1UniversalType.embeddedPDV): return "EMBEDDED PDV";
            case (ASN1UniversalType.utf8String): return `"${this.utf8String}"`;
            case (ASN1UniversalType.relativeOID): return "{ " + this.relativeObjectIdentifier
                .map((arc) => arc.toString()).join(".") + " }";
            case (ASN1UniversalType.time): return `"${this.time}"`;
            // We call sequenceOf() to mitigate any tagging ordering checks.
            case (ASN1UniversalType.sequence): return ("{ " + this.sequenceOf
                .map((el) => (el.name.length ? `${el.name} ${el.toString()}` : el.toString()))
                .join(" , ") + " }");
            // We call setOf() to mitigate any tagging uniqueness checks or value ordering checks.
            case (ASN1UniversalType.set): return ("{ " + this.setOf
                .map((el) => (el.name.length ? `${el.name} ${el.toString()}` : el.toString()))
                .join(" , ") + " }");
            case (ASN1UniversalType.numericString): return `"${this.numericString}"`;
            case (ASN1UniversalType.printableString): return `"${this.printableString}"`;
            case (ASN1UniversalType.teletexString): return "TeletexString";
            case (ASN1UniversalType.videotexString): return "VideotexString";
            case (ASN1UniversalType.ia5String): return `"${this.ia5String}"`;
            case (ASN1UniversalType.utcTime): return `"${this.utcTime.toISOString()}"`;
            case (ASN1UniversalType.generalizedTime): return `"${this.generalizedTime.toISOString()}"`;
            case (ASN1UniversalType.graphicString): return `"${this.graphicString}"`;
            case (ASN1UniversalType.visibleString): return `"${this.visibleString}"`;
            case (ASN1UniversalType.generalString): return `"${this.generalString}"`;
            case (ASN1UniversalType.universalString): return `"${this.universalString}"`;
            case (ASN1UniversalType.characterString): return "CHARACTER STRING";
            case (ASN1UniversalType.bmpString): return `"${this.bmpString}"`;
            case (ASN1UniversalType.date): return `"${this.date.toISOString()}"`;
            case (ASN1UniversalType.timeOfDay): {
                const tod = this.timeOfDay;
                return `"${tod.getUTCHours()}:${tod.getUTCMinutes()}:${tod.getUTCSeconds()}"`;
            }
            case (ASN1UniversalType.dateTime): return `"${this.dateTime.toISOString()}"`;
            case (ASN1UniversalType.duration): return this.duration.toString();
            case (ASN1UniversalType.oidIRI): return this.oidIRI;
            case (ASN1UniversalType.roidIRI): return this.relativeOIDIRI;
            default: {
                return `[UNIV ${this.tagNumber}]: ${this.value.toString()}`;
            }
            }
        } else if (this.construction === ASN1Construction.constructed) {
            const inner = this.components;
            if (inner.length === 1) {
                return inner[0].toString();
            } else {
                return "{ " + inner.map((el) => el.toString()).join(", ") + " }";
            }
        } else if (this.tagClass === ASN1TagClass.context) {
            return `[CTXT ${this.tagNumber}]: ${this.value.toString()}`;
        } else if (this.tagClass === ASN1TagClass.private) {
            return `[PRIV ${this.tagNumber}]: ${this.value.toString()}`;
        } else {
            return `[APPL ${this.tagNumber}]: ${this.value.toString()}`;
        }
    }

    /**
     * Convert this ASN.1 value to a JSON-serialized value.
     *
     * This method serializes data loosely according to the JSON Encoding Rules
     * specified in ITU Recommendation X.697.
     *
     * @param {boolean} [recurse=true] - Whether to recursively serialize child elements.
     * @returns {unknown} Usually a valid JSON Encoding Rules encoding of that element.
     */
    public toJSON (recurse: boolean = true): unknown {
        if (this.tagClass === ASN1TagClass.universal) {
            switch (this.tagNumber) {
            case (ASN1UniversalType.endOfContent): return undefined;
            case (ASN1UniversalType.boolean): return this.boolean;
            case (ASN1UniversalType.integer): {
                const ret = this.integer;
                /**
                 * This is an exception to X.697, which makes no mention of any
                 * way to encode big integers into JSON.
                 */
                if (typeof ret === "bigint") {
                    return ret.toString();
                }
                return ret;
            }
            case (ASN1UniversalType.bitString): {
                const bits = this.bitString;
                return {
                    length: bits.length,
                    value: Array.from(packBits(bits)).map((byte) => byte.toString(16)).join(""),
                };
            }
            case (ASN1UniversalType.octetString): return Array.from(this.octetString)
                .map((byte) => byte.toString(16)).join("");
            case (ASN1UniversalType.nill): return null;
            case (ASN1UniversalType.objectIdentifier): return this.objectIdentifier.toJSON();
            case (ASN1UniversalType.objectDescriptor): return this.objectDescriptor;
            case (ASN1UniversalType.external): return this.external.toJSON();
            case (ASN1UniversalType.realNumber): {
                const r = this.real;
                if (Object.is(r, -0)) {
                    return "-0";
                }
                if (r === -Infinity) {
                    return "-INF";
                }
                if (r === Infinity) {
                    return "INF";
                }
                if (Number.isNaN(r)) {
                    return "NaN";
                }
                return r.toString();
            }
            case (ASN1UniversalType.enumerated): return this.enumerated.toString();
            case (ASN1UniversalType.embeddedPDV): return this.embeddedPDV.toJSON();
            case (ASN1UniversalType.utf8String): return this.utf8String;
            case (ASN1UniversalType.relativeOID): return this.relativeObjectIdentifier
                .map((arc) => arc.toString()).join(".");
            case (ASN1UniversalType.time): return this.time;
            case (ASN1UniversalType.sequence): {
                if (!recurse) {
                    return null;
                }
                // We call sequenceOf() to mitigate any tagging ordering checks.
                return this.sequenceOf.map((el) => el.toJSON());
            }
            case (ASN1UniversalType.set): {
                if (!recurse) {
                    return null;
                }
                // We call setOf() to mitigate any tagging uniqueness checks or value ordering checks.
                return this.setOf.map((el) => el.toJSON());
            }
            case (ASN1UniversalType.numericString): return this.numericString;
            case (ASN1UniversalType.printableString): return this.printableString;
            case (ASN1UniversalType.teletexString): return String.fromCodePoint(...Array.from(this.teletexString));
            case (ASN1UniversalType.videotexString): return String.fromCodePoint(...Array.from(this.videotexString));
            case (ASN1UniversalType.ia5String): return this.ia5String;
            case (ASN1UniversalType.utcTime): return this.utcTime.toISOString();
            case (ASN1UniversalType.generalizedTime): return this.generalizedTime.toISOString();
            case (ASN1UniversalType.graphicString): return this.graphicString
            case (ASN1UniversalType.visibleString): return this.visibleString;
            case (ASN1UniversalType.generalString): return this.generalString;
            case (ASN1UniversalType.universalString): return this.universalString;
            case (ASN1UniversalType.characterString): return this.characterString.toJSON();
            case (ASN1UniversalType.bmpString): return this.bmpString;
            case (ASN1UniversalType.date): return this.date.toISOString();
            case (ASN1UniversalType.timeOfDay): {
                const tod = this.timeOfDay;
                return `${tod.getUTCHours()}:${tod.getUTCMinutes()}:${tod.getUTCSeconds()}`;
            }
            case (ASN1UniversalType.dateTime): return this.dateTime.toISOString();
            case (ASN1UniversalType.duration): return this.duration.toString();
            case (ASN1UniversalType.oidIRI): return this.oidIRI;
            case (ASN1UniversalType.roidIRI): return this.relativeOIDIRI;
            default: {
                return undefined;
            }
            }
        } else if ((this.construction === ASN1Construction.constructed) && recurse) {
            const inner = this.components;
            if (inner.length === 1) {
                return inner[0].toJSON();
            } else {
                return inner.map((el) => el.toJSON());
            }
        } else {
            return undefined;
        }
    }
}
