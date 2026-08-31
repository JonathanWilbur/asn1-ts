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

export function isObjectIdentifierLike (value: unknown): boolean {
    return brandedOr(value, OBJECT_IDENTIFIER_BRAND, (obj) => {
        const candidate = obj as Record<string, unknown>;
        return ("dotDelimitedNotation" in obj) && typeof candidate["toBytes"] === "function";
    });
}

export function isX690ElementLike (value: unknown): boolean {
    return brandedOr(value, X690_ELEMENT_BRAND, (obj) => (
        isASN1ElementLike(obj) && hasSequenceElements(obj)
    ));
}

export function isBERElementLike (value: unknown): boolean {
    return brandedOr(value, BER_ELEMENT_BRAND, () => false);
}

export function isCERElementLike (value: unknown): boolean {
    return brandedOr(value, CER_ELEMENT_BRAND, () => false);
}

export function isDERElementLike (value: unknown): boolean {
    return brandedOr(value, DER_ELEMENT_BRAND, () => false);
}

export function isExternalLike (value: unknown): boolean {
    return brandedOr(value, EXTERNAL_BRAND, (obj) => (
        hasAllKeys(obj, [ "encoding", "directReference" ])
        && hasNoneOfKeys(obj, [ "dataValue", "stringValue" ])
    ));
}

export function isEmbeddedPDVLike (value: unknown): boolean {
    return brandedOr(value, EMBEDDED_PDV_BRAND, (obj) => (
        hasAllKeys(obj, [ "identification", "dataValue" ])
        && hasNoneOfKeys(obj, [ "stringValue", "encoding" ])
    ));
}

export function isCharacterStringLike (value: unknown): boolean {
    return brandedOr(value, CHARACTER_STRING_BRAND, (obj) => (
        hasAllKeys(obj, [ "identification", "stringValue" ])
        && hasNoneOfKeys(obj, [ "dataValue", "encoding" ])
    ));
}

export function isYEAR_ENCODINGLike (value: unknown): boolean {
    return brandedOr(value, YEAR_ENCODING_BRAND, (obj) => (
        hasAllKeys(obj, [ "year" ])
        && hasNoneOfKeys(obj, [ "month", "day", "hours" ])
    ));
}

export function isYEAR_MONTH_ENCODINGLike (value: unknown): boolean {
    return brandedOr(value, YEAR_MONTH_ENCODING_BRAND, (obj) => (
        hasAllKeys(obj, [ "year", "month" ])
        && hasNoneOfKeys(obj, [ "day", "hours" ])
    ));
}

export function isDATE_ENCODINGLike (value: unknown): boolean {
    return brandedOr(value, DATE_ENCODING_BRAND, (obj) => (
        hasAllKeys(obj, [ "year", "month", "day" ])
        && hasNoneOfKeys(obj, [ "hours" ])
    ));
}

export function isHOURS_ENCODINGLike (value: unknown): boolean {
    return brandedOr(value, HOURS_ENCODING_BRAND, (obj) => (
        hasAllKeys(obj, [ "hours" ])
        && hasNoneOfKeys(obj, [ "minutes", "minutes_diff", "seconds", "year" ])
    ));
}

export function isHOURS_DIFF_ENCODINGLike (value: unknown): boolean {
    return brandedOr(value, HOURS_DIFF_ENCODING_BRAND, (obj) => (
        hasAllKeys(obj, [ "hours", "minutes_diff" ])
        && hasNoneOfKeys(obj, [ "minutes", "seconds", "year" ])
    ));
}

export function isHOURS_MINUTES_ENCODINGLike (value: unknown): boolean {
    return brandedOr(value, HOURS_MINUTES_ENCODING_BRAND, (obj) => (
        hasAllKeys(obj, [ "hours", "minutes" ])
        && hasNoneOfKeys(obj, [ "seconds", "minutes_diff", "year" ])
    ));
}

export function isHOURS_MINUTES_DIFF_ENCODINGLike (value: unknown): boolean {
    return brandedOr(value, HOURS_MINUTES_DIFF_ENCODING_BRAND, (obj) => (
        hasAllKeys(obj, [ "hours", "minutes", "minutes_diff" ])
        && hasNoneOfKeys(obj, [ "seconds", "year" ])
    ));
}

export function isTIME_OF_DAY_ENCODINGLike (value: unknown): boolean {
    return brandedOr(value, TIME_OF_DAY_ENCODING_BRAND, (obj) => (
        hasAllKeys(obj, [ "hours", "minutes", "seconds" ])
        && hasNoneOfKeys(obj, [ "minutes_diff", "fractional_part", "year", "weeks" ])
    ));
}

export function isTIME_OF_DAY_DIFF_ENCODINGLike (value: unknown): boolean {
    return brandedOr(value, TIME_OF_DAY_DIFF_ENCODING_BRAND, (obj) => (
        hasAllKeys(obj, [ "hours", "minutes", "seconds", "minutes_diff" ])
        && hasNoneOfKeys(obj, [ "fractional_part", "year", "weeks" ])
    ));
}

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

function isDurationShape (obj: object): boolean {
    return hasAllKeys(obj, [ "years", "months", "weeks", "days", "hours", "minutes", "seconds" ]);
}

export function isDURATION_EQUIVALENTLike (value: unknown): boolean {
    return brandedOr(value, DURATION_EQUIVALENT_BRAND, (obj) => (
        isDurationShape(obj)
        && typeof (obj as Record<string, unknown>)["toISOString"] === "function"
    ));
}

export function isDURATION_INTERVAL_ENCODINGLike (value: unknown): boolean {
    return brandedOr(value, DURATION_INTERVAL_ENCODING_BRAND, (obj) => (
        isDurationShape(obj)
        && typeof (obj as Record<string, unknown>)["toISOString"] !== "function"
    ));
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
