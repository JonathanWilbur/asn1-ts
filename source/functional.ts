import {
    ASN1Element,
    BERElement,
    CERElement,
    DERElement,
    ASN1TagClass,
    ASN1Construction,
    ASN1UniversalType,
    ASN1ConstructionError,
    BIT_STRING,
    INTEGER,
    OBJECT_IDENTIFIER,
    ObjectDescriptor,
    REAL,
    RELATIVE_OID,
    RELATIVE_OID_IRI,
    TIME,
    TIME_OF_DAY,
    DURATION,
    DATE,
    DATE_TIME,
    EXTERNAL,
    EMBEDDED_PDV,
    CharacterString,
    NULL,
    ENUMERATED,
    BOOLEAN,
    INSTANCE_OF,
    OID_IRI,
    OCTET_STRING,
    BMPString,
    VisibleString,
    VideotexString,
    TeletexString,
    T61String,
    UniversalString,
    GeneralString,
    GeneralizedTime,
    UTCTime,
    PrintableString,
    GraphicString,
    IA5String,
    ISO646String,
    NumericString,
    UTF8String,
    SEQUENCE,
    SEQUENCE_OF,
    SET,
    SET_OF,
} from "./index";

/*
You may notice that several exports in this file use an `encoderGetter` or
a `decoderGetter` rather than just accepting an `encoder` or `decoder`. This is
not complexity for complexity's sake. This allows us to define encoders and
decoders for recursively-defined ASN.1 types. The type in which I discovered
this issue, and hence made the necessary code changes, was `Refinement` in
`InformationFramework`.
*/

// COMMON

export interface ASN1ElementGetter<T> {
    (value?: T): ASN1Element;
}

export interface ASN1Encoder<T> {
    (value: T, elGetter: ASN1Encoder<T>): ASN1Element;
}

export interface ASN1Decoder<T> {
    (el: ASN1Element): T;
}

export interface TagValidator {
    (index: number, elements: ASN1Element[]): boolean;
}

// Thank you: https://stackoverflow.com/a/57640611/6562635
export type Selection<T, K extends string> = T extends Record<K, any> ? T[K] : never;
// Thank you: https://stackoverflow.com/a/52221718/6562635
export type AllUnionMemberKeys<T> = T extends any ? keyof T : never;
export type InextensibleChoice<T> = T;
export type ExtensibleChoice<T> = (T | ASN1Element);
export type DecodingCallback = (el: ASN1Element, name?: string) => void;
export type DecodingMap = Record<string, DecodingCallback>;

export function hasTag (tagClass: ASN1TagClass, tagNumber: number): TagValidator {
    return function (index: number, elements: ASN1Element[]): boolean {
        const el: ASN1Element = elements[index];
        return ((el.tagClass === tagClass) && (el.tagNumber === tagNumber));
    };
}

export function hasAnyTag (): boolean {
    return true;
}

export function hasTagClass (tagClass: ASN1TagClass): TagValidator {
    return function (index: number, elements: ASN1Element[]): boolean {
        return (elements[index].tagClass === tagClass);
    };
}

export function hasTagNumberIn (tagNumbers: number[]): TagValidator {
    return function (index: number, elements: ASN1Element[]): boolean {
        return tagNumbers.some((tn: number): boolean => tn === elements[index].tagNumber);
    };
}

export function and (...fns: TagValidator[]): TagValidator {
    return function (index: number, elements: ASN1Element[]): boolean {
        return fns.every((fn) => fn(index, elements));
    };
}

export function or (...fns: TagValidator[]): TagValidator {
    return function (index: number, elements: ASN1Element[]): boolean {
        return fns.some((fn) => fn(index, elements));
    };
}

export function not (fn: TagValidator): TagValidator {
    return function (index: number, elements: ASN1Element[]): boolean {
        return !fn(index, elements);
    };
}

export function tagClassName (tagClass: ASN1TagClass): string {
    switch (tagClass) {
    case (ASN1TagClass.universal): return "UNIVERSAL";
    case (ASN1TagClass.context): return "CONTEXT";
    case (ASN1TagClass.application): return "APPLICATION";
    case (ASN1TagClass.private): return "PRIVATE";
    default: {
        throw new Error(`Unrecognized ASN.1 Tag Class ${tagClass}.`);
    }
    }
}

// eslint-disable-next-line
export function deepEq (value1: any, value2: any): boolean {
    if (value1 === value2) {
        return true;
    }
    return (JSON.stringify(value1) === JSON.stringify(value2));
}

// eslint-disable-next-line
export function isDefault (defaultValue: any): (actualValue: any) => boolean {
    return function (actualValue: any): boolean {
        return deepEq(defaultValue, actualValue);
    };
}

/**
 * Kept for the sake of documentation: this cannot be used to determine
 * component presence, because typescript cannot recurse into this for the sake
 * of type-checking. TypeScript cannot tell that, if this function returns true,
 * the value should not be undefined.
 */
// eslint-disable-next-line
export function present (value: any): boolean {
    return (value !== undefined);
}

// TAGGING CODECS

/**
 * @param encoder
 * @param outer It is necessary for this to be a function that generates an
 *  `ASN1Element`, because it must get newly generated every time this is called.
 */
export function _encode_explicit (
    class_: ASN1TagClass | undefined,
    tag: number | undefined,
    encoderGetter: () => ASN1Encoder<any>,
    outer:  ASN1Encoder<any>,
): ASN1Encoder<any> {
    return function (value: any, elGetter: ASN1Encoder<any>): ASN1Element {
        const ret: ASN1Element = outer(value, outer);
        ret.sequence = [ encoderGetter()(value, elGetter) ];
        ret.construction = ASN1Construction.constructed;
        if (class_) {
            ret.tagClass = class_;
        }
        if (typeof tag !== "undefined") {
            ret.tagNumber = tag;
        }
        return ret;
    };
}

