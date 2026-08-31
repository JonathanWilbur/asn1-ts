/**
 * Well-known brands and structural checks for library types.
 *
 * `instanceof` compares constructor identity. Two copies of this package in the
 * same process (nested `node_modules`, bundler duplication) define distinct
 * classes, so `value instanceof ObjectIdentifier` fails for a real OID that
 * came from the other copy.
 *
 * {@link Symbol.for} brands are interned in the realm-wide symbol registry, so
 * every copy that uses the same key observes the same symbol. Prefer the type
 * guards on each class (for example {@link ASN1Element.isElement} and
 * {@link ObjectIdentifier.isOID}), which consult these brands and a structural
 * fallback for older copies that do not stamp a brand yet.
 *
 * @module
 */

function isObject (value: unknown): value is object {
    return typeof value === "object" && value !== null;
}

function hasAllKeys (value: object, keys: readonly string[]): boolean {
    for (const key of keys) {
        if (!(key in value)) {
            return false;
        }
    }
    return true;
}

function hasNoneOfKeys (value: object, keys: readonly string[]): boolean {
    for (const key of keys) {
        if (key in value) {
            return false;
        }
    }
    return true;
}

function brandedOr (
    value: unknown,
    brand: symbol,
    shape: (obj: object) => boolean,
): boolean {
    if (!isObject(value)) {
        return false;
    }
    if (brand in value) {
        return true;
    }
    return shape(value);
}

/**
 * Stamp a non-enumerable brand on a prototype so `brand in instance` is true
 * for that class and its subclasses, without showing up in {@link Object.keys}.
 *
 * @param prototype The class prototype to brand
 * @param brand The {@link Symbol.for} brand
 */
export function stampBrand (prototype: object, brand: symbol): void {
    Object.defineProperty(prototype, brand, {
        value: true,
        enumerable: false,
        configurable: false,
        writable: false,
    });
}

export const ASN1_ELEMENT_BRAND: symbol = Symbol.for("@wildboar/asn1.ASN1Element");
export const X690_ELEMENT_BRAND: symbol = Symbol.for("@wildboar/asn1.X690Element");
export const BER_ELEMENT_BRAND: symbol = Symbol.for("@wildboar/asn1.BERElement");
export const CER_ELEMENT_BRAND: symbol = Symbol.for("@wildboar/asn1.CERElement");
export const DER_ELEMENT_BRAND: symbol = Symbol.for("@wildboar/asn1.DERElement");
export const OBJECT_IDENTIFIER_BRAND: symbol = Symbol.for("@wildboar/asn1.ObjectIdentifier");
export const EXTERNAL_BRAND: symbol = Symbol.for("@wildboar/asn1.External");
export const EMBEDDED_PDV_BRAND: symbol = Symbol.for("@wildboar/asn1.EmbeddedPDV");
export const CHARACTER_STRING_BRAND: symbol = Symbol.for("@wildboar/asn1.CharacterString");
export const DATE_ENCODING_BRAND: symbol = Symbol.for("@wildboar/asn1.DATE_ENCODING");
export const YEAR_ENCODING_BRAND: symbol = Symbol.for("@wildboar/asn1.YEAR_ENCODING");
export const YEAR_MONTH_ENCODING_BRAND: symbol = Symbol.for("@wildboar/asn1.YEAR_MONTH_ENCODING");
export const HOURS_ENCODING_BRAND: symbol = Symbol.for("@wildboar/asn1.HOURS_ENCODING");
export const HOURS_DIFF_ENCODING_BRAND: symbol = Symbol.for("@wildboar/asn1.HOURS_DIFF_ENCODING");
export const HOURS_MINUTES_ENCODING_BRAND: symbol = Symbol.for("@wildboar/asn1.HOURS_MINUTES_ENCODING");
export const HOURS_MINUTES_DIFF_ENCODING_BRAND: symbol = Symbol.for("@wildboar/asn1.HOURS_MINUTES_DIFF_ENCODING");
export const TIME_OF_DAY_ENCODING_BRAND: symbol = Symbol.for("@wildboar/asn1.TIME_OF_DAY_ENCODING");
export const TIME_OF_DAY_DIFF_ENCODING_BRAND: symbol = Symbol.for("@wildboar/asn1.TIME_OF_DAY_DIFF_ENCODING");
export const TIME_OF_DAY_FRACTION_ENCODING_BRAND: symbol = Symbol.for(
    "@wildboar/asn1.TIME_OF_DAY_FRACTION_ENCODING",
);
export const TIME_OF_DAY_FRACTION_DIFF_ENCODING_BRAND: symbol = Symbol.for(
    "@wildboar/asn1.TIME_OF_DAY_FRACTION_DIFF_ENCODING",
);
export const DURATION_EQUIVALENT_BRAND: symbol = Symbol.for("@wildboar/asn1.DURATION_EQUIVALENT");
export const DURATION_INTERVAL_ENCODING_BRAND: symbol = Symbol.for(
    "@wildboar/asn1.DURATION_INTERVAL_ENCODING",
);

