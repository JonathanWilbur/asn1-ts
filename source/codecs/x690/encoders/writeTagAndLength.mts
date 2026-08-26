/**
 * Number of octets needed to encode a definite-form X.690 length.
 *
 * Lengths 0–126 use the short form (one octet). Length 127 uses the long form
 * so that this matches the library's historical encoding.
 *
 * @param {number} len - The number of contents octets.
 * @returns {number} The number of length octets to write.
 */
export function definiteLengthLength (len: number): number {
    if (len < 127) {
        return 1;
    }
    if (len <= 0xFF) {
        return 2;
    }
    if (len <= 0xFFFF) {
        return 3;
    }
    if (len <= 0xFFFFFF) {
        return 4;
    }
    return 5;
}

/**
 * Write X.690 identifier and length octets into `dest` starting at `offset`.
 *
 * @param {Uint8Array} dest - Destination buffer. Must have room for the octets.
 * @param {number} offset - Index of the first octet to write.
 * @param {number} tagClass - ASN.1 tag class (0–3).
 * @param {boolean} constructed - Whether the identifier octet's constructed bit is set.
 * @param {number} tagNumber - The tag number.
 * @param {number} valueLength - Number of contents octets (ignored if `indefinite`).
 * @param {boolean} indefinite - If true, write the indefinite-length form (0x80).
 * @returns {number} The offset immediately after the last written octet.
 */
export default
function writeTagAndLength (
    dest: Uint8Array,
    offset: number,
    tagClass: number,
    constructed: boolean,
    tagNumber: number,
    valueLength: number,
    indefinite: boolean,
): number {
    let ident: number = (tagClass << 6);
    if (constructed) {
        ident |= 0x20;
    }
    if (tagNumber < 31) {
        dest[offset++] = ident | tagNumber;
    } else {
        dest[offset++] = ident | 0x1F;
        let n: number = tagNumber;
        let subsequent: number = 0;
        while (n !== 0) {
            n >>>= 7;
            subsequent++;
        }
        for (let i: number = subsequent - 1; i >= 0; i--) {
            let octet: number = (tagNumber >>> (i * 7)) & 0x7F;
            if (i !== 0) {
                octet |= 0x80;
            }
            dest[offset++] = octet;
        }
    }

    if (indefinite) {
        dest[offset++] = 0x80;
    } else if (valueLength < 127) {
        dest[offset++] = valueLength;
    } else {
        let n: number = 1;
        if (valueLength > 0xFF) {
            n = 2;
        }
        if (valueLength > 0xFFFF) {
            n = 3;
        }
        if (valueLength > 0xFFFFFF) {
            n = 4;
        }
        dest[offset++] = 0x80 | n;
        for (let i: number = n - 1; i >= 0; i--) {
            dest[offset++] = (valueLength >>> (i << 3)) & 0xFF;
        }
    }
    return offset;
}

/**
 * Write a complete X.690 TLV into `dest` starting at `offset`.
 *
 * @returns {number} The offset immediately after the last written octet.
 */
export function encodeX690Into (
    dest: Uint8Array,
    offset: number,
    tagClass: number,
    constructed: boolean,
    tagNumber: number,
    value: Uint8Array | { encodeInto (destination: Uint8Array, offset?: number): number }[],
    valueLength: number,
    indefinite: boolean,
): number {
    // Fast path: short tag, definite short-form length, primitive contents.
    if (!indefinite && tagNumber < 31 && valueLength < 127 && !Array.isArray(value)) {
        dest[offset++] = (tagClass << 6) | (constructed ? 0x20 : 0) | tagNumber;
        dest[offset++] = valueLength;
        if (valueLength === 1) {
            dest[offset++] = value[0];
            return offset;
        }
        dest.set(value, offset);
        return offset + valueLength;
    }
    offset = writeTagAndLength(
        dest,
        offset,
        tagClass,
        constructed,
        tagNumber,
        valueLength,
        indefinite,
    );
    if (Array.isArray(value)) {
        for (let i: number = 0; i < value.length; i++) {
            offset = value[i].encodeInto(dest, offset);
        }
    } else {
        dest.set(value, offset);
        offset += value.length;
    }
    if (indefinite) {
        dest[offset++] = 0x00;
        dest[offset++] = 0x00;
    }
    return offset;
}
