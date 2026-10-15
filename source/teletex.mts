// Copied from https://raw.githubusercontent.com/JonathanWilbur/teletex-ts/refs/heads/main/index.mts
// Licensed under the MIT License by myself.
// I decided to vendor this here to keep asn1-ts dependency-free.

// See https://en.wikipedia.org/wiki/ITU_T.61
//
// Bytes 0x00-0x7F are identical to ASCII. Anything absent from the tables
// below is passed through unchanged. Accent bytes are stored separately so
// the hot loop can tell a combining mark from a normal mapping without a
// second range check. Every mapped code point is in the BMP, so
// String.fromCharCode is equivalent to String.fromCodePoint.

const codePointByByte: Uint16Array = new Uint16Array(256);
for (let byte: number = 0; byte < 256; byte++) {
    codePointByByte[byte] = byte;
}
codePointByByte[0xA4] = "$".charCodeAt(0);
codePointByByte[0xA6] = "#".charCodeAt(0);
codePointByByte[0xA8] = "¤".charCodeAt(0); // U+00A4
codePointByByte[0xB4] = "×".charCodeAt(0); // U+00D7
codePointByByte[0xB8] = "÷".charCodeAt(0); // U+00F7
codePointByByte[0xE0] = "Ω".charCodeAt(0); // U+2126
codePointByByte[0xE1] = "Æ".charCodeAt(0); // U+00C6
codePointByByte[0xE2] = "Ð".charCodeAt(0); // U+00D0
codePointByByte[0xE3] = "ª".charCodeAt(0); // U+00AA
codePointByByte[0xE4] = "Ħ".charCodeAt(0); // U+0126
codePointByByte[0xE6] = "Ĳ".charCodeAt(0); // U+0132
codePointByByte[0xE7] = "Ŀ".charCodeAt(0); // U+013F
codePointByByte[0xE8] = "Ł".charCodeAt(0); // U+0141
codePointByByte[0xE9] = "Ø".charCodeAt(0); // U+00D8
codePointByByte[0xEA] = "Œ".charCodeAt(0); // U+0152
codePointByByte[0xEB] = "º".charCodeAt(0); // U+00BA
codePointByByte[0xEC] = "Þ".charCodeAt(0); // U+00DE
codePointByByte[0xED] = "Ŧ".charCodeAt(0); // U+0166
codePointByByte[0xEE] = "Ŋ".charCodeAt(0); // U+014A
codePointByByte[0xEF] = "ŉ".charCodeAt(0); // U+0149
codePointByByte[0xF0] = "ĸ".charCodeAt(0); // U+0138
codePointByByte[0xF1] = "æ".charCodeAt(0); // U+00E6
codePointByByte[0xF2] = "đ".charCodeAt(0); // U+0111
codePointByByte[0xF3] = "ð".charCodeAt(0); // U+00F0
codePointByByte[0xF4] = "ħ".charCodeAt(0); // U+0127
codePointByByte[0xF5] = "ı".charCodeAt(0); // U+0131
codePointByByte[0xF6] = "ĳ".charCodeAt(0); // U+0133
codePointByByte[0xF7] = "ŀ".charCodeAt(0); // U+0140
codePointByByte[0xF8] = "ł".charCodeAt(0); // U+0142
codePointByByte[0xF9] = "ø".charCodeAt(0); // U+00F8
codePointByByte[0xFA] = "œ".charCodeAt(0); // U+0153
codePointByByte[0xFB] = "ß".charCodeAt(0); // U+00DF
codePointByByte[0xFC] = "þ".charCodeAt(0); // U+00FE
codePointByByte[0xFD] = "ŧ".charCodeAt(0); // U+0167
codePointByByte[0xFE] = "ŋ".charCodeAt(0); // U+014B

const accentByByte: Uint16Array = new Uint16Array(256);
accentByByte[0xC1] = 0x0300;
accentByByte[0xC2] = 0x0301;
accentByByte[0xC3] = 0x0302;
accentByByte[0xC4] = 0x0303;
accentByByte[0xC5] = 0x0304;
accentByByte[0xC6] = 0x0306;
accentByByte[0xC7] = 0x0307;
accentByByte[0xC8] = 0x0308;
accentByByte[0xC9] = 0x0308;
accentByByte[0xCA] = 0x030A;
accentByByte[0xCB] = 0x0327;
accentByByte[0xCC] = 0x0332;
accentByByte[0xCD] = 0x030B;
accentByByte[0xCE] = 0x0328;
accentByByte[0xCF] = 0x030C;

/**
 * `String.fromCharCode` throws once the argument list is too long. 16,384
 * is comfortably under that limit and still one call for any realistic
 * TeletexString.
 */
const CHAR_CODE_CHUNK: number = 0x4000;

function stringFromCharCodes (codes: number[]): string {
    if (codes.length <= CHAR_CODE_CHUNK) {
        return String.fromCharCode.apply(null, codes);
    }
    let out: string = "";
    for (let i: number = 0; i < codes.length; i += CHAR_CODE_CHUNK) {
        out += String.fromCharCode.apply(null, codes.slice(i, i + CHAR_CODE_CHUNK));
    }
    return out;
}

/**
 * @summary Convert a T.61 / Teletex String into a normal Unicode string.
 * @description
 *
 * This implementation is not known to be correct. There is not enough test data
 * out there, and frankly, the value of this code is pretty low. Just don't use
 * Teletex. It was abandoned by the ITU, after all.
 *
 * Any characters not recognized as valid T.61 characters are simply passed
 * through to Unicode.
 *
 * This implementation handles conversion diacritic modifiers.
 *
 * @param ttex The raw bytes of the T.61 string.
 * @returns The `string` equivalent.
 */
export
function teletexToString (ttex: Uint8Array): string {
    /**
     * In T.61, the accents prefix a base character, whereas they postfix it
     * in Unicode. This variable exists to store a prefix to perform this swap.
     */
    let accent: number = 0;
    const codePoints: number[] = [];
    for (let i: number = 0; i < ttex.length; i++) {
        const byte: number = ttex[i];
        const accentCode: number = accentByByte[byte];
        if (accentCode) {
            if (accent) {
                throw new Error("malformed teletex string: double accent");
            }
            accent = accentCode;
            continue;
        }
        codePoints.push(codePointByByte[byte]);
        if (accent) {
            codePoints.push(accent);
            accent = 0;
        }
    }
    return stringFromCharCodes(codePoints);
}

export default teletexToString;
