import type ASN1Element from "./asn1.mjs";

/**
 * Base class for all ASN.1-related errors.
 * @augments Error
 * @param {string} m - The error message.
 * @param {ASN1Element} [element] - The ASN.1 element related to the error, if any.
 */
export
class ASN1Error extends Error {
    constructor (readonly m: string, readonly element?: ASN1Element) {
        super(m);
        Object.setPrototypeOf(this, ASN1Error.prototype);
    }
}

/**
 * Error indicating that a feature or operation is not yet implemented.
 * @augments ASN1Error
 */
export
class ASN1NotImplementedError extends ASN1Error {
    constructor () {
        super("Not yet implemented.");
        Object.setPrototypeOf(this, ASN1NotImplementedError.prototype);
    }
}

/**
 * Error thrown when ASN.1 decoding or encoding exceeds the allowed recursion depth.
 * @augments ASN1Error
 */
export
class ASN1RecursionError extends ASN1Error {
    constructor () {
        super("Recursion was too deep.");
        Object.setPrototypeOf(this, ASN1RecursionError.prototype);
    }
}

/**
 * Error thrown when ASN.1 data is truncated or incomplete.
 * @augments ASN1Error
 * @param {string} m - The error message.
 * @param {ASN1Element} [element] - The ASN.1 element related to the error, if any.
 */
export
class ASN1TruncationError extends ASN1Error {
    constructor (override readonly m: string, override readonly element?: ASN1Element) {
        super(m, element);
        Object.setPrototypeOf(this, ASN1TruncationError.prototype);
    }
}

/**
 * Error thrown when an ASN.1 value overflows its allowed size or range.
 * @augments ASN1Error
 * @param {string} m - The error message.
 * @param {ASN1Element} [element] - The ASN.1 element related to the error, if any.
 */
export
class ASN1OverflowError extends ASN1Error {
    constructor (override readonly m: string, override readonly element?: ASN1Element) {
        super(m, element);
        Object.setPrototypeOf(this, ASN1OverflowError.prototype);
    }
}

/**
 * Error thrown when an ASN.1 value does not meet size constraints.
 * @augments ASN1Error
 * @param {string} m - The error message.
 * @param {ASN1Element} [element] - The ASN.1 element related to the error, if any.
 */
export
class ASN1SizeError extends ASN1Error {
    constructor (override readonly m: string, override readonly element?: ASN1Element) {
        super(m, element);
        Object.setPrototypeOf(this, ASN1SizeError.prototype);
    }
}

/**
 * Error thrown when ASN.1 data contains invalid or unexpected padding.
 * @augments ASN1Error
 * @param {string} m - The error message.
 * @param {ASN1Element} [element] - The ASN.1 element related to the error, if any.
 */
export
class ASN1PaddingError extends ASN1Error {
    constructor (override readonly m: string, override readonly element?: ASN1Element) {
        super(m, element);
        Object.setPrototypeOf(this, ASN1PaddingError.prototype);
    }
}

/**
 * Error thrown when an ASN.1 value is undefined or missing.
 * @augments ASN1Error
 * @param {string} m - The error message.
 * @param {ASN1Element} [element] - The ASN.1 element related to the error, if any.
 */
export
class ASN1UndefinedError extends ASN1Error {
    constructor (override readonly m: string, override readonly element?: ASN1Element) {
        super(m, element);
        Object.setPrototypeOf(this, ASN1UndefinedError.prototype);
    }
}

/**
 * Error thrown when ASN.1 data contains invalid or disallowed characters.
 * @augments ASN1Error
 * @param {string} m - The error message.
 * @param {ASN1Element} [element] - The ASN.1 element related to the error, if any.
 */
export
class ASN1CharactersError extends ASN1Error {
    constructor (override readonly m: string, override readonly element?: ASN1Element) {
        super(m, element);
        Object.setPrototypeOf(this, ASN1CharactersError.prototype);
    }
}

/**
 * Error thrown when ASN.1 data is constructed incorrectly or violates construction rules.
 * @augments ASN1Error
 * @param {string} m - The error message.
 * @param {ASN1Element} [element] - The ASN.1 element related to the error, if any.
 */
export
class ASN1ConstructionError extends ASN1Error {
    constructor (override readonly m: string, override readonly element?: ASN1Element) {
        super(m, element);
        Object.setPrototypeOf(this, ASN1ConstructionError.prototype);
    }
}