export function _decode_explicit<T> (decoderGetter: () => (el: ASN1Element) => T): ASN1Decoder<T> {
    return (el: ASN1Element) => decoderGetter()(el.inner);
}

export function _encode_implicit (
    class_: ASN1TagClass | undefined,
    tag: number | undefined,
    encoderGetter: () => ASN1Encoder<any>,
    outer:  ASN1Encoder<any>, // eslint-disable-line
    // ^ This needs to remain here.
): ASN1Encoder<any> {
    return function (value: any, elGetter: ASN1Encoder<any>): ASN1Element {
        const ret: ASN1Element = encoderGetter()(value, elGetter);
        if (class_) {
            ret.tagClass = class_;
        }
        if (typeof tag !== "undefined") {
            ret.tagNumber = tag;
        }
        return ret;
    };
}

export function _decode_implicit<T> (decoderGetter: () => (el: ASN1Element) => T): ASN1Decoder<T> {
    return (el: ASN1Element) => decoderGetter()(el);
}

export function _tagClass (class_: ASN1TagClass, encoderGetter: () => () => ASN1Element): ASN1Element {
    const el = encoderGetter()();
    el.tagClass = class_;
    return el;
}

export function _construction (con: ASN1Construction, encoderGetter: () => () => ASN1Element): ASN1Element {
    const el = encoderGetter()();
    el.construction = con;
    return el;
}

export function _tagNumber (tag: number, encoderGetter: () => () => ASN1Element): ASN1Element {
    const el = encoderGetter()();
    el.tagNumber = tag;
    return el;
}

// ENCODING RULE MACROS

export const BER: ASN1Encoder<any> = (): ASN1Element => new BERElement();
export const CER: ASN1Encoder<any> = (): ASN1Element => new CERElement();
export const DER: ASN1Encoder<any> = (): ASN1Element => new DERElement();

// PRIMITIVE UNIVERSAL ENCODERS

export const _encodeBitString: ASN1Encoder<BIT_STRING>
= (value: BIT_STRING, elGetter: ASN1Encoder<BIT_STRING>) => {
    const el: ASN1Element = elGetter(value, elGetter);
    el.bitString = value;
    el.tagClass = ASN1TagClass.universal;
    el.tagNumber = ASN1UniversalType.bitString;
    return el;
}

export const _encodeBoolean: ASN1Encoder<BOOLEAN>
= (value: BOOLEAN, elGetter: ASN1Encoder<BOOLEAN>) => {
    const el: ASN1Element = elGetter(value, elGetter);
    el.boolean = value;
    el.tagClass = ASN1TagClass.universal;
    el.tagNumber = ASN1UniversalType.boolean;
    return el;
}

export const _encodeUnrestrictedCharacterString: ASN1Encoder<CharacterString>
= (value: CharacterString, elGetter: ASN1Encoder<CharacterString>) => {
    const el: ASN1Element = elGetter(value, elGetter);
    el.characterString = value;
    el.tagClass = ASN1TagClass.universal;
    el.tagNumber = ASN1UniversalType.characterString;
    return el;
}

export const _encodeDate: ASN1Encoder<DATE>
= (value: DATE, elGetter: ASN1Encoder<DATE>) => {
    const el: ASN1Element = elGetter(value, elGetter);
    el.date = value;
    el.tagClass = ASN1TagClass.universal;
    el.tagNumber = ASN1UniversalType.date;
    return el;
}

export const _encodeDateTime: ASN1Encoder<DATE_TIME>
= (value: DATE_TIME, elGetter: ASN1Encoder<DATE_TIME>) => {
    const el: ASN1Element = elGetter(value, elGetter);
    el.dateTime = value;
    el.tagClass = ASN1TagClass.universal;
    el.tagNumber = ASN1UniversalType.dateTime;
    return el;
}

export const _encodeDuration: ASN1Encoder<DURATION>
= (value: DURATION, elGetter: ASN1Encoder<DURATION>) => {
    const el: ASN1Element = elGetter(value, elGetter);
    el.duration = value;
    el.tagClass = ASN1TagClass.universal;
    el.tagNumber = ASN1UniversalType.duration;
    return el;
}

export const _encodeEmbeddedPDV: ASN1Encoder<EMBEDDED_PDV>
= (value: EMBEDDED_PDV, elGetter: ASN1Encoder<EMBEDDED_PDV>) => {
    const el: ASN1Element = elGetter(value, elGetter);
    el.embeddedPDV = value;
    el.tagClass = ASN1TagClass.universal;
    el.tagNumber = ASN1UniversalType.embeddedPDV;
    return el;
}

export const _encodeEnumerated: ASN1Encoder<ENUMERATED>
= (value: ENUMERATED, elGetter: ASN1Encoder<ENUMERATED>) => {
    const el: ASN1Element = elGetter(value, elGetter);
    el.enumerated = value;
    el.tagClass = ASN1TagClass.universal;
    el.tagNumber = ASN1UniversalType.enumerated;
    return el;
}

export const _encodeExternal: ASN1Encoder<EXTERNAL>
= (value: EXTERNAL, elGetter: ASN1Encoder<EXTERNAL>) => {
    const el: ASN1Element = elGetter(value, elGetter);
    el.external = value;
    el.tagClass = ASN1TagClass.universal;
    el.tagNumber = ASN1UniversalType.external;
    return el;
}