/**
 * @summary Determine whether a value looks like an ASN.1 element
 * @description
 *
 * Consults the `ASN1Element` `Symbol.for` brand and, for unbranded values,
 * `tagClass`, `tagNumber`, `construction`, and `toBytes`.
 *
 * @param {unknown} value The value to test
 * @return {boolean} `true` if `value` looks like an ASN.1 element
 * @function
 * @internal
 * @author Cursor Grok 4.6
 */
export function isASN1ElementLike (value: unknown): boolean {
    return brandedOr(value, ASN1_ELEMENT_BRAND, (obj) => {
        const candidate = obj as Record<string, unknown>;
        return (
            typeof candidate["tagClass"] === "number"
            && typeof candidate["tagNumber"] === "number"
            && typeof candidate["construction"] === "number"
            && typeof candidate["toBytes"] === "function"
        );
    });
}

/**
 * @summary Determine whether a value looks like an object identifier
 * @description
 *
 * Consults the `ObjectIdentifier` `Symbol.for` brand and, for unbranded
 * values, `dotDelimitedNotation` and `toBytes`.
 *
 * @param {unknown} value The value to test
 * @return {boolean} `true` if `value` looks like an object identifier
 * @function
 * @internal
 * @author Cursor Grok 4.6
 */
export function isObjectIdentifierLike (value: unknown): boolean {
    return brandedOr(value, OBJECT_IDENTIFIER_BRAND, (obj) => {
        const candidate = obj as Record<string, unknown>;
        return ("dotDelimitedNotation" in obj) && typeof candidate["toBytes"] === "function";
    });
}

/**
 * @summary Determine whether a value looks like an X.690 element
 * @description
 *
 * Consults the `X690Element` `Symbol.for` brand and, for unbranded values,
 * requires an ASN.1 element shape plus `sequenceElements`.
 *
 * @param {unknown} value The value to test
 * @return {boolean} `true` if `value` looks like an X.690 element
 * @function
 * @internal
 * @author Cursor Grok 4.6
 */
export function isX690ElementLike (value: unknown): boolean {
    return brandedOr(value, X690_ELEMENT_BRAND, (obj) => (
        isASN1ElementLike(obj) && hasSequenceElements(obj)
    ));
}

/**
 * @summary Determine whether a value looks like a `BERElement`
 * @description
 *
 * Brand-only. BER, CER, and DER instances are not distinguishable by structure.
 *
 * @param {unknown} value The value to test
 * @return {boolean} `true` if `value` carries the `BERElement` brand
 * @function
 * @internal
 * @author Cursor Grok 4.6
 */
export function isBERElementLike (value: unknown): boolean {
    return brandedOr(value, BER_ELEMENT_BRAND, () => false);
}

/**
 * @summary Determine whether a value looks like a `CERElement`
 * @description
 *
 * Brand-only. BER, CER, and DER instances are not distinguishable by structure.
 *
 * @param {unknown} value The value to test
 * @return {boolean} `true` if `value` carries the `CERElement` brand
 * @function
 * @internal
 * @author Cursor Grok 4.6
 */
export function isCERElementLike (value: unknown): boolean {
    return brandedOr(value, CER_ELEMENT_BRAND, () => false);
}

/**
 * @summary Determine whether a value looks like a `DERElement`
 * @description
 *
 * Brand-only. BER, CER, and DER instances are not distinguishable by structure.
 *
 * @param {unknown} value The value to test
 * @return {boolean} `true` if `value` carries the `DERElement` brand
 * @function
 * @internal
 * @author Cursor Grok 4.6
 */
export function isDERElementLike (value: unknown): boolean {
    return brandedOr(value, DER_ELEMENT_BRAND, () => false);
}

/**
 * @summary Determine whether a value looks like an `EXTERNAL`
 * @description
 *
 * Consults the `External` `Symbol.for` brand and, for unbranded values,
 * `encoding` and `directReference`.
 *
 * @param {unknown} value The value to test
 * @return {boolean} `true` if `value` looks like an `EXTERNAL`
 * @function
 * @internal
 * @author Cursor Grok 4.6
 */
