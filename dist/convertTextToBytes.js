"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const errors_1 = require("./errors");
function convertTextToBytes(text, codec = "utf-8") {
    if (typeof TextEncoder !== "undefined") {
        return (new TextEncoder()).encode(text);
    }
    else if (typeof Buffer !== "undefined") {
        return Buffer.from(text, codec);
    }
    throw new errors_1.ASN1Error("Neither TextEncoder nor Buffer are defined to encode text into bytes.");
}
exports.default = convertTextToBytes;
//# sourceMappingURL=convertTextToBytes.js.map