export const _encodeInstanceOf: ASN1Encoder<INSTANCE_OF> = (value: INSTANCE_OF, elGetter: ASN1Encoder<INSTANCE_OF>) => {
    const el: ASN1Element = elGetter(value, elGetter);
    el.external = value;
    el.tagClass = ASN1TagClass.universal;
    el.tagNumber = ASN1UniversalType.external;
    return el;
}

export const _encodeInteger: ASN1Encoder<INTEGER>
= (value: INTEGER, elGetter: ASN1Encoder<INTEGER>) => {
    const el: ASN1Element = elGetter(value, elGetter);
    el.integer = value;
    el.tagClass = ASN1TagClass.universal;
    el.tagNumber = ASN1UniversalType.integer;
    return el;
}

export const _encodeIRI: ASN1Encoder<OID_IRI>
= (value: OID_IRI, elGetter: ASN1Encoder<OID_IRI>) => {
    const el: ASN1Element = elGetter(value, elGetter);
    el.oidIRI = value;
    el.tagClass = ASN1TagClass.universal;
    el.tagNumber = ASN1UniversalType.oidIRI;
    return el;
}

export const _encodeNull: ASN1Encoder<NULL>
= (value: NULL, elGetter: ASN1Encoder<NULL>) => {
    const el: ASN1Element = elGetter(value, elGetter);
    el.value = new Uint8Array(0);
    el.tagClass = ASN1TagClass.universal;
    el.tagNumber = ASN1UniversalType.nill;
    return el;
}

export const _encodeObjectIdentifier: ASN1Encoder<OBJECT_IDENTIFIER>
= (value: OBJECT_IDENTIFIER, elGetter: ASN1Encoder<OBJECT_IDENTIFIER>) => {
    const el: ASN1Element = elGetter(value, elGetter);
    el.objectIdentifier = value;
    el.tagClass = ASN1TagClass.universal;
    el.tagNumber = ASN1UniversalType.objectIdentifier;
    return el;
}

export const _encodeOctetString: ASN1Encoder<OCTET_STRING>
= (value: OCTET_STRING, elGetter: ASN1Encoder<OCTET_STRING>) => {
    const el: ASN1Element = elGetter(value, elGetter);
    el.octetString = value;
    el.tagClass = ASN1TagClass.universal;
    el.tagNumber = ASN1UniversalType.octetString;
    return el;
}

export const _encodeReal: ASN1Encoder<REAL>
= (value: REAL, elGetter: ASN1Encoder<REAL>) => {
    const el: ASN1Element = elGetter(value, elGetter);
    el.real = value;
    el.tagClass = ASN1TagClass.universal;
    el.tagNumber = ASN1UniversalType.realNumber;
    return el;
}

export const _encodeRelativeIRI: ASN1Encoder<RELATIVE_OID_IRI>
= (value: RELATIVE_OID_IRI, elGetter: ASN1Encoder<RELATIVE_OID_IRI>) => {
    const el: ASN1Element = elGetter(value, elGetter);
    el.relativeOIDIRI = value;
    el.tagClass = ASN1TagClass.universal;
    el.tagNumber = ASN1UniversalType.roidIRI;
    return el;
}

export const _encodeRelativeOID: ASN1Encoder<RELATIVE_OID>
= (value: RELATIVE_OID, elGetter: ASN1Encoder<RELATIVE_OID>) => {
    const el: ASN1Element = elGetter(value, elGetter);
    el.relativeObjectIdentifier = value;
    el.tagClass = ASN1TagClass.universal;
    el.tagNumber = ASN1UniversalType.relativeOID;
    return el;
}

export const _encodeSequence: ASN1Encoder<SEQUENCE<ASN1Element>>
= (value: SEQUENCE<ASN1Element>, elGetter: ASN1Encoder<SEQUENCE<ASN1Element>>) => {
    const el: ASN1Element = elGetter(value, elGetter);
    el.sequence = value;
    el.tagClass = ASN1TagClass.universal;
    el.tagNumber = ASN1UniversalType.sequence;
    return el;
}

export const _encodeSet: ASN1Encoder<SET<ASN1Element>>
= (value: SET<ASN1Element>, elGetter: ASN1Encoder<SET<ASN1Element>>) => {
    const el: ASN1Element = elGetter(value, elGetter);
    el.set = value;
    el.tagClass = ASN1TagClass.universal;
    el.tagNumber = ASN1UniversalType.set;
    return el;
}

export const _encodeTime: ASN1Encoder<TIME>
= (value: TIME, elGetter: ASN1Encoder<TIME>) => {
    const el: ASN1Element = elGetter(value, elGetter);
    el.time = value;
    el.tagClass = ASN1TagClass.universal;
    el.tagNumber = ASN1UniversalType.time;
    return el;
}

export const _encodeTimeOfDay: ASN1Encoder<TIME_OF_DAY>
= (value: TIME_OF_DAY, elGetter: ASN1Encoder<TIME_OF_DAY>) => {
    const el: ASN1Element = elGetter(value, elGetter);
    el.timeOfDay = value;
    el.tagClass = ASN1TagClass.universal;
    el.tagNumber = ASN1UniversalType.timeOfDay;
    return el;
}

export const _encodeBMPString: ASN1Encoder<BMPString>
= (value: BMPString, elGetter: ASN1Encoder<BMPString>) => {
    const el: ASN1Element = elGetter(value, elGetter);
    el.bmpString = value;
    el.tagClass = ASN1TagClass.universal;
    el.tagNumber = ASN1UniversalType.bmpString;
    return el;
}

