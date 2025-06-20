/**
 * This module contains all of the "functional API" for this package. This was
 * contrived because this API works better for code generated from an ASN.1
 * module via a compiler.
 *
 * See
 * [this repository](https://github.com/Wildboar-Software/asn1-typescript-libraries)
 * for many real-world uses of this API.
 *
 * If you're wondering why so many functions start with an underscore, it is because
 * ASN.1 identifiers may not start with a hyphen, so when you generate code that
 * converts ASN.1 identifiers to JavaScript identifiers by converting hyphens to
 * underscores, you could never generate a conflict of names from a valid ASN.1
 * identifier.
 *
 * @module
 */
import {
    ASN1Element,
    BERElement,
    CERElement,
    DERElement,
    ASN1TagClass,
    ASN1Construction,
    ASN1UniversalType,
    ASN1ConstructionError,
    CharacterString,
} from "./index.mjs";
import type {
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
} from "./index.mjs";

/*
You may notice that several exports in this file use an `encoderGetter` or
a `decoderGetter` rather than just accepting an `encoder` or `decoder`. This is
not complexity for complexity's sake. This allows us to define encoders and
decoders for recursively-defined ASN.1 types. The type in which I discovered
this issue, and hence made the necessary code changes, was `Refinement` in
`InformationFramework`.
*/

// COMMON

/**
 * @summary Interface for getting an ASN.1 element
 * @description
 *
 * This interface defines a function that returns an ASN.1 element, optionally
 * taking a value parameter. It is used throughout the functional API for
 * element creation and manipulation.
 *
 * @template T The type of the value that may be passed to the function
 */
export interface ASN1ElementGetter<T> {
    (value?: T): ASN1Element;
}

/**
 * @summary Interface for encoding values to ASN.1 elements
 * @description
 *
 * This interface defines a function that encodes a value of type T into an
 * ASN.1 element. The function takes both the value to encode and an element
 * getter function that can be used to create new ASN.1 elements.
 *
 * @template T The type of the value to encode
 */
export interface ASN1Encoder<T> {
    (value: T, elGetter: ASN1Encoder<T>): ASN1Element;
}

/**
 * @summary Interface for decoding ASN.1 elements to values
 * @description
 *
 * This interface defines a function that decodes an ASN.1 element into a value
 * of type T. The function takes an ASN.1 element and returns the decoded value.
 *
 * @template T The type of the value to decode to
 */
export interface ASN1Decoder<T> {
    (el: ASN1Element): T;
}

/**
 * @summary Interface for validating ASN.1 tags
 * @description
 *
 * This interface defines a function that validates whether an ASN.1 element
 * at a given index in an array of elements matches certain criteria. It is
 * used for component selection in `SEQUENCE` and `SET` parsing.
 */
export interface TagValidator {
    (index: number, elements: ASN1Element[]): boolean;
}

// Thank you: https://stackoverflow.com/a/57640611/6562635
/**
 * @summary Utility type for selecting properties from a type
 * @description
 *
 * This utility type extracts the type of a property `K` from type `T`.
 * It is used for type-safe property access in the functional API.
 *
 * @template T The source type
 * @template K The property key
 */
export type Selection<T, K extends string> = T extends Record<K, any> ? T[K] : never;

// Thank you: https://stackoverflow.com/a/52221718/6562635
/**
 * @summary Utility type for getting all union member keys
 * @description
 *
 * This utility type extracts all possible keys from a union type `T`.
 * It is used for type-safe `CHOICE` handling in the functional API.
 *
 * @template T The union type
 */
export type AllUnionMemberKeys<T> = T extends any ? keyof T : never;

/**
 * @summary Type for inextensible `CHOICE` values
 * @description
 *
 * This type represents a `CHOICE` value that cannot be extended with
 * additional alternatives beyond those defined in the type.
 *
 * @template T The `CHOICE` type
 */
export type InextensibleChoice<T> = T;

/**
 * @summary Type for extensible `CHOICE` values
 * @description
 *
 * This type represents a CHOICE value that can be extended with
 * additional alternatives. It can be either the defined type `T` or
 * an ASN.1 element representing an unknown alternative.
 *
 * @template T The `CHOICE` type
 */
export type ExtensibleChoice<T> = (T | ASN1Element);

/**
 * @summary Type for decoding callback functions
 * @description
 *
 * This type defines a callback function that is invoked during the
 * parsing of `SEQUENCE` and `SET` types. It receives an ASN.1 element
 * and optionally the name of the component being processed.
 */
export type DecodingCallback = (el: ASN1Element, name?: string) => void;

/**
 * @summary Type for mapping component names to decoding callbacks
 * @description
 *
 * This type defines a record that maps component names to their
 * corresponding decoding callback functions. It is used in the
 * parsing of `SEQUENCE` and `SET` types.
 */
export type DecodingMap = Record<string, DecodingCallback>;

/**
 * @summary Create a tag validator that checks for a specific tag class and number
 * @description
 *
 * This function creates a TagValidator that returns true only when an ASN.1
 * element has the specified tag class and tag number. It is commonly used
 * for component selection in `SEQUENCE` and `SET` parsing.
 *
 * @param {ASN1TagClass} tagClass The ASN.1 tag class to match
 * @param {number} tagNumber The ASN.1 tag number to match
 * @returns {Function} A TagValidator function that checks for the specified tag
 * @function
 */
export function hasTag (tagClass: ASN1TagClass, tagNumber: number): TagValidator {
    return function (index: number, elements: ASN1Element[]): boolean {
        const el: ASN1Element = elements[index];
        return ((el.tagClass === tagClass) && (el.tagNumber === tagNumber));
    };
}

/**
 * @summary Create a tag validator that accepts any tag
 * @description
 *
 * This function is a `TagValidator` that always returns true, accepting
 * any ASN.1 element regardless of its tag class or number. It is useful
 * for components that can have any tag.
 *
 * @returns A `TagValidator` function that accepts any tag
 * @function
 */
export function hasAnyTag (): boolean {
    return true;
}

/**
 * @summary Create a tag validator that checks for a specific tag class
 * @description
 *
 * This function creates a `TagValidator` that returns true when an ASN.1
 * element has the specified tag class, regardless of the tag number.
 * It is useful for components that can have any tag number within a
 * specific tag class.
 *
 * @param {ASN1TagClass} tagClass The ASN.1 tag class to match
 * @returns {Function} A `TagValidator` function that checks for the specified tag class
 * @function
 */
export function hasTagClass (tagClass: ASN1TagClass): TagValidator {
    return function (index: number, elements: ASN1Element[]): boolean {
        return (elements[index].tagClass === tagClass);
    };
}

/**
 * @summary Create a tag validator that checks for tag numbers in a list
 * @description
 *
 * This function creates a `TagValidator` that returns true when an ASN.1
 * element has a tag number that matches any of the numbers in the provided
 * array. It is useful for components that can have multiple valid tag numbers.
 *
 * @param {number[]} tagNumbers An array of valid tag numbers
 * @returns {Function} A `TagValidator` function that checks for the specified tag numbers
 * @function
 */
export function hasTagNumberIn (tagNumbers: number[]): TagValidator {
    return function (index: number, elements: ASN1Element[]): boolean {
        return tagNumbers.some((tn: number): boolean => tn === elements[index].tagNumber);
    };
}

/**
 * @summary Create a tag validator that combines multiple validators with AND logic
 * @description
 *
 * This function creates a `TagValidator` that returns true only when all of the
 * provided tag validators return true. It implements logical AND behavior for
 * combining multiple tag validation criteria.
 *
 * @param {Function[]} fns An array of `TagValidator` functions to combine
 * @returns {Function} A `TagValidator` function that requires all conditions to be met
 * @function
 */
export function and (...fns: TagValidator[]): TagValidator {
    return function (index: number, elements: ASN1Element[]): boolean {
        return fns.every((fn) => fn(index, elements));
    };
}

/**
 * @summary Create a tag validator that combines multiple validators with OR logic
 * @description
 *
 * This function creates a `TagValidator` that returns true when any of the
 * provided tag validators return true. It implements logical OR behavior for
 * combining multiple tag validation criteria.
 *
 * @param {Function[]} fns An array of `TagValidator` functions to combine
 * @returns {Function} A `TagValidator` function that requires any condition to be met
 * @function
 */
export function or (...fns: TagValidator[]): TagValidator {
    return function (index: number, elements: ASN1Element[]): boolean {
        return fns.some((fn) => fn(index, elements));
    };
}

/**
 * @summary Create a tag validator that negates another validator
 * @description
 *
 * This function creates a `TagValidator` that returns the opposite of what
 * the provided validator returns. It implements logical NOT behavior for
 * tag validation.
 *
 * @param {Function} fn The `TagValidator` function to negate
 * @returns {Function} A `TagValidator` function that returns the opposite result
 * @function
 */
