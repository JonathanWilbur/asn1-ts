import * as errors from "../errors.mjs";
import type { INTEGER } from "../macros.mjs";

const MIN_SAFE = BigInt(Number.MIN_SAFE_INTEGER);
const MAX_SAFE = BigInt(Number.MAX_SAFE_INTEGER);

/**
 * @summary Throw if `str` is not a valid ISO 8601 encoding of `label`.
 * @param {string} label - The ISO 8601 production being parsed.
 * @param {string} str - The rejected input.
 * @returns {never}
 * @function
 */
export
function invalidISO (label: string, str: string): never {
    throw new errors.ASN1Error(`Invalid ISO 8601 ${label}: ${str}`);
}

/**
 * @summary Match `str` against `regex` or throw an {@link ASN1Error}.
 * @param {string} str - The input string.
 * @param {RegExp} regex - A fully-anchored regular expression.
 * @param {string} label - The ISO 8601 production being parsed.
 * @returns {RegExpExecArray} The match.
 * @function
 */
export
function matchISO (str: string, regex: RegExp, label: string): RegExpExecArray {
    const match = regex.exec(str);
    if (!match) {
        invalidISO(label, str);
    }
    return match;
}

/**
 * @summary Parse a decimal integer, using `bigint` when it is not a safe integer.
 * @param {string} str - Decimal digits, optionally with a leading `-`.
 * @returns {INTEGER} The parsed integer.
 * @function
 */
export
function parseISOInteger (str: string): INTEGER {
    const n = BigInt(str);
    if (n >= MIN_SAFE && n <= MAX_SAFE) {
        return Number(n);
    }
    return n;
}

/**
 * @summary Parse an ISO 8601 year (`YYYY`, at least four digits, optional `-`).
 * @param {string} str - The year token.
 * @returns {INTEGER} The parsed year.
 * @function
 */
export
function parseISOYear (str: string): INTEGER {
    if (!/^-?\d{4,}$/.test(str)) {
        invalidISO("year", str);
    }
    return parseISOInteger(str);
}

/**
 * @summary Parse a two-digit ISO 8601 component such as `MM`, `DD`, `HH`.
 * @param {string} str - Exactly two decimal digits.
 * @param {string} label - The component name for error messages.
 * @returns {number} The parsed component.
 * @function
 */
export
function parseISOTwoDigit (str: string, label: string): number {
    if (!/^\d{2}$/.test(str)) {
        invalidISO(label, str);
    }
    return Number(str);
}

/**
 * @summary Parse a non-negative decimal integer (used for fractional seconds).
 * @param {string} str - One or more decimal digits.
 * @param {string} label - The component name for error messages.
 * @returns {number} The parsed integer.
 * @function
 */
export
function parseISONonNegativeInteger (str: string, label: string): number {
    if (!/^\d+$/.test(str)) {
        invalidISO(label, str);
    }
    const n = parseISOInteger(str);
    if (typeof n !== "number") {
        invalidISO(label, str);
    }
    return n;
}

/**
 * @summary Parse an ISO 8601 UTC offset (`Z` or `±HH:MM`) as minutes east of UTC.
 * @param {string} str - The offset token.
 * @returns {number} Minutes east of UTC.
 * @function
 */
export
function parseISOOffset (str: string): number {
    if (str === "Z") {
        return 0;
    }
    const match = /^([+-])(\d{2}):(\d{2})$/.exec(str);
    if (!match) {
        invalidISO("UTC offset", str);
    }
    const minutes = (Number(match[2]) * 60) + Number(match[3]);
    return match[1] === "-" ? -minutes : minutes;
}