export const _encodeGeneralString: ASN1Encoder<GeneralString>
= (value: GeneralString, elGetter: ASN1Encoder<GeneralString>) => {
    const el: ASN1Element = elGetter(value, elGetter);
    el.generalString = value;
    el.tagClass = ASN1TagClass.universal;
    el.tagNumber = ASN1UniversalType.generalString;
    return el;
}

export const _encodeGraphicString: ASN1Encoder<GraphicString>
= (value: GraphicString, elGetter: ASN1Encoder<GraphicString>) => {
    const el: ASN1Element = elGetter(value, elGetter);
    el.graphicString = value;
    el.tagClass = ASN1TagClass.universal;
    el.tagNumber = ASN1UniversalType.graphicString;
    return el;
}

export const _encodeIA5String: ASN1Encoder<IA5String>
= (value: IA5String, elGetter: ASN1Encoder<IA5String>) => {
    const el: ASN1Element = elGetter(value, elGetter);
    el.ia5String = value;
    el.tagClass = ASN1TagClass.universal;
    el.tagNumber = ASN1UniversalType.ia5String;
    return el;
}

export const _encodeISO646String: ASN1Encoder<ISO646String>
= (value: ISO646String, elGetter: ASN1Encoder<ISO646String>) => {
    const el: ASN1Element = elGetter(value, elGetter);
    el.ia5String = value;
    el.tagClass = ASN1TagClass.universal;
    el.tagNumber = ASN1UniversalType.ia5String;
    return el;
}

export const _encodeNumericString: ASN1Encoder<NumericString>
= (value: NumericString, elGetter: ASN1Encoder<NumericString>) => {
    const el: ASN1Element = elGetter(value, elGetter);
    el.numericString = value;
    el.tagClass = ASN1TagClass.universal;
    el.tagNumber = ASN1UniversalType.numericString;
    return el;
}

export const _encodePrintableString: ASN1Encoder<PrintableString>
= (value: PrintableString, elGetter: ASN1Encoder<PrintableString>) => {
    const el: ASN1Element = elGetter(value, elGetter);
    el.printableString = value;
    el.tagClass = ASN1TagClass.universal;
    el.tagNumber = ASN1UniversalType.printableString;
    return el;
}

export const _encodeTeletexString: ASN1Encoder<TeletexString>
= (value: TeletexString, elGetter: ASN1Encoder<TeletexString>) => {
    const el: ASN1Element = elGetter(value, elGetter);
    el.teletexString = value;
    el.tagClass = ASN1TagClass.universal;
    el.tagNumber = ASN1UniversalType.teletexString;
    return el;
}

export const _encodeT61String: ASN1Encoder<T61String>
= (value: T61String, elGetter: ASN1Encoder<T61String>) => {
    const el: ASN1Element = elGetter(value, elGetter);
    el.teletexString = value;
    el.tagClass = ASN1TagClass.universal;
    el.tagNumber = ASN1UniversalType.teletexString;
    return el;
}

export const _encodeUniversalString: ASN1Encoder<UniversalString>
= (value: UniversalString, elGetter: ASN1Encoder<UniversalString>) => {
    const el: ASN1Element = elGetter(value, elGetter);
    el.universalString = value;
    el.tagClass = ASN1TagClass.universal;
    el.tagNumber = ASN1UniversalType.universalString;
    return el;
}

export const _encodeUTF8String: ASN1Encoder<UTF8String>
= (value: UTF8String, elGetter: ASN1Encoder<UTF8String>) => {
    const el: ASN1Element = elGetter(value, elGetter);
    el.utf8String = value;
    el.tagClass = ASN1TagClass.universal;
    el.tagNumber = ASN1UniversalType.utf8String;
    return el;
}

export const _encodeVideotexString: ASN1Encoder<VideotexString>
= (value: VideotexString, elGetter: ASN1Encoder<VideotexString>) => {
    const el: ASN1Element = elGetter(value, elGetter);
    el.videotexString = value;
    el.tagClass = ASN1TagClass.universal;
    el.tagNumber = ASN1UniversalType.videotexString;
    return el;
}

export const _encodeVisibleString: ASN1Encoder<VisibleString>
= (value: VisibleString, elGetter: ASN1Encoder<VisibleString>) => {
    const el: ASN1Element = elGetter(value, elGetter);
    el.visibleString = value;
    el.tagClass = ASN1TagClass.universal;
    el.tagNumber = ASN1UniversalType.visibleString;
    return el;
}

export const _encodeGeneralizedTime: ASN1Encoder<GeneralizedTime>
= (value: GeneralizedTime, elGetter: ASN1Encoder<GeneralizedTime>) => {
    const el: ASN1Element = elGetter(value, elGetter);
    el.generalizedTime = value;
    el.tagClass = ASN1TagClass.universal;
    el.tagNumber = ASN1UniversalType.generalizedTime;
    return el;
}

export const _encodeUTCTime: ASN1Encoder<UTCTime>
= (value: UTCTime, elGetter: ASN1Encoder<UTCTime>) => {
    const el: ASN1Element = elGetter(value, elGetter);
    el.utcTime = value;
    el.tagClass = ASN1TagClass.universal;
    el.tagNumber = ASN1UniversalType.utcTime;
    return el;
}

export const _encodeObjectDescriptor: ASN1Encoder<ObjectDescriptor>
= (value: ObjectDescriptor, elGetter: ASN1Encoder<ObjectDescriptor>) => {
    const el: ASN1Element = elGetter(value, elGetter);
    el.objectDescriptor = value;
    el.tagClass = ASN1TagClass.universal;
    el.tagNumber = ASN1UniversalType.objectDescriptor;
    return el;
}