export function isExternalLike (value: unknown): boolean {
    return brandedOr(value, EXTERNAL_BRAND, (obj) => (
        hasAllKeys(obj, [ "encoding", "directReference" ])
        && hasNoneOfKeys(obj, [ "dataValue", "stringValue" ])
    ));
}

/**
 * @summary Determine whether a value looks like an `EMBEDDED PDV`
 * @description
 *
 * Consults the `EmbeddedPDV` `Symbol.for` brand and, for unbranded values,
 * `identification` and `dataValue`.
 *
 * @param {unknown} value The value to test
 * @return {boolean} `true` if `value` looks like an `EMBEDDED PDV`
 * @function
 * @internal
 * @author Cursor Grok 4.6
 */
export function isEmbeddedPDVLike (value: unknown): boolean {
    return brandedOr(value, EMBEDDED_PDV_BRAND, (obj) => (
        hasAllKeys(obj, [ "identification", "dataValue" ])
        && hasNoneOfKeys(obj, [ "stringValue", "encoding" ])
    ));
}

/**
 * @summary Determine whether a value looks like a `CHARACTER STRING`
 * @description
 *
 * Consults the `CharacterString` `Symbol.for` brand and, for unbranded values,
 * `identification` and `stringValue`.
 *
 * @param {unknown} value The value to test
 * @return {boolean} `true` if `value` looks like a `CHARACTER STRING`
 * @function
 * @internal
 * @author Cursor Grok 4.6
 */
export function isCharacterStringLike (value: unknown): boolean {
    return brandedOr(value, CHARACTER_STRING_BRAND, (obj) => (
        hasAllKeys(obj, [ "identification", "stringValue" ])
        && hasNoneOfKeys(obj, [ "dataValue", "encoding" ])
    ));
}

/**
 * @summary Determine whether a value looks like a `YEAR-ENCODING`
 * @description
 *
 * Consults the `YEAR-ENCODING` `Symbol.for` brand and, for unbranded values,
 * a structural check of the encoding fields.
 *
 * @param {unknown} value The value to test
 * @return {boolean} `true` if `value` looks like a `YEAR-ENCODING`
 * @function
 * @internal
 * @author Cursor Grok 4.6
 */
export function isYEAR_ENCODINGLike (value: unknown): boolean {
    return brandedOr(value, YEAR_ENCODING_BRAND, (obj) => (
        hasAllKeys(obj, [ "year" ])
        && hasNoneOfKeys(obj, [ "month", "day", "hours" ])
    ));
}

/**
 * @summary Determine whether a value looks like a `YEAR-MONTH-ENCODING`
 * @description
 *
 * Consults the `YEAR-MONTH-ENCODING` `Symbol.for` brand and, for unbranded values,
 * a structural check of the encoding fields.
 *
 * @param {unknown} value The value to test
 * @return {boolean} `true` if `value` looks like a `YEAR-MONTH-ENCODING`
 * @function
 * @internal
 * @author Cursor Grok 4.6
 */
export function isYEAR_MONTH_ENCODINGLike (value: unknown): boolean {
    return brandedOr(value, YEAR_MONTH_ENCODING_BRAND, (obj) => (
        hasAllKeys(obj, [ "year", "month" ])
        && hasNoneOfKeys(obj, [ "day", "hours" ])
    ));
}

/**
 * @summary Determine whether a value looks like a `DATE-ENCODING`
 * @description
 *
 * Consults the `DATE-ENCODING` `Symbol.for` brand and, for unbranded values,
 * a structural check of the encoding fields.
 *
 * @param {unknown} value The value to test
 * @return {boolean} `true` if `value` looks like a `DATE-ENCODING`
 * @function
 * @internal
 * @author Cursor Grok 4.6
 */
export function isDATE_ENCODINGLike (value: unknown): boolean {
    return brandedOr(value, DATE_ENCODING_BRAND, (obj) => (
        hasAllKeys(obj, [ "year", "month", "day" ])
        && hasNoneOfKeys(obj, [ "hours" ])
    ));
}

/**
 * @summary Determine whether a value looks like a `HOURS-ENCODING`
 * @description
 *
 * Consults the `HOURS-ENCODING` `Symbol.for` brand and, for unbranded values,
 * a structural check of the encoding fields.
 *
 * @param {unknown} value The value to test
 * @return {boolean} `true` if `value` looks like a `HOURS-ENCODING`
 * @function
 * @internal
 * @author Cursor Grok 4.6
 */
