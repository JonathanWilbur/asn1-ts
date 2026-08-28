import decodeRelativeObjectIdentifier from "../codecs/x690/decoders/decodeRelativeObjectIdentifier.mjs";
import {
    encodeRelativeObjectIdentifierWithPrefix,
    encodeObjectIdentifierFromArcs,
} from "../codecs/x690/encoders/encodeRelativeObjectIdentifier.mjs";
import { Buffer } from "node:buffer";
import * as errors from "../errors.mjs";
import type { SingleThreadBuffer } from "../macros.mjs";

const PERIOD = ".".charCodeAt(0);

/**
 * Decode RELATIVE-OID / OBJECT IDENTIFIER content octets into arcs, using
 * `bigint` for any arc that does not fit in `Number.MAX_SAFE_INTEGER`.
 *
 * Kept separate from {@link decodeRelativeObjectIdentifier} so the common
 * number-only path can stay a homogeneous `number[]`.
 * 
 * @author Cursor Grok 4.6
 */
function decodeRelativeObjectIdentifierBigAndSmall (
    value: Uint8Array,
    typeName = "RELATIVE-OID",
): (number | bigint)[] {
    const len: number = value.length;
    if (len === 0) {
        return [];
    }
    if (len === 1) {
        const b0: number = value[0];
        if (b0 < 0x80) {
            return [ b0 ];
        }
        if (b0 === 0x80) {
            throw new errors.ASN1PaddingError(`Prohibited padding on ${typeName} node.`);
        }
        return [];
    }
    if (value[len - 1] >= 0x80) {
        throw new errors.ASN1TruncationError(`${typeName} was truncated.`);
    }

    let nodeCount: number = 0;
    for (let j: number = 0; j < len; j++) {
        if (value[j] < 0x80) {
            nodeCount++;
        }
    }
    const nodes: (number | bigint)[] = new Array(nodeCount);
    if (nodeCount === len) {
        for (let j: number = 0; j < len; j++) {
            nodes[j] = value[j];
        }
        return nodes;
    }

    let n: number = 0;
    let i: number = 0;
    decode: while (i < len) {
        const b0: number = value[i];
        if (b0 < 0x80) {
            nodes[n++] = b0;
            i++;
            continue;
        }
        if (b0 === 0x80) {
            throw new errors.ASN1PaddingError(`Prohibited padding on ${typeName} node.`);
        }
        const b1: number = value[++i];
        if (b1 < 0x80) {
            nodes[n++] = ((b0 & 0x7F) << 7) | b1;
            i++;
            continue;
        }
        const b2: number = value[++i];
        if (b2 < 0x80) {
            nodes[n++] = ((b0 & 0x7F) << 14) | ((b1 & 0x7F) << 7) | b2;
            i++;
            continue;
        }
        const b3: number = value[++i];
        if (b3 < 0x80) {
            nodes[n++] = ((b0 & 0x7F) << 21) | ((b1 & 0x7F) << 14) | ((b2 & 0x7F) << 7) | b3;
            i++;
            continue;
        }
        // 4 bytes already consumed (28 bits). Up to 3 more stay within 49 bits
        // and are exact as Number. The 8th octet can exceed 53 bits, so the
        // accumulator is converted to bigint *before* that multiply — Number
        // cannot represent every integer past Number.MAX_SAFE_INTEGER, and
        // BigInt() would then see a rounded float, not the true arc.
        let current_node: number = ((b0 & 0x7F) << 21)
            | ((b1 & 0x7F) << 14)
            | ((b2 & 0x7F) << 7)
            | (b3 & 0x7F);
        for (let extra: number = 0; extra < 3; extra++) {
            if (++i >= len) {
                throw new errors.ASN1TruncationError(`${typeName} was truncated.`);
            }
            const byte: number = value[i];
            current_node = (current_node * 128) + (byte & 0x7F);
            if (byte < 0x80) {
                nodes[n++] = current_node;
                i++;
                continue decode;
            }
        }
        let big: bigint = BigInt(current_node);
        while (true) {
            if (++i >= len) {
                throw new errors.ASN1TruncationError(`${typeName} was truncated.`);
            }
            const byte: number = value[i];
            big = (big << 7n) | BigInt(byte & 0x7F);
            if (byte < 0x80) {
                nodes[n++] = (big <= BigInt(Number.MAX_SAFE_INTEGER))
                    ? Number(big)
                    : big;
                i++;
                continue decode;
            }
        }
    }
    return nodes;
}