export const _encodeAny: ASN1Encoder<ASN1Element>
= (value: ASN1Element) => {
    return value;
}

// PRIMITIVE UNIVERSAL DECODERS

export const _decodeBitString: ASN1Decoder<BIT_STRING>
= (el: ASN1Element): BIT_STRING => {
    return el.bitString;
}

export const _decodeBoolean: ASN1Decoder<BOOLEAN>
= (el: ASN1Element): BOOLEAN => {
    return el.boolean;
}

export const _decodeUnrestrictedCharacterString: ASN1Decoder<CharacterString>
= (el: ASN1Element): CharacterString => {
    return el.characterString;
}

export const _decodeDate: ASN1Decoder<DATE> = (el: ASN1Element): DATE => {
    return el.date;
}

export const _decodeDateTime: ASN1Decoder<DATE_TIME> = (el: ASN1Element): DATE_TIME => {
    return el.dateTime;
}

export const _decodeDuration: ASN1Decoder<DURATION> = (el: ASN1Element): DURATION => {
    return el.duration;
}

export const _decodeEmbeddedPDV: ASN1Decoder<EMBEDDED_PDV> = (el: ASN1Element): EMBEDDED_PDV => {
    return el.embeddedPDV;
}

export const _decodeEnumerated: ASN1Decoder<ENUMERATED> = (el: ASN1Element): ENUMERATED => {
    return el.enumerated;
}

export const _decodeExternal: ASN1Decoder<EXTERNAL> = (el: ASN1Element): EXTERNAL => {
    return el.external;
}

export const _decodeInstanceOf: ASN1Decoder<INSTANCE_OF> = (el: ASN1Element): INSTANCE_OF => {
    return el.external;
}

export const _decodeInteger: ASN1Decoder<INTEGER> = (el: ASN1Element): INTEGER => {
    return el.integer;
}

export const _decodeIRI: ASN1Decoder<OID_IRI> = (el: ASN1Element): OID_IRI => {
    return el.oidIRI;
}

export const _decodeNull: ASN1Decoder<NULL> = (): NULL => {
    return null;
}

export const _decodeObjectIdentifier: ASN1Decoder<OBJECT_IDENTIFIER> = (el: ASN1Element): OBJECT_IDENTIFIER => {
    return el.objectIdentifier;
}

export const _decodeOctetString: ASN1Decoder<OCTET_STRING> = (el: ASN1Element): OCTET_STRING => {
    return el.octetString;
}

export const _decodeReal: ASN1Decoder<REAL> = (el: ASN1Element): REAL => {
    return el.real;
}

export const _decodeRelativeIRI: ASN1Decoder<RELATIVE_OID_IRI> = (el: ASN1Element): RELATIVE_OID_IRI => {
    return el.relativeOIDIRI;
}

export const _decodeRelativeOID: ASN1Decoder<RELATIVE_OID> = (el: ASN1Element): RELATIVE_OID => {
    return el.relativeObjectIdentifier;
}

export const _decodeSequence: ASN1Decoder<SEQUENCE<ASN1Element>> = (el: ASN1Element): SEQUENCE<ASN1Element> => {
    return el.sequence;
}

export const _decodeSet: ASN1Decoder<SET<ASN1Element>> = (el: ASN1Element): SET<ASN1Element> => {
    return el.set;
}

export const _decodeTime: ASN1Decoder<TIME> = (el: ASN1Element): TIME => {
    return el.time;
}

export const _decodeTimeOfDay: ASN1Decoder<TIME_OF_DAY> = (el: ASN1Element): TIME_OF_DAY => {
    return el.timeOfDay;
}

export const _decodeBMPString: ASN1Decoder<BMPString> = (el: ASN1Element): BMPString => {
    return el.bmpString;
}

export const _decodeGeneralString: ASN1Decoder<GeneralString> = (el: ASN1Element): GeneralString => {
    return el.generalString;
}

export const _decodeGraphicString: ASN1Decoder<GraphicString> = (el: ASN1Element): GraphicString => {
    return el.graphicString;
}

export const _decodeIA5String: ASN1Decoder<IA5String> = (el: ASN1Element): IA5String => {
    return el.ia5String;
}

export const _decodeISO646String: ASN1Decoder<IA5String> = (el: ASN1Element): IA5String => {
    return el.ia5String;
}

export const _decodeNumericString: ASN1Decoder<NumericString> = (el: ASN1Element): NumericString => {
    return el.numericString;
}

export const _decodePrintableString: ASN1Decoder<PrintableString> = (el: ASN1Element): PrintableString => {
    return el.printableString;
}

export const _decodeTeletexString: ASN1Decoder<TeletexString> = (el: ASN1Element): TeletexString => {
    return el.teletexString;
}

export const _decodeT61String: ASN1Decoder<T61String> = (el: ASN1Element): T61String => {
    return el.teletexString;
}

export const _decodeUniversalString: ASN1Decoder<UniversalString> = (el: ASN1Element): UniversalString => {
    return el.universalString;
}

export const _decodeUTF8String: ASN1Decoder<UTF8String> = (el: ASN1Element): UTF8String => {
    return el.utf8String;
}

export const _decodeVideotexString: ASN1Decoder<VideotexString> = (el: ASN1Element): VideotexString => {
    return el.videotexString;
}

export const _decodeVisibleString: ASN1Decoder<VisibleString> = (el: ASN1Element): VisibleString => {
    return el.visibleString;
}

export const _decodeGeneralizedTime: ASN1Decoder<GeneralizedTime> = (el: ASN1Element): GeneralizedTime => {
    return el.generalizedTime;
}

