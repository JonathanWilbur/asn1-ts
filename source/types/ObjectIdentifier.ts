export default
class ObjectIdentifier {
    public readonly _nodes: number[];

    constructor (nodes: number[], prefix?: ObjectIdentifier | number) {
        const _nodes: number[] = prefix
            ? typeof prefix === "number"
                ? [ prefix ].concat(nodes)
                : prefix._nodes.concat(nodes)
            : nodes.slice(0);

        if (_nodes.length < 2) {
            throw new Error("Cannot construct an OID with less than two nodes!");
        }

        if (_nodes.length >= 1 && !(_nodes[0] in [0, 1, 2])) {
            throw new Error("OIDs first node must be 0, 1, or 2!");
        }

        if (!_nodes.every((node) => Number.isSafeInteger(node))) {
            throw new Error("OID contained a non-safe integer value.");
        }

        if (
            ((_nodes[0] < 2) && _nodes[1] > 39)
            || (_nodes[0] === 2 && _nodes[1] > 175)
        ) {
            throw new Error(
                "OID Node #2 cannot exceed 39 if node #1 is 0 or 1, and 175 "
                + `if node #1 is 2. Received these nodes: ${_nodes}.`,
            );
        }

        _nodes.forEach((node: number): void => {
            if (node < 0) {
                throw new Error("OID node numbers cannot be negative!");
            }
            if (node > Number.MAX_SAFE_INTEGER) {
                throw new Error("OID number was too big!");
            }
        });

        this._nodes = _nodes;
    }

    get nodes (): number[] {
        return this._nodes.slice(0);
    }

    get dotDelimitedNotation (): string {
        return this._nodes.join(".");
    }

    public toString (): string {
        return this.dotDelimitedNotation;
    }

    public static fromString (str: string): ObjectIdentifier {
        return new ObjectIdentifier(str.split(".").map((arc) => Number.parseInt(arc, 10)));
    }

    public toJSON (): string {
        return this.dotDelimitedNotation;
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
