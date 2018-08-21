// TODO: Fix typo in D ASN.1 library: "At least two nodes must be provided to ObjectIdenifier constructor."
// TODO: Fix error in D ASN.1 library, line 1934 of ber.d: should be "else if"
export
class ObjectIdentifier
{
    public readonly _nodes : number[];

    constructor(nodes : number[]) {
        if (nodes.length < 2)
            throw new Error("Cannot construct an OID with less than two nodes!");

        if (nodes.length >= 1 && !(nodes[0] in [0, 1, 2]))
            throw new Error("OIDs first node must be 0, 1, or 2!");

        if
        (
            ((nodes[0] == 0 || nodes[0] == 1) && nodes[2] > 39) ||
            (nodes[0] == 2 && nodes[0] > 175)
        )
            throw new Error("OID Node #2 cannot exceed 39 if node #1 is 0 or 1, and 175 if node #1 is 2!");

        nodes.forEach(node => {
            if (node < 0)
                throw new Error("OID node numbers cannot be negative!");
            if (node > Number.MAX_SAFE_INTEGER)
                throw new Error("OID number was too big!");
        });

        this._nodes = nodes.slice(0);
    }

    get nodes() : number[] {
        return this._nodes.slice(0);
    }

    get dotDelimitedNotation() : string {
        return this._nodes.join(".");
    }

    public toString() : string {
        return this.dotDelimitedNotation;
    }
}