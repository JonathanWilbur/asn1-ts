import encodeRelativeObjectIdentifier from "../codecs/x690/encoders/encodeRelativeObjectIdentifier.mjs";
import decodeRelativeObjectIdentifier from "../codecs/x690/decoders/decodeRelativeObjectIdentifier.mjs";
import { Buffer } from "node:buffer";
import * as errors from "../errors.mjs";

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
    protected encoding: Uint8Array = new Uint8Array(0);

    constructor () {}

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

    get dotDelimitedNotation (): string {
        return this.nodes.join(".");
    }

    get asn1Notation (): string {
        return `{ ${Array.from(this.nodes).map((node) => node.toString()).join(" ")} }`;
    }

    public toString (): string {
        return this.dotDelimitedNotation;
    }

    public toJSON (): string {
        return this.dotDelimitedNotation;
    }

    public toBytes (): Buffer {
        return Buffer.from(this.encoding);
    }

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

    public isEqualTo (other: ObjectIdentifier): boolean {
        return ObjectIdentifier.compare(this, other);
    }
}