export const _decodeUTCTime: ASN1Decoder<UTCTime> = (el: ASN1Element): UTCTime => {
    return el.utcTime;
}

export const _decodeObjectDescriptor: ASN1Decoder<ObjectDescriptor> = (el: ASN1Element): ObjectDescriptor => {
    return el.objectDescriptor;
}

export const _decodeAny: ASN1Decoder<ASN1Element> = (el: ASN1Element): ASN1Element => {
    return el;
}

// CONSTRUCTED TYPE

export
class ComponentSpec {
    constructor (
        readonly name: string,
        readonly optional: boolean,
        readonly selector: TagValidator,
        readonly groupIndex?: number,
        readonly versionNumber?: number,
    ) {}
}

export
function _parse_set (
    set: ASN1Element,
    decodingCallbacks: DecodingMap,
    rootComponentTypeList1: ComponentSpec[],
    extensionAdditionsList: ComponentSpec[],
    rootComponentTypeList2: ComponentSpec[],
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    unrecognizedExtensionHandler: DecodingCallback = () => {},
    maximumElements?: number,
): void {
    const rootComponents: ComponentSpec[] = rootComponentTypeList1.concat(rootComponentTypeList2);
    const components: ComponentSpec[] = rootComponents.concat(rootComponentTypeList2);
    const elements: ASN1Element[] = set.set;

    /**
     * We check the length of the SET first, to detect and prevent denial-of-service
     * attacks that are based on a malicious user supplying an excessively large SET.
     *
     * This is only a problem for SET (not SEQUENCE or CHOICE) because the tag
     * validation callback must be called for each element. Theoretically, if
     * this check were not in place, an attacker could bog down a host by supplying
     * a large SET containing only unrecognized elements (or elements that are
     * ordered such that the recognized ones appear near the end of the list),
     * so that the tag validation callback must be executed for every element (or
     * most of them) for a large number of elements. The difficulty of SET parsing
     * grows in O(n^2) time, in other words.
     *
     * To see where this would become a problem if this check were not in place,
     * search for the comment containing "758eb9f0-2d70-4cbf-ad19-593bfb939113".
     */
    {
        const calculatedMaximumElements: number = (maximumElements === undefined)
            ? (components.length + 100)
            : maximumElements;
        if (elements.length > calculatedMaximumElements) {
            throw new Error(
                `SET '${set.name}' contained ${elements.length} elements, which exceeds the `
                + `limit of ${calculatedMaximumElements} permitted elements. This may be a result `
                + "of a Denial-of-Service (DoS) attack.",
            );
        }
    }

    { // Check the entire set for duplicate tags.
        const encounteredTags: Set<string> = new Set<string>([]);
        elements.forEach((e) => {
            const tag: string = `${e.tagClass} ${e.tagNumber}`;
            if (encounteredTags.has(tag)) {
                throw new Error(
                    `Duplicate tag '${tagClassName(e.tagClass)} ${e.tagNumber}' in SET '${set.name}'.`,
                );
            }
            encounteredTags.add(tag);
        });
    }

    /**
     * You must do this by the element name--not the tag--because an element
     * may be expressed using many different tags.
     */
    const encounteredComponents: Set<string> = new Set<string>([]);
    const encounteredExtensionGroups: Set<number> = new Set<number>([]);

    // Execute callbacks on all components.
    elements.forEach((e, i) => {
        const spec: ComponentSpec | undefined = components
            .find((cs) => cs.selector(i, elements)); // 758eb9f0-2d70-4cbf-ad19-593bfb939113
        if (!spec) {
            unrecognizedExtensionHandler(e);
            return;
        }
        if (encounteredComponents.has(spec.name)) {
            throw new Error(`SET '${set.name}' contained more than one '${spec.name}' component.`);
        }
        encounteredComponents.add(spec.name);
        if (spec.groupIndex !== undefined) {
            encounteredExtensionGroups.add(spec.groupIndex);
        }
        e.name = spec.name;
        if (spec.name in decodingCallbacks) {
            decodingCallbacks[spec.name](e, spec.name);
        } else {
            unrecognizedExtensionHandler(e);
        }
    });

    // Check for missing required components
    const missingRequiredComponents: string[] = [];
    rootComponents
        .filter((c) => (!(c.optional)))
        .forEach((c) => {
            if (!(encounteredComponents.has(c.name))) {
                missingRequiredComponents.push(c.name);
            }
        });
    Array.from(encounteredExtensionGroups).forEach((exg) => {
        extensionAdditionsList
            .filter((c) => ((c.groupIndex === exg) && !(c.optional)))
            .forEach((c) => {
                if (!(encounteredComponents.has(c.name))) {
                    missingRequiredComponents.push(c.name);
                }
            });
    });
    if (missingRequiredComponents.length > 0) {
        throw new Error(
            `SET '${set.name}' missing these required components: ${missingRequiredComponents.join(", ")}.`,
        );
    }
}

