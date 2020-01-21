import ASN1Element from "./asn1";

export
class ASN1Error extends Error {
    constructor (readonly m: string, readonly element?: ASN1Element) {
        super(m);
        Object.setPrototypeOf(this, ASN1Error.prototype);
    }
}

export
class ASN1NotImplementedError extends ASN1Error {
    constructor () {
        super("Not yet implemented.");
        Object.setPrototypeOf(this, ASN1Error.prototype);
    }
}

export
class ASN1RecursionError extends ASN1Error {
    constructor () {
        super("Recursion was too deep.");
        Object.setPrototypeOf(this, ASN1Error.prototype);
    }
}

export
class ASN1TruncationError extends ASN1Error {
    constructor (readonly m: string, readonly element?: ASN1Element) {
        super(m, element);
        Object.setPrototypeOf(this, ASN1Error.prototype);
    }
}

export
class ASN1OverflowError extends ASN1Error {
    constructor (readonly m: string, readonly element?: ASN1Element) {
        super(m, element);
        Object.setPrototypeOf(this, ASN1Error.prototype);
    }
}

export
class ASN1SizeError extends ASN1Error {
    constructor (readonly m: string, readonly element?: ASN1Element) {
        super(m, element);
        Object.setPrototypeOf(this, ASN1Error.prototype);
    }
}

export
class ASN1PaddingError extends ASN1Error {
    constructor (readonly m: string, readonly element?: ASN1Element) {
        super(m, element);
        Object.setPrototypeOf(this, ASN1Error.prototype);
    }
}

export
class ASN1UndefinedError extends ASN1Error {
    constructor (readonly m: string, readonly element?: ASN1Element) {
        super(m, element);
        Object.setPrototypeOf(this, ASN1Error.prototype);
    }
}

export
class ASN1CharactersError extends ASN1Error {
    constructor (readonly m: string, readonly element?: ASN1Element) {
        super(m, element);
        Object.setPrototypeOf(this, ASN1Error.prototype);
    }
}

export
class ASN1ConstructionError extends ASN1Error {
    constructor (readonly m: string, readonly element?: ASN1Element) {
        super(m, element);
        Object.setPrototypeOf(this, ASN1Error.prototype);
    }
}
