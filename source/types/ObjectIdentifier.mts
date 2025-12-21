import encodeRelativeObjectIdentifier from "../codecs/x690/encoders/encodeRelativeObjectIdentifier.mjs";
import decodeRelativeObjectIdentifier from "../codecs/x690/decoders/decodeRelativeObjectIdentifier.mjs";
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
        let _nodes = typeof prefix === "number" ? [ prefix, ...nodes ] : nodes;
        if (!prefix || typeof prefix === "number") {
            if (_nodes.length < 2) {
                throw new Error("Cannot construct an OID with less than two nodes!");
            }
            if ((_nodes[0] < 0) || (_nodes[0] > 2)) {
                throw new Error("OIDs first node must be 0, 1, or 2!");
            }
            if (((_nodes[0] < 2) && (_nodes[1] > 39))) {
                throw new Error(`OID Node #2 cannot exceed 39 if node #1 is 0 or 1. Received these nodes: ${_nodes}.`);
            }
        }
        const oid = new ObjectIdentifier();
        if (prefix && typeof prefix !== "number") {
            oid.encoding = Buffer.concat([ prefix.encoding, encodeRelativeObjectIdentifier(_nodes) ]);
        } else {
            oid.encoding = encodeRelativeObjectIdentifier([
                (_nodes[0] * 40) + _nodes[1],
                ..._nodes.slice(2),
            ]);
        }
        return oid;
    }

    /**
     * @summary Get the the OID arcs as an array of numbers.
     * @returns {number[]} The OID arcs
     * @function
     */
    get nodes (): number[] {
        const subcomponents = decodeRelativeObjectIdentifier(this.encoding);
        return [
            Math.min(2, Math.floor(subcomponents[0] / 40)),
            ((subcomponents[0] >= 80)
                ? (subcomponents[0] - 80)
                : (subcomponents[0] % 40)),
            ...subcomponents.slice(1),
        ];
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
     * @function
     */
    get dotDelimitedNotation (): string {
        return this.nodes.join(".");
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
        if (bytes.length === 0) {
            throw new errors.ASN1TruncationError("Encoded value was too short to be an OBJECT IDENTIFIER!");
        }
        if (bytes[bytes.length - 1] & 0b10000000) {
            throw new errors.ASN1TruncationError("OID was truncated.");
        }

        let current_node: number = 0;
        for (let i = 1; i < bytes.length; i++) {
            const byte = bytes[i];
            if ((current_node === 0) && (byte === 0x80)) {
                throw new errors.ASN1PaddingError("Prohibited padding on OBJECT IDENTIFIER node.");
            }
            if (byte < 0x80) {
                current_node = 0;
            } else {
                current_node++;
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
