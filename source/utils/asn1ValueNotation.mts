import type ASN1Element from "../asn1.mjs";
import { Buffer } from "node:buffer";
import { ASN1Construction, ASN1TagClass } from "../values.mjs";

/**
 * Format an OCTET STRING in ASN.1 value notation (`'…'H`).
 *
 * Only the typed-array view is encoded. `Buffer.from(bytes.buffer)` (or any
 * other use of the backing `ArrayBuffer` without `byteOffset`/`byteLength`)
 * would hex-dump neighbouring memory, including Node.js Buffer-pool contents.
 * 
 * @internal
 * @author Cursor Grok 4.6
 */
export function formatOctetStringValue (bytes: Uint8Array): string {
    const hex: string = Buffer.from(bytes.slice()).toString("hex");
    return `'${hex}'H`;
}

/**
 * Format a BIT STRING in ASN.1 value notation (`'…'B`).
 * 
 * @internal
 * @author Cursor Grok 4.6
 */
export function formatBitStringValue (bits: Uint8ClampedArray): string {
    let bin: string = "";
    for (let i: number = 0; i < bits.length; i++) {
        bin += bits[i] ? "1" : "0";
    }
    return `'${bin}'B`;
}

/**
 * AUTOMATIC TAGS encode `[n] IMPLICIT OBJECT IDENTIFIER` as a primitive
 * context-specific element. EXPLICIT TAGS wrap a universal OID in a
 * constructed inner element. Do not decode the outer value as an OID in the
 * constructed case.
 * 
 * @internal
 * @author Cursor Grok 4.6
 */
function oidFromElement (el: ASN1Element) {
    if (el.construction === ASN1Construction.primitive) {
        return el.objectIdentifier;
    }
    return el.inner.objectIdentifier;
}

/**
 * @internal
 * @author Cursor Grok 4.6
 */
function oidValue (el: ASN1Element): string {
    return oidFromElement(el).asn1Notation;
}

/**
 * @internal
 * @author Cursor Grok 4.6
 */
function oidJSON (el: ASN1Element): string {
    return oidFromElement(el).toJSON();
}

/**
 * Pretty-print the `identification` CHOICE shared by `EMBEDDED PDV` and
 * `CHARACTER STRING` (X.680, automatic tags 0–5).
 *
 * Falls back to {@link ASN1Element.toStringEx} if the encoding does not match
 * a known alternative.
 * 
 * @internal
 * @author Cursor Grok 4.6
 */
export function stringifyIdentification (el: ASN1Element, recursionTTL: number): string {
    if (el.tagClass !== ASN1TagClass.context) {
        return el.toStringEx(recursionTTL);
    }
    try {
        switch (el.tagNumber) {
        case 0: {
            const seq = el.sequence;
            return (
                "syntaxes : { abstract "
                + oidValue(seq[0])
                + " , transfer "
                + oidValue(seq[1])
                + " }"
            );
        }
        case 1:
            return `syntax : ${oidValue(el)}`;
        case 2:
            return `presentation-context-id : ${el.integer.toString()}`;
        case 3: {
            const seq = el.sequence;
            return (
                "context-negotiation : { presentation-context-id "
                + seq[0].integer.toString()
                + " , transfer-syntax "
                + oidValue(seq[1])
                + " }"
            );
        }
        case 4:
            return `transfer-syntax : ${oidValue(el)}`;
        case 5:
            return "fixed : NULL";
        default:
            return el.toStringEx(recursionTTL);
        }
    } catch {
        return el.toStringEx(recursionTTL);
    }
}

/**
 * JSON form of the `identification` CHOICE shared by `EMBEDDED PDV` and
 * `CHARACTER STRING`. Falls back to {@link ASN1Element.toJSONEx}.
 * 
 * @internal
 * @author Cursor Grok 4.6
 */
export function identificationToJSON (el: ASN1Element, recursionTTL: number): unknown {
    if (el.tagClass !== ASN1TagClass.context) {
        return el.toJSONEx(recursionTTL);
    }
    try {
        switch (el.tagNumber) {
        case 0: {
            const seq = el.sequence;
            return {
                syntaxes: {
                    abstract: oidJSON(seq[0]),
                    transfer: oidJSON(seq[1]),
                },
            };
        }
        case 1:
            return { syntax: oidJSON(el) };
        case 2:
            return { presentationContextId: el.integer };
        case 3: {
            const seq = el.sequence;
            return {
                contextNegotiation: {
                    presentationContextId: seq[0].integer,
                    transferSyntax: oidJSON(seq[1]),
                },
            };
        }
        case 4:
            return { transferSyntax: oidJSON(el) };
        case 5:
            return { fixed: null };
        default:
            return el.toJSONEx(recursionTTL);
        }
    } catch {
        return el.toJSONEx(recursionTTL);
    }
}
