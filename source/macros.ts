import ObjectIdentifier from "./types/ObjectIdentifier";
import EmbeddedPDV from "./types/EmbeddedPDV";
import External from "./types/External";
import TypeIdentifier from "./types/TypeIdentifier";

export type COMPONENTS_OF<T> = T;
export type OPTIONAL<T> = T | undefined;
export type BOOLEAN = boolean;
export type INTEGER = number;
export type BIT_STRING = Uint8ClampedArray;
export type OCTET_STRING = Uint8Array;
export type NULL = null;
export type OBJECT_IDENTIFIER = ObjectIdentifier;
export type ObjectDescriptor = string;
export type EXTERNAL = External;
export type REAL = number;
export type INSTANCE_OF = External;
export type ENUMERATED = number;
export type EMBEDDED_PDV = EmbeddedPDV;
export type UTF8String = string;
export type RELATIVE_OID = number[];
export type SEQUENCE<T> = T[];
export type SEQUENCE_OF<T> = T[];
export type SET<T> = T[];
export type SET_OF<T> = T[];
export type GraphicString = string;
export type NumericString = string;
export type VisibleString = string;
export type PrintableString = string;
export type ISO646String = string;
export type TeletexString = Uint8Array;
export type GeneralString = string;
export type T61String = Uint8Array;
export type UniversalString = string;
export type VideotexString = Uint8Array;
export type BMPString = string;
export type IA5String = string;
// export type CharacterString = CharacterString;
export { default as CharacterString } from "./types/CharacterString";
export type UTCTime = Date;
export type GeneralizedTime = Date;

/**
 * It might be tempting to represent these as dates, and that might be fine
 * when it comes to mutating, but when accessing, the wide variety of
 * abstract value representations would entail _months_ of additional
 * programming to decode.
 */

/**
 * A string is used to represent the Time type, because it can take on so
 * many different forms.
 */
export type TIME = string;

/**
 * `DATE ::= [UNIVERSAL 31] IMPLICIT TIME (SETTINGS "Basic=Date Date=YMD Year=Basic")`
 *
 * This looks like `YYYY-MM-DD`, where `YYYY` is 1582 to 9999.
 *
 * The time will be set to local 00:00:00.
 */
export type DATE = Date;

/**
 * `TIME-OF-DAY ::= [UNIVERSAL 32] IMPLICIT TIME (SETTINGS "Basic=Time Time=HMS Local-or-UTC=L")`
 *
 * This looks like `hh:mm:ss`.
 *
 * The date will be set to today's local date.
 */
export type TIME_OF_DAY = Date;

/**
 * `DATE-TIME ::= [UNIVERSAL 33] IMPLICIT TIME (SETTINGS "Basic=Date-Time Date=YMD Year=Basic Time=HMS Local-or-UTC=L")`
 *
 * `YYYY-MM-DDThh:mm:ss`
 */
export type DATE_TIME = Date;

/**
 * `DURATION ::= [UNIVERSAL 34] IMPLICIT TIME (SETTINGS "Basic=Interval Interval-type=D")`
 *
 * This must begin with a P, then a sequence of numbers (floating-point
 * tolerated), each of which is followed by a letter, indicating the unit.
 * The only exception to this is that an hours-minutes-seconds designation
 * shall be preceded by a T.
 * The syntax is really more complicated than this, but that is a good summary.
 *
 * This library will use a `number` to represent the value, with 1 in this
 * scale representing one second, and with the fractional component
 * representing fractions of a second.
 */
export type DURATION = number;

export type OID_IRI = string;
export type RELATIVE_OID_IRI = string;

export const TRUE = true;
export const FALSE = false;
export const TRUE_BIT = 1;
export const FALSE_BIT = 0;
export const PLUS_INFINITY = Infinity;
export const MINUS_INFINITY = -Infinity;
export const NOT_A_NUMBER = NaN;

export const TYPE_IDENTIFIER = TypeIdentifier;
// ABSTRACT_SYNTAX

export const itu_t = 0;
export const ccitt = 0;
export const itu_r = 0;
export const iso = 1;
export const joint_iso_itu_t = 2;
export const joint_iso_ccitt = 2;