/**
 * @function
 * @author Cursor Grok 4.6
 */
function parseDecimalOidArc (s: string): bigint {
    const len: number = s.length;
    if (len === 0) {
        throw new SyntaxError("Cannot parse empty OID arc.");
    }
    for (let j: number = 0; j < len; j++) {
        const c: number = s.charCodeAt(j);
        if (c < 48 || c > 57) { // '0'-'9'
            throw new SyntaxError(`Invalid OID arc: ${s}`);
        }
    }
    return BigInt(s);
}

/**
 * @function
 * @author Cursor Grok 4.6
 */
function encodedBigArcLength (arc: bigint): number {
    if (arc < 0x80n) {
        return 1;
    }
    if (arc < 0x4000n) {
        return 2;
    }
    if (arc < 0x200000n) {
        return 3;
    }
    if (arc < 0x10000000n) {
        return 4;
    }
    let n: number = 1;
    let v: bigint = arc;
    while (v >= 0x80n) {
        n++;
        v >>= 7n;
    }
    return n;
}

/**
 * @function
 * @author Cursor Grok 4.6
 */
function writeBigArc (bytes: Uint8Array, o: number, arc: bigint): number {
    if (arc < 0x80n) {
        bytes[o++] = Number(arc);
        return o;
    }
    const stack: number[] = [ Number(arc & 0x7Fn) ];
    let v: bigint = arc >> 7n;
    while (v > 0n) {
        stack.push(Number(v & 0x7Fn) | 0x80);
        v >>= 7n;
    }
    for (let k: number = stack.length - 1; k >= 0; k--) {
        bytes[o++] = stack[k];
    }
    return o;
}

/**
 * @function
 * @author Cursor Grok 4.6
 */
function encodeObjectIdentifierFromBigArcs (arcs: bigint[]): Uint8Array {
    const leading: bigint = (arcs[0] * 40n) + arcs[1];
    let byteLen: number = encodedBigArcLength(leading);
    for (let a: number = 2; a < arcs.length; a++) {
        byteLen += encodedBigArcLength(arcs[a]);
    }
    const bytes: Uint8Array = Buffer.alloc(byteLen);
    let o: number = writeBigArc(bytes, 0, leading);
    for (let a: number = 2; a < arcs.length; a++) {
        o = writeBigArc(bytes, o, arcs[a]);
    }
    return bytes;
}

/**
 * An `ObjectIdentifier` is a constructed data type, defined
 * in the [International Telecommunications Union](https://www.itu.int)'s
 * [X.660](https://www.itu.int/rec/T-REC-X.660/en).
 *
 * It is a sequence of unsigned integers assigned by authorities, and which
 * can be delegated to other authorities and organizations to form a
 * hierarchical namespace of unique identifiers.
 */
export default
class ObjectIdentifier {
    /**
     * The BER / CER / DER encoding of the object identifier. This approach was
     * used because:
     *
     * 1. It tolerates any size of integer.
     * 2. It is maximally efficient with memory usage.
     * 3. It gives the best performance for comparison of object identifiers.
     * 4. It gives the best performance for decoding and encoding object identifiers.
     *
     * This approach comes at the expense of some performance when printing
     * object identifiers, but this is not expected to be as frequent as
     * comparison, encoding, and decoding. This same encoding is used for
     * the packed encoding rules and likely other encoding rules, so does not
     * bias against the implementation of other encoding rules.
     */
    protected encoding: Uint8Array = new Uint8Array(0);

    /**
     * @summary Get a read-only copy of the underlying X.690 encoding
     * @description
     *
     * **DO NOT MODIFY THE RETURN VALUE**
     *
     * In the interest of high performance, you may want to avoid allocating a
     * new bytes array when you want to obtain the X.690 encoding of this
     * object identifier. This method allows you to obtain a reference to the
     * underlying `Uint8Array` on which the encoding is stored, which means no
     * allocation.
     *
     * However, this returned `Uint8Array` **MUST NOT** be modified. Doing so
     * risks cached data being invalidated currently, and could break more
     * things in the future, since the immutability of this bytes is a design
     * assumption.
     *
     * @returns {Uint8Array} A copy of the underlying x.690 encoding
     */
    public toBytesUnsafe(): Uint8Array {
        return this.encoding;
    }

