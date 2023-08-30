import decodeObjectIdentifier from "../codecs/x690/decoders/decodeObjectIdentifier";
import encodeObjectIdentifier from "../codecs/x690/encoders/encodeObjectIdentifier";

const PERIOD = ".".charCodeAt(0);

export default
class ObjectIdentifier {
    private _nodes: Uint32Array;

    constructor (nodes: number[], prefix?: ObjectIdentifier | number) {
        const _nodes: number[] = prefix
            ? typeof prefix === "number"
                ? [ prefix, ...nodes ]
                : [ ...prefix.nodes, ...nodes ]
            : nodes.slice(0);
        if (_nodes.length < 2) {
            throw new Error("Cannot construct an OID with less than two nodes!");
        }
        if ((_nodes[0] < 0) || (_nodes[0] > 2)) {
            throw new Error("OIDs first node must be 0, 1, or 2!");
        }
        if (((_nodes[0] < 2) && (_nodes[1] > 39)) || (_nodes[1] > 175)) {
            throw new Error(
                "OID Node #2 cannot exceed 39 if node #1 is 0 or 1, and 175 "
                + `if node #1 is 2. Received these nodes: ${_nodes}.`,
            );
        }
        this._nodes = new Uint32Array(_nodes);
    }

    get nodes (): number[] {
        return Array.from(this._nodes);
    }

    get dotDelimitedNotation (): string {
        return this._nodes.join(".");
    }

    get asn1Notation (): string {
        return `{ ${Array.from(this._nodes).map((node) => node.toString()).join(" ")} }`;
    }

    public toString (): string {
        return this.dotDelimitedNotation;
    }

    public toJSON (): string {
        return this.dotDelimitedNotation;
    }

    public toBytes (): Buffer {
        return encodeObjectIdentifier(this);
    }

    public static fromString (str: string): ObjectIdentifier {
        // return new ObjectIdentifier(str.split(".").map((arc) => Number.parseInt(arc, 10)));
        // for (const s of str.split(".")) {
        //     arcs.push(Number.parseInt(s, 10));
        // }

        // Benchmarking showed this to be the most performant approach.
        const arcs: number[] = [];
        let last = 0;
        let i = 0;
        while (i < str.length) {
            if (str.charCodeAt(i) === PERIOD) {
                const arc = Number.parseInt(str.slice(last, i - 1), 10);
                arcs.push(arc);
                last = i + 1;
            }
            i++;
        }
        return new ObjectIdentifier(arcs);
    }

    public static fromBytes (bytes: Uint8Array): ObjectIdentifier {
        return decodeObjectIdentifier(bytes);
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
        if (a._nodes.length !== b._nodes.length) {
            return false;
        }
        const len = a._nodes.length;
        let i = len - 1;
        while (i >= 0) {
            if (a._nodes[i] !== b._nodes[i]) {
                return false;
            }
            i--;
        }
        return true;
    }

    public isEqualTo (other: ObjectIdentifier): boolean {
        return ObjectIdentifier.compare(this, other);
    }
}