export function isHOURS_ENCODINGLike (value: unknown): boolean {
    return brandedOr(value, HOURS_ENCODING_BRAND, (obj) => (
        hasAllKeys(obj, [ "hours" ])
        && hasNoneOfKeys(obj, [ "minutes", "minutes_diff", "seconds", "year" ])
    ));
}

/**
 * @summary Determine whether a value looks like a `HOURS-DIFF-ENCODING`
 * @description
 *
 * Consults the `HOURS-DIFF-ENCODING` `Symbol.for` brand and, for unbranded values,
 * a structural check of the encoding fields.
 *
 * @param {unknown} value The value to test
 * @return {boolean} `true` if `value` looks like a `HOURS-DIFF-ENCODING`
 * @function
 * @internal
 * @author Cursor Grok 4.6
 */
export function isHOURS_DIFF_ENCODINGLike (value: unknown): boolean {
    return brandedOr(value, HOURS_DIFF_ENCODING_BRAND, (obj) => (
        hasAllKeys(obj, [ "hours", "minutes_diff" ])
        && hasNoneOfKeys(obj, [ "minutes", "seconds", "year" ])
    ));
}

/**
 * @summary Determine whether a value looks like a `HOURS-MINUTES-ENCODING`
 * @description
 *
 * Consults the `HOURS-MINUTES-ENCODING` `Symbol.for` brand and, for unbranded values,
 * a structural check of the encoding fields.
 *
 * @param {unknown} value The value to test
 * @return {boolean} `true` if `value` looks like a `HOURS-MINUTES-ENCODING`
 * @function
 * @internal
 * @author Cursor Grok 4.6
 */
export function isHOURS_MINUTES_ENCODINGLike (value: unknown): boolean {
    return brandedOr(value, HOURS_MINUTES_ENCODING_BRAND, (obj) => (
        hasAllKeys(obj, [ "hours", "minutes" ])
        && hasNoneOfKeys(obj, [ "seconds", "minutes_diff", "year" ])
    ));
}

/**
 * @summary Determine whether a value looks like a `HOURS-MINUTES-DIFF-ENCODING`
 * @description
 *
 * Consults the `HOURS-MINUTES-DIFF-ENCODING` `Symbol.for` brand and, for unbranded values,
 * a structural check of the encoding fields.
 *
 * @param {unknown} value The value to test
 * @return {boolean} `true` if `value` looks like a `HOURS-MINUTES-DIFF-ENCODING`
 * @function
 * @internal
 * @author Cursor Grok 4.6
 */
export function isHOURS_MINUTES_DIFF_ENCODINGLike (value: unknown): boolean {
    return brandedOr(value, HOURS_MINUTES_DIFF_ENCODING_BRAND, (obj) => (
        hasAllKeys(obj, [ "hours", "minutes", "minutes_diff" ])
        && hasNoneOfKeys(obj, [ "seconds", "year" ])
    ));
}

/**
 * @summary Determine whether a value looks like a `TIME-OF-DAY-ENCODING`
 * @description
 *
 * Consults the `TIME-OF-DAY-ENCODING` `Symbol.for` brand and, for unbranded values,
 * a structural check of the encoding fields.
 *
 * @param {unknown} value The value to test
 * @return {boolean} `true` if `value` looks like a `TIME-OF-DAY-ENCODING`
 * @function
 * @internal
 * @author Cursor Grok 4.6
 */
export function isTIME_OF_DAY_ENCODINGLike (value: unknown): boolean {
    return brandedOr(value, TIME_OF_DAY_ENCODING_BRAND, (obj) => (
        hasAllKeys(obj, [ "hours", "minutes", "seconds" ])
        && hasNoneOfKeys(obj, [ "minutes_diff", "fractional_part", "year", "weeks" ])
    ));
}

/**
 * @summary Determine whether a value looks like a `TIME-OF-DAY-DIFF-ENCODING`
 * @description
 *
 * Consults the `TIME-OF-DAY-DIFF-ENCODING` `Symbol.for` brand and, for unbranded values,
 * a structural check of the encoding fields.
 *
 * @param {unknown} value The value to test
 * @return {boolean} `true` if `value` looks like a `TIME-OF-DAY-DIFF-ENCODING`
 * @function
 * @internal
 * @author Cursor Grok 4.6
 */
