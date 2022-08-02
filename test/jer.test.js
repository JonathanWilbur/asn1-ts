const asn1 = require("../dist/node/index.js");

describe("JSON Encoding Rules", () => {
    it("Converts a BigInt into a string", () => {
        const el = new asn1.BERElement();
        el.tagNumber = 2;
        el.integer = 45081095376109356095179030960913561n;
        expect(el.toJSON()).toBe("45081095376109356095179030960913561");
    });
});