export function not (fn: TagValidator): TagValidator {
    return function (index: number, elements: ASN1Element[]): boolean {
        return !fn(index, elements);
    };
}

/**
 * @summary Convert an ASN.1 tag class to its string representation
 * @description
 *
 * This function converts an ASN.1 tag class enum value to its corresponding
 * string name. It is useful for error messages and debugging purposes.
 *
 * @param tagClass The ASN.1 tag class to convert
 * @returns The string name of the tag class
 * @function
 */
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

/**
 * @summary Deeply compares two values of any data type.
 * @description
 *
 * This function performs a deep comparison of two values, handling various
 * data types including primitives, objects, arrays, and BigInt values.
 * It uses `JSON.stringify()` for object comparison and special handling for
 * BigInt values since they cannot be serialized to JSON.
 *
 * @param value1 The first value to compare
 * @param value2 The second value to compare
 * @returns `true` if the two values are equal, `false` otherwise
 * @function
 */
export function deepEq (value1: unknown, value2: unknown): boolean {
    try {
        if (value1 === value2) {
            return true;
        }
        if ( // Because BigInt can't be converted to JSON.
            ((typeof value1 === "bigint") || (typeof value1 === "number"))
            && ((typeof value2 === "bigint") || (typeof value2 === "number"))
        ) {
            return (BigInt(value1) === BigInt(value2));
        }
        // This is imperfect, but it will work 95% of the time.
        return (JSON.stringify(value1) === JSON.stringify(value2));
    } catch {
        return false;
    }
}

/**
 * @summary Create a function that checks if a value equals a default value
 * @description
 *
 * This function creates a predicate function that checks whether an actual
 * value equals a specified `DEFAULT` value using deep equality comparison.
 * It is useful for determining if optional components should be omitted
 * from ASN.1 encoding.
 *
 * @param defaultValue The default value to compare against
 * @returns A function that returns true if the actual value equals the default
 * @function
 */
export function isDefault (defaultValue: any): (actualValue: any) => boolean {
    return function (actualValue: any): boolean {
        return deepEq(defaultValue, actualValue);
    };
}

/**
 * @summary Check if a value is present (not undefined)
 * @description
 *
 * This function checks whether a value is present by comparing it against
 * `undefined`, which is used for absent components.
 *
 * @param value The value to check for presence
 * @returns `true` if the value is not undefined, `false` otherwise
 * @function
 */
export function present (value: any): boolean {
    return (value !== undefined);
}

// TAGGING CODECS

/**
 * @summary Create an explicit tagging encoder
 * @description
 *
 * This function creates an encoder that applies explicit tagging to ASN.1
 * elements. Explicit tagging wraps the encoded value in a constructed
 * element with the specified tag class and number.
 *
 * @param {ASN1TagClass | undefined} class_ The ASN.1 tag class to apply (optional)
 * @param {number | undefined} tag The ASN.1 tag number to apply (optional)
 * @param {Function} encoderGetter A function that returns the encoder for the inner value
 * @param {Function} outer A function that generates a new ASN.1 element
 *
 * @returns {Function} An encoder function that applies explicit tagging
 * @function
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

/**
 * @summary Create an explicit tagging decoder
 * @description
 *
 * This function creates a decoder that handles explicit tagging by
 * extracting the inner element and applying the provided decoder to it.
 *
 * @param {Function} decoderGetter A function that returns the decoder for the inner value
 * @returns {Function} A decoder function that handles explicit tagging
 * @function
 */
export function _decode_explicit<T> (decoderGetter: () => (el: ASN1Element) => T): ASN1Decoder<T> {
    return (el: ASN1Element) => decoderGetter()(el.inner);
}

/**
 * @summary Create an implicit tagging encoder
 * @description
 *
 * This function creates an encoder that applies implicit tagging to ASN.1
 * elements. Implicit tagging changes the tag class and number of the
 * encoded value without wrapping it in a constructed element.
 *
 * @param {ASN1TagClass | undefined} class_ The ASN.1 tag class to apply (optional)
 * @param {number | undefined} tag The ASN.1 tag number to apply (optional)
 * @param {Function} encoderGetter A function that returns the encoder for the value
 * @param {Function} _ This parameter needs to remain for compatibility
 * @returns {Function} An encoder function that applies implicit tagging
 * @function
 */