export function _parse_component_type_list (
    componentTypeList: ComponentSpec[],
    decodingCallbacks: DecodingMap,
    elements: ASN1Element[],
    isExtensionAdditionsList: boolean,
): number {
    let e: number = 0;
    let s: number = 0;
    let currentGroup: number | undefined = undefined;
    while (s < componentTypeList.length) {
        const element: ASN1Element = elements[e];
        const spec: ComponentSpec = componentTypeList[s];
        if (!element) { // If you have ran out of elements in the list.
            if (spec.optional) { // ... and its optional, just keep going.
                s++;
                continue;
            /**
             * The only difference between parsing an extension additions list
             * and a root component type list is that, if you run out of elements
             * in the extension additions list, it is only invalid if an
             * ExtensionAdditionsGroup had any present elements, but was missing
             * REQUIRED elements.
             */
            } else if (isExtensionAdditionsList) { // The element was required as a part of an ExtensionAdditionsGroup.
                if ((spec.groupIndex !== undefined) && (spec.groupIndex <= (currentGroup || Infinity))) {
                    throw new ASN1ConstructionError(`Missing required extension '${spec.name}' in SEQUENCE.`);
                } else {
                    s++;
                    continue;
                }
            } else {
                throw new ASN1ConstructionError(`Missing required component '${spec.name}' in SEQUENCE.`);
            }
        }
        if (spec.selector(e, elements)) {
            element.name = spec.name;
            if (spec.name in decodingCallbacks) {
                decodingCallbacks[spec.name](element, spec.name);
            }
            if (spec.groupIndex !== undefined) {
                currentGroup = spec.groupIndex;
            }
            e++; // Only if it is a match do you increment the element.
        } else if (!spec.optional) {
            throw new Error(`Component '${spec.name}' missing from SEQUENCE.`);
        }
        s++;
    }
    return e;
}

export function _get_possible_initial_components (
    componentTypeList: ComponentSpec[],
): ComponentSpec[] {
    let i: number = 0;
    while (i < componentTypeList.length) {
        if (!(componentTypeList[i++].optional)) {
            break;
        }
    }
    return componentTypeList.slice(0, i);
}

/**
 * This differs from _parse_sequence_without_trailing_rctl in that this function
 * determines the start of the trailing RCTL by searching for tags of its leading
 * OPTIONAL, DEFAULT, and first required elements. This is possible only in this
 * case, because ITU X.680 requires that tags must be unique within these elements
 * as well as the extensions only when there is a trailing RCTL.
 *
 * @param seq
 * @param rootComponentTypeList1
 * @param extensionAdditionsList
 * @param rootComponentTypeList2
 */
export
function _parse_sequence_with_trailing_rctl (
    seq: ASN1Element,
    decodingCallbacks: DecodingMap,
    rootComponentTypeList1: ComponentSpec[],
    extensionAdditionsList: ComponentSpec[],
    rootComponentTypeList2: ComponentSpec[],
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    unrecognizedExtensionHandler: DecodingCallback = () => {},
): void {
    const elements: ASN1Element[] = seq.sequence;
    const startOfExtensions: number = _parse_component_type_list(
        rootComponentTypeList1,
        decodingCallbacks,
        elements,
        false,
    );
    const possibleInitialRCTL2Components: ComponentSpec[] = _get_possible_initial_components(rootComponentTypeList2);
    const rctl2EntirelyOptional: boolean = rootComponentTypeList2.every((ct) => ct.optional);
    const extensionsOnwards: ASN1Element[] = elements.slice(startOfExtensions);
    let numberOfExtensionElements: number = extensionsOnwards
        .findIndex((e, i): boolean => possibleInitialRCTL2Components
            .some((pirctl2c): boolean => pirctl2c.selector(i, extensionsOnwards)));
    if (startOfExtensions === -1) { // We did not find RCTL2.
        if (rctl2EntirelyOptional) {
            numberOfExtensionElements = (elements.length - startOfExtensions);
        } else {
            throw new Error(`Trailing root component type list for SEQUENCE '${seq.name}' not found.`);
        }
    }
    const startOfRCTL2: number = (startOfExtensions + numberOfExtensionElements);
    const numberOfExtensionsRead: number = _parse_component_type_list(
        extensionAdditionsList,
        decodingCallbacks,
        elements.slice(startOfExtensions, startOfRCTL2),
        true,
    );
    const endOfRecognizedExtensions: number = (startOfExtensions + numberOfExtensionsRead);
    elements
        .slice(endOfRecognizedExtensions, startOfRCTL2)
        .forEach((x) => unrecognizedExtensionHandler(x));
    const numberOfRCTL2ElementsRead: number = _parse_component_type_list(
        rootComponentTypeList2,
        decodingCallbacks,
        elements.slice(startOfRCTL2),
        false,
    );
    if ((startOfRCTL2 + numberOfRCTL2ElementsRead) !== elements.length) {
        throw new Error(`SEQUENCE '${seq.name}' had excess elements at the end.`);
    }
}

export
function _parse_sequence_without_trailing_rctl (
    seq: ASN1Element,
    decodingCallbacks: DecodingMap,
    rootComponentTypeList1: ComponentSpec[],
    extensionAdditionsList: ComponentSpec[],
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    unrecognizedExtensionHandler: DecodingCallback = () => {},
): void {
    const elements: ASN1Element[] = seq.sequence;
    const startOfExtensions: number = _parse_component_type_list(
        rootComponentTypeList1,
        decodingCallbacks,
        elements,
        false,
    );
    const numberOfExtensionsRead: number = _parse_component_type_list(
        extensionAdditionsList,
        decodingCallbacks,
        elements.slice(startOfExtensions),
        true,
    );
    const endOfRecognizedExtensions: number = (startOfExtensions + numberOfExtensionsRead);
    elements
        .slice(endOfRecognizedExtensions)
        .forEach((x) => unrecognizedExtensionHandler(x));
}

/**
 * This might have problems when it comes to parsing componentsOf sequences. The
 * compiler will need to translate the componentsOf elements to their fields before
 * adding them to this list. The compiler will also need to handle automatic tagging.
 *
 * @param seq
 * @param specification
 */
