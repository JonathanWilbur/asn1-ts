import type ASN1Element from "../../asn1.mjs";
import * as errors from "../../errors.mjs";
import { ASN1TagClass, ASN1UniversalType } from "../../values.mjs";
import { hasSequenceElements } from "../../brands.mjs";

/** Matches {@link ASN1Element.nestingRecursionLimit}. */
export const NESTING_RECURSION_LIMIT: number = 5;

/**
 * @summary Obtain constructed child elements without joining content octets.
 * @internal
 */
export function getConstructedChildren (el: ASN1Element): readonly ASN1Element[] {
    if (hasSequenceElements(el)) {
        return el.sequenceElements(false) as readonly ASN1Element[];
    }
    return el.sequence;
}

/**
 * @summary Validate a constructed string or OCTET STRING fragment.
 * @internal
 */
export function validateFragment (
    fragment: ASN1Element,
    fragmentTagNumber: number,
    dataType: string,
    context: ASN1Element,
): void {
    if (fragment.tagClass !== ASN1TagClass.universal) {
        throw new errors.ASN1ConstructionError(
            `Invalid tag class in constructed ${dataType}. Must be UNIVERSAL`,
            context,
        );
    }
    if (fragment.tagNumber !== fragmentTagNumber) {
        throw new errors.ASN1ConstructionError(
            fragmentTagNumber === ASN1UniversalType.bitString
                ? `Invalid tag number in constructed ${dataType}. Must be 3 (BIT STRING).`
                : `Invalid tag number in constructed ${dataType}. Must be 4 (OCTET STRING).`,
            context,
        );
    }
}

/**
 * @summary Fold an ASCII uppercase letter to lowercase.
 * @internal
 */
export function foldAsciiByte (byte: number): number {
    if (byte >= 0x41 && byte <= 0x5A) {
        return byte + 0x20;
    }
    return byte;
}

/**
 * @summary Compare two numbers for sort ordering.
 * @internal
 */
export function orderingSign (a: number, b: number): -1 | 0 | 1 {
    if (a < b) {
        return -1;
    }
    if (a > b) {
        return 1;
    }
    return 0;
}

/**
 * @summary Map a single-byte directory string code point per X.520 (ASCII subset).
 * @description
 * Returns `null` when the byte is ignored, `0x20` for whitespace, or the byte
 * itself for other printable characters. Multi-byte UTF-8 is not supported.
 * @internal
 */
export function mapDirectoryStringByte (byte: number): number | null {
    // CHARACTER TABULATION, LINE FEED, LINE TABULATION, FORM FEED, CARRIAGE RETURN
    if (byte === 0x09 || byte === 0x0A || byte === 0x0B || byte === 0x0C || byte === 0x0D) {
        return 0x20;
    }
    if (byte < 0x20 || byte === 0x7F) {
        return null;
    }
    return byte;
}