export function isTIME_OF_DAY_DIFF_ENCODINGLike (value: unknown): boolean {
    return brandedOr(value, TIME_OF_DAY_DIFF_ENCODING_BRAND, (obj) => (
        hasAllKeys(obj, [ "hours", "minutes", "seconds", "minutes_diff" ])
        && hasNoneOfKeys(obj, [ "fractional_part", "year", "weeks" ])
    ));
}

/**
 * @summary Determine whether a value looks like a `TIME-OF-DAY-FRACTION-ENCODING`
 * @description
 *
 * Consults the `TIME-OF-DAY-FRACTION-ENCODING` `Symbol.for` brand and, for unbranded values,
 * a structural check of the encoding fields.
 *
 * @param {unknown} value The value to test
 * @return {boolean} `true` if `value` looks like a `TIME-OF-DAY-FRACTION-ENCODING`
 * @function
 * @internal
 * @author Cursor Grok 4.6
 */
export function isTIME_OF_DAY_FRACTION_ENCODINGLike (value: unknown): boolean {
    return brandedOr(value, TIME_OF_DAY_FRACTION_ENCODING_BRAND, (obj) => {
        const fractional = (obj as Record<string, unknown>)["fractional_part"];
        return (
            hasAllKeys(obj, [ "hours", "minutes", "seconds", "fractional_part" ])
            && hasNoneOfKeys(obj, [ "minutes_diff", "year", "weeks" ])
            && (typeof fractional === "number" || typeof fractional === "bigint")
        );
    });
}

/**
 * @summary Determine whether a value looks like a `TIME-OF-DAY-FRACTION-DIFF-ENCODING`
 * @description
 *
 * Consults the `TIME-OF-DAY-FRACTION-DIFF-ENCODING` `Symbol.for` brand and, for unbranded values,
 * a structural check of the encoding fields.
 *
 * @param {unknown} value The value to test
 * @return {boolean} `true` if `value` looks like a `TIME-OF-DAY-FRACTION-DIFF-ENCODING`
 * @function
 * @internal
 * @author Cursor Grok 4.6
 */
export function isTIME_OF_DAY_FRACTION_DIFF_ENCODINGLike (value: unknown): boolean {
    return brandedOr(value, TIME_OF_DAY_FRACTION_DIFF_ENCODING_BRAND, (obj) => {
        const fractional = (obj as Record<string, unknown>)["fractional_part"];
        return (
            hasAllKeys(obj, [ "hours", "minutes", "seconds", "fractional_part", "minutes_diff" ])
            && hasNoneOfKeys(obj, [ "year", "weeks" ])
            && (typeof fractional === "number" || typeof fractional === "bigint")
        );
    });
}

/**
 * @summary Determine whether a value looks like a `DURATION-EQUIVALENT`
 * @description
 *
 * `DURATION-EQUIVALENT` and `DURATION-INTERVAL-ENCODING` share the same
 * fields, so this check is brand-only. Presence of `toISOString` is not used.
 *
 * @param {unknown} value The value to test
 * @return {boolean} `true` if `value` carries the `DURATION-EQUIVALENT` brand
 * @function
 * @internal
 * @author Cursor Grok 4.6
 */
export function isDURATION_EQUIVALENTLike (value: unknown): boolean {
    return brandedOr(value, DURATION_EQUIVALENT_BRAND, () => false);
}

/**
 * @summary Determine whether a value looks like a `DURATION-INTERVAL-ENCODING`
 * @description
 *
 * `DURATION-EQUIVALENT` and `DURATION-INTERVAL-ENCODING` share the same
 * fields, so this check is brand-only. Presence of `toISOString` is not used.
 *
 * @param {unknown} value The value to test
 * @return {boolean} `true` if `value` carries the `DURATION-INTERVAL-ENCODING` brand
 * @function
 * @internal
 * @author Cursor Grok 4.6
 */
export function isDURATION_INTERVAL_ENCODINGLike (value: unknown): boolean {
    return brandedOr(value, DURATION_INTERVAL_ENCODING_BRAND, () => false);
}

export function hasSequenceElements (
    value: unknown,
): value is { sequenceElements: (zeroCopy: boolean) => unknown[] } {
    return isObject(value)
        && typeof (value as { sequenceElements?: unknown }).sequenceElements === "function";
}

export function hasSetElements (
    value: unknown,
): value is { setElements: (zeroCopy: boolean) => unknown[] } {
    return isObject(value)
        && typeof (value as { setElements?: unknown }).setElements === "function";
}