export
function _parse_sequence (
    seq: ASN1Element,
    decodingCallbacks: DecodingMap,
    rootComponentTypeList1: ComponentSpec[],
    extensionAdditionsList: ComponentSpec[],
    rootComponentTypeList2: ComponentSpec[],
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    unrecognizedExtensionHandler: DecodingCallback = () => {},
): void {
    if (rootComponentTypeList2.length > 0) {
        _parse_sequence_with_trailing_rctl(
            seq,
            decodingCallbacks,
            rootComponentTypeList1,
            extensionAdditionsList,
            rootComponentTypeList2,
            unrecognizedExtensionHandler,
        );
    } else {
        _parse_sequence_without_trailing_rctl(
            seq,
            decodingCallbacks,
            rootComponentTypeList1,
            extensionAdditionsList,
            unrecognizedExtensionHandler,
        );
    }
}

export function _encode_choice<T> (
    choices: Record<keyof T, ASN1Encoder<T[AllUnionMemberKeys<T>]>>,
    elGetter: ASN1Encoder<T>,
): ASN1Encoder<T> {
    return function (value: T): ASN1Element {
        if (value instanceof ASN1Element) {
            return value;
        }
        const key: keyof T | undefined = (Object.keys(value) as (keyof T | undefined)[])[0];
        if (!key) {
            throw new Error("Empty choice value object.");
        }
        const encoder = choices[key];
        if (!encoder) {
            throw new Error(`Unrecognized alternative '${key}'.`);
        }
        return encoder(value[key] as T[AllUnionMemberKeys<T>], elGetter as any);
    };
}

export function _decode_inextensible_choice<T> (
    choices: Record<
        string,
        [AllUnionMemberKeys<T>, ASN1Decoder<T[AllUnionMemberKeys<T>]>]
    >,
): ASN1Decoder<InextensibleChoice<T>> {
    return function (el: ASN1Element): InextensibleChoice<T> {
        const result = choices[`${tagClassName(el.tagClass)} ${el.tagNumber}`];
        if (!result) {
            if (choices["*"]) {
                const ret: T = {} as T;
                ret[choices["*"][0]] = choices["*"][1](el);
                return ret;
            } else {
                throw new Error(
                    `Unrecognized CHOICE tag '${tagClassName(el.tagClass)} ${
                        el.tagNumber
                    }'.`,
                );
            }
        }
        const [name, decoder] = result;
        const ret: T = {} as T;
        ret[name] = decoder(el);
        return ret;
    };
}

export function _decode_extensible_choice<T> (
    choices: Record<string, [ AllUnionMemberKeys<T>, ASN1Decoder<T[AllUnionMemberKeys<T>]> ]>,
): ASN1Decoder<ExtensibleChoice<T>> {
    return function (el: ASN1Element): ExtensibleChoice<T> {
        const result = choices[`${tagClassName(el.tagClass)} ${el.tagNumber}`];
        if (!result) {
            return el;
        }
        const [ name, decoder ] = result;
        const ret: T = {} as T;
        ret[name] = decoder(el);
        return ret as T;
    };
}

export type SequenceOfDecoder<T> = ASN1Decoder<SEQUENCE_OF<T>>;
export type SetOfDecoder<T> = ASN1Decoder<SET_OF<T>>;
export type SequenceOfEncoder<T> = ASN1Encoder<SEQUENCE_OF<T>>;
export type SetOfEncoder<T> = ASN1Encoder<SET_OF<T>>;

export function _decodeSequenceOf<T> (decoderGetter: () => ASN1Decoder<T>): SequenceOfDecoder<T> {
    return function (el: ASN1Element): SEQUENCE_OF<T> {
        return el.sequence.map(decoderGetter());
    };
}

export function _encodeSequenceOf<T> (
    encoderGetter: () => (value: T, innerElGetter: ASN1Encoder<T>) => ASN1Element,
    outerElGetter: ASN1Encoder<any>,
): SequenceOfEncoder<T> {
    return function (value: SEQUENCE_OF<T>): ASN1Element {
        const el = outerElGetter(value, outerElGetter);
        const encoder = encoderGetter();
        el.sequence = value.map((v) => encoder(v, outerElGetter));
        el.tagClass = ASN1TagClass.universal;
        el.tagNumber = ASN1UniversalType.sequence;
        return el;
    };
}

export function _decodeSetOf<T> (decoderGetter: () => (el: ASN1Element) => T): SetOfDecoder<T> {
    return function (el: ASN1Element): SET_OF<T> {
        return el.set.map(decoderGetter());
    };
}

export function _encodeSetOf<T> (
    encoderGetter: () => (value: T, innerElGetter: ASN1Encoder<T>) => ASN1Element,
    outerElGetter: ASN1Encoder<any>,
): SetOfEncoder<T> {
    return function (value: SET_OF<T>): ASN1Element {
        const el = outerElGetter(value, outerElGetter);
        const encoder = encoderGetter();
        el.set = value.map((v) => encoder(v, outerElGetter));
        el.tagClass = ASN1TagClass.universal;
        el.tagNumber = ASN1UniversalType.set;
        return el;
    };
}

export const _encodeBigInt: ASN1Encoder<OCTET_STRING> = (
    value: OCTET_STRING,
    elGetter: ASN1Encoder<OCTET_STRING>,
) => {
    const el: ASN1Element = elGetter(value, elGetter);
    el.octetString = value;
    el.tagClass = ASN1TagClass.universal;
    el.tagNumber = ASN1UniversalType.integer;
    return el;
};

export const _decodeBigInt: ASN1Decoder<OCTET_STRING> = (
    el: ASN1Element,
): OCTET_STRING => {
    return el.octetString;
};
