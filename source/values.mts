/**
 * Maximum unsigned 32-bit integer value (0xFFFFFFFF).
 * @type {number}
 * @constant
 */
export const MAX_UINT_32: number = 0x00FFFFFFFF;
/**
 * Minimum unsigned 32-bit integer value (0).
 * @type {number}
 * @constant
 */
export const MIN_UINT_32: number = 0x0000000000;
/**
 * Maximum signed 32-bit integer value (0x7FFFFFFF).
 * @type {number}
 * @constant
 */
export const MAX_SINT_32: number = 0x7FFFFFFF;
/**
 * Minimum signed 32-bit integer value (-0x80000000).
 * @type {number}
 * @constant
 */
export const MIN_SINT_32: number = -0x80000000;

/**
 * ASN.1 tag classes as defined by the standard.
 * @enum {number}
 */
export
enum ASN1TagClass {
    universal = 0,
    application = 1,
    context = 2,
    private = 3,
}

/**
 * ASN.1 construction types: primitive or constructed.
 * @enum {number}
 */
export
enum ASN1Construction {
    primitive = 0,
    constructed = 1,
}

/**
 * Preferences for encoding ASN.1 lengths.
 * @enum {number}
 */
export
enum LengthEncodingPreference {
    definite,
    indefinite,
}

/**
 * Special values for ASN.1 REAL type.
 * @enum {number}
 */
export
enum ASN1SpecialRealValue {
    plusInfinity = 0b01000000,
    minusInfinity = 0b01000001,
    notANumber = 0b01000010,
    minusZero = 0b01000011,
}

/**
 * Bases for encoding ASN.1 REAL values.
 * @enum {number}
 */
export
enum ASN1RealEncodingBase {
    base2 =  0b00000000,
    base8 =  0b00010000,
    base16 = 0b00100000,
}

/**
 * Scales for encoding ASN.1 REAL values.
 * @enum {number}
 */
export
enum ASN1RealEncodingScale {
    scale0 = 0b00000000,
    scale1 = 0b00000100,
    scale2 = 0b00001000,
    scale3 = 0b00001100,
}

/**
 * ASN.1 universal types and their tag numbers.
 * @enum {number}
 */
export
enum ASN1UniversalType {
    endOfContent = 0x00,
    boolean = 0x01,
    integer = 0x02,
    bitString = 0x03,
    octetString = 0x04,
    nill = 0x05,
    objectIdentifier = 0x06,
    objectDescriptor = 0x07,
    external = 0x08,
    realNumber = 0x09,
    enumerated = 0x0A,
    embeddedPDV = 0x0B,
    utf8String = 0x0C,
    relativeOID = 0x0D,
    reserved14 = 0x0E,
    time = 0x0E,
    reserved15 = 0x0F,
    sequence = 0x10,
    set = 0x11,
    numericString = 0x12,
    printableString = 0x13,
    teletexString = 0x14,
    videotexString = 0x15,
    ia5String = 0x16,
    utcTime = 0x17,
    generalizedTime = 0x18,
    graphicString = 0x19,
    visibleString = 0x1A,
    generalString = 0x1B,
    universalString = 0x1C,
    characterString = 0x1D,
    bmpString = 0x1E,
    date = 31,
    timeOfDay = 32,
    dateTime = 33,
    duration = 34,
    oidIRI = 35,
    roidIRI = 36,
}

/**
 * The acceptable characters for a PrintableString in ASN.1.
 * Sorted by frequency in English for optimization.
 * @type {string}
 * @constant
 */
export const printableStringCharacters: string
    = "etaoinsrhdlucmfywgpbvkxqjzETAOINSRHDLUCMFYWGPBVKXQJZ0123456789 '()+,-./:=?";

/**
 * Regular expression for matching ASN.1 UTCTime values.
 * @type {RegExp}
 * @constant
 */
export const utcTimeRegex: RegExp = /^(\d{2})((?:1[0-2])|(?:0\d))((?:3[01])|(?:[0-2]\d))((?:2[0-3])|(?:[01]\d))([0-5]\d)([0-5]\d)?((?:(\+|-)((?:2[0-3])|(?:[01]\d))[0-5]\d)|Z)$/;

/**
 * Regular expression for matching distinguished ASN.1 UTCTime values with named groups.
 * @type {RegExp}
 * @constant
 */