    /**
     * @summary Get the number of bytes in the X.690 encoding
     * @description
     *
     * Return the byte length of the BER / CER / DER encoding of this object
     * identifier, which does not include the tag or length octets: just the
     * content octets.
     *
     * Example: for the `commonName` object identifier (`2.5.4.3`) this returns
     * `3` because the object identifier is encoded on three bytes: `0xFF0403`.
     *
     * @returns The number of bytes of the X.690-encoded object identifier
     */
    public byteLength(): number {
        return this.encoding.length;
    }

    /**summary
     * @summary Constructs a new object identifier from a list of OID arcs and optionally a prefix.
     * @description
     *
     * This function constructs a new object identifier from a list of OID arcs
     * and optionally a prefix. If a prefix is provided, it will be prefixed to
     * the new OID. If no prefix is provided, the new OID will be constructed
     * from the provided arcs. The OID arcs are validated.
     *
     * @param nodes OID arcs
     * @param prefix OID to prefix the new OID with
     * @returns A new object identifier
     * @function
     */
    public static fromParts (nodes: number[], prefix?: ObjectIdentifier | number): ObjectIdentifier {
        const oid = new ObjectIdentifier();
        if (prefix !== undefined && typeof prefix !== "number") {
            oid.encoding = encodeRelativeObjectIdentifierWithPrefix(prefix.encoding, nodes);
            return oid;
        }
        const first: number = (typeof prefix === "number") ? prefix : nodes[0];
        const second: number = (typeof prefix === "number") ? nodes[0] : nodes[1];
        const restStart: number = (typeof prefix === "number") ? 1 : 2;
        const arcCount: number = (typeof prefix === "number") ? (nodes.length + 1) : nodes.length;
        if (arcCount < 2) {
            throw new Error("Cannot construct an OID with less than two nodes!");
        }
        if ((first < 0) || (first > 2)) {
            throw new Error("OIDs first node must be 0, 1, or 2!");
        }
        if ((first < 2) && (second > 39)) {
            throw new Error(`OID Node #2 cannot exceed 39 if node #1 is 0 or 1. Received these nodes: ${
                (typeof prefix === "number") ? [ prefix, ...nodes ] : nodes
            }.`);
        }
        oid.encoding = encodeObjectIdentifierFromArcs(first, second, nodes, restStart);
        return oid;
    }

    /**
     * @summary Get the the OID arcs as an array of numbers.
     * @returns {number[]} The OID arcs
     * @function
     */
    get nodes (): number[] {
        const subcomponents: number[] = decodeRelativeObjectIdentifier(this.encoding, "OBJECT IDENTIFIER");
        const first: number = subcomponents[0];
        const nodes: number[] = new Array(subcomponents.length + 1);
        nodes[0] = Math.min(2, Math.floor(first / 40));
        nodes[1] = (first >= 80)
            ? (first - 80)
            : (first % 40);
        for (let i: number = 1; i < subcomponents.length; i++) {
            nodes[i + 1] = subcomponents[i];
        }
        return nodes;
    }

    /**
     * @summary Get the OID arcs as an array of numbers and/or BigInts.
     * @description
     *
     * Like {@link nodes}, but arcs that exceed `Number.MAX_SAFE_INTEGER` are
     * returned as `bigint` values so that object identifiers with unbounded
     * arc sizes can be represented exactly. Arcs that fit in a safe integer
     * remain `number`s.
     *
     * @returns {(number | bigint)[]} The OID arcs
     * @function
     * @author Cursor Grok 4.6
     */
    get nodesBigAndSmall (): (number | bigint)[] {
        const subcomponents: (number | bigint)[] = decodeRelativeObjectIdentifierBigAndSmall(
            this.encoding,
            "OBJECT IDENTIFIER",
        );
        const first: number | bigint = subcomponents[0];
        const nodes: (number | bigint)[] = new Array(subcomponents.length + 1);
        if (typeof first === "bigint") {
            // A bigint first subcomponent is always >= 80, so the first arc is 2.
            nodes[0] = 2;
            const second: bigint = first - 80n;
            nodes[1] = (second <= BigInt(Number.MAX_SAFE_INTEGER))
                ? Number(second)
                : second;
        } else {
            nodes[0] = Math.min(2, Math.floor(first / 40));
            nodes[1] = (first >= 80)
                ? (first - 80)
                : (first % 40);
        }
        for (let i: number = 1; i < subcomponents.length; i++) {
            nodes[i + 1] = subcomponents[i];
        }
        return nodes;
    }

