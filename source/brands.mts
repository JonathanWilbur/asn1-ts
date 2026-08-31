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
 * guards {@link ASN1Element.isElement} and {@link ObjectIdentifier.isOID}, which
 * consult these brands and a structural fallback for older copies that do not
 * stamp a brand yet.
 *
 * @module
 */

function isObject (value: unknown): value is object {
    return typeof value === "object" && value !== null;
}

/**
 * Brand stamped on every {@link ASN1Element} (and therefore on BER / CER / DER
 * elements). Shared across copies of this package via {@link Symbol.for}.
 */
export const ASN1_ELEMENT_BRAND: symbol = Symbol.for("@wildboar/asn1.ASN1Element");

/**
 * Brand stamped on every {@link ObjectIdentifier}. Shared across copies of this
 * package via {@link Symbol.for}.
 */
export const OBJECT_IDENTIFIER_BRAND: symbol = Symbol.for("@wildboar/asn1.ObjectIdentifier");

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

/**
 * `true` if `value` is an ASN.1 element from this copy or another copy of the
 * package, or a structural stand-in that older copies can produce.
 *
 * Distinguished from an object identifier by requiring `tagClass`,
 * `tagNumber`, and `construction`. Both types have `toBytes()`.
 *
 * @param value The value to test
 */
export function isASN1ElementLike (value: unknown): boolean {
    if (!isObject(value)) {
        return false;
    }
    if (ASN1_ELEMENT_BRAND in value) {
        return true;
    }
    const candidate = value as Record<string, unknown>;
    return (
        typeof candidate["tagClass"] === "number"
        && typeof candidate["tagNumber"] === "number"
        && typeof candidate["construction"] === "number"
        && typeof candidate["toBytes"] === "function"
    );
}

/**
 * `true` if `value` is an object identifier from this copy or another copy of
 * the package, or a structural stand-in with `dotDelimitedNotation` and
 * `toBytes`.
 *
 * `dotDelimitedNotation` is checked with `in` so the getter is not invoked
 * (it can throw {@link ASN1OverflowError} for oversized arcs).
 *
 * Do not test for instance `fromParts`: that method is static, so a real OID
 * from another copy never has it.
 *
 * @param value The value to test
 */
export function isObjectIdentifierLike (value: unknown): boolean {
    if (!isObject(value)) {
        return false;
    }
    if (OBJECT_IDENTIFIER_BRAND in value) {
        return true;
    }
    const candidate = value as Record<string, unknown>;
    return (
        ("dotDelimitedNotation" in value)
        && typeof candidate["toBytes"] === "function"
    );
}

/**
 * `true` if `value` implements the zero-copy `sequenceElements` method added
 * on BER / CER / DER elements.
 *
 * @param value The value to test
 */
export function hasSequenceElements (
    value: unknown,
): value is { sequenceElements: (zeroCopy: boolean) => unknown[] } {
    return isObject(value)
        && typeof (value as { sequenceElements?: unknown }).sequenceElements === "function";
}

/**
 * `true` if `value` implements the zero-copy `setElements` method added on
 * BER / CER / DER elements.
 *
 * @param value The value to test
 */
export function hasSetElements (
    value: unknown,
): value is { setElements: (zeroCopy: boolean) => unknown[] } {
    return isObject(value)
        && typeof (value as { setElements?: unknown }).setElements === "function";
}