export function _encode_implicit (
    class_: ASN1TagClass | undefined,
    tag: number | undefined,
    encoderGetter: () => ASN1Encoder<any>,
    _:  ASN1Encoder<any>,
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

/**
 * @summary Create an implicit tagging decoder
 * @description
 *
 * This function creates a decoder that handles implicit tagging by
 * applying the provided decoder directly to the element.
 *
 * @param {Function} decoderGetter A function that returns the decoder for the value
 * @returns {Function} A decoder function that handles implicit tagging
 * @function
 */
export function _decode_implicit<T> (decoderGetter: () => (el: ASN1Element) => T): ASN1Decoder<T> {
    return (el: ASN1Element) => decoderGetter()(el);
}

/**
 * @summary Set the tag class of an ASN.1 element
 * @description
 *
 * This function creates an ASN.1 element using the provided encoder getter
 * and sets its tag class to the specified value.
 *
 * @param {ASN1TagClass} class_ The ASN.1 tag class to set
 * @param {Function} encoderGetter A function that returns an ASN.1 element
 * @returns {ASN1Element} An ASN.1 element with the specified tag class
 * @function
 */
export function _tagClass (class_: ASN1TagClass, encoderGetter: () => () => ASN1Element): ASN1Element {
    const el = encoderGetter()();
    el.tagClass = class_;
    return el;
}

/**
 * @summary Set the construction type of an ASN.1 element
 * @description
 *
 * This function creates an ASN.1 element using the provided encoder getter
 * and sets its construction type to the specified value.
 *
 * @param {ASN1Construction} con The ASN.1 construction type to set
 * @param {Function} encoderGetter A function that returns an ASN.1 element
 * @returns {ASN1Element} An ASN.1 element with the specified construction type
 * @function
 */
export function _construction (con: ASN1Construction, encoderGetter: () => () => ASN1Element): ASN1Element {
    const el = encoderGetter()();
    el.construction = con;
    return el;
}

/**
 * @summary Set the tag number of an ASN.1 element
 * @description
 *
 * This function creates an ASN.1 element using the provided encoder getter
 * and sets its tag number to the specified value.
 *
 * @param {number} tag The ASN.1 tag number to set
 * @param {Function} encoderGetter A function that returns an ASN.1 element
 * @returns {ASN1Element} An ASN.1 element with the specified tag number
 * @function
 */
export function _tagNumber (tag: number, encoderGetter: () => () => ASN1Element): ASN1Element {
    const el = encoderGetter()();
    el.tagNumber = tag;
    return el;
}

// ENCODING RULE MACROS

/**
 * @summary BER (Basic Encoding Rules) element getter
 * @description
 *
 * This constant provides a function that creates new BER (Basic Encoding Rules)
 * ASN.1 elements.
 *
 * @constant
 */
export const BER: ASN1Encoder<any> = (): ASN1Element => new BERElement();

/**
 * @summary CER (Canonical Encoding Rules) element getter
 * @description
 *
 * This constant provides a function that creates new CER (Canonical Encoding Rules)
 * ASN.1 elements.
 *
 * @constant
 */
export const CER: ASN1Encoder<any> = (): ASN1Element => new CERElement();

/**
 * @summary DER (Distinguished Encoding Rules) element getter
 * @description
 *
 * This constant provides a function that creates new DER (Distinguished Encoding Rules)
 * ASN.1 elements.
 *
 * @constant
 */
export const DER: ASN1Encoder<any> = (): ASN1Element => new DERElement();

// PRIMITIVE UNIVERSAL ENCODERS

/**
 * @summary Encode a `BIT STRING` value to an ASN.1 element
 * @param {Uint8ClampedArray} value The `BIT STRING` value to encode
 * @param {Function} elGetter A function that creates a new ASN.1 element
 * @returns {ASN1Element} An ASN.1 element containing the encoded `BIT STRING`
 * @function
 */
export const _encodeBitString: ASN1Encoder<BIT_STRING> = (
    value: BIT_STRING,
    elGetter: ASN1Encoder<BIT_STRING>
) => {
    const el: ASN1Element = elGetter(value, elGetter);
    el.bitString = value;
    el.tagClass = ASN1TagClass.universal;
    el.tagNumber = ASN1UniversalType.bitString;
    return el;
}

/**
 * @summary Decode a `BIT STRING` value from an ASN.1 element
 * @param {ASN1Element} el The ASN.1 element containing the `BIT STRING`
 * @returns {Uint8ClampedArray} The decoded `BIT STRING` value
 * @function
 */
export const _decodeBitString: ASN1Decoder<BIT_STRING>
= (el: ASN1Element): BIT_STRING => {
    return el.bitString;
}

/**
 * @summary Encode a `BOOLEAN` value to an ASN.1 element
 * @param value The `BOOLEAN` value to encode
 * @param elGetter A function that creates a new ASN.1 element
 * @returns An ASN.1 element containing the encoded `BOOLEAN`
 * @function
 */
export const _encodeBoolean: ASN1Encoder<BOOLEAN>
= (value: BOOLEAN, elGetter: ASN1Encoder<BOOLEAN>) => {
    const el: ASN1Element = elGetter(value, elGetter);
    el.boolean = value;
    el.tagClass = ASN1TagClass.universal;
    el.tagNumber = ASN1UniversalType.boolean;
    return el;
}

/**
 * @summary Decode a `BOOLEAN` value from an ASN.1 element
 * @param el The ASN.1 element containing the `BOOLEAN`
 * @returns The decoded `BOOLEAN` value
 * @function
 */
export const _decodeBoolean: ASN1Decoder<BOOLEAN>
= (el: ASN1Element): BOOLEAN => {
    return el.boolean;
}

/**
 * @summary Encode an `UnrestrictedCharacterString` value to an ASN.1 element
 * @param value The `UnrestrictedCharacterString` value to encode
 * @param elGetter A function that creates a new ASN.1 element
 * @returns An ASN.1 element containing the encoded `UnrestrictedCharacterString`
 * @function
 */
export const _encodeUnrestrictedCharacterString: ASN1Encoder<CharacterString>
= (value: CharacterString, elGetter: ASN1Encoder<CharacterString>) => {
    const el: ASN1Element = elGetter(value, elGetter);
    el.characterString = value;
    el.tagClass = ASN1TagClass.universal;
    el.tagNumber = ASN1UniversalType.characterString;
    return el;
}

/**
 * @summary Decode an `UnrestrictedCharacterString` value from an ASN.1 element
 * @param el The ASN.1 element containing the `UnrestrictedCharacterString`
 * @returns The decoded `UnrestrictedCharacterString` value
 * @function
 */
export const _decodeUnrestrictedCharacterString: ASN1Decoder<CharacterString>
= (el: ASN1Element): CharacterString => {
    return el.characterString;
}

/**
 * @summary Encode a `DATE` value to an ASN.1 element
 * @param value The `DATE` value to encode
 * @param elGetter A function that creates a new ASN.1 element
 * @returns An ASN.1 element containing the encoded `DATE`
 * @function
 */
export const _encodeDate: ASN1Encoder<DATE>
= (value: DATE, elGetter: ASN1Encoder<DATE>) => {
    const el: ASN1Element = elGetter(value, elGetter);
    el.date = value;
    el.tagClass = ASN1TagClass.universal;
    el.tagNumber = ASN1UniversalType.date;
    return el;
}

/**
 * @summary Decode a `DATE` value from an ASN.1 element
 * @param el The ASN.1 element containing the `DATE`
 * @returns The decoded `DATE` value
 * @function
 */
export const _decodeDate: ASN1Decoder<DATE> = (el: ASN1Element): DATE => {
    return el.date;
}

/**
 * @summary Encode a `DATE-TIME` value to an ASN.1 element
 * @param value The `DATE-TIME` value to encode
 * @param elGetter A function that creates a new ASN.1 element
 * @returns An ASN.1 element containing the encoded `DATE-TIME`
 * @function
 */
export const _encodeDateTime: ASN1Encoder<DATE_TIME>
= (value: DATE_TIME, elGetter: ASN1Encoder<DATE_TIME>) => {
    const el: ASN1Element = elGetter(value, elGetter);
    el.dateTime = value;
    el.tagClass = ASN1TagClass.universal;
    el.tagNumber = ASN1UniversalType.dateTime;
    return el;
}

/**
 * @summary Decode a `DATE-TIME` value from an ASN.1 element
 * @param el The ASN.1 element containing the `DATE-TIME`
 * @returns The decoded `DATE-TIME` value
 * @function
 */
export const _decodeDateTime: ASN1Decoder<DATE_TIME> = (el: ASN1Element): DATE_TIME => {
    return el.dateTime;
}

/**
 * @summary Encode a `DURATION` value to an ASN.1 element
 * @param value The `DURATION` value to encode
 * @param elGetter A function that creates a new ASN.1 element
 * @returns An ASN.1 element containing the encoded `DURATION`
 * @function
 */
export const _encodeDuration: ASN1Encoder<DURATION>
= (value: DURATION, elGetter: ASN1Encoder<DURATION>) => {
    const el: ASN1Element = elGetter(value, elGetter);
    el.duration = value;
    el.tagClass = ASN1TagClass.universal;
    el.tagNumber = ASN1UniversalType.duration;
    return el;
}

/**
 * @summary Decode a `DURATION` value from an ASN.1 element
 * @param el The ASN.1 element containing the `DURATION`
 * @returns The decoded `DURATION` value
 * @function
 */
export const _decodeDuration: ASN1Decoder<DURATION> = (el: ASN1Element): DURATION => {
    return el.duration;
}

/**
 * @summary Encode an `EMBEDDED PDV` value to an ASN.1 element
 * @param value The `EMBEDDED PDV` value to encode
 * @param elGetter A function that creates a new ASN.1 element
 * @returns An ASN.1 element containing the encoded `EMBEDDED PDV`
 * @function
 */
export const _encodeEmbeddedPDV: ASN1Encoder<EMBEDDED_PDV>
= (value: EMBEDDED_PDV, elGetter: ASN1Encoder<EMBEDDED_PDV>) => {
    const el: ASN1Element = elGetter(value, elGetter);
    el.embeddedPDV = value;
    el.tagClass = ASN1TagClass.universal;
    el.tagNumber = ASN1UniversalType.embeddedPDV;
    return el;
}

/**
 * @summary Decode an `EMBEDDED PDV` value from an ASN.1 element
 * @param el The ASN.1 element containing the `EMBEDDED PDV`
 * @returns The decoded `EMBEDDED PDV` value
 * @function
 */
export const _decodeEmbeddedPDV: ASN1Decoder<EMBEDDED_PDV> = (el: ASN1Element): EMBEDDED_PDV => {
    return el.embeddedPDV;
}

/**
 * @summary Encode an `ENUMERATED` value to an ASN.1 element
 * @param value The `ENUMERATED` value to encode
 * @param elGetter A function that creates a new ASN.1 element
 * @returns An ASN.1 element containing the encoded `ENUMERATED`
 * @function
 */
export const _encodeEnumerated: ASN1Encoder<ENUMERATED>
= (value: ENUMERATED, elGetter: ASN1Encoder<ENUMERATED>) => {
    const el: ASN1Element = elGetter(value, elGetter);
    el.enumerated = value;
    el.tagClass = ASN1TagClass.universal;
    el.tagNumber = ASN1UniversalType.enumerated;
    return el;
}

/**
 * @summary Decode an `ENUMERATED` value from an ASN.1 element
 * @param el The ASN.1 element containing the `ENUMERATED`
 * @returns The decoded `ENUMERATED` value
 * @function
 */
export const _decodeEnumerated: ASN1Decoder<ENUMERATED> = (el: ASN1Element): ENUMERATED => {
    return el.enumerated;
}

/**
 * @summary Encode an `EXTERNAL` value to an ASN.1 element
 * @param value The `EXTERNAL` value to encode
 * @param elGetter A function that creates a new ASN.1 element
 * @returns An ASN.1 element containing the encoded `EXTERNAL`
 * @function
 */
export const _encodeExternal: ASN1Encoder<EXTERNAL>
= (value: EXTERNAL, elGetter: ASN1Encoder<EXTERNAL>) => {
    const el: ASN1Element = elGetter(value, elGetter);
    el.external = value;
    el.tagClass = ASN1TagClass.universal;
    el.tagNumber = ASN1UniversalType.external;
    return el;
}

/**
 * @summary Decode an `EXTERNAL` value from an ASN.1 element
 * @param el The ASN.1 element containing the `EXTERNAL`
 * @returns The decoded `EXTERNAL` value
 * @function
 */
export const _decodeExternal: ASN1Decoder<EXTERNAL> = (el: ASN1Element): EXTERNAL => {
    return el.external;
}

/**
 * @summary Encode an `INSTANCE OF` value to an ASN.1 element
 * @param value The `INSTANCE OF` value to encode
 * @param elGetter A function that creates a new ASN.1 element
 * @returns An ASN.1 element containing the encoded `INSTANCE OF`
 * @function
 */
export const _encodeInstanceOf: ASN1Encoder<INSTANCE_OF> = (value: INSTANCE_OF, elGetter: ASN1Encoder<INSTANCE_OF>) => {
    const el: ASN1Element = elGetter(value, elGetter);
    el.external = value;
    el.tagClass = ASN1TagClass.universal;
    el.tagNumber = ASN1UniversalType.external;
    return el;
}

/**
 * @summary Decode an `INSTANCE OF` value from an ASN.1 element
 * @param el The ASN.1 element containing the `INSTANCE OF`
 * @returns The decoded `INSTANCE OF` value
 * @function
 */
export const _decodeInstanceOf: ASN1Decoder<INSTANCE_OF> = (el: ASN1Element): INSTANCE_OF => {
    return el.external;
}

/**
 * @summary Encode an `INTEGER` value to an ASN.1 element
 * @param value The `INTEGER` value to encode
 * @param elGetter A function that creates a new ASN.1 element
 * @returns An ASN.1 element containing the encoded `INTEGER`
 * @function
 */
export const _encodeInteger: ASN1Encoder<INTEGER>
= (value: INTEGER, elGetter: ASN1Encoder<INTEGER>) => {
    const el: ASN1Element = elGetter(value, elGetter);
    el.integer = value;
    el.tagClass = ASN1TagClass.universal;
    el.tagNumber = ASN1UniversalType.integer;
    return el;
}

/**
 * @summary Decode an `INTEGER` value from an ASN.1 element
 * @param el The ASN.1 element containing the `INTEGER`
 * @returns The decoded `INTEGER` value
 * @function
 */
export const _decodeInteger: ASN1Decoder<INTEGER> = (el: ASN1Element): INTEGER => {
    return el.integer;
}

/**
 * @summary Encode an `OID-IRI` value to an ASN.1 element
 * @param value The `OID-IRI` value to encode
 * @param elGetter A function that creates a new ASN.1 element
 * @returns An ASN.1 element containing the encoded `OID-IRI`
 * @function
 */
export const _encodeIRI: ASN1Encoder<OID_IRI>
= (value: OID_IRI, elGetter: ASN1Encoder<OID_IRI>) => {
    const el: ASN1Element = elGetter(value, elGetter);
    el.oidIRI = value;
    el.tagClass = ASN1TagClass.universal;
    el.tagNumber = ASN1UniversalType.oidIRI;
    return el;
}

/**
 * @summary Decode an `OID-IRI` value from an ASN.1 element
 * @param el The ASN.1 element containing the `OID-IRI`
 * @returns The decoded `OID-IRI` value
 * @function
 */
export const _decodeIRI: ASN1Decoder<OID_IRI> = (el: ASN1Element): OID_IRI => {
    return el.oidIRI;
}

/**
 * @summary Encode a `NULL` value to an ASN.1 element
 * @param value The `NULL` value to encode
 * @param elGetter A function that creates a new ASN.1 element
 * @returns An ASN.1 element containing the encoded `NULL`
 * @function
 */
export const _encodeNull: ASN1Encoder<NULL>
= (value: NULL, elGetter: ASN1Encoder<NULL>) => {
    const el: ASN1Element = elGetter(value, elGetter);
    el.value = new Uint8Array(0);
    el.tagClass = ASN1TagClass.universal;
    el.tagNumber = ASN1UniversalType.nill;
    return el;
}

/**
 * @summary Decode a `NULL` value from an ASN.1 element
 * @returns `null`
 * @function
 */
export const _decodeNull: ASN1Decoder<NULL> = (): NULL => {
    return null;
}

/**
 * @summary Encode an `OBJECT IDENTIFIER` value to an ASN.1 element
 * @param value The `OBJECT IDENTIFIER` value to encode
 * @param elGetter A function that creates a new ASN.1 element
 * @returns An ASN.1 element containing the encoded `OBJECT IDENTIFIER`
 * @function
 */
export const _encodeObjectIdentifier: ASN1Encoder<OBJECT_IDENTIFIER>
= (value: OBJECT_IDENTIFIER, elGetter: ASN1Encoder<OBJECT_IDENTIFIER>) => {
    const el: ASN1Element = elGetter(value, elGetter);
    el.objectIdentifier = value;
    el.tagClass = ASN1TagClass.universal;
    el.tagNumber = ASN1UniversalType.objectIdentifier;
    return el;
}

/**
 * @summary Decode an `OBJECT IDENTIFIER` value from an ASN.1 element
 * @param el The ASN.1 element containing the `OBJECT IDENTIFIER`
 * @returns The decoded `OBJECT IDENTIFIER` value
 * @function
 */
export const _decodeObjectIdentifier: ASN1Decoder<OBJECT_IDENTIFIER> = (el: ASN1Element): OBJECT_IDENTIFIER => {
    return el.objectIdentifier;
}

/**
 * @summary Encode an `OCTET STRING` value to an ASN.1 element
 * @description
 * Encodes an `OCTET STRING` value into an ASN.1 element with the universal tag class and octetString tag number.
 * @param value The `OCTET STRING` value to encode
 * @param elGetter A function that creates a new ASN.1 element
 * @returns An ASN.1 element containing the encoded `OCTET STRING`
 * @function
 */
export const _encodeOctetString: ASN1Encoder<OCTET_STRING>
= (value: OCTET_STRING, elGetter: ASN1Encoder<OCTET_STRING>) => {
    const el: ASN1Element = elGetter(value, elGetter);
    el.octetString = value;
    el.tagClass = ASN1TagClass.universal;
    el.tagNumber = ASN1UniversalType.octetString;
    return el;
}

/**
 * @summary Decode an `OCTET STRING` value from an ASN.1 element
 * @description
 * Extracts an `OCTET STRING` value from an ASN.1 element.
 * @param el The ASN.1 element containing the `OCTET STRING`
 * @returns The decoded `OCTET STRING` value
 * @function
 */
export const _decodeOctetString: ASN1Decoder<OCTET_STRING> = (el: ASN1Element): OCTET_STRING => {
    return el.octetString;
}

/**
 * @summary Encode a `REAL` value to an ASN.1 element
 * @param value The `REAL` value to encode
 * @param elGetter A function that creates a new ASN.1 element
 * @returns An ASN.1 element containing the encoded `REAL`
 * @function
 */
export const _encodeReal: ASN1Encoder<REAL>
= (value: REAL, elGetter: ASN1Encoder<REAL>) => {
    const el: ASN1Element = elGetter(value, elGetter);
    el.real = value;
    el.tagClass = ASN1TagClass.universal;
    el.tagNumber = ASN1UniversalType.realNumber;
    return el;
}

/**
 * @summary Decode a `REAL` value from an ASN.1 element
 * @param el The ASN.1 element containing the `REAL`
 * @returns The decoded `REAL` value
 * @function
 */
export const _decodeReal: ASN1Decoder<REAL> = (el: ASN1Element): REAL => {
    return el.real;
}

/**
 * @summary Encode a `RELATIVE-OID-IRI` value to an ASN.1 element
 * @param value The `RELATIVE-OID-IRI` value to encode
 * @param elGetter A function that creates a new ASN.1 element
 * @returns An ASN.1 element containing the encoded `RELATIVE-OID-IRI`
 * @function
 */
export const _encodeRelativeIRI: ASN1Encoder<RELATIVE_OID_IRI>
= (value: RELATIVE_OID_IRI, elGetter: ASN1Encoder<RELATIVE_OID_IRI>) => {
    const el: ASN1Element = elGetter(value, elGetter);
    el.relativeOIDIRI = value;
    el.tagClass = ASN1TagClass.universal;
    el.tagNumber = ASN1UniversalType.roidIRI;
    return el;
}

/**
 * @summary Decode a `RELATIVE-OID-IRI` value from an ASN.1 element
 * @param el The ASN.1 element containing the `RELATIVE-OID-IRI`
 * @returns The decoded `RELATIVE-OID-IRI` value
 * @function
 */
export const _decodeRelativeIRI: ASN1Decoder<RELATIVE_OID_IRI> = (el: ASN1Element): RELATIVE_OID_IRI => {
    return el.relativeOIDIRI;
}

/**
 * @summary Encode a `RELATIVE-OID` value to an ASN.1 element
 * @param value The `RELATIVE-OID` value to encode
 * @param elGetter A function that creates a new ASN.1 element
 * @returns An ASN.1 element containing the encoded `RELATIVE-OID`
 * @function
 */
export const _encodeRelativeOID: ASN1Encoder<RELATIVE_OID>
= (value: RELATIVE_OID, elGetter: ASN1Encoder<RELATIVE_OID>) => {
    const el: ASN1Element = elGetter(value, elGetter);
    el.relativeObjectIdentifier = value;
    el.tagClass = ASN1TagClass.universal;
    el.tagNumber = ASN1UniversalType.relativeOID;
    return el;
}

/**
 * @summary Decode a `RELATIVE-OID` value from an ASN.1 element
 * @param el The ASN.1 element containing the `RELATIVE-OID`
 * @returns The decoded `RELATIVE-OID` value
 * @function
 */
export const _decodeRelativeOID: ASN1Decoder<RELATIVE_OID> = (el: ASN1Element): RELATIVE_OID => {
    return el.relativeObjectIdentifier;
}

/**
 * @summary Encode a `SEQUENCE` value to an ASN.1 element
 * @param value The `SEQUENCE` value to encode
 * @param elGetter A function that creates a new ASN.1 element
 * @returns An ASN.1 element containing the encoded `SEQUENCE`
 * @function
 */
export const _encodeSequence: ASN1Encoder<SEQUENCE<ASN1Element>>
= (value: SEQUENCE<ASN1Element>, elGetter: ASN1Encoder<SEQUENCE<ASN1Element>>) => {
    const el: ASN1Element = elGetter(value, elGetter);
    el.sequence = value;
    el.tagClass = ASN1TagClass.universal;
    el.tagNumber = ASN1UniversalType.sequence;
    return el;
}

/**
 * @summary Decode a `SEQUENCE` value from an ASN.1 element
 * @param el The ASN.1 element containing the `SEQUENCE`
 * @returns The decoded `SEQUENCE` value
 * @function
 */
export const _decodeSequence: ASN1Decoder<SEQUENCE<ASN1Element>> = (el: ASN1Element): SEQUENCE<ASN1Element> => {
    return el.sequence;
}

/**
 * @summary Encode a `SET` value to an ASN.1 element
 * @param value The `SET` value to encode
 * @param elGetter A function that creates a new ASN.1 element
 * @returns An ASN.1 element containing the encoded `SET`
 * @function
 */
export const _encodeSet: ASN1Encoder<SET<ASN1Element>>
= (value: SET<ASN1Element>, elGetter: ASN1Encoder<SET<ASN1Element>>) => {
    const el: ASN1Element = elGetter(value, elGetter);
    el.set = value;
    el.tagClass = ASN1TagClass.universal;
    el.tagNumber = ASN1UniversalType.set;
    return el;
}

/**
 * @summary Decode a `SET` value from an ASN.1 element
 * @param el The ASN.1 element containing the `SET`
 * @returns The decoded `SET` value
 * @function
 */
export const _decodeSet: ASN1Decoder<SET<ASN1Element>> = (el: ASN1Element): SET<ASN1Element> => {
    return el.set;
}

/**
 * @summary Encode a `TIME` value to an ASN.1 element
 * @param value The `TIME` value to encode
 * @param elGetter A function that creates a new ASN.1 element
 * @returns An ASN.1 element containing the encoded `TIME`
 * @function
 */
export const _encodeTime: ASN1Encoder<TIME>
= (value: TIME, elGetter: ASN1Encoder<TIME>) => {
    const el: ASN1Element = elGetter(value, elGetter);
    el.time = value;
    el.tagClass = ASN1TagClass.universal;
    el.tagNumber = ASN1UniversalType.time;
    return el;
}

/**
 * @summary Decode a `TIME` value from an ASN.1 element
 * @param el The ASN.1 element containing the `TIME`
 * @returns The decoded `TIME` value
 * @function
 */
export const _decodeTime: ASN1Decoder<TIME> = (el: ASN1Element): TIME => {
    return el.time;
}

/**
 * @summary Encode a `TIME-OF-DAY` value to an ASN.1 element
 * @param value The `TIME-OF-DAY` value to encode
 * @param elGetter A function that creates a new ASN.1 element
 * @returns An ASN.1 element containing the encoded `TIME-OF-DAY`
 * @function
 */
export const _encodeTimeOfDay: ASN1Encoder<TIME_OF_DAY>
= (value: TIME_OF_DAY, elGetter: ASN1Encoder<TIME_OF_DAY>) => {
    const el: ASN1Element = elGetter(value, elGetter);
    el.timeOfDay = value;
    el.tagClass = ASN1TagClass.universal;
    el.tagNumber = ASN1UniversalType.timeOfDay;
    return el;
}

/**
 * @summary Decode a `TIME-OF-DAY` value from an ASN.1 element
 * @description
 * Extracts a `TIME-OF-DAY` value from an ASN.1 element.
 * @param el The ASN.1 element containing the `TIME-OF-DAY`
 * @returns The decoded `TIME-OF-DAY` value
 * @function
 */
export const _decodeTimeOfDay: ASN1Decoder<TIME_OF_DAY> = (el: ASN1Element): TIME_OF_DAY => {
    return el.timeOfDay;
}

/**
 * @summary Encode a `BMPString` value to an ASN.1 element
 * @param value The `BMPString` value to encode
 * @param elGetter A function that creates a new ASN.1 element
 * @returns An ASN.1 element containing the encoded `BMPString`
 * @function
 */
export const _encodeBMPString: ASN1Encoder<BMPString>
= (value: BMPString, elGetter: ASN1Encoder<BMPString>) => {
    const el: ASN1Element = elGetter(value, elGetter);
    el.bmpString = value;
    el.tagClass = ASN1TagClass.universal;
    el.tagNumber = ASN1UniversalType.bmpString;
    return el;
}

/**
 * @summary Decode a `BMPString` value from an ASN.1 element
 * @param el The ASN.1 element containing the `BMPString`
 * @returns The decoded `BMPString` value
 * @function
 */
export const _decodeBMPString: ASN1Decoder<BMPString> = (el: ASN1Element): BMPString => {
    return el.bmpString;
}

/**
 * @summary Encode a `GeneralString` value to an ASN.1 element
 * @param value The `GeneralString` value to encode
 * @param elGetter A function that creates a new ASN.1 element
 * @returns An ASN.1 element containing the encoded `GeneralString`
 * @function
 */
export const _encodeGeneralString: ASN1Encoder<GeneralString>
= (value: GeneralString, elGetter: ASN1Encoder<GeneralString>) => {
    const el: ASN1Element = elGetter(value, elGetter);
    el.generalString = value;
    el.tagClass = ASN1TagClass.universal;
    el.tagNumber = ASN1UniversalType.generalString;
    return el;
}

/**
 * @summary Decode a `GeneralString` value from an ASN.1 element
 * @param el The ASN.1 element containing the `GeneralString`
 * @returns The decoded `GeneralString` value
 * @function
 */
export const _decodeGeneralString: ASN1Decoder<GeneralString> = (el: ASN1Element): GeneralString => {
    return el.generalString;
}

/**
 * @summary Encode a `GraphicString` value to an ASN.1 element
 * @param value The `GraphicString` value to encode
 * @param elGetter A function that creates a new ASN.1 element
 * @returns An ASN.1 element containing the encoded `GraphicString`
 * @function
 */
export const _encodeGraphicString: ASN1Encoder<GraphicString>
= (value: GraphicString, elGetter: ASN1Encoder<GraphicString>) => {
    const el: ASN1Element = elGetter(value, elGetter);
    el.graphicString = value;
    el.tagClass = ASN1TagClass.universal;
    el.tagNumber = ASN1UniversalType.graphicString;
    return el;
}

/**
 * @summary Decode a `GraphicString` value from an ASN.1 element
 * @param el The ASN.1 element containing the `GraphicString`
 * @returns The decoded `GraphicString` value
 * @function
 */
export const _decodeGraphicString: ASN1Decoder<GraphicString> = (el: ASN1Element): GraphicString => {
    return el.graphicString;
}

/**
 * @summary Encode an `IA5String` value to an ASN.1 element
 * @param value The `IA5String` value to encode
 * @param elGetter A function that creates a new ASN.1 element
 * @returns An ASN.1 element containing the encoded `IA5String`
 * @function
 */
export const _encodeIA5String: ASN1Encoder<IA5String>
= (value: IA5String, elGetter: ASN1Encoder<IA5String>) => {
    const el: ASN1Element = elGetter(value, elGetter);
    el.ia5String = value;
    el.tagClass = ASN1TagClass.universal;
    el.tagNumber = ASN1UniversalType.ia5String;
    return el;
}

/**
 * @summary Decode an `IA5String` value from an ASN.1 element
 * @param el The ASN.1 element containing the `IA5String`
 * @returns The decoded `IA5String` value
 * @function
 */
export const _decodeIA5String: ASN1Decoder<IA5String>
= (el: ASN1Element): IA5String => {
    return el.ia5String;
}

/**
 * @summary Encode an `ISO646String` value to an ASN.1 element
 * @param value The `ISO646String` value to encode
 * @param elGetter A function that creates a new ASN.1 element
 * @returns An ASN.1 element containing the encoded `ISO646String`
 * @function
 */
export const _encodeISO646String: ASN1Encoder<ISO646String>
= (value: ISO646String, elGetter: ASN1Encoder<ISO646String>) => {
    const el: ASN1Element = elGetter(value, elGetter);
    el.ia5String = value;
    el.tagClass = ASN1TagClass.universal;
    el.tagNumber = ASN1UniversalType.ia5String;
    return el;
}

/**
 * @summary Decode an `ISO646String` value from an ASN.1 element
 * @param el The ASN.1 element containing the `ISO646String`
 * @returns The decoded `ISO646String` value
 * @function
 */
export const _decodeISO646String: ASN1Decoder<ISO646String>
= (el: ASN1Element): ISO646String => {
    return el.ia5String;
}

/**
 * @summary Encode a `NumericString` value to an ASN.1 element
 * @param value The `NumericString` value to encode
 * @param elGetter A function that creates a new ASN.1 element
 * @returns An ASN.1 element containing the encoded `NumericString`
 * @function
 */
export const _encodeNumericString: ASN1Encoder<NumericString>
= (value: NumericString, elGetter: ASN1Encoder<NumericString>) => {
    const el: ASN1Element = elGetter(value, elGetter);
    el.numericString = value;
    el.tagClass = ASN1TagClass.universal;
    el.tagNumber = ASN1UniversalType.numericString;
    return el;
}

/**
 * @summary Decode a `NumericString` value from an ASN.1 element
 * @param el The ASN.1 element containing the `NumericString`
 * @returns The decoded `NumericString` value
 * @function
 */
export const _decodeNumericString: ASN1Decoder<NumericString>
= (el: ASN1Element): NumericString => {
    return el.numericString;
}

/**
 * @summary Encode a `PrintableString` value to an ASN.1 element
 * @param value The `PrintableString` value to encode
 * @param elGetter A function that creates a new ASN.1 element
 * @returns An ASN.1 element containing the encoded `PrintableString`
 * @function
 */
export const _encodePrintableString: ASN1Encoder<PrintableString>
= (value: PrintableString, elGetter: ASN1Encoder<PrintableString>) => {
    const el: ASN1Element = elGetter(value, elGetter);
    el.printableString = value;
    el.tagClass = ASN1TagClass.universal;
    el.tagNumber = ASN1UniversalType.printableString;
    return el;
}

/**
 * @summary Decode a `PrintableString` value from an ASN.1 element
 * @param el The ASN.1 element containing the `PrintableString`
 * @returns The decoded `PrintableString` value
 * @function
 */
export const _decodePrintableString: ASN1Decoder<PrintableString>
= (el: ASN1Element): PrintableString => {
    return el.printableString;
}

/**
 * @summary Encode a `TeletexString` value to an ASN.1 element
 * @param value The `TeletexString` value to encode
 * @param elGetter A function that creates a new ASN.1 element
 * @returns An ASN.1 element containing the encoded `TeletexString`
 * @function
 */
export const _encodeTeletexString: ASN1Encoder<TeletexString>
= (value: TeletexString, elGetter: ASN1Encoder<TeletexString>) => {
    const el: ASN1Element = elGetter(value, elGetter);
    el.teletexString = value;
    el.tagClass = ASN1TagClass.universal;
    el.tagNumber = ASN1UniversalType.teletexString;
    return el;
}

/**
 * @summary Decode a `TeletexString` value from an ASN.1 element
 * @param el The ASN.1 element containing the `TeletexString`
 * @returns The decoded `TeletexString` value
 * @function
 */
export const _decodeTeletexString: ASN1Decoder<TeletexString>
= (el: ASN1Element): TeletexString => {
    return el.teletexString;
}

/**
 * @summary Encode a `T61String` value to an ASN.1 element
 * @param value The `T61String` value to encode
 * @param elGetter A function that creates a new ASN.1 element
 * @returns An ASN.1 element containing the encoded `T61String`
 * @function
 */
export const _encodeT61String: ASN1Encoder<T61String>
= (value: T61String, elGetter: ASN1Encoder<T61String>) => {
    const el: ASN1Element = elGetter(value, elGetter);
    el.teletexString = value;
    el.tagClass = ASN1TagClass.universal;
    el.tagNumber = ASN1UniversalType.teletexString;
    return el;
}

/**
 * @summary Decode a `T61String` value from an ASN.1 element
 * @param el The ASN.1 element containing the `T61String`
 * @returns The decoded `T61String` value
 * @function
 */
export const _decodeT61String: ASN1Decoder<T61String>
= (el: ASN1Element): T61String => {
    return el.teletexString;
}

/**
 * @summary Encode a `UniversalString` value to an ASN.1 element
 * @param value The `UniversalString` value to encode
 * @param elGetter A function that creates a new ASN.1 element
 * @returns An ASN.1 element containing the encoded `UniversalString`
 * @function
 */
export const _encodeUniversalString: ASN1Encoder<UniversalString>
= (value: UniversalString, elGetter: ASN1Encoder<UniversalString>) => {
    const el: ASN1Element = elGetter(value, elGetter);
    el.universalString = value;
    el.tagClass = ASN1TagClass.universal;
    el.tagNumber = ASN1UniversalType.universalString;
    return el;
}

/**
 * @summary Decode a `UniversalString` value from an ASN.1 element
 * @param el The ASN.1 element containing the `UniversalString`
 * @returns The decoded `UniversalString` value
 * @function
 */
export const _decodeUniversalString: ASN1Decoder<UniversalString>
= (el: ASN1Element): UniversalString => {
    return el.universalString;
}

/**
 * @summary Encode a `UTF8String` value to an ASN.1 element
 * @param value The `UTF8String` value to encode
 * @param elGetter A function that creates a new ASN.1 element
 * @returns An ASN.1 element containing the encoded `UTF8String`
 * @function
 */
export const _encodeUTF8String: ASN1Encoder<UTF8String>
= (value: UTF8String, elGetter: ASN1Encoder<UTF8String>) => {
    const el: ASN1Element = elGetter(value, elGetter);
    el.utf8String = value;
    el.tagClass = ASN1TagClass.universal;
    el.tagNumber = ASN1UniversalType.utf8String;
    return el;
}

/**
 * @summary Decode a `UTF8String` value from an ASN.1 element
 * @param el The ASN.1 element containing the `UTF8String`
 * @returns The decoded `UTF8String` value
 * @function
 */
export const _decodeUTF8String: ASN1Decoder<UTF8String>
= (el: ASN1Element): UTF8String => {
    return el.utf8String;
}

/**
 * @summary Encode a `VideotexString` value to an ASN.1 element
 * @param value The `VideotexString` value to encode
 * @param elGetter A function that creates a new ASN.1 element
 * @returns An ASN.1 element containing the encoded `VideotexString`
 * @function
 */
export const _encodeVideotexString: ASN1Encoder<VideotexString>
= (value: VideotexString, elGetter: ASN1Encoder<VideotexString>) => {
    const el: ASN1Element = elGetter(value, elGetter);
    el.videotexString = value;
    el.tagClass = ASN1TagClass.universal;
    el.tagNumber = ASN1UniversalType.videotexString;
    return el;
}

/**
 * @summary Decode a `VideotexString` value from an ASN.1 element
 * @param el The ASN.1 element containing the `VideotexString`
 * @returns The decoded `VideotexString` value
 * @function
 */
export const _decodeVideotexString: ASN1Decoder<VideotexString>
= (el: ASN1Element): VideotexString => {
    return el.videotexString;
}

/**
 * @summary Encode a `VisibleString` value to an ASN.1 element
 * @param value The `VisibleString` value to encode
 * @param elGetter A function that creates a new ASN.1 element
 * @returns An ASN.1 element containing the encoded `VisibleString`
 * @function
 */
export const _encodeVisibleString: ASN1Encoder<VisibleString>
= (value: VisibleString, elGetter: ASN1Encoder<VisibleString>) => {
    const el: ASN1Element = elGetter(value, elGetter);
    el.visibleString = value;
    el.tagClass = ASN1TagClass.universal;
    el.tagNumber = ASN1UniversalType.visibleString;
    return el;
}

/**
 * @summary Decode a `VisibleString` value from an ASN.1 element
 * @param el The ASN.1 element containing the `VisibleString`
 * @returns The decoded `VisibleString` value
 * @function
 */
export const _decodeVisibleString: ASN1Decoder<VisibleString>
= (el: ASN1Element): VisibleString => {
    return el.visibleString;
}

/**
 * @summary Encode a `GeneralizedTime` value to an ASN.1 element
 * @param value The `GeneralizedTime` value to encode
 * @param elGetter A function that creates a new ASN.1 element
 * @returns An ASN.1 element containing the encoded `GeneralizedTime`
 * @function
 */
export const _encodeGeneralizedTime: ASN1Encoder<GeneralizedTime>
= (value: GeneralizedTime, elGetter: ASN1Encoder<GeneralizedTime>) => {
    const el: ASN1Element = elGetter(value, elGetter);
    el.generalizedTime = value;
    el.tagClass = ASN1TagClass.universal;
    el.tagNumber = ASN1UniversalType.generalizedTime;
    return el;
}

/**
 * @summary Decode a `GeneralizedTime` value from an ASN.1 element
 * @param el The ASN.1 element containing the `GeneralizedTime`
 * @returns The decoded `GeneralizedTime` value
 * @function
 */
export const _decodeGeneralizedTime: ASN1Decoder<GeneralizedTime>
= (el: ASN1Element): GeneralizedTime => {
    return el.generalizedTime;
}

/**
 * @summary Encode a `UTCTime` value to an ASN.1 element
 * @param value The `UTCTime` value to encode
 * @param elGetter A function that creates a new ASN.1 element
 * @returns An ASN.1 element containing the encoded `UTCTime`
 * @function
 */
export const _encodeUTCTime: ASN1Encoder<UTCTime>
= (value: UTCTime, elGetter: ASN1Encoder<UTCTime>) => {
    const el: ASN1Element = elGetter(value, elGetter);
    el.utcTime = value;
    el.tagClass = ASN1TagClass.universal;
    el.tagNumber = ASN1UniversalType.utcTime;
    return el;
}

/**
 * @summary Decode a `UTCTime` value from an ASN.1 element
 * @param el The ASN.1 element containing the `UTCTime`
 * @returns The decoded `UTCTime` value
 * @function
 */
export const _decodeUTCTime: ASN1Decoder<UTCTime>
= (el: ASN1Element): UTCTime => {
    return el.utcTime;
}

/**
 * @summary Encode an `ObjectDescriptor` value to an ASN.1 element
 * @param value The `ObjectDescriptor` value to encode
 * @param elGetter A function that creates a new ASN.1 element
 * @returns An ASN.1 element containing the encoded `ObjectDescriptor`
 * @function
 */
export const _encodeObjectDescriptor: ASN1Encoder<ObjectDescriptor>
= (value: ObjectDescriptor, elGetter: ASN1Encoder<ObjectDescriptor>) => {
    const el: ASN1Element = elGetter(value, elGetter);
    el.objectDescriptor = value;
    el.tagClass = ASN1TagClass.universal;
    el.tagNumber = ASN1UniversalType.objectDescriptor;
    return el;
}

/**
 * @summary Decode an `ObjectDescriptor` value from an ASN.1 element
 * @param el The ASN.1 element containing the `ObjectDescriptor`
 * @returns The decoded `ObjectDescriptor` value
 * @function
 */
export const _decodeObjectDescriptor: ASN1Decoder<ObjectDescriptor>
= (el: ASN1Element): ObjectDescriptor => {
    return el.objectDescriptor;
}

/**
 * @summary Encode an `ANY` value to an ASN.1 element
 * @param value The ASN.1 element to encode
 * @returns The ASN.1 element unchanged
 * @function
 */
export const _encodeAny: ASN1Encoder<ASN1Element>
= (value: ASN1Element) => {
    return value;
}

/**
 * @summary Decode an ASN.1 element as `ANY`
 * @param el The ASN.1 element
 * @returns The ASN.1 element unchanged
 * @function
 */
export const _decodeAny: ASN1Decoder<ASN1Element>
= (el: ASN1Element): ASN1Element => {
    return el;
}

// CONSTRUCTED TYPE

/**
 * @classdesc A specification for a component of a `SET` or `SEQUENCE` type.
 */
export
class ComponentSpec {
    constructor (

        /**
         * @summary The name of the component, such as `subjectPublicKeyInfo`
         * @public
         * @readonly
         */

        readonly name: string,
        /**
         * @summary Whether the component is `OPTIONAL` or `DEFAULT`ing
         * @public
         * @readonly
         */
        readonly optional: boolean,

        /**
         * @summary Selector for the tag of the component
         * @description
         *
         * Use {@link hasAnyTag} to select any tag.
         *
         * @public
         * @readonly
         */
        readonly selector: TagValidator,

        /**
         * @summary The zero-based group index, if this component appears in a group.
         * @description
         *
         * For an example of a group, see the definition of `TBSCertificate` in
         * the `AuthenticationFramework` ASN.1 module. The field
         * `subjectUniqueIdentifier` appears in group 0, and uses version number
         * 2.
         *
         * @public
         * @readonly
         */
        readonly groupIndex?: number,

        /**
         * @summary The version number of the type in which this component is defined.
         * @description
         *
         * For an example of a group, see the definition of `TBSCertificate` in
         * the `AuthenticationFramework` ASN.1 module. The field
         * `subjectUniqueIdentifier` appears in group 0, and uses version number
         * 2.
         *
         * @public
         * @readonly
         */
        readonly versionNumber?: number,
    ) {}
}

/**
 * @summary Invoke callbacks for the components of a `SET` type
 * @description
 *
 * This function invokes callbacks in the `decodingCallbacks` map for elements
 * that are recognized as components of a `SET` type. It invokes
 * `unrecognizedExtensionHandler` for all other ASN.1-encoded elements.
 *
 * The specifications for a given set are passed in as `rootComponentTypeList1`,
 * `extensionAdditionsList`, and `rootComponentTypeList2`, which correspond to
 * the ASN.1 syntax according to which structured types are defined.
 *
 * For example:
 *
 * ```asn1
 * Thingy ::= SET {
 *   thingId       OBJECT IDENTIFIER OPTIONAL,
 *   thingName     UTF8String
 * }
 * ```
 *
 * Can be parsed via:
 *
 * ```ts
 * import { OPTIONAL, OBJECT_IDENTIFIER, UTF8String, ASN1Element } from "jsr:@wildboar/asn1";
 * import * as $ from "jsr:@wildboar/asn1/functional";
 *
 * // ... el is an ASN1Element containing the `SET`
 *
 * const _rctl1_for_Thingy: $.ComponentSpec[] = [
 *     new $.ComponentSpec("thingId", true, $.hasTag(_TagClass.universal, 6)),
 *     new $.ComponentSpec("thingName", false, $.hasTag(_TagClass.universal, 12)),
 * ];
 *
 * let thingId: OPTIONAL<OBJECT_IDENTIFIER>;
 * let thingName!: UTF8String;
 * let extensions: ASN1Element[] = [];
 * const callbacks: $.DecodingMap = {
 *     thingId: (_el: ASN1Element): void => {
 *         objectClass = $._decode_explicit<OBJECT_IDENTIFIER>(() => $._decodeObjectIdentifier)(_el);
 *     },
 *     thingName: (_el: ASN1Element): void => {
 *         criteria = $._decode_explicit<UTF8String>(() => $._decodeUTF8String)(_el);
 *     },
 * };
 * const everythingElse = (ext: ASN1Element): void => { extensions.push(ext); };
 *
 * $._parse_set(el, callbacks, _rctl1_for_Thingy, [], [], everythingElse);
 * const myThingy = new Thingy(thingId, thingName, extensions);
 * ```
 *
 * @param set The ASN.1 value encoding the `SET`
 * @param {Object} decodingCallbacks A map of component names to callbacks
 * @param {ComponentSpec[]} rootComponentTypeList1 Component specifications for
 *  the Root Component Type List 1
 * @param {ComponentSpec[]} extensionAdditionsList Component specifications for
 *  the Extension Additions List
 * @param {ComponentSpec[]} rootComponentTypeList2 Component specifications for
 *  the Root Component Type List 2
 * @param {Function} unrecognizedExtensionHandler The callback to invoke with an
 *  unrecognized extension
 * @param maximumElements The maximum number of elements to parse. This is to
 *  allow for control over denial-of-service vectors.
 *
 * @function
 */
export
function _parse_set (
    set: ASN1Element,
    decodingCallbacks: DecodingMap,
    rootComponentTypeList1: ComponentSpec[],
    extensionAdditionsList: ComponentSpec[],
    rootComponentTypeList2: ComponentSpec[],
    unrecognizedExtensionHandler: DecodingCallback = () => {},
    maximumElements?: number,
): void {
    const rootComponents: ComponentSpec[] = rootComponentTypeList1.concat(rootComponentTypeList2);
    const components: ComponentSpec[] = rootComponents.concat(extensionAdditionsList);
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
        for (const e of elements) {
            const tag: string = `${e.tagClass} ${e.tagNumber}`;
            if (encounteredTags.has(tag)) {
                throw new Error(
                    `Duplicate tag '${tagClassName(e.tagClass)} ${e.tagNumber}' in SET '${set.name}'.`,
                );
            }
            encounteredTags.add(tag);
        }
    }

    /**
     * You must do this by the element name--not the tag--because an element
     * may be expressed using many different tags.
     */
    const encounteredComponents: Set<string> = new Set<string>([]);
    const encounteredExtensionGroups: Set<number> = new Set<number>([]);

    // Execute callbacks on all components.
    for (let i = 0; i < elements.length; i++) {
        const e = elements[i];
        const spec: ComponentSpec | undefined = components
            .find((cs) => cs.selector(i, elements)); // 758eb9f0-2d70-4cbf-ad19-593bfb939113
        if (!spec) {
            unrecognizedExtensionHandler(e);
            continue;
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
    }

    // Check for missing required components
    const missingRequiredComponents: string[] = rootComponents
        .filter((c) => (!c.optional && !encounteredComponents.has(c.name)))
        .map((c) => c.name);
    Array.from(encounteredExtensionGroups).forEach((exg) => {
        for (const c of extensionAdditionsList) {
            if (!(
                (c.groupIndex === exg)
                && !c.optional
                && !encounteredComponents.has(c.name)
            )) {
                continue;
            }
            missingRequiredComponents.push(c.name);
        }
    });
    if (missingRequiredComponents.length > 0) {
        throw new Error(
            `SET '${set.name}' missing these required components: ${missingRequiredComponents.join(", ")}.`,
        );
    }
}

function _parse_component_type_list (
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
function _parse_sequence_with_trailing_rctl (
    seq: ASN1Element,
    decodingCallbacks: DecodingMap,
    rootComponentTypeList1: ComponentSpec[],
    extensionAdditionsList: ComponentSpec[],
    rootComponentTypeList2: ComponentSpec[],
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
        .findIndex((_, i): boolean => possibleInitialRCTL2Components
            .some((pirctl2c): boolean => pirctl2c.selector(i, extensionsOnwards)));
    if (numberOfExtensionElements === -1) { // We did not find RCTL2.
        if (!rctl2EntirelyOptional) {
            throw new Error(`Trailing root component type list for SEQUENCE '${seq.name}' not found.`);
        }
        numberOfExtensionElements = elements.length - startOfExtensions;
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
    if (startOfRCTL2 + numberOfRCTL2ElementsRead !== elements.length) {
        throw new Error(`SEQUENCE '${seq.name}' had excess elements at the end.`);
    }
}

function _parse_sequence_without_trailing_rctl (
    seq: ASN1Element,
    decodingCallbacks: DecodingMap,
    rootComponentTypeList1: ComponentSpec[],
    extensionAdditionsList: ComponentSpec[],
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
 * @summary Invoke callbacks for the components of a `SEQUENCE` type
 * @description
 *
 * This function invokes callbacks in the `decodingCallbacks` map for elements
 * that are recognized as components of a `SEQUENCE` type. It invokes
 * `unrecognizedExtensionHandler` for all other ASN.1-encoded elements.
 *
 * The specifications for a given set are passed in as `rootComponentTypeList1`,
 * `extensionAdditionsList`, and `rootComponentTypeList2`, which correspond to
 * the ASN.1 syntax according to which structured types are defined.
 *
 * This might have problems when it comes to parsing `COMPONENTS OF` sequences.
 * The compiler will need to translate the `COMPONENTS OF` components to their
 * fields before adding them to the lists. The compiler will also need to handle
 * `AUTOMATIC TAGS`.
 *
 * @param seq The ASN.1 value encoding the `SEQUENCE`
 * @param {Object} decodingCallbacks A map of component names to callbacks
 * @param {ComponentSpec[]} rootComponentTypeList1 Component specifications for
 *  the Root Component Type List 1
 * @param {ComponentSpec[]} extensionAdditionsList Component specifications for
 *  the Extension Additions List
 * @param {ComponentSpec[]} rootComponentTypeList2 Component specifications for
 *  the Root Component Type List 2
 * @param {Function} unrecognizedExtensionHandler The callback to invoke with an
 *  unrecognized extension
 *
 * @function
 */
export
function _parse_sequence (
    seq: ASN1Element,
    decodingCallbacks: DecodingMap,
    rootComponentTypeList1: ComponentSpec[],
    extensionAdditionsList: ComponentSpec[],
    rootComponentTypeList2: ComponentSpec[],
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

/**
 * @summary Encode a `CHOICE` type
 * @param {Object} choices A map of choices to encoders
 * @param {Function} elGetter Returns the element to use for encoding (e.g. `DERElement`)
 * @returns {Function} the encoder function for the `CHOICE` as a whole
 * @function
 */
export function _encode_choice<T extends object> (
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
            throw new Error(`Unrecognized alternative '${String(key)}'.`);
        }
        return encoder(value[key] as T[AllUnionMemberKeys<T>], elGetter as any);
    };
}

/**
 * @summary Decode an an inextensible `CHOICE` type
 * @description
 * Decodes an inextensible `CHOICE` type from an ASN.1 element. Throws an error
 * if the tag is unrecognized.
 *
 * Compare to {@link _decode_extensible_choice} for a version that supports
 * extensible `CHOICE` types.
 *
 * @param {Object} choices A map of choices to decoders
 * @returns {Function} A decoder function for the `CHOICE` as a whole
 * @function
 */
export function _decode_inextensible_choice<T> (
    choices: Record<
        string,
        [AllUnionMemberKeys<T>, ASN1Decoder<T[AllUnionMemberKeys<T>]>]
    >,
): ASN1Decoder<InextensibleChoice<T>> {
    return function (el: ASN1Element): InextensibleChoice<T> {
        // TODO: Re-write to use Map()
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

/**
 * @summary Decode an extensible `CHOICE` type
 * @description
 * Decodes an extensible `CHOICE` type from an ASN.1 element. Returns the element
 * if the tag is unrecognized.
 *
 * Compare to {@link _decode_inextensible_choice} for a version that supports
 * inextensible `CHOICE` types.
 *
 * @param {Object} choices A map of choices to decoders
 * @returns {Function} A decoder function for the `CHOICE` as a whole
 * @function
 */
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

/**
 * @summary Decode a `SEQUENCE OF` type
 * @description
 * Decodes a `SEQUENCE OF` type from an ASN.1 element.
 *
 * @param {Function} decoderGetter A function that returns a decoder for the items of the sequence
 * @returns {Function} A decoder function for the `SEQUENCE OF` as a whole
 * @function
 */
export function _decodeSequenceOf<T> (decoderGetter: () => ASN1Decoder<T>): SequenceOfDecoder<T> {
    return function (el: ASN1Element): SEQUENCE_OF<T> {
        return el.sequence.map(decoderGetter());
    };
}

/**
 * @summary Encode a `SEQUENCE OF` type
 * @description
 * Encodes a `SEQUENCE OF` type to an ASN.1 element.
 * @param {Function} encoderGetter A function that returns an encoder for the items of the sequence
 * @param {Function} outerElGetter A function that returns an encoder for the outer element (e.g. `DERElement`)
 * @returns {Function} An encoder function for the `SEQUENCE OF` as a whole
 * @function
 */
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

/**
 * @summary Decode a `SET OF` type
 * @description
 * Decodes a `SET OF` type from an ASN.1 element.
 * @param {Function} decoderGetter A function that returns a decoder for the items of the set
 * @returns {Function} A decoder function for the `SET OF` as a whole
 * @function
 */
export function _decodeSetOf<T> (decoderGetter: () => (el: ASN1Element) => T): SetOfDecoder<T> {
    return function (el: ASN1Element): SET_OF<T> {
        return el.setOf.map(decoderGetter());
    };
}

/**
 * @summary Encode a `SET OF` type
 * @description
 * Encodes a `SET OF` type to an ASN.1 element.
 * @param {Function} encoderGetter A function that returns an encoder for the items of the set
 * @param {Function} outerElGetter A function that returns an encoder for the outer element (e.g. `DERElement`)
 * @returns {Function} An encoder function for the `SET OF` as a whole
 * @function
 */
export function _encodeSetOf<T> (
    encoderGetter: () => (value: T, innerElGetter: ASN1Encoder<T>) => ASN1Element,
    outerElGetter: ASN1Encoder<any>,
): SetOfEncoder<T> {
    return function (value: SET_OF<T>): ASN1Element {
        const el = outerElGetter(value, outerElGetter);
        const encoder = encoderGetter();
        el.setOf = value.map((v) => encoder(v, outerElGetter));
        el.tagClass = ASN1TagClass.universal;
        el.tagNumber = ASN1UniversalType.set;
        return el;
    };
}

/**
 * @summary Encode a `bigint` value to an ASN.1 element
 * @description
 * Encodes a `bigint` value into an ASN.1 element with the universal tag class and integer tag number.
 *
 * An `OCTET STRING` is used to encode the `bigint` value.
 *
 * @param {Uint8Array} value The `bigint` value to encode
 * @param {Function} elGetter A function that creates a new ASN.1 element
 * @returns {ASN1Element} The encoded `bigint` value
 * @function
 */
export const _encodeBigInt: ASN1Encoder<OCTET_STRING> = (
    value: OCTET_STRING,
    elGetter: ASN1Encoder<OCTET_STRING>,
): ASN1Element => {
    const el: ASN1Element = elGetter(value, elGetter);
    el.octetString = value;
    el.tagClass = ASN1TagClass.universal;
    el.tagNumber = ASN1UniversalType.integer;
    return el;
};

/**
 * @summary Decode a `bigint` value from an ASN.1 element
 * @description
 * Decodes a `bigint` value from an ASN.1 element.
 * @param {ASN1Element} el The ASN.1 element containing the `bigint` value
 * @returns {Uint8Array} The decoded `bigint` value as a `Uint8Array`
 * @function
 */
export const _decodeBigInt: ASN1Decoder<OCTET_STRING> = (el: ASN1Element): OCTET_STRING => {
    return el.octetString;
};