    private dotDelimitedNotationCached: string | null = null;

    /**
     * @summary Get the OID as a dot-delimited string.
     * @description
     *
     * This function returns the OID as a dot-delimited string.
     *
     * Example output: `1.2.840.113549.1.1.1`
     *
     * The output is cached between calls, because this string is often used to
     * index object identifiers in a `Set` or `Map`. This string could become
     * invalid if you somehow modify the underlying bytes for this type.
     *
     * @returns {string} The OID as a dot-delimited string
     * @function
     */
    get dotDelimitedNotation (): string {
        if (this.dotDelimitedNotationCached) {
            return this.dotDelimitedNotationCached;
        }
        const ret = this.nodes.join(".");
        this.dotDelimitedNotationCached = ret;
        return ret;
    }

    /**
     * @summary Get the OID as an ASN.1 notation string.
     * @description
     *
     * This function returns the OID as an ASN.1 notation string.
     *
     * Example output: `{ 1 2 840 113549 1 1 1 }`
     *
     * @returns {string} The OID as an ASN.1 notation string
     * @function
     */
    get asn1Notation (): string {
        return `{ ${Array.from(this.nodes).map((node) => node.toString()).join(" ")} }`;
    }

    /**
     * @summary Get the OID as a dot-delimited string.
     * @description
     *
     * This function returns the OID as a dot-delimited string.
     *
     * Example output: `1.2.840.113549.1.1.1`
     *
     * If {@link nodes} overflows, the string is built from
     * {@link nodesBigAndSmall} so that oversized arcs are printed exactly.
     *
     * @returns {string} The OID as a dot-delimited string
     */
    public toString (): string {
        try {
            return this.dotDelimitedNotation;
        } catch (e) {
            if (e instanceof errors.ASN1OverflowError) {
                const ret = this.nodesBigAndSmall.join(".");
                this.dotDelimitedNotationCached = ret;
                return ret;
            }
            throw e;
        }
    }

    /**
     * @summary Get the OID as a dot-delimited string.
     * @description
     *
     * This function returns the OID as a dot-delimited string.
     *
     * Example output: `1.2.840.113549.1.1.1`
     *
     * @returns {string} The OID as a dot-delimited string
     */
    public toJSON (): string {
        return this.dotDelimitedNotation;
    }

    /**
     * @summary Get the OID as a BER / CER / DER encoded byte array.
     * @description
     *
     * This function returns the OID as a byte array.
     *
     * Example output: `Buffer<55, 04, 03>` (for 2.5.4.3)
     *
     * @returns {Buffer} The OID as a byte array
     */
    public toBytes (): SingleThreadBuffer {
        return Buffer.from(this.encoding);
    }

    /**
     * @summary Constructs a new object identifier from a dot-delimited string.
     * @description
     *
     * This function constructs a new object identifier from a dot-delimited
     * string.
     *
     * @param str The OID as a dot-delimited string
     * @returns A new object identifier
     * @function
     */
    public static fromString (str: string): ObjectIdentifier {
        // Benchmarking showed this to be the most performant approach.
        const arcs: number[] = [];
        let last = 0;
        let i = 0;
        while (i < str.length) {
            if (str.charCodeAt(i) === PERIOD) {
                const arc = Number.parseInt(str.slice(last, i), 10);
                arcs.push(arc);
                last = i + 1;
            }
            i++;
        }
        const arc = Number.parseInt(str.slice(last, i), 10);
        arcs.push(arc);
        return ObjectIdentifier.fromParts(arcs);
    }

