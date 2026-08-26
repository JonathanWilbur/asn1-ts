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
        const subcomponents: number[] = decodeRelativeObjectIdentifier(this.encoding);
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
     * @returns {string} The OID as a dot-delimited string
     */
    public toString (): string {
        return this.dotDelimitedNotation;
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
        if (bytes[len - 1] >= 0x80) {
            throw new errors.ASN1TruncationError("OID was truncated.");
        }
        if (len >= 2 && bytes[1] === 0x80) {
            throw new errors.ASN1PaddingError("Prohibited padding on OBJECT IDENTIFIER node.");
        }
        let continuations: number = (bytes[0] >= 0x80) ? 1 : 0;
        for (let i: number = 1; i < len; i++) {
            const byte: number = bytes[i];
            if (i >= 2 && byte === 0x80 && bytes[i - 1] < 0x80) {
                throw new errors.ASN1PaddingError("Prohibited padding on OBJECT IDENTIFIER node.");
            }
            if (byte >= 0x80) {
                continuations++;
                if (continuations >= 8) {
                    throw new errors.ASN1OverflowError("OBJECT IDENTIFIER node too large to decode.");
                }
            } else {
                continuations = 0;
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