export const distinguishedUTCTimeRegex: RegExp = /^(?<year>\d{2})(?<month>(?:1[0-2])|(?:0\d))(?<date>(?:3[01])|(?:[0-2]\d))(?<hour>(?:2[0-3])|(?:[01]\d))(?<minute>[0-5]\d)(?<second>[0-5]\d)?Z$/;

/**
 * Regular expression for matching ASN.1 GeneralizedTime values.
 * @type {RegExp}
 * @constant
 */
export const generalizedTimeRegex: RegExp = /^(\d{4})((?:1[0-2])|(?:0\d))((?:3[01])|(?:[0-2]\d))((?:2[0-3])|(?:[01]\d))([0-5]\d)?([0-5]\d)?(?:(?:\.|,)(\d+))?((?:(?:\+|-)((?:2[0-3])|(?:[01]\d))[0-5]\d)|Z)?$/;

/**
 * Regular expression for matching distinguished ASN.1 GeneralizedTime values with named groups.
 * @type {RegExp}
 * @constant
 */
export const distinguishedGeneralizedTimeRegex: RegExp = /^(?<year>\d{4})(?<month>(?:1[0-2])|(?:0\d))(?<date>(?:3[01])|(?:[0-2]\d))(?<hour>(?:2[0-3])|(?:[01]\d))(?<minute>[0-5]\d)(?<second>[0-5]\d)(?:(\.|,)(?<fraction>\d*[1-9]))?Z$/;

/**
 * Regular expression for ASN.1 NR1 (Numeric Real) values.
 * @type {RegExp}
 * @constant
 */
export const nr1Regex: RegExp = /^ *(\+|-)?\d+$/u;
/**
 * Regular expression for ASN.1 NR2 (Numeric Real) values.
 * @type {RegExp}
 * @constant
 */
export const nr2Regex: RegExp = /^ *(\+|-)?(?:\d+(\.|,)\d*)|(?:\d*(\.|,)\d+)$/u;
/**
 * Regular expression for ASN.1 NR3 (Numeric Real) values.
 * @type {RegExp}
 * @constant
 */
export const nr3Regex: RegExp = /^ *(\+|-)?(?:\d+(\.|,)\d*)|(?:\d*(\.|,)\d+)(e|E)(\+|-)?\d+$/u;
/**
 * Regular expression for canonical ASN.1 NR3 values.
 * @type {RegExp}
 * @constant
 */
export const canonicalNR3Regex: RegExp = /^ *-?(?:[1-9]\d*)?[1-9]\.E(?:\+0)|(?:-?[1-9]\d*)$/u;
/**
 * Regular expression for distinguished ASN.1 NR3 values.
 * @type {RegExp}
 * @constant
 */
export const distinguishedNR3Regex: RegExp = /^ *-?(?:[1-9]\d*)?[1-9]\.E(?:\+0)|(?:-?[1-9]\d*)$/u;

/**
 * Canonical ordering of ASN.1 tag classes for sorting or comparison.
 * @type {ASN1TagClass[]}
 * @constant
 */
export
const CANONICAL_TAG_CLASS_ORDERING: ASN1TagClass[] = [
    ASN1TagClass.universal,
    ASN1TagClass.application,
    ASN1TagClass.context,
    ASN1TagClass.private,
];

/**
 * Regular expression string for matching numbers (integer or decimal).
 * @type {string}
 * @constant
 */
export const numberRegex: string = "(?:0|[1-9]\\d*)(?:\\.\\d+)?";

/**
 * Regular expression for matching ISO 8601-like `DURATION` strings.
 * @type {RegExp}
 * @constant
 */
export const durationRegex: RegExp = new RegExp(
    "^(?:(" + numberRegex + ")Y)?"
    + "(?:(" + numberRegex + ")M)?"
    + "(?:(" + numberRegex + ")D)?"
    + "(?:T"
    + "(?:(" + numberRegex + ")H)?"
    + "(?:(" + numberRegex + ")M)?"
    + "(?:(" + numberRegex + ")S)?"
    + ")?$",
);

/**
 * Regular expression for matching ASN.1 `DATE-TIME` strings.
 * @type {RegExp}
 * @constant
 */
export const datetimeRegex: RegExp = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}$/;