    /**
     * @summary Constructs a new object identifier from a dot-delimited string, preserving oversized arcs.
     * @description
     *
     * Like {@link fromString}, but each arc is parsed as a `bigint` so that
     * values larger than `Number.MAX_SAFE_INTEGER` are encoded exactly.
     * Arcs that fit in a safe integer still produce the same encoding as
     * {@link fromString}.
     *
     * @param str The OID as a dot-delimited string
     * @returns A new object identifier
     * @function
     * @author Cursor Grok 4.6
     */
    public static fromStringWithBigArcs (str: string): ObjectIdentifier {
        const arcs: bigint[] = [];
        let last = 0;
        let i = 0;
        while (i < str.length) {
            if (str.charCodeAt(i) === PERIOD) {
                arcs.push(parseDecimalOidArc(str.slice(last, i)));
                last = i + 1;
            }
            i++;
        }
        arcs.push(parseDecimalOidArc(str.slice(last, i)));
        if (arcs.length < 2) {
            throw new Error("Cannot construct an OID with less than two nodes!");
        }
        const first: bigint = arcs[0];
        const second: bigint = arcs[1];
        if ((first < 0n) || (first > 2n)) {
            throw new Error("OIDs first node must be 0, 1, or 2!");
        }
        if ((first < 2n) && (second > 39n)) {
            throw new Error(`OID Node #2 cannot exceed 39 if node #1 is 0 or 1. Received these nodes: ${arcs}.`);
        }
        const maxSafe: bigint = BigInt(Number.MAX_SAFE_INTEGER);
        let allSmall: boolean = true;
        for (let a: number = 0; a < arcs.length; a++) {
            if (arcs[a] > maxSafe) {
                allSmall = false;
                break;
            }
        }
        if (allSmall) {
            const numbers: number[] = new Array(arcs.length);
            for (let a: number = 0; a < arcs.length; a++) {
                numbers[a] = Number(arcs[a]);
            }
            return ObjectIdentifier.fromParts(numbers);
        }
        const oid = new ObjectIdentifier();
        oid.encoding = encodeObjectIdentifierFromBigArcs(arcs);
        return oid;
    }

    /**
     * @summary Constructs a new object identifier from a BER / CER / DER encoded byte array.
     * @description
     *
     * This function constructs a new object identifier from a BER / CER / DER encoded byte array.
     *
     * @param bytes The OID as a BER / CER / DER encoded byte array
     * @returns A new object identifier
     * @function
     */
    public static fromBytes (bytes: Uint8Array): ObjectIdentifier {
        const len: number = bytes.length;
        if (len === 0) {
            throw new errors.ASN1TruncationError("Encoded value was too short to be an OBJECT IDENTIFIER!");
        }
        if (bytes[0] === 0x80) {
            throw new errors.ASN1PaddingError("Prohibited padding on OBJECT IDENTIFIER node.");
        }
        if (bytes[len - 1] >= 0x80) {
            throw new errors.ASN1TruncationError("OID was truncated.");
        }
        for (let i: number = 1; i < len; i++) {
            const byte: number = bytes[i];
            if (byte === 0x80 && bytes[i - 1] < 0x80) {
                throw new errors.ASN1PaddingError("Prohibited padding on OBJECT IDENTIFIER node.");
            }
        }
        const oid = new ObjectIdentifier();
        oid.encoding = bytes;
        return oid;
    }

    /**
     * @summary UNSAFELY construct a new object identifier from a BER / CER / DER encoded byte array.
     * @description
     *
     * This function constructs a new object identifier from a BER / CER / DER
     * encoded byte array without validating the encoding.
     *
     * @param bytes The OID as a BER / CER / DER encoded byte array
     * @returns A new object identifier
     * @function
     */
    public static fromBytesUnsafe (bytes: Uint8Array): ObjectIdentifier {
        const oid = new ObjectIdentifier();
        oid.encoding = bytes;
        return oid;
    }

    /**
     * @summary Compares two object identifiers.
     * @description
     *
     * This function compares two object identifiers. As an optimization, it
     * compares them in reverse order, because the first arc of the OID can only
     * take on three values, so it is highly likely to match, and the second arc
     * can only take up about 150 values. The final arc, on the other hand, is
     * the mostly likely to differ. Checking this last arc first allows us to
     * bail out sooner if the OIDs are not equal.
     *
     * @param {ObjectIdentifier} a An object identifier
     * @param {ObjectIdentifier} b The other object identifier
     * @returns `true` if the object identifiers match, `false` otherwise.
     */
    public static compare (a: ObjectIdentifier, b: ObjectIdentifier): boolean {
        return Buffer.compare(a.encoding, b.encoding) === 0;
    }

    /**
     * @summary Compares this object identifier to another object identifier.
     * @description
     *
     * This function compares this object identifier to another object identifier.
     *
     * @param other The other object identifier
     * @returns `true` if the object identifiers match, `false` otherwise.
     * @function
     */
    public isEqualTo (other: ObjectIdentifier): boolean {
        return ObjectIdentifier.compare(this, other);
    }
}
