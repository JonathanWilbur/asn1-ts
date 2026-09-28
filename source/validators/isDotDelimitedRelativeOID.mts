/**
 * Branded dot-delimited RELATIVE-OID string and its type guard.
 *
 * A valid dot-delimited RELATIVE-OID consists of at least one decimal arc,
 * with arcs separated by single periods, no leading, trailing, or empty arcs,
 * and no leading zeroes (except the arc `0` itself). Unlike OBJECT
 * IDENTIFIERs, arc values are unconstrained: any non-negative integer is
 * permitted in any position.
 *
 * @module
 */
import type {
    AreValidOIDTailArcs,
    SplitOIDArcs,
} from "./isDotDelimitedOID.mjs";

/**
 * Brand for {@link DotDelimitedRelativeOidString}.
 *
 * Declared but never emitted; it only exists at the type level so a plain
 * `string` is not assignable to {@link DotDelimitedRelativeOidString}
 * without narrowing via {@link isDotDelimitedRelativeOID} (or an explicit
 * cast).
 */
declare const DOT_DELIMITED_RELATIVE_OID_BRAND: unique symbol;

/**
 * A dot-delimited RELATIVE-OID string (e.g. `"840.113549.1.1.1"`).
 *
 * This is a branded string: a plain `string` is not assignable to it without
 * first passing the {@link isDotDelimitedRelativeOID} type guard (or an
 * explicit cast). For compile-time checking of literals, see
 * {@link IsValidDOTDelimitedRelativeOID}.
 */
export type DotDelimitedRelativeOidString = string & {
    readonly [DOT_DELIMITED_RELATIVE_OID_BRAND]: typeof DOT_DELIMITED_RELATIVE_OID_BRAND;
};

/**
 * Compile-time check that `S` is a valid dot-delimited RELATIVE-OID: at
 * least one arc, no empty arcs, and no leading zeroes.
 *
 * Use it to constrain literals, e.g.
 * `function f<S extends string>(roid: S & (IsValidDOTDelimitedRelativeOID<S> extends true ? unknown : never))`.
 * Runtime input must still be narrowed with
 * {@link isDotDelimitedRelativeOID}.
 */
export type IsValidDOTDelimitedRelativeOID<S extends string> = AreValidOIDTailArcs<
    SplitOIDArcs<S>
>;

/**
 * @summary Determine whether a value is a valid dot-delimited RELATIVE-OID string
 * @description
 *
 * Returns `true` when `value` is a string of at least one decimal arc, with
 * arcs separated by single periods, and with:
 *
 * - no empty arcs (hence no leading, trailing, or doubled periods); and
 * - no leading zeroes (except the arc `0` itself).
 *
 * Arc values are unconstrained, unlike OBJECT IDENTIFIERs. Arcs may be
 * arbitrarily large: they are validated syntactically and never converted to
 * `number`, so arcs beyond `Number.MAX_SAFE_INTEGER` are accepted.
 *
 * @param {string} value The value to test
 * @returns {boolean} `true` if `value` is a valid dot-delimited RELATIVE-OID string
 * @function
 */
export function isDotDelimitedRelativeOID (value: string): value is DotDelimitedRelativeOidString {
    const len: number = value.length;
    if (len < 1) {
        return false;
    }
    // Leading or trailing period means an empty arc.
    if (value.charCodeAt(0) === 46 || value.charCodeAt(len - 1) === 46) { // "."
        return false;
    }
    let arcLength: number = 0;
    let arcFirstCharCode: number = 0;
    for (let i: number = 0; i < len; i++) {
        const c: number = value.charCodeAt(i);
        if (c === 46) { // "."
            // Empty arc (doubled period).
            if (arcLength === 0) {
                return false;
            }
            arcLength = 0;
            continue;
        }
        if (c < 48 || c > 57) { // not "0"-"9"
            return false;
        }
        if (arcLength === 0) {
            arcFirstCharCode = c;
        } else if (arcLength === 1 && arcFirstCharCode === 48) {
            // Leading zero: an arc longer than one char may not start with "0".
            return false;
        }
        arcLength++;
    }
    // A trailing period would leave the final arc empty.
    if (arcLength === 0) {
        return false;
    }
    return true;
}

export default isDotDelimitedRelativeOID;
